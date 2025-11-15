
const express = require("express");
const reservationRouter = express.Router();
const TimeBlock = require("./TimeBlock"); 
const { Reservation, Log } = require("./Reservation");
const { sendResText } = require("./sendResText");
const { sendCancelText } = require("./sendCancelText");
const { sendUpdatedResText } = require("./sendUpdatedResText");
const { reservationChecker } = require("./reservationChecker");

let clients = [];

// Create new reservation
reservationRouter.post("/", async (req, res) => {
  try {
    const { name, numGuests, date, time, notes, phone, tableSize, sendText } =
      req.body;

    let newReservation = new Reservation({
      name,
      numGuests,
      date,
      time,
      notes,
      phone,
      tableSize,
      sendText,
    });
    const response = await reservationChecker(numGuests, date, time, false);
    if (response.available) {
      await newReservation.save();
      if (sendText) await sendResText(newReservation);
      clients.forEach((client) =>
        client.write(`data: ${JSON.stringify(newReservation)}\n\n`),
      );

      newReservation = await attachLogToReservation(newReservation);
      
      res.status(201).json(newReservation);
    } else {
      res.status(500).json({ error: "Availability error" });
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const hourOptions = [
  "11:30am",
  "11:45am",
  "12:00pm",
  "12:15pm",
  "12:30pm",
  "12:45pm",
  "1:00pm",
  "1:15pm",
  "1:30pm",
  "1:45pm",
  "2:00pm",
  "2:15pm",
  "2:30pm",
  "2:45pm",
  "3:00pm",
  "3:15pm",
  "3:30pm",
  "3:45pm",
  "4:00pm",
  "4:15pm",
  "4:30pm",
  "4:45pm",
  "5:00pm",
  "5:15pm",
  "5:30pm",
  "5:45pm",
  "6:00pm",
  "6:15pm",
  "6:30pm",
  "6:45pm",
  "7:00pm",
  "7:15pm",
  "7:30pm",
  "7:45pm",
  "8:00pm",
  "8:15pm",
  "8:30pm",
  "8:45pm",
  "9:00pm",
];

function convertTo12Hour(time) {
  if (typeof time !== "string" || !/^\d{1,2}:\d{2}$/.test(time)) {
    return "";
  }

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  let period = "am";
  if (hours >= 12) {
    period = "pm";
  }

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
}

function getHourIndex(time12) {
  return hourOptions.indexOf(time12);
}

function isTimeValidForToday(time12) {
  const now = new Date();
  const chicagoNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  
  const currentHour = chicagoNow.getHours();
  const currentMinute = chicagoNow.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const [hours, minutesPeriod] = time12.match(/(\d+):(\d+)(am|pm)/).slice(1);
  let hour = parseInt(hours);
  const minute = parseInt(minutesPeriod);
  const period = time12.slice(-2);

  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  const reservationTimeInMinutes = hour * 60 + minute;

  return reservationTimeInMinutes > currentTimeInMinutes + 15;
}

reservationRouter.get("/timelist", async (req, res) => {
  try {
    const { date } = req.query;
    const requestedYear = Number(date.substring(0, 4));
    const requestedMonth = Number(date.substring(5, 7));
    const requestedDay = Number(date.substring(8, 10));

    const requestDate = new Date(requestedYear, requestedMonth - 1, requestedDay);
    const dayOfWeek = requestDate.getDay();

    const now = new Date();
    const chicagoNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const isToday = requestDate.toDateString() === chicagoNow.toDateString();

    let dayStartTime, dayEndTime;
    switch (dayOfWeek) {
      case 0: 
        dayStartTime = "12:00pm";
        dayEndTime = "7:30pm";
        break;
      case 5:
      case 6: 
        dayStartTime = "11:30am";
        dayEndTime = "8:30pm";
        break;
      default: 
        dayStartTime = "11:30am";
        dayEndTime = "7:30pm";
    }

    const dayStartIndex = getHourIndex(dayStartTime);
    const dayEndIndex = getHourIndex(dayEndTime);

    let timeBlock = await TimeBlock.findOne({
      $or: [
        {
          repeat: true,
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: "$date" }, requestedDay] },
              { $eq: [{ $month: "$date" }, requestedMonth] }
            ]
          }
        },
        {
          repeat: { $ne: true },
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: "$date" }, requestedDay] },
              { $eq: [{ $month: "$date" }, requestedMonth] },
              { $eq: [{ $year: "$date" }, requestedYear] }
            ]
          }
        }
      ]
    });

    let result = [...hourOptions];

    if (timeBlock) {
      const startTime12 = convertTo12Hour(timeBlock.startTime);
      const endTime12 = convertTo12Hour(timeBlock.endTime);
      const blockStartIndex = getHourIndex(startTime12);
      const blockEndIndex = getHourIndex(endTime12);

      if (blockStartIndex !== -1 && blockEndIndex !== -1) {
        if (timeBlock.blockType === "Open") {
          const effectiveStartIndex = Math.max(blockStartIndex, dayStartIndex);
          const effectiveEndIndex = Math.min(blockEndIndex, dayEndIndex);
          result = hourOptions.slice(effectiveStartIndex, effectiveEndIndex + 1);
        } else if (timeBlock.blockType === "Closed") {
          const lowerIndex = Math.min(blockStartIndex, blockEndIndex);
          const upperIndex = Math.max(blockStartIndex, blockEndIndex);
          
          if (lowerIndex === 0 && upperIndex === hourOptions.length - 1) {
            result = [];
          } else {
            const part1 = hourOptions.slice(0, lowerIndex);
            const part2 = hourOptions.slice(upperIndex + 1, hourOptions.length);
            result = [...part1, ...part2];
            
            result = result.filter(time => {
              const timeIndex = getHourIndex(time);
              return timeIndex >= dayStartIndex && timeIndex <= dayEndIndex;
            });
          }
        }
      } else {
    
        result = hourOptions.slice(dayStartIndex, dayEndIndex + 1);
      }
    } else {
      result = hourOptions.slice(dayStartIndex, dayEndIndex + 1);
    }

    if (isToday) {
      result = result.filter(time => isTimeValidForToday(time));
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

reservationRouter.post("/timeblock", async (req, res) => {
  try {
    const { date, startTime, endTime, repeat, blockType } = req.body;

    const newTimeBlock = new TimeBlock({
      date,
      startTime,
      endTime,
      repeat,
      blockType
    });

    await newTimeBlock.save();

    return res.status(201).json(newTimeBlock);
  } catch (error) {
    console.error("Error creating time block:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

reservationRouter.get("/timeblock", async (req, res) => {
  try {
    const timeBlocks = await TimeBlock.find();

    const now = new Date();
    const chicagoNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Chicago" })
    );
    chicagoNow.setHours(0, 0, 0, 0);

    const upcoming = timeBlocks.filter((block) => {
      if (!block.repeat) {
        const blockDate = new Date(block.date);
        const chicagoBlockDate = new Date(
          blockDate.toLocaleString("en-US", { timeZone: "America/Chicago" })
        );
        chicagoBlockDate.setHours(0, 0, 0, 0);
        
        return chicagoBlockDate >= chicagoNow;
      }
      return false;
    });
    
    const repeating = timeBlocks.filter((block) => block.repeat);

    return res.status(200).json({ upcoming, repeating });
  } catch (error) {
    console.error("Error fetching time blocks:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

reservationRouter.delete("/timeblock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTimeBlock = await TimeBlock.findByIdAndDelete(id);

    if (!deletedTimeBlock) {
      return res.status(404).json({ error: "Time block not found" });
    }

    return res.status(200).json({ message: "Time block deleted successfully" });
  } catch (error) {
    console.error("Error deleting time block:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


reservationRouter.get("/events", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

reservationRouter.post("/override", async (req, res) => {
  try {
    const { name, numGuests, date, time, notes, phone, tableSize, sendText, employee } =
      req.body;

    let newReservation = new Reservation({
      name,
      numGuests,
      date,
      time,
      notes,
      phone,
      tableSize,
      selfMade: true,
      user: employee
    });

    await newReservation.save();
    if (sendText) await sendResText(newReservation);
    newReservation = await attachLogToReservation(newReservation);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get list of reservations
reservationRouter.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get reservation by id
reservationRouter.get("/id/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete reservation by id
reservationRouter.delete("/id/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const deletedReservation =
      await Reservation.findByIdAndRemove(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

function sortReservationsByTime(reservations) {
  return reservations.sort((a, b) => {
    const [hourA, minuteA] = a.time.split(":").map(Number);
    const [hourB, minuteB] = b.time.split(":").map(Number);

    if (hourA !== hourB) {
      return hourA - hourB;
    }

    return minuteA - minuteB;
  });
}


const attachLogToReservation = async (reservation) =>{
    const plainReservation = reservation.toObject ? reservation.toObject() : reservation;
    
    const logs = await Log.find({
      reservationId: plainReservation._id
    }).sort({ time: 1 });
        
    reservation = {
      ...plainReservation,
      logs
    };

    return reservation;
} 

const attachLogToReservationList = async (reservations) =>{
    const reservationIds = reservations.map(r => r._id);
    
    const logs = await Log.find({
      reservationId: { $in: reservationIds }
    }).sort({ time: 1 });
    
    const logsMap = {};
    logs.forEach(log => {
      const resId = log.reservationId.toString();
      if (!logsMap[resId]) {
        logsMap[resId] = [];
      }
      logsMap[resId].push(log);
    });
    
    reservations = reservations.map(reservation => ({
      ...reservation,
      logs: logsMap[reservation._id.toString()] || []
    }));

    return reservations;
} 

reservationRouter.get("/date/:date", async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    const chicagoTargetDate = new Date(
      `${targetDate.toLocaleString("en-US", { timeZone: "America/Chicago" })} GMT`,
    );
    const startOfDay = new Date(
      Date.UTC(
        chicagoTargetDate.getUTCFullYear(),
        chicagoTargetDate.getUTCMonth(),
        chicagoTargetDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        chicagoTargetDate.getUTCFullYear(),
        chicagoTargetDate.getUTCMonth(),
        chicagoTargetDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
    
    let reservations = await Reservation.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    }).lean();
    
    reservations = sortReservationsByTime(reservations);
    reservations = await attachLogToReservationList(reservations);

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations by date:", error);
    res.status(500).json({ error: "Server error" });
  }
});

function getCurrentTime() {
  const now = new Date();


  const chicagoDateTime = new Date(
    `${now.toLocaleString("en-US", { timeZone: "America/Chicago" })} GMT`,
  );
  const hours = String(chicagoDateTime.getUTCHours()).padStart(2, "0");
  const minutes = String(chicagoDateTime.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const objDiff = (oldObj, newObj) => {
  let oldState = [], newState = []

  Object.keys(newObj).forEach(key => {
    if(oldObj[key] && oldObj[key] !== newObj[key] && key !== "dateMade" && key !== "tableSize" && key !== "_id"){
      if(key === "date" && oldObj[key].toISOString() === newObj[key]) return 
      oldState.push({key, value: oldObj[key]})
      newState.push({key, value: newObj[key]})
    };
  })

  return { oldState, newState };
}

const logReservationChange = async (id, oldState, newState, employee = null) => {
    const newLog = new Log({
        reservationId: id,
        oldState,
        newState,
        user: employee
    });
    await newLog.save({ writeConcern: { w: 'majority', j: true } });
    return newLog;
}
//update reservation state

reservationRouter.patch("/id/:id/state/:state", async (req, res) => {
  try {
    const [reservationId, newState] = [req.params.id, req.params.state];

    const existingReservation = await Reservation.findById(reservationId);

    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const lowercaseState = newState.toLowerCase();
    let arrivedTime = "";
    if (lowercaseState === "arrived") {
      arrivedTime = getCurrentTime();
    }

    let updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { state: lowercaseState, arrivedTime: arrivedTime },
      { new: true },
    );

    const oldStateObj = {
      key: "state",
      value: existingReservation.state
    }
    const newStateObj = {
      key: "state",
      value: lowercaseState
    }

    await logReservationChange(updatedReservation._id, oldStateObj, newStateObj, "Employee")
    updatedReservation  = await attachLogToReservation(updatedReservation)

    if (newState === "cancel" && updatedReservation.phone) {
      sendCancelText(updatedReservation.phone);
    }

    clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(updatedReservation)}\n\n`),
    );

    res.json(updatedReservation);

  } catch (error) {
    console.error("Error updating reservation state:", error);
    res.status(500).json({ error: "Server error" });
  }
});

reservationRouter.get("/check", async (req, res) => {
  const numGuests = req.query.numGuests;
  const date = req.query.date;
  const time = req.query.time;
  const override = req.query.override === "true";

  const response = await reservationChecker(numGuests, date, time, override);
  response.override = override;
  res.status(200).json(response);
});


module.exports = reservationRouter;


// Update reservation by id
reservationRouter.put("/id/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const updatedData = req.body;

    const existingReservation = await Reservation.findById(reservationId).lean();
    const {oldState, newState} = objDiff(existingReservation, updatedData)

    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    let updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updatedData,
      { new: true },
    );

    await logReservationChange(reservationId, oldState, newState, updatedData.employee);
    await sendUpdatedResText(updatedReservation);
  
    updatedReservation = await attachLogToReservation(updatedReservation); 

    clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(updatedReservation)}\n\n`),
    );

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});


reservationRouter.put("/timeblock/:id", async (req, res) => {
  try {
    const timeblockId = req.params.id;
    const updatedItem = req.body;

    const existingBlock = await TimeBlock.findById(timeblockId);

    if (!existingBlock) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const updatedBlock = await TimeBlock.findByIdAndUpdate(
      timeblockId,
      updatedItem,
      { new: true },
    );

    res.status(200).json(updatedBlock);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

reservationRouter.get("/stats", async (req, res) => {
  try {
    const now = new Date();

    const chicagoNow = new Date(
      `${now.toLocaleString("en-US", { timeZone: "America/Chicago" })} GMT`
    );

    const todayStart = new Date(
      chicagoNow.getFullYear(),
      chicagoNow.getMonth(),
      chicagoNow.getDate(),
      0,
      0,
      0
    );
    const todayEnd = new Date(
      chicagoNow.getFullYear(),
      chicagoNow.getMonth(),
      chicagoNow.getDate(),
      23,
      59,
      59
    );

    const lastWeekEnd = new Date(chicagoNow);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1); 

    const lastWeekStart = new Date(chicagoNow);
    lastWeekStart.setDate(lastWeekStart.getDate() - 6); 

    // Ensure consistent timezone handling for all date ranges
    const monthStart = new Date(chicagoNow.getFullYear(), chicagoNow.getMonth(), 1, 0, 0, 0);
    const monthEnd = new Date(
      chicagoNow.getFullYear(),
      chicagoNow.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const yearStart = new Date(chicagoNow.getFullYear(), 0, 1, 0, 0, 0);
    const yearEnd = new Date(
      chicagoNow.getFullYear(),
      11,
      31,
      23,
      59,
      59
    );

    // Use a more reasonable start date - adjust based on your actual data
    const allTimeStart = new Date(2020, 0, 1, 0, 0, 0);
    const allTimeEnd = new Date(9999, 11, 31, 23, 59, 59);

    function combineState(state) {
      if (state === "arrived" || state === "upcoming") return "arrUp";
      if (state === "noshow") return "noshow";
      if (state === "cancel") return "cancel";
      return "other";
    }

    async function getStackedStats(startDate, endDate) {
      const reservations = await Reservation.find({
        date: { $gte: startDate, $lte: endDate },
      }).select("numGuests state");

      let totalGuests = 0;
      let totalReservations = 0; // Only count arrived and upcoming
      const groupingMap = {};

      for (const r of reservations) {
        const cState = combineState(r.state);
        
        // Only count guests and reservations for arrived/upcoming
        if (cState === "arrUp") {
          totalGuests += r.numGuests;
          totalReservations++;
        }

        const numGuestsKey = String(r.numGuests);

        if (!groupingMap[numGuestsKey]) {
          groupingMap[numGuestsKey] = {
            arrUp: 0,
            noshow: 0,
            cancel: 0,
            other: 0,
          };
        }
        groupingMap[numGuestsKey][cState] += 1;
      }

      const data = Object.entries(groupingMap)
        .map(([numGuests, statesObj]) => {
          const row = {
            numGuests,
            arrUp: statesObj.arrUp,
            noshow: statesObj.noshow,
            cancel: statesObj.cancel,
          };

          Object.keys(row).forEach((key) => {
            if (key !== "numGuests" && row[key] === 0) {
              delete row[key];
            }
          });

          return row;
        })
        .sort((a, b) => parseInt(a.numGuests, 10) - parseInt(b.numGuests, 10));

      return {
        data,
        totalGuests,
        totalReservations,
      };
    }

    async function getTrendStats(startDate, endDate, groupBy) {
      if (!["day", "month"].includes(groupBy)) {
        throw new Error("Invalid grouping unit");
      }

      // Use a simpler approach that matches your date filtering exactly
      const reservations = await Reservation.find({
        date: { $gte: startDate, $lte: endDate },
      }).select("date state");

      const dateMap = {};

      for (const reservation of reservations) {
        const cState = combineState(reservation.state);
        
        // Convert to Chicago timezone and format consistently
        const chicagoDate = new Date(reservation.date.toLocaleString("en-US", { timeZone: "America/Chicago" }));
        
        let dateKey;
        if (groupBy === "day") {
          const year = chicagoDate.getFullYear();
          const month = String(chicagoDate.getMonth() + 1).padStart(2, "0");
          const day = String(chicagoDate.getDate()).padStart(2, "0");
          dateKey = `${year}-${month}-${day}`;
        } else {
          const year = chicagoDate.getFullYear();
          const month = String(chicagoDate.getMonth() + 1).padStart(2, "0");
          dateKey = `${year}-${month}`;
        }

        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { arrUp: 0, noshow: 0, cancel: 0 };
        }

        if (["arrUp", "noshow", "cancel"].includes(cState)) {
          dateMap[dateKey][cState] += 1;
        }
      }

      // PERFORMANCE FIX: Only fill missing periods for specific cases
      if (groupBy === "month") {
        // Only fill current year for year view, don't fill massive date ranges
        const isYearView = startDate.getFullYear() === endDate.getFullYear() &&
                          startDate.getMonth() === 0 && 
                          endDate.getMonth() === 11;
        
        if (isYearView) {
          const year = startDate.getFullYear();
          for (let m = 0; m < 12; m++) {
            const dateKey = `${year}-${String(m + 1).padStart(2, "0")}`;
            if (!dateMap[dateKey]) {
              dateMap[dateKey] = { arrUp: 0, noshow: 0, cancel: 0 };
            }
          }
        }
        // For allTime view, DON'T fill missing months - only return what has data
      }

      const sortedKeys = Object.keys(dateMap).sort();

      const arrUpSeries = { id: "arrUp", data: [] };
      const noshowSeries = { id: "noshow", data: [] };
      const cancelSeries = { id: "cancel", data: [] };

      for (const k of sortedKeys) {
        const { arrUp, noshow, cancel } = dateMap[k];
        arrUpSeries.data.push({ x: k, y: arrUp });
        noshowSeries.data.push({ x: k, y: noshow });
        cancelSeries.data.push({ x: k, y: cancel });
      }

      return [arrUpSeries, noshowSeries, cancelSeries];
    }

    const [
      todayStats,
      lastWeekStats,
      monthStats,
      yearStats,
      allTimeStats,

      todayTimeSeries,
      lastWeekTimeSeries,
      monthTimeSeries,
      yearTimeSeries,
      allTimeTimeSeries,
    ] = await Promise.all([
      getStackedStats(todayStart, todayEnd),
      getStackedStats(lastWeekStart, lastWeekEnd),
      getStackedStats(monthStart, monthEnd),
      getStackedStats(yearStart, yearEnd),
      getStackedStats(allTimeStart, allTimeEnd),

      getTrendStats(todayStart, todayEnd, "day"), 
      getTrendStats(lastWeekStart, lastWeekEnd, "day"),
      getTrendStats(monthStart, monthEnd, "day"), 
      getTrendStats(yearStart, yearEnd, "month"),
      getTrendStats(allTimeStart, allTimeEnd, "month"), 
    ]);

    todayStats.timeSeries = todayTimeSeries;
    lastWeekStats.timeSeries = lastWeekTimeSeries;
    monthStats.timeSeries = monthTimeSeries;
    yearStats.timeSeries = yearTimeSeries;
    allTimeStats.timeSeries = allTimeTimeSeries;

    res.json({
      today: {
        data: todayStats.data,
        totalGuests: todayStats.totalGuests,
        totalReservations: todayStats.totalReservations,
        timeSeries: todayStats.timeSeries,
      },
      week: {
        data: lastWeekStats.data,
        totalGuests: lastWeekStats.totalGuests,
        totalReservations: lastWeekStats.totalReservations,
        timeSeries: lastWeekStats.timeSeries,
      },
      month: {
        data: monthStats.data,
        totalGuests: monthStats.totalGuests,
        totalReservations: monthStats.totalReservations,
        timeSeries: monthStats.timeSeries,
      },
      year: {
        data: yearStats.data,
        totalGuests: yearStats.totalGuests,
        totalReservations: yearStats.totalReservations,
        timeSeries: yearStats.timeSeries,
      },
      allTime: {
        data: allTimeStats.data,
        totalGuests: allTimeStats.totalGuests,
        totalReservations: allTimeStats.totalReservations,
        timeSeries: allTimeStats.timeSeries,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send("Server Error");
  }
});

reservationRouter.delete("/delete-old-reservations", async (req, res) => {
  try {
    const result = await Reservation.deleteMany({ name: "-" });

    res.json({
      message: `Deleted ${result.deletedCount} reservations before November 1st, 2024.`,
    });
  } catch (error) {
    console.error("Error deleting reservations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

async function updateReservationDate(reservationId) {
  try {
    const newDate = new Date("2024-11-10T06:00:00.000Z");

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { date: newDate },
      { new: true }
    );

    if (!updatedReservation) {
      throw new Error("Reservation not found");
    }

    return updatedReservation;
  } catch (error) {
    console.error("Error updating reservation date:", error);
    throw error;
  }
}

reservationRouter.patch("/id/:id/date", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const updatedReservation = await updateReservationDate(reservationId);

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = reservationRouter;
