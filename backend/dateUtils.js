const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: "short",
    timeZone: 'America/Chicago',
}

const dateToString = (date) => {
    return date.toLocaleString('en-US', dateOptions)
}

module.exports = {
    dateToString
};