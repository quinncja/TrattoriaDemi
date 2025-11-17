import {
  deleteTimeblock,
  getReservationsData,
  getTimeblocks,
  postTimeBlock,
  updateTimeblock,
} from "api";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import { peopleSvg, plusSvg, resBookSvg } from "svg";
import TimeBlockPopup from "./TimeBlockPopup";
import TimeBlock from "./Timeblock";
import LineChart from "./LineChart";
import { toast } from "sonner";
import { formatNumberWithCommas } from "functions";

function ReservationDash() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentChart, setCurrent] = useState("week");
  const [data, setData] = useState({
    week: null,
    month: null,
    year: null,
  });
  const [timeblocks, setTimeblocks] = useState();
  const closePopup = () => {
    clearEditingBlock();
    setPopupOpen(false);
  };

  function sortRepeating(arr) {
    return arr.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);

      if (da.getMonth() !== db.getMonth()) {
        return da.getMonth() - db.getMonth();
      }
      return da.getDate() - db.getDate();
    });
  }

  function sortUpcoming(arr) {
    return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const submitBlock = async (newBlock) => {
    try {
      const response = await postTimeBlock(newBlock);
      const createdBlock = response.data;
      setTimeblocks((prev) => {
        if (createdBlock.repeat) {
          const updatedRepeating = sortRepeating([
            ...prev.repeating,
            createdBlock,
          ]);
          return {
            ...prev,
            repeating: updatedRepeating,
          };
        } else {
          const updatedUpcoming = sortUpcoming([
            ...prev.upcoming,
            createdBlock,
          ]);
          return {
            ...prev,
            upcoming: updatedUpcoming,
          };
        }
      });
      closePopup();
      toast.success("Timeblock successfuly created");
    } catch (error) {
      toast.error("Failed to create Timeblock");
    }
  };

  useEffect(() => {
    const loadTimeblocks = async () => {
      const loadedData = await getTimeblocks();

      const sortedData = {
        repeating: sortRepeating(loadedData.repeating),
        upcoming: sortUpcoming(loadedData.upcoming),
      };
      console.log(sortedData);
      setTimeblocks(sortedData);
    };

    loadTimeblocks();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await getReservationsData();
      console.log(loadedData);
      setData(loadedData);
    };

    loadData();
  }, []);

  const resCountItems = [
    {
      title: "Today",
      id: "today",
      ...data.today,
    },
    {
      title: "Week",
      id: "week",
      ...data.week,
    },
    {
      title: "Month",
      id: "month",
      ...data.month,
    },
    {
      title: "Year",
      id: "year",
      ...data.year,
    },
    {
      title: "All time",
      id: "allTime",
      ...data.allTime,
    },
  ];

  const resCount = (obj) => {
    return (
      <div className="res-count-wrapper">
        <div
          onClick={() => setCurrent(obj.id)}
          className={`res-count filter-button ${
            currentChart === obj.id && "active-filter-button"
          }`}
        >
          <label className="res-count-label"> {obj.title} </label>
          <div
            style={{
              display: "grid",
              gridTemplate: "1fr / 1fr 1fr",
              gap: "5px",
              width: "90%",
  
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "7px",
                minWidth: "3.5ch",
              }}
            >
              {resBookSvg()}
              {formatNumberWithCommas(obj.totalReservations)}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "7px",
                alignItems: "center",
                minWidth: "3.5ch",
              }}
            >
              {peopleSvg()}
              {formatNumberWithCommas(obj.totalGuests)}
            </div>
          </div>
        </div>
        {currentChart === obj.id && <div className="connection-line" />}
      </div>
    );
  };

  const [editingBlock, setEditingBlock] = useState({
    date: null,
    startTime: null,
    endTime: null,
    repeat: null,
    type: null,
    editing: false,
  });

  const clearEditingBlock = () => {
    setEditingBlock({
      date: null,
      startTime: null,
      endTime: null,
      repeat: null,
      type: null,
      editing: false,
    });
  };

  const editBlock = (block) => {
    setEditingBlock({ ...block, editing: true });
    setPopupOpen(true);
  };

  const updateBlock = async (id, updatedFields) => {
    try {
      const response = await updateTimeblock(id, updatedFields);
      console.log(response);
      const updatedBlock = response.data;
      setTimeblocks((prev) => {
        let newRepeating = prev.repeating.filter((b) => b._id !== id);
        let newUpcoming = prev.upcoming.filter((b) => b._id !== id);

        if (updatedBlock.repeat) {
          newRepeating.push(updatedBlock);
          newRepeating = sortRepeating(newRepeating);
        } else {
          newUpcoming.push(updatedBlock);
          newUpcoming = sortUpcoming(newUpcoming);
        }

        return {
          ...prev,
          repeating: newRepeating,
          upcoming: newUpcoming,
        };
      });

      toast.success("Timeblock updated");
      closePopup();
    } catch (error) {
      toast.error("Timeblock failed to update");
    }
  };

  const deleteBlock = async (id) => {
    try {
      await deleteTimeblock(id);

      setTimeblocks((prev) => {
        const newRepeating = prev.repeating.filter((b) => b._id !== id);
        const newUpcoming = prev.upcoming.filter((b) => b._id !== id);

        return {
          ...prev,
          repeating: newRepeating,
          upcoming: newUpcoming,
        };
      });

      toast.success("Timeblock deleted");
      closePopup();
    } catch (error) {
      toast.error("Timeblock failed to delete");
    }
  };

  const breakdownHeader = () => {

    const calcTotal = (type) => {
      return data[currentChart].data.reduce((sum, item) => sum + (item[type] || 0), 0);
    }

    return(
      <div className="res-breakdown-count" style={{display: "flex", flexDirection: "row", gap: "35px", fontSize: "14px", color: "white"}}>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}> 
              <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}> 
            <div style={{fontSize: '16px', fontWeight: "600", display: 'flex', gap: "5px", alignItems: "center"}}>             
            <div style={{background: "var(--gold)", height: '10px', width: "10px", borderRadius: "50%"}}/> {calcTotal("arrUp")} </div>
            <div style={{opacity: '.8'}}> Completed </div>
            </div>
          </div>

          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}> 
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}> 
            <div style={{fontSize: '16px', fontWeight: "600", display: 'flex', gap: "5px", alignItems: "center"}}>             
            <div style={{background: "#c64949", height: '10px', width: "10px", borderRadius: "50%"}}/> {calcTotal("cancel")} </div>
            <div style={{opacity: '.8'}}> Canceled </div>
            </div>
          </div>

          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}> 
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}> 
            <div style={{fontSize: '16px', fontWeight: "600", display: 'flex', gap: "5px", alignItems: "center"}}>             
            <div style={{background: "#a09c9c", height: '10px', width: "10px", borderRadius: "50%"}}/> {calcTotal("noshow")} </div>
            <div style={{opacity: '.8'}}> No Show </div>
            </div>
          </div>

      </div>
    )
  }

  return (
    <div
      className="dash-item dash-item-full"
      style={{
        gridRow: "span 2",
        background: "none",
        border: "none",
        padding: "0px",
        display: "grid",
        gridTemplateColumns: ".5fr 1fr .5fr",
        gridTemplateRows: "1fr .8fr",
        gap: "12px",
      }}
    >
      <div
        className="faux-dash-item res-count-item"
        style={{ gridRow: "span 1" }}
      >
        <h2 style={{ height: "45px" }}> Reservations </h2>
        <div className="res-dash-left todays-res">
          {resCountItems.map((item) => {
            return resCount(item);
          })}
        </div>
      </div>

      <div className="faux-dash-item breakdown" style={{ gridRow: "span 1" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "space-between",
          }}
        >
        <h2 style={{ height: "45px" }}> Breakdown </h2>
        {data[currentChart] && breakdownHeader()}
        </div>
        <div className="res-dash-left">
          <div className="bar-wrapper">
            {data[currentChart] && <BarChart data={data[currentChart].data} />}
          </div>
        </div>
      </div>

      <div className="faux-dash-item" style={{ gridRow: "span 2" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ height: "35px" }}> Timeblocks </h2>
          <button
            className="new-payroll edit-employees new-block"
            onClick={() => setPopupOpen(true)}
          >
            {" "}
            {plusSvg()} New{" "}
          </button>
        </div>
        <div className="res-dash-left timeblock-container">
          <div
            className="res-count timeblocks no-inner-padding"
            style={{ width: "300px" }}
          >
            <label className="res-count-label" style={{ marginLeft: "5px" }}>
              {" "}
              Upcoming{" "}
            </label>
            {timeblocks && timeblocks.upcoming.length > 0 ? (
              timeblocks.upcoming.map((item) => (
                <TimeBlock item={item} editBlock={editBlock} />
              ))
            ) : (
              <div
                style={{
                  fontSize: "14px",
                  opacity: ".7",
                  width: "100%",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                {" "}
                No upcoming timeblocks{" "}
              </div>
            )}
          </div>
          <div className="res-count timeblocks no-inner-padding">
            <label className="res-count-label" style={{ marginLeft: "5px" }}>
              {" "}
              Repeating{" "}
            </label>
            {timeblocks && timeblocks.repeating.length > 0 ? (
              timeblocks.repeating.map((item) => (
                <TimeBlock item={item} editBlock={editBlock} />
              ))
            ) : (
              <div
                style={{
                  fontSize: "14px",
                  opacity: ".7",
                  width: "100%",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                {" "}
                No repeating timeblocks{" "}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="faux-dash-item breakdown"
        style={{ gridColumn: "span 2" }}
      >
        <div className={`connector-line cl-${currentChart}`} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ height: "45px" }}> History </h2>
        </div>
        <div className="res-dash-left">
          <div className="pointer-events" style={{ height: "40vh" }}>
            {data[currentChart] && (
              <LineChart
                data={data[currentChart].timeSeries}
                view={currentChart}
              />
            )}
          </div>
        </div>
      </div>

      {popupOpen && (
        <TimeBlockPopup
          editingBlock={editingBlock}
          submitBlock={submitBlock}
          closeSelf={closePopup}
          updateBlock={updateBlock}
          deleteBlock={deleteBlock}
        />
      )}
    </div>
  );
}

export default ReservationDash;
