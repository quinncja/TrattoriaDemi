const mongoose = require('mongoose');
const giftcardSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: String, 
        required: true,
    },
    message: {
        type: String,
    },
    purchaserName: {
        type: String,
    },
    purchaserEmail: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('Giftcard', giftcardSchema)