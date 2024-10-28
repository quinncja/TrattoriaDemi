import GiftcardDash from "./Giftcard/GiftcardDash";
import PayrollDash from "./Payroll/PayrollDash";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <PayrollDash />
      <GiftcardDash />
      <br />
    </div>
  );
}

export default AdminDashboard;
