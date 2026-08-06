```js
let Arr = [
  { id: "1", date: "Mar 11 2012 10:00:00 AM" },
  { id: "2", date: "Mar 8 2012 08:00:00 AM" },
];

function geeks_outer() {
  Arr.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  console.log(JSON.stringify(Arr));
}

geeks_outer();

/**************************************************************** */
let Arr = [
  { id: "1", date: "Mar 12 2012 10:00:00 AM" },
  { id: "2", date: "Mar 8 2012 08:00:00 AM" },
];

function geeks_outer() {
  Arr.sort(GFG_sortFunction);
  console.log(JSON.stringify(Arr));
}

function GFG_sortFunction(a, b) {
  let dateA = new Date(a.date).getTime();
  let dateB = new Date(b.date).getTime();
  return dateA > dateB ? 1 : -1;
}

geeks_outer();
