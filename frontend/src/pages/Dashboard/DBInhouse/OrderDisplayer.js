import Order from "./Order";

function OrderDisplayer(props) {
  const confirmOrder = props.confirmOrder;
  const cancelOrder = props.cancelOrder;
  const setState = props.setState;
  const orders = props.orders;
  const completeOrder = props.completeOrder;

  function mapOrders() {
    return orders
      .sort((a, b) => new Date(a.timePlaced) - new Date(b.timePlaced))
      .map((order) => (
        <Order
          key={order._id}
          order={order}
          setState={setState}
          confirmOrder={confirmOrder}
          cancelOrder={cancelOrder}
          completeOrder={completeOrder}
        />
      ));
  }

  return <>{orders && orders.length > 0 && <>{mapOrders()}</>}</>;
}

export default OrderDisplayer;
