import { capitalizeFirstLetter } from "../../../functions";
import { deliverySvg, pickupSvg } from "../../../svg";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../../../animations";

function OrderType(props) {
  const { type, setType, delivery, pickup } = props;
  const eta = type === "delivery" ? "50 - 60 minute eta" : "10 - 15 minute eta";
  const svg = type === "delivery" ? deliverySvg() : pickupSvg();

  return (
    <AnimatePresence>
      {type ? (
        <motion.div {...fadeIn}>
          <div className="order-type">
          <div className="order-type-column"> 
            <div className="order-type-top">
              {svg}
              {capitalizeFirstLetter(type)}
              {type === "delivery" && 
              <div className="fee-text"> $5 fee
              </div>}
            </div>
            <div className="order-type-bottom ">
              {eta}
              </div>
            </div>
            <button className="change" onClick={() => setType(null)}>
                Change
              </button>
          </div>
        </motion.div>
      ) : (
        <motion.div {...fadeIn}>
          <div className={`input-group`}>
            <label className={`input-text`}> Proceed to checkout </label>

            <div className="order-type-container">
              <button
                className={`reserve-button order-type-btn ${
                  type === "pickup" && "reserve-button-active"
                } ${!pickup && "disabled-type"}`}
                disabled={!pickup}
                onClick={(event) => setType(event.target.id)}
                id="pickup"
              >
                {pickup ? "Pickup" : "Pickup unavailable"}
              </button>
              <button
                className={`reserve-button order-type-btn ${
                  type === "delivery" && "reserve-button-active"
                } ${!delivery && "disabled-type"}`}
                disabled={!delivery}
                onClick={(event) => setType(event.target.id)}
                id="delivery"
              >
                {delivery ? "Delivery" : "Delivery unavailable"}
              </button>
              {}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OrderType;
