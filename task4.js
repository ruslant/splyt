const assert = require('assert');
// node.js bitSet structure for working with bits (same as C++ std::bitset).
const BitSet = require('bitset');


class Time {
  static toMinutes(timeString) {
    let timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    let minutes = parseInt(timeParts[1], 10);

    return hours * 60 + minutes; 
  }

  static formatTime(minutes) {
    let hours = Math.trunc(minutes / 60);
    let minutesPart = minutes % 60;

    return `${this._padNumberWithZeros(hours, 2)}:${this._padNumberWithZeros(minutesPart, 2)}`;
  }

  // format numbers with padding zeros
  static _padNumberWithZeros(num, size){
    let s = num + '';
    
    while (s.length < size) {
      s = '0' + s;
    }

    return s;
  }
}

class MeetingPlanner {
  constructor(settings) {
    settings |= {};

    this._beginningOfTheWorkday = Time.toMinutes(settings.beginningOfTheWorkday || '09:00');
    this._endOfTheWorkday = Time.toMinutes(settings.endOfTheWorkday || '19:00');
  }

  findInterval(schedules, duration) {
    let bitSets = this._initBitSets(schedules);

    // return null if no bit sets created
    if (!bitSets.length) {
      return null;
    }

    let bitSetIntersection = this._applyAndOperatorToBitSets(bitSets);

    let intervals = this._convertBitSetToInvervals(bitSetIntersection);

    // Remove intervals with less than meeting duration
    intervals = intervals.filter(x => (x[1] - x[0]) > duration);

    // Format intervals in 24h format
    intervals.forEach(interval => {
      interval[0] = Time.formatTime(interval[0]);
      interval[1] = Time.formatTime(interval[1]);
    });

    return intervals.length ? intervals[0] : null;
  }

  _initBitSets(schedules) {
    let bitSets = [];
    
    schedules.forEach((schedule) => {
      let bitSet = new BitSet();

      bitSet.setRange(this._beginningOfTheWorkday, this._endOfTheWorkday - 1, 1);

      schedule.forEach(meeting => {
        let meetingStartMinutes = Time.toMinutes(meeting[0]);
        let meetingEndMinutes = Time.toMinutes(meeting[1]);

        bitSet.setRange(meetingStartMinutes, meetingEndMinutes - 1, 0)
      });

      bitSets.push(bitSet);
    });

    return bitSets;
  }

  // Apply and operator to all bit sets
  _applyAndOperatorToBitSets(bitSets) {
    if (!bitSets.length) {
      return null;
    }

    let andBitset = bitSets[0];
    for (let i = 1; i < bitSets.length; i++) {
      andBitset = andBitset.and(bitSets[i]);
    }

    return andBitset;
  }

  _convertBitSetToInvervals(bitSet) {
    let intervals = [];

    let previousBit = 0;
    for (let i = this._beginningOfTheWorkday; i < this._endOfTheWorkday; i++) {
      if (previousBit === 0 && bitSet.get(i) === 1) {
        // if free interval begins
        previousBit = 1;

        intervals.push([i]);
      } else if (previousBit === 1 && bitSet.get(i) === 0) {
        // if free interval ends
        previousBit = 0;

        intervals[intervals.length - 1].push(i);
      } else if (previousBit === 1 && i === (this._endOfTheWorkday - 1)) {
        // reaching the end of the workday
        intervals[intervals.length - 1].push(i);
      }
    }

    return intervals;
  }
}

// assert Time.toMinutes method
assert(Time.toMinutes('00:01') === 1);
assert(Time.toMinutes('09:00') === 540);
assert(Time.toMinutes('17:45') === 1065);

// assert Time.formatTime method
assert(Time.formatTime(Time.toMinutes('00:01')) === '00:01');
assert(Time.formatTime(Time.toMinutes('09:00')) === '09:00');
assert(Time.formatTime(Time.toMinutes('17:45')) === '17:45');


let meetingDuration = 60;

let schedules1 = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
];

let planner = new MeetingPlanner();

let result = planner.findInterval(schedules1, meetingDuration);

assert.deepEqual(result, ['12:15', '13:30']);

// -------------------------------------------------------------

let schedules2 = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30']],
  [['11:30', '19:00']]
];

let result2 = planner.findInterval(schedules2, meetingDuration);

assert(result2 == null);

// -------------------------------------------------------------

let schedules3 = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:55'], ['15:00', '16:30']]
];

let result3 = planner.findInterval(schedules3, meetingDuration);

assert.deepEqual(result3, ['17:30', '18:59']);