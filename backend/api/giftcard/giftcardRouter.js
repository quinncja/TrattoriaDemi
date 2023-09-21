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
      metadata: {
        recipientName,
        amount,
        shippingAddress,
        message,
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

async function getGiftcard(email){
  try {
    const giftcard = await Giftcard.findById(id);
    return(giftcard)
  } catch (error) {
    console.error(id, error);
  }
}

async function setEmail(email, giftcard){
  giftcard.email = email;
  email.save()
}

async function markPaid(giftcard) {
    giftcard.isPaid = true;
    giftcard.save();
}

async function sendReciept(data) {
  try {
    const module = await import("../../dist/sendEmailReciept.js");
    module.sendEmailReciept(data);
  } catch (error) {
    console.error("Error importing or executing sendEmailReciept:", error);
  }
}

async function deleteGiftcard(id){
  try {
    const giftcard = await Giftcard.findById(id);
    giftcard.delete()
  } catch (error) {
    console.error(id, error);
  }
}

async function onCheckeoutSuccess(metadata, email){
  const giftcard = getGiftcard(metadata.id);
  markPaid(giftcard)
  setEmail(giftcard, email)
  sendReciept(metadata, email)
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
  const session = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
      onCheckeoutSuccess(session.metadata, session.customer_details.email)
      break;
    default:
      deleteGiftcard(session.metadata.id)
  }
  response.send(event.type);
});

module.exports = giftcardRouter;
