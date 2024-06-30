import { Resend } from "resend";
import giftcardReceipt from "./giftcardReceipt.js";
import giftcardPurchased from "./giftcardPurchased.js";

const resend = new Resend(process.env.RESEND_KEY);

async function sendEmailReciept(giftCard, date) {
  try {
    await resend.emails.send({
      from: "Trattoria Demi <noreply@trattoriademi.site>",
      to: giftCard.email,
      subject: "Your giftcard reciept",
      react: giftcardReceipt({
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
  try {
  await resend.emails.send({
    from: "Trattoria Demi <noreply@trattoriademi.site>",
    to: "trattoriademi@gmail.com",
    subject: "Giftcard Purchased",
    react: giftcardPurchased({
      amount: `$${giftCard.amount}`,
      recipient: giftCard.recipientName,
      address: giftCard.shippingAddress,
      message: giftCard.message,
      id: giftCard.id,
      date: date,
      email: giftCard.email,
    }),
  });
  } catch (error) {
    console.error(error);
  }
}

export { sendEmailReciept };
