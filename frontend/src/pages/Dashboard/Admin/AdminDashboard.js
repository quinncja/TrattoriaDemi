import GiftcardDash from "./Giftcard/GiftcardDash";
import PayrollDash from "./Payroll/PayrollDash";

function AdminDashboard(){


    return(
        <div className="admin-dashboard">
            <PayrollDash/>
            <GiftcardDash/>
        </div>
    )
}

export default AdminDashboard;