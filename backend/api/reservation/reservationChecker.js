const TimeBlock = require("./TimeBlock");
const Reservation = require("./Reservation");
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

const tableSizes = {
  1: ["2top"],
  2: ["2top", "3top"],
  3: ["3top", "4top"],
  4: ["4top", "6top"],
  5: ["6top"],
  6: ["6top"],
  7: ["6top"],
  8: ["xl"],
  9: ["xl"],
  10: ["xl"],
  11: ["2xl"],
  12: ["2xl"],
  13: ["2xl"],
  14: ["2xl"],
  15: ["3xl"],
  16: ["3xl"],
  17: ["3xl"],
  18: ["3xl"],
  19: ["4xl"],
  20: ["4xl"],
  21: ['5xl'],
  22: ['5xl'],
  23: ['5xl'],
  24: ['5xl'],
  25: ['6xl'],
  26: ['6xl'],
  27: ['6xl'],
  28: ['6xl'],
  29: ['6xl'],
  30: ['6xl'],
};

const baseConfiguration = { "2top": 4, "3top": 2, "4top": 4, "6top": 2 };
const largeTableAdjustments = {
  "xl": [
    { "2top": -1 }, { "6top": -1 }
  ],
  "2xl": [
    { "4top": -1 }, { "6top": -1 }
  ],
  "3xl": [
    { "2top": -1 }, { "4top": -1 }, { "6top": -1 }
  ],
  "4xl": [
    { "4top": -2 }, { "6top": -1 }
  ],
  "5xl": [
    { "2top": -1 }, { "4top": -2 }, { "6top": -1 }
  ],
  "6xl": [
    { "2top": -1 }, { "4top": -3 }, { "6top": -2 }
  ]
};

