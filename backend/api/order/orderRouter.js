const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const domain = process.env.DEPLOYED_DOMAIN;
const orderRouter = express.Router();
const Order = require("./Order");
const SystemStatus = require("./SystemStatus")
const { sendOrderText, sendOrderCancelText } = require("./sendOrderText")
const moment = require('moment-timezone');
const { Item, Menu, Section } = require("./Menu");
const { ObjectId } = require("mongoose").Types;
const endpointSecret = process.env.STRIPE_ORDER_ENDPOINT_SECRET;
let clients = [];

async function loadMenus(req, res, next) {
  try {
    const menuTypes = ["lunch", "dinner", "wine"];
    const menus = await Menu.find({ menuType: { $in: menuTypes } });

    const menuPromises = menus.map(async (menu) => {
      const sections = await Section.find({ menuId: menu._id });
      const sectionPromises = sections.map(async (section) => {
        const items = await Item.find({ sectionId: section._id });
        return {
          ...section.toObject(),
          items,
        };
      });

      const resolvedSections = await Promise.all(sectionPromises);
      return {
        ...menu.toObject(),
        sections: resolvedSections,
      };
    });

    const resolvedMenus = await Promise.all(menuPromises);

    req.menus = {};
    resolvedMenus.forEach((menu) => {
      req.menus[menu.menuType] = menu;
    });

    next();
  } catch (err) {
    console.error("Error fetching menus:", err);
    return res.status(500).json({ message: "Failed to load the menus." });
  }
}

async function getLastUpdatedForType(type) {
  const menu = await Menu.findOne({ menuType: type })
    .sort({ lastUpdated: -1 })
    .select("lastUpdated");
  return {
    type,
    lastUpdated: menu ? menu.lastUpdated : null,
  };
}

async function getLastUpdatedMenus() {
  const menuTypes = ["lunch", "dinner", "wine"];

  const results = await Promise.all(
    menuTypes.map((type) => getLastUpdatedForType(type)),
  );

  const lastUpdatedValues = {};
  for (const result of results) {
    lastUpdatedValues[result.type] = result.lastUpdated;
  }

  return lastUpdatedValues;
}

orderRouter.get("/menu-check", async (req, res) => {
  try {
    const lastUpdatedData = await getLastUpdatedMenus();
    res.json(lastUpdatedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching last updated menus." });
  }
});

orderRouter.get("/menus", loadMenus, (req, res) => {
  res.json(req.menus);
});

async function createCheckoutSession(price, orderId) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: "Trattoria Demi Mobile Order",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
    },
    success_url: `${domain}/order-status/${orderId}?status=success`,
    cancel_url: `${domain}/checkout`,
  });

  return session;
}

async function getCartTotal(serverItemsList) {
  let total = 0;

  for (let serverItem of serverItemsList) {
    const item = await Item.findById(new ObjectId(serverItem.itemId));
    total += item.price;

    if (serverItem.size) {
      const size = item.sizes.find((s) => s._id.toString() === serverItem.size);
      if (size) {
        total += size.price;
      }
    }

    if (serverItem.sauce) {
      const sauce = item.sauces.find(
        (s) => s._id.toString() === serverItem.sauce,
      );
      if (sauce) {
        total += sauce.price;
      }
    }

    if (serverItem.pasta) {
      const pasta = item.pastas.find(
        (p) => p._id.toString() === serverItem.pasta,
      );
      if (pasta) {
        total += pasta.price;
      }
    }
    if (serverItem.platter.length > 0) {
      total += (serverItem.platter.length - 1) * 5;
    }
    if (serverItem.options.length > 0) {
      for (let optionId of serverItem.options) {
        const option = item.options.find((o) => o._id.toString() === optionId);
        if (option) {
          total += option.price;
        }
      }
    }
    if (serverItem.dressing) {
      total += serverItem.dressingQty * 0.75;
    }
  }
  return total;
}
function getTax(price) {
  return price * 0.1025;
}

async function checkStatus(type){
  const status = await SystemStatus.findOne();
  return status[type]
}

orderRouter.post("/pickup", async (req, res) => {
  try {
    const { customerName, type, tip, address, notes, utensils, phone, items } =
      req.body;
    if(!checkStatus(type)) res.status(500).json({ message: `${type} closed` });
    
    const serverItemsList = items.flatMap((item) => {
      return Array(item.qty).fill(item.serverItem);
    });
    let total = await getCartTotal(serverItemsList);
    const tax = getTax(total);
    total += tax;
    if (type === "delivery") {
      total += Number(tip);
      total += 5;
    }
    total = Number(total.toFixed(2));
    const newOrder = new Order({
      type,
      customerName,
      address,
      notes,
      phone,
      items,
      tip,
      utensils,
      totalPrice: total,
    });
    const savedOrder = await newOrder.save();
    clients.forEach((client) =>
    client.write(`data: ${JSON.stringify(newOrder)}\n\n`),
    );
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing the order" });
  }
});

