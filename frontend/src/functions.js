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

export function convertDateStringToIso(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);

  const dateInChicago = new Date(year, month - 1, day);

  const options = {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const chicagoDateString = dateInChicago.toLocaleDateString('en-CA', options); // Format: 'YYYY-MM-DD'

  const [adjustedYear, adjustedMonth, adjustedDay] = chicagoDateString.split('-').map(Number);

  const dateAtMidnightUTC = new Date(Date.UTC(adjustedYear, adjustedMonth - 1, adjustedDay));

  const formattedDate = dateAtMidnightUTC.toISOString();

  return formattedDate;
}


export function dateToString(date) {
  const dateString = date.replace('Z', '');
  const dateAsObj = new Date(dateString);

  const options = {
    timeZone: 'America/Chicago',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = dateAsObj.toLocaleDateString('en-US', options);
  console.log(formattedDate)
  return formattedDate;
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
  // Adjust the date to Chicago time and extract date components
  const options = {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  // Get the date components in Chicago time
  const [month, day, year] = date
    .toLocaleDateString('en-US', options)
    .split('/')
    .map(Number);

  // Create a Date object at midnight UTC with the Chicago date components
  const dateAtMidnightUTC = new Date(Date.UTC(year, month - 1, day));

  // Convert to ISO string
  const formattedDate = dateAtMidnightUTC.toISOString();

  return formattedDate; // Will be in format 'YYYY-MM-DDT00:00:00.000Z'
};


export function replaceSpaceW_(str) {
  return str.replace(/ /g, "_");
}

export function calculateDates(periodNumber) {
  const baseDate = new Date("2024-01-01");

  const endDate = new Date(baseDate);
  endDate.setDate(baseDate.getDate() + periodNumber * 14);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 13);

  const formatDate = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear().toString();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    return mm + "/" + dd + "/" + yyyy;
  };

  return [formatDate(startDate), formatDate(endDate)];
}

export function formatDates(array) {
  return `${array[0]} -\n ${array[1]}`;
}

export function getCurrentPeriod() {
  const baseDate = new Date("2024-01-01T00:00:00-06:00");

  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  const centralTime = new Date(today.getTime() - offset - 6 * 3600000);

  const diffTime = Math.abs(centralTime - baseDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const currentPeriod = Math.ceil(diffDays / 14);
  return currentPeriod - 1;
}

export function getFirstWord(inputStr) {
  if (typeof inputStr !== "string") {
    throw new TypeError("Input must be a string");
  }

  const trimmedStr = inputStr.trim();

  if (trimmedStr === "") {
    return "";
  }

  const words = trimmedStr.split(/\s+/);

  return words[0];
}
