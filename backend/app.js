require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const reservationRouter = require("./api/reservation/reservationRouter");
const messageRouter = require("./api/message/messageRouter");
const { giftcardRouter } = require("./api/giftcard/giftcardRouter");
const { orderRouter } = require("./api/order/orderRouter");
const payrollRouter = require("./api/payroll/payrollRouter");
const stripeRouter = require("./api/stripe");

const app = express();
app.use(
  helmet.crossOriginOpenerPolicy({ policy: "same-origin" }),
  helmet.crossOriginEmbedderPolicy({ policy: "require-corp" }),
);
const port = process.env.PORT || 4000;
const mongo_uri = process.env.MONGO_URI;

async function main() {
  try {
    await mongoose.connect(mongo_uri);
    console.log("Database connected Successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }

  mongoose.connection
    .once("open", function () {
      console.log("Database connected Successfully");
    })
    .on("error", function (err) {
      console.log("Error", err);
    });
}

app.use(cors());
app.use(
  "/api/stripe/payment-webhook",
  express.raw({ type: "application/json" }),
);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/reservations", reservationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/giftcard", giftcardRouter);
app.use("/api/order", orderRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/stripe", stripeRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Trattoria Demi listening on port ${port}`);
  console.log(`Local: http://localhost:${port}`);
  console.log(`Network: http://192.168.1.79:${port}`);
});

app.get("/", async (req, res) => {
  try {
    res.status(200).json("Hello World");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

main();
