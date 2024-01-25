require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const reservationRouter = require("./api/reservation/reservationRouter");
const messageRouter = require("./api/message/messageRouter");
const giftcardRouter = require("./api/giftcard/giftcardRouter");
const orderRouter = require("./api/order/orderRouter");
const payrollRouter = require("./api/payroll/payrollRouter");

const app = express();
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
  "/api/giftcard/payment-webhook",
  express.raw({ type: "application/json" }),
);
app.use(
  "/api/order/payment-webhook",
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

app.listen(port, () => {
  console.log(`Trattoria Demi listening on port ${port}`);
});

main();
