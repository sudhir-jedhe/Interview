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

### Step-by-Step Implementation

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

### Next Steps

1. **Backend Integration**:
   - Replace the `console.log` with a `POST` request to your backend server for saving the reservation.
2. **User Confirmation**:
   - Once the reservation is confirmed, show a confirmation message to the user.

This is a basic implementation, and you can further enhance it by adding more features like form validation, error handling, and UI improvements.

Here is a complete, modular, and production-ready React component for the **Restaurant Reservation Widget** implementing your exact user flow.

It includes state management for the multi-step dialog/modal, form validation, step navigation, and mock backend submission.

---

### React Component Implementation

```jsx
import React, { useState } from 'react';

// Main Reservation Widget Component
export default function ReservationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    guests: 2,
    date: new Date().toISOString().split('T')[0], // Default to today
    time: '18:00',
    name: '',
    phone: '',
  });

  // Errors State
  const [errors, setErrors] = useState({});

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Please select a date.';
    if (!formData.time) newErrors.time = 'Please select a time.';
    if (formData.guests < 1) newErrors.guests = 'At least 1 guest required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  // Handle Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      // Example: Send POST request to backend API
      /*
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Booking failed');
      */

      // Logging reservation details to console
      console.log('Reservation Submitted Successfully:', formData);

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsConfirmed(true);
    } catch (error) {
      console.error('Reservation Error:', error);
      alert('Failed to book table. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Modal
  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setIsConfirmed(false);
    setFormData({
      guests: 2,
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      name: '',
      phone: '',
    });
    setErrors({});
  };

  return (
    <div style={styles.container}>
      {/* 1. Initial Trigger Button */}
      <button style={styles.openBtn} onClick={() => setIsOpen(true)}>
        Book a table
      </button>

      {/* 2. Reservation Dialog / Modal */}
      {isOpen && (
        <div style={styles.overlay} onClick={handleClose}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={handleClose}>
              &times;
            </button>

            {!isConfirmed ? (
              <>
                <h2 style={styles.title}>
                  {step === 1 ? 'Select Booking Details' : 'Contact Information'}
                </h2>

                {/* Progress Bar */}
                <div style={styles.progressContainer}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: step === 1 ? '50%' : '100%',
                    }}
                  />
                </div>

                {/* STEP 1: Date, Time, and Guests */}
                {step === 1 && (
                  <form onSubmit={handleNextStep} style={styles.form}>
                    <div style={styles.field}>
                      <label style={styles.label}>Number of Persons</label>
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors.guests && <span style={styles.error}>{errors.guests}</span>}
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Date</label>
                      <input
                        type="date"
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors.date && <span style={styles.error}>{errors.date}</span>}
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors.time && <span style={styles.error}>{errors.time}</span>}
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                      Continue
                    </button>
                  </form>
                )}

                {/* STEP 2: Name & Phone Number */}
                {step === 2 && (
                  <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.summaryBox}>
                      <p style={{ margin: 0 }}>
                        <strong>Summary:</strong> {formData.guests} Guest(s) on{' '}
                        {formData.date} at {formData.time}
                      </p>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors.name && <span style={styles.error}>{errors.name}</span>}
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors.phone && <span style={styles.error}>{errors.phone}</span>}
                    </div>

                    <div style={styles.btnGroup}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        style={styles.backBtn}
                        disabled={isSubmitting}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        style={styles.submitBtn}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* SUCCESS / CONFIRMATION VIEW */
              <div style={styles.successView}>
                <div style={styles.successIcon}>✓</div>
                <h2>Reservation Confirmed!</h2>
                <p>
                  Thank you, <strong>{formData.name}</strong>. We look forward to
                  welcoming you on <strong>{formData.date}</strong> at{' '}
                  <strong>{formData.time}</strong> for <strong>{formData.guests}</strong> guest(s).
                </p>
                <button style={styles.submitBtn} onClick={handleClose}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline CSS Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  openBtn: {
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
  },
  title: {
    marginTop: 0,
    marginBottom: '10px',
    fontSize: '20px',
    color: '#1d3557',
  },
  progressContainer: {
    width: '100%',
    height: '4px',
    backgroundColor: '#f1faee',
    borderRadius: '2px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#457b9d',
    transition: 'width 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#457b9d',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  },
  error: {
    color: '#e63946',
    fontSize: '12px',
  },
  summaryBox: {
    backgroundColor: '#f1faee',
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '4px solid #457b9d',
    fontSize: '14px',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
  },
  backBtn: {
    padding: '10px 16px',
    border: '1px solid #ccc',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#1d3557',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  successView: {
    textAlign: 'center',
    padding: '10px 0',
  },
  successIcon: {
    fontSize: '48px',
    color: '#2a9d8f',
    marginBottom: '10px',
  },
};

```

---

### Key Features Included

1. **Multi-step Dialog Navigation:** Seamlessly transitions from Step 1 (Party size, Date, Time) to Step 2 (Name, Phone number) with a progress bar indicator.
2. **Form Validation:** Prevents progressing or submitting invalid/empty fields (e.g., checks phone number regex format and ensures the reservation date isn't in the past).
3. **Reservation Summary Box:** Shows selected date/time/guests on the contact info screen so the user can verify their selection before confirming.
4. **Backend Ready:** Uses `async/await` to simulate network request delay with fallback logic ready for a REST API endpoint via `fetch()`.
5. **Success Screen:** Displays a confirmation view after the reservation is recorded.
