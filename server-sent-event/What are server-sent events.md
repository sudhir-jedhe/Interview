// Server-sent events (SSE) is a server push technology enabling a browser to receive automatic updates from a server via HTTP connection without resorting to polling. These are a one way communications channel - events flow from server to client only. This has been used in Facebook/Twitter updates, stock price updates, news feeds etc.

// How do you receive server-sent event notifications

// The EventSource object is used to receive server-sent event notifications. For example, you can receive messages from server as below,

```js
// if (typeof EventSource !== "undefined") {
//      var source = new EventSource("sse_generator.js");
//      source.onmessage = function (event) {
//      document.getElementById("output").innerHTML += event.data + "<br>";
//      };
// }

// How do you check browser support for server-sent events

// You can perform browser support for server-sent events before using it as below,

if (typeof EventSource !== "undefined") {
  // Server-sent events supported. Let's have some code here!
} else {
  // No server-sent events supported
}

// Below are the list of events available for server sent events
// | Event     | Description                                           |
// |----       | ---------
// | onopen    | It is used when a connection to the server is opened  |
// | onmessage | This event is used when a message is received         |
// | onerror   | It happens when an error occurs                       |
```
