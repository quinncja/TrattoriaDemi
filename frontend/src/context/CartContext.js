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
    setItems((prevItems) => {
      const newItem = { ...item, u_id: generateUniqueId() };
      return [...prevItems, newItem];
    });
  };

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    let tot = 0;
    let qty = 0;
    items.forEach((item) => {
      tot += convertPriceToNumber(item.totalPrice);
      qty += Number(item.qty);
    });
    setPrice(tot);
    setQty(qty);
  }, [items]);

  const updateCartItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.u_id === updatedItem.u_id ? { ...item, ...updatedItem } : item
      )
    );
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  const deleteItemFromCart = (itemId) => {
    console.log(items);
    setItems((prevItems) => {
      return prevItems.filter((item) => item.u_id !== itemId);
    });
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
        updateCartItem,
        deleteItemFromCart,
        clearCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
