const Reservation = require("./Reservation");

const tableSizes = {
    1: [2],
    2: [2],
    3: [3, 4],
    4: [4, 6],
    5: [6],
    6: [6],
    7: [6],
    8: [6],
    9: [8],
    10: [8]
}

const maxTables = {"2top": 5, "3top": 2, "4top": 3, "5top": 2, "xl" : 1}
const secondaryMaxTables = {"2top": 4, "3top": 2, "4top": 3, "5top": 2, "xl" : 0}

function timeToMinutes(timeStr) {
    const [hour, minute] = timeStr.split(':').map(Number);
    return hour * 60 + minute;
}
  
function isWithinOneHour(time, reservationTime) {
    const timeInMinutes = timeToMinutes(time);
    const reservationTimeInMinutes = timeToMinutes(reservationTime);
    const difference = Math.abs(timeInMinutes - reservationTimeInMinutes);
    return difference <= 60;
}

function checkTableAvailability(overlapRes, tableSize){
    let tableAmount;
    if(overlapRes.some(res => res.tableSize === "xl")) tableAmount = secondaryMaxTables[tableSize];
    else tableAmount = maxTables[tableSize];
    const count = overlapRes.filter(res => res.tableSize === tableSize).length;
    if (count + 1 > tableAmount) return false;
    return true;
}   

function checkAvailability(reservations, tableOptions, time){
    if(reservations.some(res => res.time === time)) return false;
    const overlapRes = reservations.filter(reservation => isWithinOneHour(time, reservation.time));
    for (let i = 0; i < tableOptions.length; i++){
        if (checkTableAvailability(overlapRes, tableOptions[i])) return {time, table: tableOptions[i]}
    }
    return false;
}

function getNextSlot(time, i){
    let [hour, minute] = time.split(':');
    hour = parseInt(hour);
    minute = parseInt(minute);
    for(let j = 0; j < i; j++){
        minute += 15;
        if(minute === 60){
            minute = 0;
            hour += 1;
        }
    }
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
}

function getPrevSlot(time, i){
    let [hour, minute] = time.split(':');
    hour = parseInt(hour);
    minute = parseInt(minute);
    for(let j = 0; j < i; j++){
        minute -= 15;
        if(minute === -15){
            minute = 45;
            hour -= 1;
        }
    }
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
}

async function reservationChecker(numGuests, desiredDate, desiredTime){
    let suggestedTimes = []
    const reservations = await Reservation.find({ date: desiredDate });
    const tableOptions = tableSizes[numGuests];
    for(let i = 0; i < tableOptions.length; i++){
        foundTable = checkAvailability(reservations, tableOptions, desiredTime)
        if (foundTable) return ({available: foundTable, suggestions: []})
    }
    for(let i = 1; i < 6; i++){
        if(suggestedTimes.length >= 5) break;
        const prev = getPrevSlot(desiredTime, i)
        const next = getNextSlot(desiredTime, i)
        const prevSuggestion = checkAvailability(reservations, tableOptions, prev)
        if(prevSuggestion) suggestedTimes.push(prevSuggestion)
        const nextSuggestion = checkAvailability(reservations, tableOptions, next)
        if(nextSuggestion) suggestedTimes.push(nextSuggestion)
    }
    return {available: false, suggestions: suggestedTimes}
}

module.exports = {
    reservationChecker,
    getPrevSlot,
    getNextSlot,
    checkTableAvailability,
    checkAvailability,
    isWithinOneHour,
    timeToMinutes
}