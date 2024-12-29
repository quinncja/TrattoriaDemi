const monthOptions = {
  day: "numeric",
  month: "short",
  timeZone: "America/Chicago",
};

const monthYearOptions = {
  year: "numeric",
  month: "short",
  timeZone: "America/Chicago",
};

const shortDateOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "America/Chicago",
};

const dateOptions = {
  weekday: "long",
  day: "numeric",
  month: "short",
  timeZone: "America/Chicago",
};

const timeOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric",
  timeZone: "America/Chicago",
};

export const dateToMonthYear = (date) => {
  return date.toLocaleString("en-US", monthYearOptions);
};

export const dateToMonth = (date) => {
  return date.toLocaleString("en-US", monthOptions);
};

export const dateToShortString = (date) => {
  return date.toLocaleString("en-US", shortDateOptions);
};

export const dateToString = (date) => {
  return date.toLocaleString("en-US", dateOptions);
};

export const dateTimeToString = (date) => {
  return date
    .toLocaleString("en-US", timeOptions)
    .replace(/ (AM|PM)$/, (match, p1) => p1.toLowerCase());
};
