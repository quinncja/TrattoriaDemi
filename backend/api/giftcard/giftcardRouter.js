const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const express = require('express')
const bodyParser = require('body-parser'); // Import bodyParser middleware
const giftcardRouter = express.Router();
const Giftcard = require('./Giftcard')

const domain = process.env.DEPLOYED_DOMAIN;
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

// Create new Giftcard 
giftcardRouter.post("/", async (req, res) => {
    try{
        const { recipientName, amount, shippingAddress, message } = req.body;
        const newGiftcard = new Giftcard({recipientName, amount, shippingAddress, message});
        await newGiftcard.save();
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': amount * 100, 
                    'product_data': {
                        'name': "Trattoria Demi Giftcard",
                    },
                },
                'quantity': 1,
              },
            ],
            mode: 'payment',
            success_url: `${domain}/giftcards?="success"`,
            cancel_url: `${domain}/giftcards`,
          });
        
    res.status(200).json({ url: session.url });

    } catch (error) {
        console.error('Error creating giftcard:', error);
        res.status(500).json({ error: error});
    }
})

app.use(bodyParser.raw({ type: 'application/json' }));

giftcardRouter.post('/payment-webhook', (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
    console.log(endpointSecret)
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSessionCompleted = event.data.object;
          console.log(checkoutSessionCompleted)
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

