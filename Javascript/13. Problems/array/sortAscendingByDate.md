```js
export const sortAscendingByDate = (array) => {
  return array.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
};

const events = [
  { name: "Event 1", date: "2022-10-20", location: "New York" },
  { name: "Event 2", date: "2023-02-10", location: "Paris" },
  { name: "Event 3", date: "2023-01-01", location: "Tokyo" },
];

const sortedEvents = sortAscendingByDate(events);
console.log(sortedEvents);
// Output: [
//   { name: 'Event 3', date: '2023-01-01', location: 'Tokyo' },
//   { name: 'Event 2', date: '2023-02-10', location: 'Paris' },
//   { name: 'Event 1', date: '2022-10-20', location: 'New York' },
// ]
