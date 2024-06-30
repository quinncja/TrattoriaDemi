import { Resend } from "resend";
import giftCardReceipt from "./giftCardReceipt.js";
import giftcardPurchased from "./giftcardPurchased.js";

const resend = new Resend(process.env.RESEND_KEY);

async function sendEmailReciept(giftCard, date) {
  try {
    await resend.emails.send({
      from: "Trattoria Demi <noreply@trattoriademi.site>",
      to: giftCard.email,
      subject: "Your giftcard reciept",
      react: giftCardReceipt({
        amount: `$${giftCard.amount}`,
        recipient: giftCard.recipientName,
        address: giftCard.shippingAddress,
        message: giftCard.message,
        id: giftCard.id,
        date: date,
      }),
    });
    await resend.emails.send({
      from: "Trattoria Demi <noreply@trattoriademi.site>",
      to: "quinnwsieja@gmail.com",
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
