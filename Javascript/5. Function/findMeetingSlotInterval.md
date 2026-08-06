// [start, end] is a time interval, with all integers from 0 to 24.

// Given schedules for all team members,

// [
//   [[13,15], [11,12], [10,13]], //schedule for member 1
//   [[8, 9]], // schedule for member 2
//   [[13, 18]] // schedule for member 3
// ]

// You need to create a function findMeetingSlots() to return the time slots available for all the members to have a meeting.

// For the input above, below slots should be returned

// [[0,8],[9,10],[18,24]]
// Notes

// the input schedule intervals might be unsorted
// one member's schedule might have overlapping intervals.
// prev

// type Interval = [number, number]

/**
 * @param {Interval[][]} schedules
 * @return {Interval[]}
 */
function findMeetingSlots(schedules) {
  let times = schedules.flat();

  times.sort((a, b) => a[0] - b[0]);

  let result = [];

  let prevEnd = 0;
  times.forEach((t) => {
    let [start, end] = t;
    if (prevEnd < start) {
      result.push([prevEnd, start]);
    }

    prevEnd = Math.max(end, prevEnd);
  });

  if (prevEnd !== 24) {
    result.push([prevEnd, 24]);
  }

  return result;
}

/*********************************************** */

// type Interval = [number, number]

/**
 * @param {Interval[][]} schedules
 * @return {Interval[]}
 */
function findMeetingSlots(schedules) {
  const busy = new Array(25).fill(0);
  for (const schedule of schedules) {
    for (const [start, end] of schedule) {
      busy[start]++;
      busy[end]--;
    }
  }

  const ans = [];
  let prev = null;
  let curBusy = 0;
  for (let i = 0; i <= 24; i++) {
    if (curBusy === 0 && busy[i]) {
      if (prev !== null) {
        ans.push([prev, i]);
        prev = null;
      }
    } else if (prev === null && curBusy + busy[i] === 0) {
      prev = i;
    }
    curBusy += busy[i];
  }
  if (prev !== null && prev < 24) ans.push([prev, 24]);
  return ans;
}

/***************************************** */

// type Interval = [number, number]

/**
 * @param {Interval[][]} schedules
 * @return {Interval[]}
 */
function findMeetingSlots(schedules) {
  // Combine all blocked time intervals
  let combinedSchedule = schedules.flat();

  // Sort schedule by start times
  combinedSchedule.sort((a, b) => {
    return a[0] - b[0];
  });

  console.log(combinedSchedule);

  // Push in gaps
  let result = [];
  let time = 0; // The beginning of the next "free time" block

  for (let event of combinedSchedule) {
    let start = event[0];
    let end = event[1];

    if (start > time) {
      // Starting a new meeting, free time is over... :(
      result.push([time, start]);
    } // No need if meeting starts during our current one

    if (end > time) {
      time = end; // Free time now starts at the end of the meeting
    } // No need if our current meeting goes longer than this one's end
  }

  if (time < 24) {
    // End at 24 hrs
    result.push([time, 24]);
  }

  return result;
}
