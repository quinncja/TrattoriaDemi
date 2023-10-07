const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


function numberToWord(numString) {
    const numberWords = {
        '1': 'one guest',
        '2': 'two guests',
        '3': 'three guests',
        '4': 'four guests',
        '5': 'five guests',
        '6': 'six guests',
        '7': 'seven guests',
        '8': 'eight guests',
        '9': 'nine guests',
        '10': 'ten guests'
    };

    return numberWords[numString] || "Number out of range";
}

function convertTo12Hour(time) {
    let [hours, minutes] = time.split(':');
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
  
    return `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
  }



  function dateToString(date) {
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
  
function sendResText(reservation){
    client.messages
    .create({
        body: `${reservation.name}, \n \nWe are happy to confirm your reservation for ${numberToWord(reservation.numGuests)} on ${dateToString(reservation.date)} at ${convertTo12Hour(reservation.time)}. \n\nShould you need to cancel, click the link below: \n www.trattoriademi.site/cancel/${reservation._id}. \n\nWe look forward to serving you. \n- Trattoria Demi`,
        from: '+18447275525',
        to: reservation.phone
    })
}

module.exports = {
    sendResText
}