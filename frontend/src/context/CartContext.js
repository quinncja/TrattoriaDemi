import React, { useState, createContext, useEffect } from "react";

const CartContext = createContext();
export default CartContext;

export function CartProvider(props) {
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQty] = useState(0);

  function convertPriceToNumber(price) {
    const numericValue = price.replace(/[^\d.]/g, "");
    return parseFloat(numericValue);
  }

  const clearCart = () => {
    setItems([]);
    setPrice(0);
    setQty(0);
  };

  const addItemToCart = (item) => {
    setItems((prevItems) => [...prevItems, item]);
    setPrice((prevPrice) => prevPrice + convertPriceToNumber(item.totalPrice));
    setQty((prevQty) => prevQty + Number(item.qty));
  };

  const deleteItemFromCart = (item) => {
    setItems((prevItems) => prevItems.filter((prevItem) => prevItem !== item));
    setPrice((prevPrice) => prevPrice - convertPriceToNumber(item.totalPrice));
    setQty((prevQty) => prevQty - item.qty);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const { items, price, quantity } = JSON.parse(savedCart);
      setItems(items);
      setPrice(price);
      setQty(quantity);
    }
  }, []);

  useEffect(() => {
    const cartData = { items, price, quantity };
    if (cartData.items !== 0)
      localStorage.setItem("cart", JSON.stringify(cartData));
  }, [items, price, quantity]);

  return (
    <CartContext.Provider
      value={{
        items,
        price,
        quantity,
        addItemToCart,
        deleteItemFromCart,
        clearCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
