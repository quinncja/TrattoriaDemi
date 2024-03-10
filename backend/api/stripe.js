const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const stripeRouter = express.Router();
const { handleGiftcardSuccess, deleteGiftcard } = require('./giftcard/giftcardRouter');
const { handleOrderSuccess } = require ('./order/orderRouter')
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

stripeRouter.post("/payment-webhook", async (request, response) => {
    const sig = request.headers["stripe-signature"];
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    const session = event.data.object;
    switch (session.metadata.type){
        case "giftcard": 
            if (event.type === "checkout.session.completed") handleGiftcardSuccess(session.metadata, session.customer_details.email)
            else deleteGiftcard(session.metadata.id);
        case "order":
            if (event.type === "checkout.session.completed") handleOrderSuccess(session.metadata.orderId, session.payment_intent)
            else  deleteOrder(order);
        default: 
            ""
    }
    response.send(event.type);
  });


  module.exports = stripeRouter;