import { Resend } from "resend";
import Email from "./email.js";
const resend = new Resend(process.env.RESEND_KEY);

async function sendEmailReciept(giftCard, date) {
  try {
    await resend.emails.send({
      from: "Trattoria Demi <noreply@trattoriademi.site>",
      to: giftCard.email,
      subject: "Your giftcard reciept",
      react: Email({
        amount: `$${giftCard.amount}`,
        recipient: giftCard.recipientName,
        address: giftCard.shippingAddress,
        message: giftCard.message,
        id: giftCard.id,
        date: date,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}

export { sendEmailReciept };
