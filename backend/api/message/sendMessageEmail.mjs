import { Resend } from "resend";
import messageSent from "./messageSent.js";

const resend = new Resend(process.env.RESEND_KEY);
const sender = process.env.SENDER_EMAIL;

async function sendMessageEmail(message) {
  try {
    await resend.emails.send({
      from: sender,
      to: "trattoriademi@gmail.com",
      subject: "Contact Form Submission",
      react: messageSent({
        name: message.name,
        email: message.email,
        message: message.message,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

export { sendMessageEmail };
