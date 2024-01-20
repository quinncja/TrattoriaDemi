import Item from "../Item";
import { motion } from "framer-motion";
import { fadeIn } from "animations";

function YourOrder(props) {
  const { type, tip, items, price } = props;

  function getTotalPrice() {
    let totPrice = Number(price);
    let tax = Number((totPrice * 0.1025).toFixed(2));
    totPrice += tax;
    totPrice = Number(totPrice.toFixed(2));
    if (type === "delivery") totPrice += 5;
    totPrice += tip;
    return totPrice.toFixed(2);
  }

  return (
    <motion.div {...fadeIn} className="your-order">
      <div className="your-order-top">
        <div className={`reciept-header`}> Your order</div>
        <div className="subheader">Click an item to modify it</div>
      </div>
      <div className="reciept-line" />
      <div className="checkout-items">
        {items.map((item) => (
          <Item type={"checkout"} item={item} key={item.u_id} />
        ))}
      </div>
      <div className="reciept-line" />
      <div className="checkout-prices">
        <div className="checkout-price">
          <div>subtotal</div>
          <div>{price.toFixed(2)}</div>
        </div>
        {type === "delivery" && (
          <div className="checkout-price">
            <div>delivery fee</div>
            <div>5.00</div>
          </div>
        )}
        {type === "delivery" && (
          <div className="checkout-price">
            <div>tip</div>
            <div>{tip.toFixed(2)}</div>
          </div>
        )}
        <div className="checkout-price">
          <div>tax</div>
          <div>{(price * 0.1025).toFixed(2)}</div>
        </div>
        <div className="checkout-price cpb">
          <div>total</div>
          <div>{getTotalPrice()}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default YourOrder;
