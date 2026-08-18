# Scenario: Two Concurrent Requests Both Book the Last Remaining Seat

Under load testing, two simultaneous `POST /bookings` requests for the same flight both read `seatsAvailable: 1`, both decide there's room, and both insert a booking row — overselling the flight.

**Approach:**
This is a classic read-then-write race condition — the check and the write aren't atomic. Fix it by pushing the check into the write itself using a conditional update (an atomic `UPDATE ... WHERE seatsAvailable > 0`) or a row lock (`SELECT ... FOR UPDATE`) inside a transaction, so the database — not application code — enforces the invariant.

```js
// BAD: read-then-write race — two requests can both pass the check before either writes
async function bookSeatUnsafe(flightId) {
  const flight = await Flight.findByPk(flightId);
  if (flight.seatsAvailable < 1) throw new Error('Sold out');
  await flight.update({ seatsAvailable: flight.seatsAvailable - 1 }); // both requests get here
}

// GOOD: atomic conditional update — the database guarantees only one request wins
async function bookSeatSafe(pool, flightId) {
  const { rowCount } = await pool.query(
    'UPDATE flights SET seats_available = seats_available - 1 WHERE id = $1 AND seats_available > 0',
    [flightId]
  );
  if (rowCount === 0) throw new Error('Sold out'); // the second concurrent request lands here
}
```
The atomic `UPDATE ... WHERE seats_available > 0` only affects a row if the condition still holds at the moment the database applies the write, so under concurrent access exactly one of the two requests decrements the count and the other gets `rowCount === 0` and correctly reports "sold out." A `SELECT ... FOR UPDATE` inside an explicit transaction is the equivalent pattern when the logic is too complex to express as a single `UPDATE`.
