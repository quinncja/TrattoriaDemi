const { timeToMinutes, isWithinOneHour, getNextSlot, getPrevSlot} = require('./reservationChecker'); // adjust the path and import according to your setup

describe('timeToMinutes', () => {
  it('should convert HH:MM string to minutes', () => {
    expect(timeToMinutes('10:00')).toBe(600);
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('23:59')).toBe(1439);
  });
});

describe('isWithinOneHour', () => {
  it('should check if a given time is within a 1-hour window of the specified time', () => {
    expect(isWithinOneHour('10:00', '10:15')).toBeTruthy();
    expect(isWithinOneHour('10:00', '11:00')).toBeTruthy();
    expect(isWithinOneHour('10:00', '11:01')).toBeFalsy();
    expect(isWithinOneHour('10:30', '11:00')).toBeTruthy();
    expect(isWithinOneHour('10:30', '11:30')).toBeTruthy();
  });
});

describe('getNextSlot', () => {
    it('should give the next time slot i times forward', () => {
       expect(getNextSlot("13:30", 1)).toBe("13:45");
       expect(getNextSlot("13:30", 2)).toBe("14:00");
       expect(getNextSlot("13:30", 3)).toBe("14:15");
       expect(getNextSlot("13:30", 4)).toBe("14:30");
       expect(getNextSlot("13:30", 5)).toBe("14:45");
    })
})

describe('getPrevSlot', () => {
    it('should give the next time slot i times backward', () => {
       expect(getPrevSlot("13:30", 1)).toBe("13:15");
       expect(getPrevSlot("13:30", 2)).toBe("13:00");
       expect(getPrevSlot("13:30", 3)).toBe("12:45");
       expect(getPrevSlot("13:30", 4)).toBe("12:30");
       expect(getPrevSlot("13:30", 5)).toBe("12:15");
    })
})