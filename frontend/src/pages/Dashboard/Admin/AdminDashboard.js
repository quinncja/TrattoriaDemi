import GiftcardDash from "./Giftcard/GiftcardDash";
import PayrollDash from "./Payroll/PayrollDash";
import ReservationDash from "./Reservation/ReservationDash";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <PayrollDash />
      <ReservationDash />
      <GiftcardDash />
      <br />
    </div>
  );
}

export default AdminDashboard;
