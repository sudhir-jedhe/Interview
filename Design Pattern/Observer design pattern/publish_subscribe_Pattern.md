// Create an interface exposing subscribe and publish functionality, which allows publishing data which in turn invokes all the subscribers with the data
// A simple module with publish and subscribe function can be exposed to achieve such functionality
// List of subscribers can be maintained in an array and can be invoked in loop on each publish
function pubSub() {
  const subscribers = [];

  function publish(data) {
    subscribers.forEach((subscriber) => subscriber(data));
  }

  function subscribe(fn) {
    subscribers.push(fn);
  }

  return {
    publish,
    subscribe,
  };
}

// driver code
const pubSubObj = pubSub();
pubSubObj.subscribe((data) => {
  console.log("Subscriber 1: " + data);
});
pubSubObj.subscribe((data) => {
  console.log("Subscriber 2: " + data);
});

// all subscribers will be called with the data on publish
pubSubObj.publish("Value is 10");

//https://jsmanifest.com/the-publish-subscribe-pattern-in-javascript/
