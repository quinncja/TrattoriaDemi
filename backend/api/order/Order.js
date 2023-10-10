const mongoose = require("mongoose")
const orderType = ["pickup", "delivery"]
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    tip: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        ENUM: orderType,
    },
    address: {
        type: String,
    },
    notes: {
        type: String,
    },
    utensils: {
        type: Boolean,
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
        type: String,
        default: "",
    },
    isPaid: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("Order", orderSchema)