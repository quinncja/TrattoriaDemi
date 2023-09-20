const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const express = require("express");
const giftcardRouter = express.Router();
const Giftcard = require("./Giftcard");
const domain = process.env.DEPLOYED_DOMAIN;
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

// Create new Giftcard
giftcardRouter.post("/", async (req, res) => {
  try {
    const { recipientName, amount, shippingAddress, message, email } = req.body;
    const newGiftcard = new Giftcard({
      recipientName,
      amount,
      shippingAddress,
      message,
      email,
    });
    await newGiftcard.save();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            product_data: {
              name: "Trattoria Demi Giftcard",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: {
        recipientName,
        amount,
        shippingAddress,
        message,
        email,
        id: newGiftcard._id,
      },
      success_url: `${domain}/giftcards/?success=true`,
      cancel_url: `${domain}/giftcards`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating giftcard:", error);
    res.status(500).json({ error: error });
  }
});

async function markPaid(id) {
  try {
    const giftcard = await Giftcard.findById(id);
    giftcard.isPaid = true;
    giftcard.save();
  } catch (error) {
    console.error(error);
  }
}

async function sendReciept(data) {
  try {
    const module = await import("./sendEmailReciept.mjs");
    console.log("before sendEmailReciept")
    module.sendEmailReciept(data);
  } catch (error) {
    console.error("Error importing or executing sendEmailReciept:", error);
  }
}

giftcardRouter.post("/payment-webhook", (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("checkout-data:")
      markPaid(session.metadata.id);
      sendReciept(session.metadata)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Handle the event
  console.log(`Unhandled event type ${event.type}`);
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

module.exports = giftcardRouter;
