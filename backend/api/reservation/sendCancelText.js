const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

function sendCancelText(phone) {
  client.messages.create({
    body: `\n \nYour reservation has been cancelled.
    \n - Trattoria Demi`,
    from: "+18447275525",
    to: phone,
  });
}

module.exports = {
  sendCancelText,
};
