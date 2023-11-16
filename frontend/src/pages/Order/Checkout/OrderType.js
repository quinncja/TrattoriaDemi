import { capitalizeFirstLetter } from "../../../functions";
import { deliverySvg, pickupSvg } from "../../../svg";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "../../../animations";
import { useState } from "react";

function OrderType(props) {
  const { type, setType, delivery, pickup } = props;

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const eta = type === "delivery" ? "50 - 60 minute eta" : "10 - 15 minute eta";
  const svg = type === "delivery" ? deliverySvg() : pickupSvg();

  return (
      <AnimatePresence> 
      {type ? (
        <motion.div {...fadeIn}  >
          <motion.div className="order-type" layoutId={`${type}-outline`}>
            <div className="order-type-column">
              <div className="order-type-top" layoutId="top-content">
              <motion.div layoutId={`${type}-svg`}> {svg} </motion.div>
                <motion.div layoutId={type}> {capitalizeFirstLetter(type)} </motion.div>
                {type === "delivery" && <div className="fee-text"> $5 fee</div>}
              </div>
              <div className="order-type-bottom ">{eta}</div>
            </div>
            <button className="change" onClick={() => setType(null)}>
              Change
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div {...fadeIn} layoutId="shared-layout">
          <div className={`input-group`}>
              <label className={`input-text`}> Proceed to checkout </label>
            <div className="order-type-container">
            <motion.button
                layoutId="pickup-outline"
                className={`reserve-button order-type-btn ${
                  type === "pickup" && "reserve-button-active"
                } ${!pickup && "disabled-type"}`}
                disabled={!pickup}
                onClick={(event) =>
                  handleTypeChange(event.target.id)}
                id="pickup"
              >
                <motion.div layoutId="pickup-svg" className="inner-div"> {pickupSvg()} </motion.div>
                <motion.div layoutId="pickup"> 
                {pickup ? "Pickup" : "Pickup unavailable"}
                </motion.div>
              </motion.button>
              <motion.button
                layoutId="delivery-outline"
                className={`reserve-button order-type-btn ${
                  type === "delivery" && "reserve-button-active"
                } ${!delivery && "disabled-type"}`}
                disabled={!delivery}
                onClick={(event) =>
                  handleTypeChange(event.target.id)}
                id="delivery"
              >
                <motion.div layoutId="delivery-svg" className="inner-div"> {deliverySvg()} </motion.div>
                <motion.div layoutId="delivery"> 
                {delivery ? "Delivery" : "Delivery unavailable"}
                </motion.div>
              </motion.button>
              {}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
  );
}

export default OrderType;
