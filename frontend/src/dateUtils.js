const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: "short",
    timeZone: 'America/Chicago',
}

export const dateToString = (date) => {
    return date.toLocaleString('en-US', dateOptions)
}
  