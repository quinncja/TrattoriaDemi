const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const moment = require('moment-timezone');
const client = require("twilio")(accountSid, authToken);

function minutesUntilTime(targetTime) {
    const now = moment.tz('America/Chicago');
    const target = moment.tz(targetTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ', 'America/Chicago');
    const diff = target.diff(now, 'minutes');
    return diff;
}


function timeText(order){
    console.log(order.estimatedReady)
    if(order.type === "delivery"){
        return `Delivery in approximately ${minutesUntilTime(order.estimatedReady)} minutes.`
    } else return `Pickup in approximately ${minutesUntilTime(order.estimatedReady)} minutes.`
}

function sendOrderText(order) {
  client.messages.create({
    body: `Your order has been confirmed, ${timeText(order)}\n\nClick here to view your order: \nwww.trattoriademi.site/order-status/${order._id} \n\nWe look forward to seeing you. \n- Trattoria Demi`,
    from: "+18447275525",
    to: order.phone,
  });
}

module.exports = {
  sendOrderText,
};
