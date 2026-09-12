The question was basically to find all the cities belonging to all the states in a country given the list of states & list of cities belonging to each state. The assumption here is that the state & city arrays will be provided by a backend API.
Here's an example to explain it better:
// e.g. 'USA' is the country for which we need to find all the cities// Input: city names are kept same with number for simplicity// States API responsegetStates('USA') -> ['CA', 'NY', 'WA']// City API responsegetCities('CA') -> ['LA', 'SF', 'SD']getCities('NY') -> ['LA1', 'SF1', 'SD1']getCities('WA') -> ['LA2', 'SF2', 'SD2']// Problem Requirement// You need to find all the cities in a given country by calling both APIsgetAllCities('USA') -> [
                        'LA', 'SF', 'SD',
                        'LA1', 'SF1', 'SD1',
                        'LA2', 'SF2', 'SD2',
                       ];
This question wants to check if you can handle all the API calls using Promise.all() for states & then cities for each state. You can search for a solution to this problem on the internet. Covering the entire solution of this problem won't be possible in this blog, will try to write a detailed solution for this in a separate one.

Here is the solution to solve this using modern JavaScript, `async/await`, and `Promise.all()`.

---

### Solution

```javascript
async function getAllCities(country) {
  // 1. Fetch all states for the given country
  const states = await getStates(country);

  // 2. Fire all getCities requests in parallel
  const citiesPromises = states.map((state) => getCities(state));

  // 3. Wait for all city requests to resolve concurrently
  const citiesPerState = await Promise.all(citiesPromises);

  // 4. Flatten the 2D array: [['LA', 'SF'], ['NY1', 'NY2']] -> ['LA', 'SF', 'NY1', 'NY2']
  return citiesPerState.flat();
}

```

---

### Step-by-Step Breakdown

1. **Initial API Call (`getStates`)**:

* We await `getStates(country)` first because we cannot know which cities to fetch until we have the list of states.

1. **Parallel Requests (`Array.prototype.map`)**:

* `states.map(state => getCities(state))` starts all the asynchronous `getCities` calls immediately and returns an array of pending promises: `[Promise, Promise, Promise]`.
* *Anti-pattern avoided:* Do not use `for...of` with `await` inside the loop here, as that would fetch cities sequentially, turning an $O(1)$ parallel network wait into an $O(N)$ waterfall.

1. **Resolving Concurrency (`Promise.all`)**:

* `Promise.all(citiesPromises)` resolves when all state queries complete, yielding a nested 2D array:

```javascript
[
  ['LA', 'SF', 'SD'],
  ['LA1', 'SF1', 'SD1'],
  ['LA2', 'SF2', 'SD2']
]

```

1. **Flattening the Array (`.flat()`)**:

* `citiesPerState.flat()` flattens the list by one depth level into a single array containing all cities.

---

### Production Considerations

In a real-world interview, interviewers often look for how you handle failure and concurrency limits:

#### 1. Resilient Error Handling (`Promise.allSettled`)

If one state fails (e.g., network timeout on `'NY'`), `Promise.all()` rejects entirely. To return data for the states that succeeded:

```javascript
async function getAllCitiesResilient(country) {
  const states = await getStates(country);
  
  const results = await Promise.allSettled(states.map(getCities));
  
  return results
    .filter((res) => res.status === 'fulfilled')
    .flatMap((res) => res.value);
}

```

#### 2. Concurrency Throttling (Rate Limiting)

If a country has hundreds of states/provinces, firing hundreds of requests at once via `Promise.all` can overload the server or trip a rate limit. In that case, batching in chunks (e.g., using `p-limit` or a custom worker pool of 5 concurrent requests) is the standard approach.

Yes — this is a classic **nested asynchronous API / `Promise.all()`** interview problem.

 The key idea is:

 1. Call `getStates(country)`.
 2. Once the states arrive, call `getCities(state)` **for every state in parallel** using `Promise.all()`.
 3. `getCities()` returns an array for each state, so you'll have an **array of arrays**.
 4. Flatten that result into one array.

 `Promise.all()` is particularly appropriate because it starts all supplied promises concurrently and resolves with their results in the same order as the input promises.  MDN Web Docs+1

