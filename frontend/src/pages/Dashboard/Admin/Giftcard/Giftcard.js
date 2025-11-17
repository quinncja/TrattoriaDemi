import { dateToShortString } from "dateUtils";

function Giftcard({giftcardObj}){

    return(
        <div className="dash-giftcard">
            <div style={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}> 
            <div style={{display: 'flex', flexDirection: "column", gap: "4px"}}>
            <div style={{display: 'flex', alignItems: "baseline", gap: "5px", fontSize: "15px", fontWeight: '600'}}> <div style={{ opacity: "1"}}> to </div> {giftcardObj.recipientName} </div>
            <div style={{display: 'flex', alignItems: "baseline", gap: '5px', opacity: ".6", fontSize: '15px' }}> <div style={{fontSize: '16px'}}> from </div>  {giftcardObj.senderName} </div>
            </div>

            <div style={{display: 'flex', flexDirection: "column", gap: "4px", alignItems: "flex-end"}}>
            <div style={{fontSize: '15px', opacity: ".8"}}> {dateToShortString(new Date(giftcardObj.datePurchased))}</div> 
            <div style={{color: "var(--gold)", fontWeight: '600', fontSize: "20px", filter: "brightness(1.1)"}}> ${giftcardObj.amount} </div>
            </div>

            </div>
        </div>
    )
}

export default Giftcard;