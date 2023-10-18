import { Resend } from "resend";
import Email from "./email.js";
const resend = new Resend("re_GgxLzxLg_Cke5P6gTBjw8kANtKT9ZcZFG");

async function sendEmailReciept(giftCard, email) {
  try {
    const data = await resend.emails.send({
      from: "Trattoria Demi <noreply@trattoriademi.site>",
      to: [giftCard.email],
      subject: "Your giftcard reciept",
      react: Email({
        amount: giftCard.amount,
        recipient: giftCard.recipientName,
        address: giftCard.shippingAddress,
        message: giftCard.message,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

export { sendEmailReciept };
