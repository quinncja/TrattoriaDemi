import { useContext, useState } from "react";
import { useMobile } from "context/MobileContext";
import { useNavigate } from "react-router-dom";
import { checkoutCart, placePickupOrder } from "api";
import CartContext from "context/CartContext";
import { useStatus } from "context/StatusContext";
import FancyLine from "images/FancyLine.png";
import YourOrder from "./YourOrder";
import "../Order.css";
import Checkout from "./Checkout";
import OrderType from "./OrderType";
import { locationAlert } from "swal2";

function CheckoutPage() {
  const { items, price } = useContext(CartContext);
  const {mobile} = useMobile();
  const { status, updated } = useStatus();
  const { delivery, pickup } = status || {};
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [tip, setTip] = useState(0);

  async function submitCheckout(newOrder, optional) {
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
        if (error.response.status === 400) locationAlert();
        else console.log(error);
      }
  }

  function closedStatus() {
    return (
      <>
        <div className="empty-order">
          <div className="menu-section-header "> Check back soon </div>
          <div className="empty-order-subheader no-change">
            {" "}
            Our online ordering system is currently closed. <br />
          </div>
        </div>
      </>
    );
  }

  function emptyOrder() {
    return (
      <>
        <div className="empty-order">
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

  return updated ? (
    price === 0 ? (
      <div className="reserve-container no-top-line">
        <div className="reserve-section">{emptyOrder()}</div>
      </div>
    ) : status && !status.delivery && !status.pickup ? (
      <div className="reserve-container no-top-line">
        <div className="reserve-section"> {closedStatus()} </div>{" "}
      </div>
    ) : (
      <div className="reserve-container no-top-line">
        <div className="reserve-section">
          <div className="menu-section-header"> Review & Checkout </div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <div className="checkout-page">
            <div className="checkout-side">
              <OrderType
                type={type}
                setType={setType}
                delivery={delivery}
                pickup={pickup}
              />
              <Checkout
                type={type}
                submitCheckout={submitCheckout}
                items={items}
                price={price}
                mobile={mobile}
                tip={tip}
                setTip={setTip}
              />
            </div>
            <div className="your-order-container">
              <YourOrder tip={tip} type={type} price={price} items={items} />
            </div>
          </div>
        </div>
      </div>
    )
  ) : (
    <div className="empty" />
  );
}

export default CheckoutPage;
