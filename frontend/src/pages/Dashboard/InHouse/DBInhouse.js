import Reservations from "./Reservations";
import Orders from "./Orders";
import "./DBInhouse.css";

function DBInhouse() {
  return (
    <div className="inhouse-container">
      <Reservations />
      <div className="hr-db-line" />
      <Orders />
    </div>
  );
}

export default DBInhouse;
