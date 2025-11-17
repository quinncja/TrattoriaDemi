import { getGiftcardData } from "api";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import Giftcard from "./Giftcard";

function GiftcardDash() {
  const [chartData, setChartData] = useState();
  const [giftCards, setGiftcards] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await getGiftcardData();
      const { data, totalAmount, recentItems} = loadedData;
      setChartData(data);
      setGiftcards(recentItems);
      setTotal(totalAmount);
    };

    loadData();
  }, []);


  return (
    <> 
      <div className="dash-item" style={{paddingBlock: '30px', paddingInline: "35px"}}>
        <div className="connection-line giftcard-connection"> </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "space-between",
          }}
        >
          <h2> Giftcards </h2>
          <div className="giftcard-total">
            <span className="white small"> Total Sold: </span>
            <strong className="white"> ${total} </strong>
          </div>
        </div>
        <div className="bar-wrapper">
          {chartData && <BarChart data={chartData} />}
        </div>
      </div>

      <div className="dash-item" style={{paddingBlock: '30px', paddingInline: "0px"}}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: 'center',
            paddingInline: "35px"
          }}
        >
          <h2> Recently Purchased </h2>
          <div className="submit-button new-payroll edit-employees" style={{width: '65px'}}>
            <span className="white small"> See All </span>
          </div>
        </div>
          
        <div className="bar-wrapper" style={{paddingTop: "20px"}}>
          {giftCards && giftCards.map((obj) => <Giftcard giftcardObj={obj}/>)}
        </div>
      </div>
    </>
  );
}

export default GiftcardDash;
