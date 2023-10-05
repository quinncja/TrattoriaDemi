const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
    },
    deliveryMessage: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    items: {
        type: [Object],
    },
    timePlaced: {
        type: Date,
        default: Date.now
    },  
    estimatedReady: {
        type: Date,
    },
    isPaid: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("Order", orderSchema)