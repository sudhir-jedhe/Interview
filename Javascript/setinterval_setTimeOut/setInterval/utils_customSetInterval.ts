// Polyfill version
export function createSetIntervalPolyfill() {
  let intervalID = 0;
  const intervalMap: { [key: number]: NodeJS.Timeout } = {};

  function setIntervalPolyfill(callbackFn: Function, delay = 0, ...args: any[]) {
    if (typeof callbackFn !== "function") {
      throw new TypeError("'callback' should be a function");
    }

    const id = intervalID++;

    function repeat() {
      intervalMap[id] = setTimeout(() => {
        callbackFn(...args);
        if (intervalMap[id]) {
          repeat();
        }
      }, delay);
    }
    repeat();

    return id;
  }

  function clearIntervalPolyfill(intervalID: number) {
    clearTimeout(intervalMap[intervalID]);
    delete intervalMap[intervalID];
  }

  return {
    setIntervalPolyfill,
    clearIntervalPolyfill,
  };
}

// Promise-based version
export function customSetInterval(callback: () => boolean | void, interval: number): [Promise<string>, () => void] {
  return [
    new Promise<string>((resolve, reject) => {
      if (typeof callback !== 'function') {
        reject(new TypeError('Callback must be a function'));
        return;
      }
      if (typeof interval !== 'number' || interval <= 0) {
        reject(new TypeError('Interval must be a positive number'));
        return;
      }

      const intervalId = setInterval(() => {
        try {
          const result = callback();
          if (result === false) {
            clearInterval(intervalId);
            resolve('Interval stopped by callback return value.');
          }
        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, interval);
    }),
    () => clearInterval(intervalId)
  ];
}

