To build a React component for a restaurant reservation widget with the given user flow, we will break down the task into several parts:

1. **Initial Button:**
   - Initially, show a button labeled "Book a table".
2. **Dialog for Selecting Date, Time, and Number of Persons:**
   - On button click, a dialog should appear where the user can choose the number of persons, the date, and time.

3. **Enter Name and Phone Number:**
   - Once the user selects the date, time, and number of persons, show fields to enter their name and phone number.

4. **Confirm Reservation:**
   - After entering personal information, show a button to confirm the reservation.

5. **POST to Backend or Log Information:**
   - Once confirmed, either send the reservation data to a backend endpoint or log the data in the console for now.

### Step-by-Step Implementation:

#### 1. Set Up React Project

First, make sure you're in a React environment. You can use `create-react-app` or any other React boilerplate.

```bash
npx create-react-app restaurant-reservation
cd restaurant-reservation
npm start
```

#### 2. Install Necessary Packages

We'll need `react-datepicker` for date and time picking. Install it via npm.

```bash
npm install react-datepicker
npm install --save react-phone-number-input
```

#### 3. Implement the Component

```javascript
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const ReservationWidget = () => {
  // State for controlling different parts of the flow
  const [isOpen, setIsOpen] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Open the booking form dialog
  const handleOpen = () => setIsOpen(true);

  // Close the booking form dialog
  const handleClose = () => setIsOpen(false);

  // Handle form submission (mock API call for now)
  const handleSubmit = () => {
    const reservationDetails = {
      name,
      phone,
      numberOfPersons,
      selectedDate,
      selectedTime,
    };

    // For now, log the reservation details
    console.log("Reservation details:", reservationDetails);

    // Example of calling a backend API (mocked)
    // fetch('/api/reservation', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(reservationDetails),
    // });

    setIsSubmitted(true);
  };

  return (
    <div>
      {/* Initial button */}
      {!isSubmitted ? (
        <button onClick={handleOpen}>Book a table</button>
      ) : (
        <div>Reservation Confirmed!</div>
      )}

      {/* Booking Form Dialog */}
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book Your Table</h2>
            <div>
              <label>
                Number of Persons:
                <input
                  type="number"
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(e.target.value)}
                  min="1"
                />
              </label>
            </div>
            <div>
              <label>
                Select Date:
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy/MM/dd"
                  minDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                />
              </label>
            </div>
            <div>
              <label>
                Select Time:
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                </select>
              </label>
            </div>

            <div>
              <h3>Your Details</h3>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Phone Number:
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  required
                />
              </label>
            </div>

            <div>
              <button onClick={handleSubmit}>Book</button>
              <button onClick={handleClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationWidget;
```

#### 4. Add Some Basic Styles

To make the modal dialog look better, here are some basic styles:

```css
/* Add in your CSS file or inside the component in a style tag */

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}

h2,
h3 {
  text-align: center;
}
```

#### 5. Explanation of the Code

- **State Variables:**
  - `isOpen`: Tracks whether the booking dialog is open.
  - `numberOfPersons`, `selectedDate`, `selectedTime`: Store the user's selection.
  - `name` and `phone`: Store the user's personal details.
  - `isSubmitted`: Indicates whether the reservation has been confirmed.

- **DatePicker Component**:
  - We use `react-datepicker` to select the date and ensure the user cannot select past dates (`minDate={new Date()}`).

- **Phone Input**:
  - We use `react-phone-number-input` to handle phone number input.

- **Handle Reservation**:
  - When the user clicks the "Book" button, it logs the reservation details to the console. You can replace it with a `fetch` call to hit the backend API.

- **Modal Dialog**:
  - A modal appears when the "Book a table" button is clicked, allowing the user to choose their reservation details. It also has a "Cancel" button to close the dialog.

---

### Next Steps:

1. **Backend Integration**:
   - Replace the `console.log` with a `POST` request to your backend server for saving the reservation.
2. **User Confirmation**:
   - Once the reservation is confirmed, show a confirmation message to the user.

This is a basic implementation, and you can further enhance it by adding more features like form validation, error handling, and UI improvements.