orderRouter.post("/checkout", async (req, res) => {
  try {
    const { customerName, type, tip, address, notes, utensils, phone, items } =
      req.body;
    if(!checkStatus(type)) res.status(500).json({ message: `${type} closed` });
    const serverItemsList = items.flatMap((item) => {
      return Array(item.qty).fill(item.serverItem);
    });
    const subtotal = await getCartTotal(serverItemsList);
    let total = subtotal; 
    const tax = getTax(total);
    total += tax;
    if (type === "delivery") {
      total += Number(tip);
      total += 5;
    }
    total = Number(total.toFixed(2));
    const newOrder = new Order({
      type,
      subtotal,
      customerName,
      address,
      notes,
      phone,
      items,
      tip,
      utensils,
      totalPrice: total,
    });
    const savedOrder = await newOrder.save();
    const session = await createCheckoutSession(
      total,
      savedOrder._id.toString(),
    );
    
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing the order" });
  }
});

orderRouter.get("/today", async (req, res) => {
    try {
      const startOfToday = moment.tz("America/Chicago").startOf('day').toDate();
      const endOfToday = moment.tz("America/Chicago").endOf('day').toDate();
  
      const orders = await Order.find({
        timePlaced: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving the orders" });
    }
  });

  
orderRouter.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // This fetches all the orders from the database
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving the orders" });
  }
});

async function getOrder(id) {
  try {
    const idObject = new ObjectId(id);
    const order = await Order.findById(idObject);
    if (!order) throw new Error(`No giftcard found with ID: ${id}`);
    return order;
  } catch (error) {
    console.error(id, error);
  }
}

orderRouter.get("/id/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await getOrder(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ message: `No order found with ID: ${orderId}` });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving the order" });
  }
});

orderRouter.patch("/id/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const time = req.body.time;

    const order = await getOrder(orderId);

    if (!order) {
      return res.status(404).json({ message: `No order found with ID: ${orderId}` });
    }

    order.estimatedReady = time;
    order.status = "confirmed";
    await order.save(); 
    sendOrderText(order);
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating the order" });
  }
});

async function refundOrder(paymentIntent){
  try {
    await stripe.refunds.create({
    payment_intent: paymentIntent,
  })
  }catch (error) {
    throw (error);
  }
}

async function deleteOrder(orderId) {
  try {
    await Order.findByIdAndRemove(orderId);
  } catch (error) {
    console.error(orderId, error);
  }
}

orderRouter.delete("/id/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await getOrder(orderId);

    if (!order) {
      return res.status(404).json({ message: `No order found with ID: ${orderId}` });
    }

    await refundOrder(order.paymentIntent);
    await deleteOrder(orderId);
    sendOrderCancelText(order);

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating the order" , error});
  }
});

async function onCheckeoutSuccess(orderId, paymentIntent) {
  const order = await Order.findById(orderId);
  order.isPaid = true;
  order.paymentIntent = paymentIntent;
  await order.save();
}

orderRouter.post("/payment-webhook", async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  const session = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
      onCheckeoutSuccess(session.metadata.orderId, session.payment_intent);
      break;
    default:
      deleteOrder(order);
  }
  response.send(event.type);
});
module.exports = orderRouter;


orderRouter.get("/events", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

async function getSystemStatusInstance() {
  let status = await SystemStatus.findOne();

  if (!status) {
    status = new SystemStatus({
      pickup: true,
      delivery: true,
    });
    await status.save();
  }

  return status;
}

orderRouter.get("/status", async (req, res) => {
  try {
    let status = await getSystemStatusInstance();
    res.json(status);
  } catch (error) {
    console.error("Error fetching system status:", error);
    res.status(500).send("Internal Server Error");
  }
});


orderRouter.patch("/status", async (req, res) => {
  const updates = req.body;
  try {
    let updatedStatus = await SystemStatus.findOneAndUpdate({}, updates, { new: true });
    res.json(updatedStatus);  
  } catch (error) {
    console.error("Error updating system status:", error);
    res.status(500).send("Internal Server Error");
  }
});
