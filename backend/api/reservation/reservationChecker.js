const Reservation = require("./Reservation");

const tableSizes = {
  1: ["2top"],
  2: ["2top"],
  3: ["3top", "4top"],
  4: ["4top", "6top"],
  5: ["6top"],
  6: ["6top"],
  7: ["6top"],
  8: ["6top"],
  9: ["xl"],
  10: ["xl"],
};

const maxTables = { "2top": 5, "3top": 2, "4top": 3, "6top": 2, xl: 1 };
const secondaryMaxTables = {
  "2top": 4,
  "3top": 2,
  "4top": 3,
  "6top": 1,
  xl: 0,
};

function timeToMinutes(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour * 60 + minute;
}

function isWithinOneHourAndFifteen(time, reservationTime) {
  const timeInMinutes = timeToMinutes(time);
  const reservationTimeInMinutes = timeToMinutes(reservationTime);
  const difference = Math.abs(timeInMinutes - reservationTimeInMinutes);
  return difference <= 75;
}

function checkTableAvailability(overlapRes, tableSize) {
  let tableAmount;
  if (overlapRes.some((res) => res.tableSize === "xl"))
    tableAmount = secondaryMaxTables[tableSize];
  else tableAmount = maxTables[tableSize];
  const count = overlapRes.filter((res) => res.tableSize === tableSize).length;
  if (count + 1 > tableAmount) return false;
  return true;
}

function checkAvailability(reservations, tableOptions, time) {
  if (reservations.some((res) => res.time === time && res.state !== "cancel"))
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

function getNextSlot(time, i) {
  let [hour, minute] = time.split(":");
  hour = parseInt(hour);
  minute = parseInt(minute);
  for (let j = 0; j < i; j++) {
    minute += 15;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  return `${hour}:${minute < 10 ? "0" : ""}${minute}`;
}

function getPrevSlot(time, i) {
  let [hour, minute] = time.split(":");
  hour = parseInt(hour);
  minute = parseInt(minute);
  for (let j = 0; j < i; j++) {
    minute -= 15;
    if (minute === -15) {
      minute = 45;
      hour -= 1;
    }
  }
  return `${hour}:${minute < 10 ? "0" : ""}${minute}`;
}

function isTimeValid(dateStr, timeStr) {
  const localDateStr = dateStr.replace('Z', '');
  const desiredDate = new Date(localDateStr);

  const [hours, minutes] = timeStr.split(":").map(Number);

  desiredDate.setHours(hours, minutes, 0, 0);
  const desiredDateTime = desiredDate;

  const now = new Date();

  const isToday = desiredDateTime.toDateString() === now.toDateString();
  
  if (isToday) {
    const timeDifference = desiredDateTime - now;
    const minutesDifference = timeDifference / (1000 * 60);

    if (minutesDifference < 30) {
      return false;
    }
  }

  return true;
}


async function reservationChecker(numGuests, desiredDate, desiredTime) {
  let suggestedTimes = [];
  const reservations = await Reservation.find({ date: desiredDate });
  const tableOptions = tableSizes[numGuests];
  for (let i = 0; i < tableOptions.length; i++) {
    const foundTable = checkAvailability(reservations, tableOptions, desiredTime);
    if (foundTable) return { available: foundTable, suggestions: [] };
  }
  let i = 0;
  while (suggestedTimes.length < 5) {
    const prev = getPrevSlot(desiredTime, i);
    const next = getNextSlot(desiredTime, i);
    if (isTimeValid(desiredDate, next)) {
      const nextSuggestion = checkAvailability(reservations, tableOptions, next);
      if (nextSuggestion) suggestedTimes.push(nextSuggestion);
    }
    if (isTimeValid(desiredDate, prev)) {
      const prevSuggestion = checkAvailability(reservations, tableOptions, prev);
      if (prevSuggestion) suggestedTimes.push(prevSuggestion);
    }
    i += 1;

    if (parseInt(next.split(":")[0]) >= 23 && parseInt(next.split(":")[1]) >= 45) break;
    if (parseInt(prev.split(":")[0]) <= 0 && parseInt(prev.split(":")[1]) <= 0) break;
  }
  return { available: false, suggestions: suggestedTimes };
}

module.exports = {
  reservationChecker,
  getPrevSlot,
  getNextSlot,
  checkTableAvailability,
  checkAvailability,
  isWithinOneHourAndFifteen,
  timeToMinutes,
};
