import moment from "moment-timezone";

export function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function convertTo24Hour(time) {
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

export function convertTo12Hour(time) {
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

export function dateToString(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateAsObj = new Date(date);
  const dayName = days[dateAsObj.getUTCDay()];
  const monthName = months[dateAsObj.getUTCMonth()];
  const day = dateAsObj.getUTCDate();

  return `${dayName}, ${monthName} ${day}`;
}

export function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return string;
}

export function minutesUntilTime(date, targetTime) {
  const target = moment.tz(
    targetTime,
    "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "America/Chicago"
  );
  const diff = target.diff(date, "minutes");
  return diff;
}

export function formatPhoneNumber(phoneNumber) {
  const last10Digits = phoneNumber.slice(-10);
  const match = last10Digits.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]})-${match[2]}-${match[3]}`;
  }

  return null;
}

export function getTimeFromDate(dateStr) {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export const convertDateToIso = (date) => {
  const dateAsUTC = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
  const formattedDate = dateAsUTC.toISOString();
  return formattedDate;
};

export function replaceSpaceW_(str) {
  return str.replace(/ /g, "_");
}


export function calculateDates(periodNumber) {
  const baseDate = new Date('2024-01-01');

  const endDate = new Date(baseDate);
  endDate.setDate(baseDate.getDate() + (periodNumber * 14) );

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 13);

  const formatDate = (date) => {
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      const yyyy = date.getFullYear().toString()

      if(dd < 10) {
          dd = '0' + dd;
      } 
      if(mm < 10) {
          mm = '0' + mm;
      } 

      return mm + '/' + dd + '/' + yyyy;
  }

  return( [formatDate(startDate), formatDate(endDate)] )
}