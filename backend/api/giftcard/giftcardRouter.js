const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);
const express = require("express");
const giftcardRouter = express.Router();
const Giftcard = require("./Giftcard");
const domain = process.env.DEPLOYED_DOMAIN;
const shipping_id = process.env.STRIPE_SHIPPING_ID;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { DateTime } = require("luxon");
const { getGiftcardDataForBarChart } = require("./giftcardDataService");

giftcardRouter.get("/all", async (req, res) => {
  try {
    const giftcards = await Giftcard.find(
      {},
      "recipientName _id amount isPaid datePurchased",
    );
    res.status(200).json(giftcards);
  } catch (error) {
    console.error("Error fetching giftcards:", error);
    res.status(500).json({ error: error.message });
  }
});

giftcardRouter.post("/", async (req, res) => {
  try {
    const { recipientName, amount, itemId, shippingAddress, message } =
      req.body;
    const newGiftcard = new Giftcard({
      recipientName,
      shippingAddress,
      amount,
      message,
    });
    const savedGiftcard = await newGiftcard.save();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: itemId,
          quantity: 1,
        }
      ],
      mode: "payment",
      metadata: {
        type: "giftcard",
        recipientName,
        amount,
        shippingAddress,
        message,
        id: savedGiftcard._id.toString(),
      },
      shipping_options: [{
        shipping_rate: shipping_id
      }],
      success_url: `${domain}/giftcards/?success=true`,
      cancel_url: `${domain}/giftcards`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating giftcard:", error);
    res.status(500).json({ error: error });
  }
});

async function getGiftcard(id) {
  try {
    const idObject = new ObjectId(id);
    const giftcard = await Giftcard.findById(idObject);
    if (!giftcard) throw new Error(`No giftcard found with ID: ${id}`);
    return giftcard;
  } catch (error) {
    console.error(id, error);
  }
}

async function setDetails(details, giftcard) {
  giftcard.email = details.email;
  giftcard.senderName = details.name;
  await giftcard.save();
}

async function markPaid(giftcard) {
  giftcard.isPaid = true;
  await giftcard.save();
}

async function sendReciept(data) {
  try {
    const module = await import("../../dist/sendEmailReciept.js");
    module.sendEmailReciept(
      data,
      DateTime.now().toLocaleString(DateTime.DATE_FULL),
    );
  } catch (error) {
    console.error("Error importing or executing sendEmailReciept:", error);
  }
}

async function handleGiftcardSuccess(metadata, details) {
  try {
    const giftcard = await getGiftcard(metadata.id);
    if (giftcard) {
      await markPaid(giftcard);
      await setDetails(details, giftcard);
      await sendReciept(giftcard);
    } else {
      console.error("No giftcard found with ID:", metadata.id);
    }
  } catch (error) {
    console.error("Error in onCheckoutSuccess:", error);
  }
}

async function deleteGiftcard(id) {
  try {
    const giftcard = await Giftcard.findById(id);
    giftcard.delete();
  } catch (error) {
    console.error(id, error);
  }
}

giftcardRouter.get("/stats", async (req, res) => {
  try {
    const { data, totalAmount } = await getGiftcardDataForBarChart();
    res.status(200).json({ data, totalAmount });
  } catch (error) {
    console.error("Error fetching gift card stats:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = { giftcardRouter, handleGiftcardSuccess, deleteGiftcard };
