const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function sendCancelText(phone) {
  try {
    const message = await client.messages.create({
      body: `\n \nYour reservation has been cancelled.
    \n - Trattoria Demi`,
      from: "+18447275525",
      to: phone,
    });
    return message;
  } catch (err) {
    console.error("Error sending cancellation text:", err);
  }
}

module.exports = {
  sendCancelText,
};
