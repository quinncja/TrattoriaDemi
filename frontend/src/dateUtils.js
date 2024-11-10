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

export const dateToString = (date) => {
  return date.toLocaleString("en-US", dateOptions);
};


export const dateTimeToString = (date) => {
  return date.toLocaleString("en-US", timeOptions).replace(/ (AM|PM)$/, (match, p1) => p1.toLowerCase());
};
