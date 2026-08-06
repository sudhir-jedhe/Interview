let count = 0;

function timedCount() {
  count++;
  postMessage(count);
  setTimeout(timedCount, 500);
}

self.onmessage = function (e) {
  if (e.data === "start") {
    timedCount();
  } else if (e.data === "reset") {
    count = 0;
    postMessage(count);
  }
};
