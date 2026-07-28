```js
import "./CalendarViewer.css";
import React, { useState } from "react";

const CalendarViewer = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];

        // Add empty days for the first week
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div className="day empty" key={`empty-${i}`}></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div className="day" key={day}>
                    {day}
                </div>
            );
        }

        return days;
    };

    const renderHeader = () => {
        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        return (
            <div className="header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{`${month} ${year}`}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
        );
    };

    return (
        <div className="calendar-viewer">
            {renderHeader()}
            <div className="days-of-week">
                <div className="day-name">Sun</div>
                <div className="day-name">Mon</div>
                <div className="day-name">Tue</div>
                <div className="day-name">Wed</div>
                <div className="day-name">Thu</div>
                <div className="day-name">Fri</div>
                <div className="day-name">Sat</div>
            </div>
            <div className="days-container">
                {renderDays()}
            </div>
        </div>
    );
};

export default CalendarViewer;


.calendar-viewer {
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    background: white;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.header button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
}

.days-of-week {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 5px;
}

.days-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #f0f0f0;
}

.empty {
    background: #f9f9f9;
}

.day:hover {
    background: #f0f0f0;
}
```