function convertTo24Hour(time) {
  let [hours, minutes] = time.split(/[:\s]/);
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (time.toLowerCase().includes("pm") && hours !== 12) {
    hours += 12;
  }

  if (time.toLowerCase().includes("am") && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

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

function timeToMinutes(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour * 60 + minute;
}

function isWithinOneHourAndFifteen(time, reservationTime) {
  const timeInMinutes = timeToMinutes(time);
  const reservationTimeInMinutes = timeToMinutes(reservationTime);
  const difference = Math.abs(timeInMinutes - reservationTimeInMinutes);
  return difference <= 90;
}

function canFitLargeTable(currentConfig, tableSize) {
  if (["2top", "3top", "4top", "6top"].includes(tableSize)) {
    return currentConfig[tableSize] > 0;
  }

  const adjustments = largeTableAdjustments[tableSize];
  if (!adjustments) return false;

  let tempConfig = { ...currentConfig };
  
  for (let adjustment of adjustments) {
    for (let [tableType, change] of Object.entries(adjustment)) {
      tempConfig[tableType] += change;
      if (tempConfig[tableType] < 0) {
        return false;
      }
    }
  }
  
  return true;
}


function getCurrentTableConfiguration(overlapRes) {
  let currentConfig = { ...baseConfiguration };

  const largeTypes = ["xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
  const largeCounts = { "xl": 0, "2xl": 0, "3xl": 0, "4xl": 0 , "5xl" : 0, "6xl": 0};
  
  overlapRes.forEach((res) => {
    if (largeTypes.includes(res.tableSize)) {
      largeCounts[res.tableSize] += 1;
    }
  });

  for (let largeType of largeTypes) {
    const count = largeCounts[largeType];
    if (count > 0) {
      const adjustments = largeTableAdjustments[largeType];
      for (let i = 0; i < count; i++) {
        adjustments.forEach((adjustment) => {
          for (let [tableType, change] of Object.entries(adjustment)) {
            if (currentConfig[tableType] !== undefined) {
              currentConfig[tableType] = Math.max(
                0,
                currentConfig[tableType] + change
              );
            }
          }
        });
      }
    }
  }

  for (let key in currentConfig) {
    if (currentConfig[key] < 0) currentConfig[key] = 0;
  }

  return currentConfig;
}

function checkTableAvailability(overlapRes, tableSize) {
  const currentConfig = getCurrentTableConfiguration(overlapRes);
  if (["xl", "2xl", "3xl", "4xl", "5xl", "6xl"].includes(tableSize)) {
    return canFitLargeTable(currentConfig, tableSize);
  }
  
  const tableAmount = currentConfig[tableSize] || 0;
  const count = overlapRes.filter((res) => res.tableSize === tableSize).length;

  if (count + 1 > tableAmount) return false;
  return true;
}

function checkAvailability(reservations, tableOptions, time, override) {
  if (!override && (reservations.some((res) => res.time === time && res.state !== "cancel")))
    return false;
  const overlapRes = reservations.filter(
    (reservation) =>
      isWithinOneHourAndFifteen(time, reservation.time) &&
      reservation.state !== "cancel",
  );
  for (let i = 0; i < tableOptions.length; i++) {
    if (checkTableAvailability(overlapRes, tableOptions[i]))
      return { time, table: tableOptions[i] };
  }
  return false;
}

function isTimeValid(dateStr, timeStr) {
  const localDateStr = dateStr.replace("Z", "");
  const desiredDate = new Date(localDateStr);

  const [hours, minutes] = timeStr.split(":").map(Number);

  desiredDate.setHours(hours, minutes, 0, 0);
  const desiredDateTime = desiredDate;
  
  const now = new Date();

  const isToday = desiredDateTime.toDateString() === now.toDateString();
  const desiredTimeInMinutes = hours * 60 + minutes;

  if (isToday) {
    const timeDifference = desiredDateTime - now;
    const minutesDifference = timeDifference / (1000 * 60);

    if (Math.abs(minutesDifference) < 30) {
      return false;
    }
  }

  const dayOfWeek = desiredDate.getDay();
  let latestTimeInMinutes;
  let earliestTimeInMinutes;

  if (dayOfWeek === 5 || dayOfWeek === 6) {
    latestTimeInMinutes = 20 * 60 + 45;
  } else {
    latestTimeInMinutes = 19 * 60 + 45;
  }

  if (dayOfWeek === 0) {
    earliestTimeInMinutes = 12 * 60;
  } else {
    earliestTimeInMinutes = 11 * 60 + 30;
  }

  if (desiredTimeInMinutes > latestTimeInMinutes) {
    return false;
  }
  if (desiredTimeInMinutes < earliestTimeInMinutes) {
    return false;
  }

  return true;
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


async function reservationChecker(numGuests, desiredDate, desiredTime, override) {
  const targetDate = new Date(desiredDate);

  const chicagoTargetDate = new Date(
    `${targetDate.toLocaleString("en-US", { timeZone: "America/Chicago" })} GMT`,
  );

  const now = new Date();
  const chicagoNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const isToday = chicagoTargetDate.toDateString() === chicagoNow.toDateString();

  const date = chicagoTargetDate.toISOString().split('T')[0];
  const requestedYear = Number(date.substring(0, 4));
  const requestedMonth = Number(date.substring(5, 7));
  const requestedDay = Number(date.substring(8, 10));
  
  const requestDate = new Date(requestedYear, requestedMonth - 1, requestedDay);
  const dayOfWeek = requestDate.getDay();
  
  let dayStartTime, dayEndTime;
      switch (dayOfWeek) {
        case 0: 
          dayStartTime = "12:00pm";
          dayEndTime = "7:45pm";
          break;
        case 5:
        case 6: 
          dayStartTime = "11:30am";
          dayEndTime = "8:45pm";
          break;
        default: 
          dayStartTime = "11:30am";
          dayEndTime = "7:45pm";
      }
  
      const dayStartIndex = getHourIndex(dayStartTime);
      const dayEndIndex = getHourIndex(dayEndTime);
  
      let timeBlock = await TimeBlock.findOne({
        $or: [
          {
            repeat: true,
            $expr: {
              $and: [
                { $eq: [{ $dayOfMonth: { $dateFromString: { dateString: { $substr: ["$date", 0, 10] } } } }, requestedDay] },
                { $eq: [{ $month: { $dateFromString: { dateString: { $substr: ["$date", 0, 10] } } } }, requestedMonth] }
              ]
            }
          },
          {
            repeat: false,
            $expr: {
              $and: [
                { $eq: [{ $dayOfMonth: { $dateFromString: { dateString: { $substr: ["$date", 0, 10] } } } }, requestedDay] },
                { $eq: [{ $month: { $dateFromString: { dateString: { $substr: ["$date", 0, 10] } } } }, requestedMonth] },
                { $eq: [{ $year: { $dateFromString: { dateString: { $substr: ["$date", 0, 10] } } } }, requestedYear] }
              ]
            }
          }
        ]
      });
  
      let availableTimeSlots = [...hourOptions];
  
      if (timeBlock) {
        const startTime12 = convertTo12Hour(timeBlock.startTime);
        const endTime12 = convertTo12Hour(timeBlock.endTime);
        const blockStartIndex = getHourIndex(startTime12);
        const blockEndIndex = getHourIndex(endTime12);
  
        if (blockStartIndex !== -1 && blockEndIndex !== -1) {
          if (timeBlock.blockType === "Open") {
            const effectiveStartIndex = Math.max(blockStartIndex, dayStartIndex);
            const effectiveEndIndex = Math.min(blockEndIndex, dayEndIndex);
            availableTimeSlots = hourOptions.slice(effectiveStartIndex, effectiveEndIndex + 1);
          } else if (timeBlock.blockType === "Closed") {
            const lowerIndex = Math.min(blockStartIndex, blockEndIndex);
            const upperIndex = Math.max(blockStartIndex, blockEndIndex);
            
            if (lowerIndex === 0 && upperIndex === hourOptions.length - 1) {
              availableTimeSlots = [];
            } else {
              const part1 = hourOptions.slice(0, lowerIndex);
              const part2 = hourOptions.slice(upperIndex + 1, hourOptions.length);
              availableTimeSlots = [...part1, ...part2];
              
              availableTimeSlots = availableTimeSlots.filter(time => {
                const timeIndex = getHourIndex(time);
                return timeIndex >= dayStartIndex && timeIndex <= dayEndIndex;
              });
            }
          }
        } else {
      
          availableTimeSlots = hourOptions.slice(dayStartIndex, dayEndIndex + 1);
        }
      } else {
        availableTimeSlots = hourOptions.slice(dayStartIndex, dayEndIndex + 1);
      }

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

  if (isToday) {
    availableTimeSlots = availableTimeSlots.filter(time => isTimeValidForToday(time));
  }

  const reservations = await Reservation.find({ date: { $gte: startOfDay, $lt: endOfDay }});
  const tableOptions = tableSizes[numGuests];

  if (availableTimeSlots.includes(convertTo12Hour(desiredTime))) {
    const foundTable = checkAvailability(reservations, tableOptions, desiredTime, override);
    if (foundTable) return { available: foundTable, suggestions: [] };
  }

  let suggestions = [];
  const desiredTimeIndex = getHourIndex(desiredTime);

  const sortedTimeSlots = availableTimeSlots
    .map(time => ({
      time,
      distance: Math.abs(getHourIndex(time) - desiredTimeIndex)
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(item => item.time);

    for (const time of sortedTimeSlots) {
      if (time === desiredTime) continue; 
      
      const suggestion = checkAvailability(reservations, tableOptions, convertTo24Hour(time), override);
      if (suggestion) {
        suggestions.push(suggestion);
        if (suggestions.length >= 5) break;
      }
    }
    return { available: false, suggestions };
  }

module.exports = {
  reservationChecker,
  checkTableAvailability,
  checkAvailability,
  isWithinOneHourAndFifteen,
  timeToMinutes,
};