## Clean `async/await` solution

```js
async function getAllCities(country) {
  // 1. Get all states for the country
  const states = await getStates(country);

  // 2. Get cities for every state in parallel
  const citiesByState = await Promise.all(
    states.map(state => getCities(state))
  );

  // 3. Flatten [[...], [...], [...]] into [...]
  return citiesByState.flat();
}
```

 With your example:

```js
getStates("USA");
// ["CA", "NY", "WA"]

getCities("CA");
// ["LA", "SF", "SD"]

getCities("NY");
// ["LA1", "SF1", "SD1"]

getCities("WA");
// ["LA2", "SF2", "SD2"]
```

 The intermediate result is:

```js
[
  ["LA", "SF", "SD"],
  ["LA1", "SF1", "SD1"],
  ["LA2", "SF2", "SD2"]
]
```

 Then `.flat()` produces:

```js
[
  "LA", "SF", "SD",
  "LA1", "SF1", "SD1",
  "LA2", "SF2", "SD2"
]
```

 So:

```js
const cities = await getAllCities("USA");

console.log(cities);
```

 outputs:

```js
[
  "LA", "SF", "SD",
  "LA1", "SF1", "SD1",
  "LA2", "SF2", "SD2"
]
```

## Promise chaining version

 If the interviewer specifically wants to see `Promise.all()` without `async/await`:

```js
function getAllCities(country) {
  return getStates(country)
    .then(states => {
      return Promise.all(
        states.map(state => getCities(state))
      );
    })
    .then(citiesByState => citiesByState.flat());
}
```

 Or more concisely:

```js
function getAllCities(country) {
  return getStates(country)
    .then(states => Promise.all(states.map(getCities)))
    .then(cities => cities.flat());
}
```

 The important part is **not** to do this:

```js
states.forEach(async state => {
  const cities = await getCities(state);
});
```

 because `forEach()` doesn't collect the promises, so there's nothing to await for the caller. Using `map()` creates an array of promises, which is exactly what `Promise.all()` expects.  DEV Community

## What actually happens concurrently?

 Suppose:

```js
getStates("USA")       → 100ms

getCities("CA")        → 500ms
getCities("NY")        → 200ms
getCities("WA")        → 300ms
```

 The flow is:

```
                getStates()
                    │
                  100ms
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
       getCities  getCities  getCities
          CA         NY        WA
         500ms      200ms     300ms
          └─────────┼─────────┘
                    ↓
               Promise.all()
                    │
                  500ms
                    ↓
                 .flat()
                    ↓
              all cities
```

 The city calls **do not wait for one another**. `Promise.all()` waits for the slowest one. That's the main point the interviewer is usually looking for.  MDN Web Docs

## A good interview explanation

 You could explain it like this:

 > "The state API has to be called first because I need the states before I know which city APIs to call. Once I have the states, I map each state to a `getCities(state)` promise and pass that array to `Promise.all()`. This allows all city API requests to run concurrently. The result is an array of city arrays, so I flatten it before returning."

 That's essentially the whole solution.

### One important production consideration

 `Promise.all()` is **fail-fast**: if any `getCities()` request rejects, the overall `getAllCities()` promise rejects. The other requests aren't cancelled; they may continue running, but their results aren't returned by that `Promise.all()`.  MDN Web Docs

 If the requirement instead says *"return cities from successful states even if one state's API fails"*, you'd use `Promise.allSettled()` and filter the fulfilled results.

 For the interview requirement you described, though, the straightforward answer is:

```js
async function getAllCities(country) {
  const states = await getStates(country);

  const cities = await Promise.all(
    states.map(state => getCities(state))
  );

  return cities.flat();
}
```

 That is probably the version I'd give first in an interview.
