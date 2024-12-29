import { getGiftcardData } from "api";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";

function GiftcardDash() {
  const [chartData, setChartData] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await getGiftcardData();
      const { data, totalAmount } = loadedData;
      setChartData(data);
      setTotal(totalAmount);
    };

    loadData();
  }, []);

  return (
    <div className="dash-item">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
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
  );
}

export default GiftcardDash;
