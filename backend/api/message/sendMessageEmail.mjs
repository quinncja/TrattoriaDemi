import { Resend } from "resend";
import messageSent from "./messageSent.js";

const resend = new Resend(process.env.RESEND_KEY);

async function sendMessageEmail(message) {
    try {
        await resend.emails.send({
          from: "Trattoria Demi <noreply@trattoriademi.site>",
          to: "quinnwsieja@gmail.com",
          subject: "Contact Form Submission",
          react: messageSent({
            name: message.name,
            email: message.email,
            message: message.message,
          }),
        });
      } catch (error) {
        console.error(error);
    }
}

export { sendMessageEmail };