export function debounce(fn, delay = 500) {
  let timerId = null;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    timerId = setTimeout(fn, delay, ...args);
  };
}


// If you're adding a search functionality into any application, you should always use debouncing technique If the results are coming from API.

// Debouncing allows us to limit the number of API calls to the server.

// Instead of making an API call for every character typed, we make an API call after a few milliseconds once the user has stopped typing.

// This will also avoid the flickering of your search results and will provide a better user experience.