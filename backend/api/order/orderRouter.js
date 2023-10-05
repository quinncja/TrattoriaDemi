const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const domain = process.env.DEPLOYED_DOMAIN;
const orderRouter = express.Router();
const Order = require("./Order");
const { Item, Menu, Section } = require('./Menu');
const { ObjectId } = require('mongoose').Types;

async function loadMenus(req, res, next) {
    try {
        const menuTypes = ['lunch', 'dinner', 'wine'];
        const menus = await Menu.find({ menuType: { $in: menuTypes } });

        const menuPromises = menus.map(async menu => {
            const sections = await Section.find({ menuId: menu._id });
            const sectionPromises = sections.map(async section => {
                const items = await Item.find({ sectionId: section._id });
                return {
                    ...section.toObject(),
                    items
                };
            });

            const resolvedSections = await Promise.all(sectionPromises);
            return {
                ...menu.toObject(),
                sections: resolvedSections
            };
        });

        const resolvedMenus = await Promise.all(menuPromises);

        req.menus = {};
        resolvedMenus.forEach(menu => {
            req.menus[menu.menuType] = menu;
        });

        next();
    } catch (err) {
        console.error('Error fetching menus:', err);
        return res.status(500).json({ message: "Failed to load the menus." });
    }
}

async function getLastUpdatedForType(type) {
    const menu = await Menu.findOne({ menuType: type }).sort({ lastUpdated: -1 }).select('lastUpdated');
    return {
        type,
        lastUpdated: menu ? menu.lastUpdated : null
    };
}

async function getLastUpdatedMenus() {
    const menuTypes = ['lunch', 'dinner', 'wine'];

    const results = await Promise.all(menuTypes.map(type => getLastUpdatedForType(type)));

    const lastUpdatedValues = {};
    for (const result of results) {
        lastUpdatedValues[result.type] = result.lastUpdated;
    }

    return lastUpdatedValues;
}


orderRouter.get('/menu-check', async (req, res) => {
    try {
        const lastUpdatedData = await getLastUpdatedMenus();
        res.json(lastUpdatedData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching last updated menus.' });
    }
})


orderRouter.get('/menus', loadMenus, (req, res) => {
    res.json(req.menus);
});

async function createCheckoutSession(price, orderId){
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
          price_data: {
            currency: "usd",
            unit_amount: price * 100,
            product_data: {
              name: "Trattoria Demi Mobile Order",
            },
          },
          quantity: 1,
        }
        ],
        mode: "payment",
        metadata: {
            orderId,
        },
        success_url: `${domain}/checkout/?success=true`,
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
                const size = item.sizes.find(s => s._id.toString() === serverItem.size);
                if (size) {
                    total += size.price;
                }
            }

            if (serverItem.sauce) {
                const sauce = item.sauces.find(s => s._id.toString() === serverItem.sauce);
                if (sauce) {
                    total += sauce.price;
                }
            }

            if (serverItem.pasta) {
                const pasta = item.pastas.find(p => p._id.toString() === serverItem.pasta);
                if (pasta) {
                    total += pasta.price;
                }
            }
            if (serverItem.platter.length > 0) {
                total += (serverItem.platter.length - 1) * 5
            }
            if (serverItem.options.length > 0) {
                for (let optionId of serverItem.options) {
                    const option = item.options.find(o => o._id.toString() === optionId);
                    if (option) {
                        total += option.price;
                    }
                }
            }
            if (serverItem.dressing) {
                total += serverItem.dressingQty * 0.75;
            }
        }
    return(total)
}

orderRouter.post('/checkout', async (req, res) => {
    try {
        const { customerName, address, deliveryMessage, email, phone, items} = req.body;
        const serverItemsList = items.map((item) => item.serverItem);
        const total = (await getCartTotal(serverItemsList)).toFixed(2)
        const newOrder = new Order({
            customerName,
            address, 
            deliveryMessage,
            email,
            phone,
            items,
            totalPrice: total,
        })
        const savedOrder = await newOrder.save();
        const session = await createCheckoutSession(total, savedOrder._id.toString());
        res.status(200).json({ url: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing the order" });
    }
});

async function getOrder(id){
    try {
      const idObject = new ObjectId(id);
      const order = await Order.findById(idObject);
      if (!order) 
        throw new Error(`No giftcard found with ID: ${id}`);
      return(order)
    } catch (error) {
      console.error(id, error);
    }
}

async function markPaid(order) {
    order.isPaid = true;
    await order.save();
}
  
async function onCheckeoutSuccess(orderId){
    try {
      const order = await getOrder(orderId);
      if(order) {
        await markPaid(order);
        // await sendReciept(order); TODO: IMPLEMENT EMAIL RECEIPT
      } else {
        console.error("No giftcard found with ID:", metadata.id);
      }
    } catch(error) {
      console.error("Error in onCheckoutSuccess:", error);
    }
}

async function deleteOrder(orderId){
    try {
      const order = await Order.findById(orderId);
      order.delete()
    } catch (error) {
      console.error(orderId, error);
    }
}

orderRouter.post("/payment-webhook", (request, response) => {
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
        onCheckeoutSuccess(session.metadata.orderId)
        break;
      default:
        deleteOrder(session.metadata.orderId)
    }
    response.send(event.type);
  });
module.exports = orderRouter;
