import { useContext, useEffect, useState } from "react";
import { useMobile } from "../../context/MobileContext";
import { useNavigate } from "react-router-dom";
import { checkoutCart, placePickupOrder } from "../../api";
import CartContext from "../../context/CartContext";
import FancyLine from "../../images/FancyLine.png";
import { usePlacesWidget } from "react-google-autocomplete";
import Input from "../../components/Input"
import { useStatus } from "../../context/StatusContext";
import "./Order.css";

function Checkout() {
  const { items, price, deleteItemFromCart } = useContext(CartContext);
  const mobile = useMobile();
  const { status, updated } = useStatus();
  const { delivery, pickup } = status || {};
  const navigate = useNavigate();
  const [type, setType] = useState();
  const [activeBtn, setActiveButton] = useState(null);
  const [tip, setTip] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [notes, setNotes] = useState(null);
  const [checkbox, setCheckbox] = useState(null);
  const PLACES_KEY = process.env.REACT_APP_PLACES_KEY;

  const { ref } = usePlacesWidget({
    apiKey: PLACES_KEY,
    options: {
      location: "42.0451%2C-87.6877°",
      radius: 200,
      types: "street-adress",
    },
    onPlaceSelected: (place) => {
      setAddress(place.formatted_address);
    },
  });

  useEffect(() => {
    if (status && status.pickup) setType("pickup");
  }, [status]);

  const [errorStates, setError] = useState({
    name: false,
    address: false,
    phone: false,
    type: false,
  });

  const inputText = {
    name: errorStates.name ? "Enter your name" : "Name",
    address: errorStates.address ? "Enter your address" : "Delivery Address",
    phone: errorStates.phone ? "Enter your phone number" : "Phone number",
    type: errorStates.type ? "Select an order type" : "Order type",
    notes: "Instructions",
    tip: "Gratuity for your driver",
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setError((errorStates) => ({ ...errorStates, phone: false }));
  }

  const handleChange = (event) => {
    if (event.target.id === "name") {
      setError((errorStates) => ({ ...errorStates, name: false }));
      setName(event.target.value);
    }
    if (event.target.id === "address") {
      setError((errorStates) => ({ ...errorStates, address: false }));
      setAddress(event.target.value);
    }
    if (event.target.id === "guests") {
      setError((errorStates) => ({ ...errorStates, phone: false }));
      setPhone(event.target.selectedIndex);
    }
    if (event.target.id === "notes") {
      setNotes(event.target.value);
    }
    if (event.target.id === "other") {
      setTip(event.target.value);
      setError((errorStates) => ({ ...errorStates, time: false }));
    }
  };

  const inputObjs = {
    name: {
      name: "Name",
      text: inputText.name,
      error: errorStates.name,
      handleChange,
    },
    phone: {
      name: "phone",
      type: "phone",
      text: inputText.phone,
      error: errorStates.phone,
      value: phone,
      handleChange: handlePhoneChange,
    },
    address: {
      name: "address",
      type: "address",
      text: inputText.address,
      error: errorStates.address,
      ref: ref,
      hidden: type === "pickup" ? true : false,
      handleChange,
    },
    notes: {
      name: "notes",
      type: "textarea",
      text: inputText.notes,
      handleChange,
    }
  }

  const checkoutValidator = () => {
    let isError = false;
    if (!name) {
      setError((errorStates) => ({ ...errorStates, name: true }));
      isError = true;
    }
    if (!phone) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, phone: true }));
    }
    if (type === "delivery") {
      if (!address) {
        isError = true;
        setError((errorStates) => ({ ...errorStates, address: true }));
      }
    }
    return isError;
  };

  function getTip() {
    if (activeBtn) return price * activeBtn * 0.01;
    return Number(tip);
  }

  function getTotalPrice() {
    let totPrice = Number(price);
    let tax = Number((totPrice * 0.1025).toFixed(2));
    totPrice += tax;
    totPrice = Number(totPrice.toFixed(2));
    if (type === "delivery") totPrice += 5;
    totPrice += getTip();
    return totPrice.toFixed(2);
  }

  async function handleSubmit(optional) {
    if (!checkoutValidator()) submitCheckout(optional);
  }

  async function submitCheckout(optional) {
    const newOrder = {
      type,
      customerName: name,
      address,
      phone,
      notes,
      utensils: checkbox,
      tip: getTip(),
      items,
    };
    if (optional === "pickup") {
      try {
        const response = await placePickupOrder(newOrder);
        if (response.status === 200) {
          navigate(`/order-status/${response.data._id}?status=success`);
        }
      } catch (error) {
        console.error(error);
      }
    } else
      try {
        const response = await checkoutCart(newOrder);
        const body = response.data;
        window.location.href = body.url;
      } catch (error) {
        console.log("i need error statements");
      }
  }

  function displayModifiers(modifiers) {
    let optionArr = [];
    if (modifiers.size) {
      optionArr.push(modifiers.size);
    }
    if (modifiers.sauce) {
      optionArr.push(modifiers.sauce);
    }
    if (modifiers.pasta) {
      optionArr.push("Sub " + modifiers.pasta);
    }
    if (modifiers.options) {
      for (let i = 0; i < modifiers.options.length; i++)
        optionArr.push(modifiers.options[i]);
    }
    if (modifiers.dressing) {
      optionArr.push(`extra dressing (${modifiers.dressing})`);
    }
    if (modifiers.platter) {
      optionArr = optionArr.concat(modifiers.platter);
    }
    return optionArr.join(", ");
  }

  function trashCanSvg() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 6H5H21"
          stroke="#444444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
          stroke="#444444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11V17"
          stroke="#444444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 11V17"
          stroke="#444444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function checkMargSvg() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="#444444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function cancelSvg() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18"
          stroke="#444444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6L18 18"
          stroke="#444444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function CheckoutItem(props) {
    const item = props.item;
    const [isDeleting, setDeleting] = useState(false);

    if (isDeleting)
      return (
        <div className="checkout-item">
          <div className="checkout-item-left">
            <div className="checkout-item-header">
              <div className="checkout-header-row">
                <div className="checkout-item-qty">{item.qty}</div>
                <div className="checkout-item-name item-name">
                  {`Remove ${item.name}?`}
                </div>
              </div>
            </div>
            <div className="item-options">
              {displayModifiers(item.modifiers)}
            </div>
          </div>
          <div className="is-deleting-buttons">
            {" "}
            <button className="delete-btn" onClick={() => setDeleting(false)}>
              {cancelSvg()}
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteItemFromCart(item)}
            >
              {checkMargSvg()}
            </button>{" "}
          </div>
        </div>
      );
    else
      return (
        <div className="checkout-item">
          <div className="checkout-item-left">
            <div className="checkout-item-header">
              <div className="checkout-header-row">
                <div className="checkout-item-qty">{item.qty}</div>
                <div className="checkout-item-name item-name">{item.name}</div>
              </div>
              <div className="item-price">{item.totalPrice}</div>
            </div>
            <div className="item-options">
              {displayModifiers(item.modifiers)}
            </div>
            {item.instructions && (
              <div className="item-options">{item.instructions}</div>
            )}
          </div>
          <button className="delete-btn" onClick={() => setDeleting(true)}>
            {trashCanSvg()}
          </button>
        </div>
      );
  }

  function orderReciept() {
    return (
      <div>
        <div className="reciept-container ">
          <div
            className={`menu-section-header padding-bottom ${
              !mobile && "left"
            }`}
          >
            {" "}
            Your Order
          </div>
          <div className="reciept-line" />
          <div className="checkout-items">
            {items.map((item) => (
              <CheckoutItem item={item} />
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
            {type === "delivery" && (tip || activeBtn) && (
              <div className="checkout-price">
                <div>tip</div>
                <div>{getTip().toFixed(2)}</div>
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
        </div>
      </div>
    );
  }

  function backButton() {
    return (
      <button onClick={() => navigate("/order")} className="back-button">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19L5 12L12 5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Modify order{" "}
      </button>
    );
  }

  function orderTypeInput(input) {
    return (
      <div className="order-type-container">
        <button
          className={`reserve-button order-type ${
            type === "pickup" && "reserve-button-active"
          } ${!pickup && "disabled-type"}`}
          disabled={!pickup}
          onClick={(event) => setType(event.target.id)}
          id="pickup"
        >
          {pickup ? "Pickup" : "Pickup unavailable"}
        </button>
        <button
          className={`reserve-button order-type ${
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
    );
  }

  function underOrderText() {
    return (
      <div className="another-row">
        {type && (
          <div className="phone-checkbox">
            <button
              className={` checkbox ${checkbox && "checkbox-active"}`}
              type="button"
              onClick={() => setCheckbox(!checkbox)}
            />
            <div className={`reserve-small-text ${mobile && "smallllll-text"}`}>
              {" "}
              Include utensils{" "}
            </div>
          </div>
        )}
        {type === "delivery" && (
          <div className={`reserve-small-text ${mobile && "smallllll-text"}`}>
            {" "}
            There is $5 delivery charge{" "}
          </div>
        )}
      </div>
    );
  }

  function tipInput(input) {
    return (
      <div className={`input-${input} input-group`}>
        <div
          className={`input-text ${errorStates[input] && `input-text-error`}`}
        >
          {" "}
          {inputText[input]}{" "}
        </div>
        <div className="tip-buttons">
          <button
            id="15"
            className={`reserve-button rb-c ${
              activeBtn === 15 && "reserve-button-active"
            }`}
            onClick={() => setActiveButton(15)}
          >
            15%
          </button>
          <button
            id="20"
            className={`reserve-button rb-c ${
              activeBtn === 20 && "reserve-button-active"
            }`}
            onClick={() => setActiveButton(20)}
          >
            20%
          </button>
          <button
            id="25"
            className={`reserve-button rb-c ${
              activeBtn === 25 && "reserve-button-active"
            }`}
            onClick={() => setActiveButton(25)}
          >
            25%
          </button>
          <input
            type="text"
            id="other"
            className={`reserve-select select-other`}
            onChange={(event) => handleChange(event)}
            onClick={() => setActiveButton(null)}
            placeholder="Other"
          ></input>
        </div>
      </div>
    );
  }

  function oldInput(input) {
    return (
      <div className={`input-${input} input-group`}>
        <label
          className={`input-text ${errorStates[input] && `input-text-error`}`}
        >
          {" "}
          {inputText[input]}{" "}
        </label>
        {input === "type"
          && orderTypeInput()}
      </div>
    );
  }

  function checkoutBody() {
    return (
      <>
        <div className="checkout-inputs">
          {oldInput("type")}
          {underOrderText()}
          {type === "delivery" && tipInput("tip")}
          <div className="row checkout-row">
            {Input(inputObjs.name)}
            {Input(inputObjs.phone)}
          </div>
          {Input(inputObjs.address)}
          {Input(inputObjs.notes)}
        </div>
        <div className="mockline" />
        <button className="submit-button" onClick={() => handleSubmit()}>
          {" "}
          Checkout with stripe{" "}
        </button>
        {type === "pickup" && (
          <button
            className="submit-button submit-button-secondary"
            onClick={() => handleSubmit("pickup")}
          >
            {" "}
            Pay at register{" "}
          </button>
        )}
      </>
    );
  }

  function closedStatus() {
    return (
      <>
        <div className="reciept-container empty-order">
          <div className="menu-section-header "> Check back soon </div>
          <div className="empty-order-subheader no-change">
            {" "}
            Our online ordering system is currently closed. <br /> We're sorry,
            we know you're hungry.
          </div>
        </div>
      </>
    );
  }

  function emptyOrder() {
    return (
      <>
        <div className="reciept-container empty-order">
          <div className="menu-section-header "> Your order is empty</div>
          <button
            className="empty-order-subheader"
            onClick={() => navigate("/order")}
            type="button"
          >
            {" "}
            Click here to find something tasty!
          </button>
        </div>
      </>
    );
  }

  function checkoutOrder() {
    if (mobile) {
      return (
        <>
          {backButton()}
          {orderReciept()}
          <div className="reciept-container">
            <div className="menu-section-header"> Checkout </div>
            <img className="fancy-line" src={FancyLine} alt="" />
            {checkoutBody()}
          </div>
          <div></div>
        </>
      );
    }
    return (
      <>
        <div>
          {backButton()}
          <div className="reciept-container checkout-variant">
            <div className="menu-section-header"> Checkout </div>
            <img className="fancy-line" src={FancyLine} alt="" />
            {checkoutBody()}
          </div>
        </div>
        <div>
          <div className="mockline" />
          {orderReciept()}
        </div>
      </>
    );
  }

  return updated ? (
    price === 0 ? (
      <div className="empty-container"> {emptyOrder()} </div>
    ) : status && !status.delivery && !status.pickup ? (
      <div className="empty-container"> {closedStatus()} </div>
    ) : (
      <div className="checkout-container"> {checkoutOrder()} </div>
    )
  ) : (
    <div className="empty" />
  );
}

export default Checkout;
