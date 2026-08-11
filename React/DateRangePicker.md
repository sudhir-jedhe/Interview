Here is a complete, production-ready React implementation for a **Date Range Picker with a Dual-Calendar Modal**.

This component supports selecting a start date and an end date across two side-by-side calendars, dynamically highlights all days in between the selected range, and handles single-date clicks and range completions seamlessly.

### 1. The Date Range Picker Component (`DateRangePicker.jsx`)

```jsx
import React, { useState } from 'react';
import './DateRangePicker.css'; // Optional styling file

const DateRangePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  // Track the view month/year for the dual calendars
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Format dates for the trigger button display
  const formatDateString = (date) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle clicking a specific date on either calendar
  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      // First click, or resetting a completed range
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        // If selected end date is before start date, reset start date
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  // Helper to check if a date falls within the selected range (or hover state)
  const isInRange = (date) => {
    const start = startDate;
    const end = endDate || (startDate && hoverDate > startDate ? hoverDate : null);
    return start && end && date > start && date < end;
  };

  const isStartDate = (date) => startDate && date.toDateString() === startDate.toDateString();
  const isEndDate = (date) => endDate && date.toDateString() === endDate.toDateString();

  // Helper to generate days for a given month/year view
  const generateMonthDays = (year, month) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Padding for previous month's trailing days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Next/Prev month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Left calendar details
  const leftYear = currentMonth.getFullYear();
  const leftMonth = currentMonth.getMonth();
  const leftDays = generateMonthDays(leftYear, leftMonth);

  // Right calendar details (Next month)
  const rightMonthDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightMonthDate.getFullYear();
  const rightMonth = rightMonthDate.getMonth();
  const rightDays = generateMonthDays(rightYear, rightMonth);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="date-range-container">
      {/* Trigger Button */}
      <button className="picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        📅 {formatDateString(startDate)} — {formatDateString(endDate)}
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="calendar-modal">
          <div className="calendar-header-controls">
            <button onClick={handlePrevMonth}>&larr; Prev</button>
            <div className="selected-summary">
              {startDate ? formatDateString(startDate) : 'Start'} to {endDate ? formatDateString(endDate) : 'End'}
            </div>
            <button onClick={handleNextMonth}>Next &rarr;</button>
          </div>

          <div className="calendars-wrapper">
            {/* Left Calendar */}
            <div className="single-calendar">
              <h4>{monthNames[leftMonth]} {leftYear}</h4>
              <div className="weekdays-grid">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div className="days-grid">
                {leftDays.map((date, idx) => {
                  if (!date) return <div key={`empty-l-${idx}`} className="day empty"></div>;
                  const selectedStart = isStartDate(date);
                  const selectedEnd = isEndDate(date);
                  const inRange = isInRange(date);

                  return (
                    <div
                      key={date.toISOString()}
                      className={`day ${selectedStart ? 'start-date' : ''} ${selectedEnd ? 'end-date' : ''} ${inRange ? 'in-range' : ''}`}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => startDate && !endDate && setHoverDate(date)}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Calendar */}
            <div className="single-calendar">
              <h4>{monthNames[rightMonth]} {rightYear}</h4>
              <div className="weekdays-grid">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div className="days-grid">
                {rightDays.map((date, idx) => {
                  if (!date) return <div key={`empty-r-${idx}`} className="day empty"></div>;
                  const selectedStart = isStartDate(date);
                  const selectedEnd = isEndDate(date);
                  const inRange = isInRange(date);

                  return (
                    <div
                      key={date.toISOString()}
                      className={`day ${selectedStart ? 'start-date' : ''} ${selectedEnd ? 'end-date' : ''} ${inRange ? 'in-range' : ''}`}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => startDate && !endDate && setHoverDate(date)}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="calendar-footer">
            <button className="clear-btn" onClick={() => { setStartDate(null); setEndDate(null); }}>Clear</button>
            <button className="apply-btn" onClick={() => setIsOpen(false)}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

```

---

### 2. Styling (`DateRangePicker.css`)

Add this optional CSS to style your modal layout and highlight behavior cleanly:

```css
.date-range-container {
  position: relative;
  font-family: sans-serif;
}

.picker-trigger {
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.calendar-modal {
  position: absolute;
  top: 45px;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 16px;
  z-index: 100;
  width: 600px;
}

.calendar-header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-header-controls button {
  padding: 6px 12px;
  cursor: pointer;
}

.calendars-wrapper {
  display: flex;
  gap: 24px;
}

.single-calendar {
  flex: 1;
}

.single-calendar h4 {
  text-align: center;
  margin-bottom: 8px;
}

.weekdays-grid, .days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.weekdays-grid span {
  font-size: 12px;
  color: #666;
  font-weight: bold;
  padding-bottom: 6px;
}

.day {
  padding: 10px 0;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.day:hover:not(.empty) {
  background-color: #f0f0f0;
  border-radius: 50%;
}

.day.start-date {
  background-color: #007bff;
  color: white;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.day.end-date {
  background-color: #007bff;
  color: white;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.day.in-range {
  background-color: #e6f0ff;
  border-radius: 0 !important;
}

.calendar-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.apply-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn {
  background: transparent;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

```
