# Cinema Hall Layout Structure (Machine Coding / React Interview)

A **Cinema Hall Layout** problem is commonly asked in React/JavaScript interviews to test:

- Grid rendering
- State management
- Seat selection
- Booking validation
- Dynamic layouts
- Data-driven UI

Modern seat-booking UIs typically support rows, aisles, gaps, premium sections, booked seats, and screen positioning. Examples of seat-layout systems describe JSON-driven theatre configurations with seats, aisles, gaps, pricing sections, and selection/booking states. [\[github.com\]](https://github.com/Vidittamrakar21/Seat_Booking_Layout_UI), [\[github.com\]](https://github.com/Shreyash-SP80/cinema-seat-booking-react), [\[blog.stackademic.com\]](https://blog.stackademic.com/how-to-build-a-movie-theater-seat-booking-ui-with-react-and-tailwind-css-c1b81692ae3b)

---

## Typical Layout

```text
               SCREEN
  ---------------------------------

A   🟩 🟩 🟩 🟩    🟩 🟩 🟩 🟩

B   🟩 🟩 🟩 🟩    🟩 🟩 🟩 🟩

C   🟩 🟩 🟥 🟩    🟩 🟩 🟩 🟩

D   🟩 🟩 🟩 🟩    🟩 🟩 🟩 🟩

E   🟨 🟨 🟨 🟨    🟨 🟨 🟨 🟨

F   🟨 🟨 🟨 🟨    🟨 🟨 🟨 🟨


🟩 Regular
🟨 Premium
🟥 Booked
```

---

# Recommended Data Structure

Instead of hardcoding seats, use a JSON-driven approach where the layout configuration describes rows, seats, aisles, and pricing sections. [\[github.com\]](https://github.com/Vidittamrakar21/Seat_Booking_Layout_UI), [\[madewithreactjs.com\]](https://madewithreactjs.com/react-seat-toolkit)

```js
const layout = [
  {
    row: "A",
    seats: [
      {
        id: "A1",
        type: "REGULAR",
        booked: false,
      },
      {
        id: "A2",
        type: "REGULAR",
        booked: false,
      },
      {
        type: "AISLE",
      },
      {
        id: "A3",
        type: "REGULAR",
        booked: true,
      },
    ],
  },

  {
    row: "B",
    seats: [...]
  },
];
```

---

# Seat Model

```ts
interface Seat {
  id: string;
  type: "REGULAR" | "PREMIUM" | "VIP";

  booked: boolean;
}
```

---

# React Component

```tsx
function CinemaHall() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  return (
    <div>
      <div className="screen">SCREEN</div>

      {layout.map((row) => (
        <div key={row.row} className="row">
          <span>{row.row}</span>

          {row.seats.map((seat, index) => {
            if (seat.type === "AISLE") {
              return <div key={index} className="aisle" />;
            }

            return (
              <button
                key={seat.id}
                disabled={seat.booked}
                onClick={() => toggleSeat(seat.id)}
              >
                {seat.id}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

---

# Better Production Structure

```js
const theatre = {
  screenName: "Screen 1",

  totalColumns: 14,

  sections: [
    {
      name: "Regular",
      price: 200,
    },

    {
      name: "Premium",
      price: 350,
    },

    {
      name: "VIP",
      price: 500,
    },
  ],

  rows: [
    {
      rowLabel: "A",
      section: "Regular",
      seats: [],
    },

    {
      rowLabel: "E",
      section: "Premium",
      seats: [],
    },
  ],
};
```

JSON-based layouts are often recommended because different theatres can be rendered dynamically without changing frontend code. [\[github.com\]](https://github.com/Vidittamrakar21/Seat_Booking_Layout_UI), [\[madewithreactjs.com\]](https://madewithreactjs.com/react-seat-toolkit)

---

# Seat States

```text
AVAILABLE  🟩

SELECTED   🟦

BOOKED     🟥

VIP        ⭐

PREMIUM    🟨
```

---

# Booking Flow

```text
Load Layout
      ↓
Select Seat
      ↓
Validation
      ↓
Calculate Total
      ↓
Confirm Booking
      ↓
Mark Seats Booked
```

---

# Complexity

### Rendering

```text
Rows = R
Seats = S

Time:
O(R × S)
```

### Seat Toggle

```text
O(1)
```

(using Set)

---

# Senior Interview Enhancements

### 1. Multiple Sections

```text
VIP
Premium
Regular
```

### 2. Couple Seats

```text
[A1 A2]
```

Must book together.

### 3. Auto Seat Allocation

```text
Need 4 seats

Find nearest 4 adjacent seats
```

### 4. Reservation Timer

```text
Hold seat for 5 minutes
```

### 5. Real-Time Booking

```text
WebSocket
```

Prevent double-booking.

### 6. Accessibility Seats

```text
Wheelchair seats
```

### 7. Dynamic Pricing

```text
Weekend: ₹300
Weekday: ₹200
```

---

## Interview Answer

> Model the cinema hall using a JSON configuration containing rows, seats, aisles, and pricing sections. Render it as a grid, maintain selected/booked seat state separately, and support validation, pricing, and booking through a data-driven architecture. This makes the solution scalable across different theatre layouts. [\[github.com\]](https://github.com/Vidittamrakar21/Seat_Booking_Layout_UI), [\[madewithreactjs.com\]](https://madewithreactjs.com/react-seat-toolkit), [\[blog.stackademic.com\]](https://blog.stackademic.com/how-to-build-a-movie-theater-seat-booking-ui-with-react-and-tailwind-css-c1b81692ae3b)

For a **Cinema Hall / BookMyShow / Ticket Booking System**, the biggest challenge is:

```text
User A selects Seat A1
User B selects Seat A1
User C selects Seat A1

All at the same time
```

Without concurrency control:

```text
❌ Double Booking
❌ Money charged twice
❌ Customer disputes
```

This is a classic concurrency problem, and common solutions include **optimistic locking**, **distributed locking**, and **temporary seat holds with TTL**. [\[linkedin.com\]](https://www.linkedin.com/pulse/locking-seat-reservation-tauseef-rahaman-tnucc), [\[medium.com\]](https://medium.com/@abhishekranjandev/concurrency-conundrum-in-booking-systems-2e53dc717e8c), [\[linkedin.com\]](https://www.linkedin.com/posts/divyam-jain-a11b1a198_systemdesign-backendengineering-redis-activity-7314641555464564736-cOXh)

---

# Wrong Approach

```js
if (seat.available) {
  seat.available = false;
}
```

Scenario:

```text
Request A reads Available
Request B reads Available

A books seat
B books seat
```

Now:

```text
Same seat sold twice
```

---

# Solution 1: Optimistic Locking (Most Common)

Add a version column.

```sql
Seat
------------------
id
status
version
```

Example:

```text
Seat A1

status = AVAILABLE

version = 1
```

---

### User A

```sql
UPDATE seats
SET status='BOOKED',
version=version+1
WHERE id='A1'
AND version=1
```

Success ✅

---

### User B

Tries:

```sql
UPDATE seats
SET status='BOOKED',
version=version+1
WHERE id='A1'
AND version=1
```

Fails because:

```text
Current version = 2
```

Result:

```text
Seat already booked
```

Only one booking succeeds. Optimistic locking relies on checking the version before update and rejecting conflicting changes. [\[linkedin.com\]](https://www.linkedin.com/pulse/locking-seat-reservation-tauseef-rahaman-tnucc), [\[medium.com\]](https://medium.com/@abhishekranjandev/concurrency-conundrum-in-booking-systems-2e53dc717e8c), [\[linkedin.com\]](https://www.linkedin.com/posts/divyam-jain-a11b1a198_systemdesign-backendengineering-redis-activity-7314641555464564736-cOXh)

---

# Solution 2: Seat Hold (BookMyShow Style)

When user clicks seat:

```text
AVAILABLE
   ↓
HELD
   ↓
BOOKED
```

State Machine:

```text
AVAILABLE
      ↓
HELD (5 mins)
      ↓
BOOKED
```

Popular systems often use a temporary hold stored in Redis with a TTL so the seat is reserved while the user is paying. [\[github.com\]](https://github.com/Shravya493/FLASHTIX), [\[linkedin.com\]](https://www.linkedin.com/posts/divyam-jain-a11b1a198_systemdesign-backendengineering-redis-activity-7314641555464564736-cOXh)

---

### Redis Hold

```text
seat:A1

value:
{
  userId: 123
}

TTL = 300 sec
```

If payment succeeds:

```text
BOOKED
```

If payment fails:

```text
AVAILABLE
```

---

# Solution 3: Distributed Lock (Microservices)

Suppose:

```text
Web App
Mobile App
Kiosk App

All booking same seat
```

Use distributed lock:

```text
Redis Lock
ZooKeeper
Etcd
```

Flow:

```text
User A
  ↓
Acquire Lock A1
  ↓
Book Seat
  ↓
Release Lock
```

User B:

```text
Try Lock A1

Fail
```

Real-world event-ticketing examples frequently combine Redis-based distributed locking with optimistic locking. [\[github.com\]](https://github.com/Praveen2535/EventTicketBooking-Application), [\[github.com\]](https://github.com/Shravya493/FLASHTIX)

---

# Best Architecture

```text
Client
  ↓
Booking API
  ↓
Redis Seat Hold
  ↓
Payment
  ↓
Database Booking
```

---

# Database Design

### Seat Table

```sql
SEATS
-----------------
id
show_id
seat_number
status
version
```

### Booking Table

```sql
BOOKINGS
-----------------
booking_id
user_id
show_id
status
created_at
```

### Booking Seat

```sql
BOOKING_SEATS
-----------------
booking_id
seat_id
```

---

# Real-Time Updates

If User A books:

```text
A1 becomes RED
```

All connected users should see:

```text
A1 unavailable
```

Use:

```text
WebSocket
Server Sent Events
```

Real-time seat reservation designs commonly use WebSockets and seat-state broadcasts to keep all users synchronized. [\[finlo.in\]](https://finlo.in/real-time-seat-reservation-system-design.html)

---

# High-Level Design

```text
            ┌─────────────┐
            │ React App   │
            └──────┬──────┘
                   │
              WebSocket
                   │
            ┌──────▼──────┐
            │ Booking API │
            └──────┬──────┘
                   │
         ┌─────────▼─────────┐
         │ Redis Seat Hold   │
         │ TTL = 5 Minutes   │
         └─────────┬─────────┘
                   │
            ┌──────▼──────┐
            │ Payment API │
            └──────┬──────┘
                   │
            ┌──────▼──────┐
            │ MySQL       │
            │ Versioning  │
            └─────────────┘
```

---

# Senior React/System Design Interview Answer

If asked:

> "How would you prevent simultaneous booking from multiple apps?"

Answer:

> I would use a **two-layer approach**: first, place the seat in a temporary **HELD** state using a Redis lock with a TTL (e.g., 5 minutes) while the user completes payment. Second, use **optimistic locking** at the database level with a version column to guarantee that only one transaction can successfully mark the seat as BOOKED. Additionally, I would push real-time seat-status updates through WebSockets so all clients immediately see the latest availability. This combination provides scalability, consistency, and a good user experience. [\[linkedin.com\]](https://www.linkedin.com/posts/divyam-jain-a11b1a198_systemdesign-backendengineering-redis-activity-7314641555464564736-cOXh), [\[github.com\]](https://github.com/Praveen2535/EventTicketBooking-Application), [\[finlo.in\]](https://finlo.in/real-time-seat-reservation-system-design.html)
