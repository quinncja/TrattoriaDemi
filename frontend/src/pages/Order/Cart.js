import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import { motion, useAnimate } from "framer-motion"

function Cart() {
  const navigate = useNavigate();
  const { quantity } = useContext(CartContext);
  const quantityRef = useRef(quantity);
  const [ scope, animate ] = useAnimate();

  useEffect(() => {
    if ((quantity > quantityRef.current)){
      const glowEffect = {
        rotate: [0, '7deg', '-6deg', '4deg', '-2deg', 0],
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 10px rgba(211, 150, 58, 0)", 
          "0 0 15px rgba(211, 150, 58, 0.6)",   
          "0 0 15px rgba(211, 150, 58, 0.6)",  
          "0 0 10px rgba(211, 150, 58, 0)"      
        ],        
        duration: 1.,
        times: [0, 0.2, .4, .6, .8, 1],
        loop: Infinity,
        repeatDelay: 1
      } 
      quantityRef.current = quantity;
    
      animate(scope.current, glowEffect)
    }
  }, [animate, quantity, scope])

  const bagIcon = () => {
    return (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bag-icon"
      >
        <path
          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 6H21"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  return (
    <motion.div ref={scope} whileHover={quantity > 0 && {scale: 1.06, boxShadow: "0 0 15px rgba(211, 150, 58, 0.8)"}} transition={{ type: "spring", stiffness: 100, damping: 10 }} className={`cart-button ${quantity === 0 && "empty-cart"}`} onClick={ quantity > 0 && (() => navigate("/checkout"))}>
      {quantity} {bagIcon()}
    </motion.div>
  );
}

export default Cart;
