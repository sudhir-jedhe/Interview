If you want 100% custom implementation (no MUI DatePicker, no react-datepicker), for a Senior React interview you should build it as a mini framework.

Final Architecture
CustomDatePicker
│
├── DateInput
├── Popover
├── Calendar
├── MonthSelector
├── YearSelector
├── NavigationHeader
├── DayGrid
├── DateRangeEngine
├── ValidationEngine
├── KeyboardEngine
├── AccessibilityLayer
├── LocalizationEngine
├── HolidayEngine
├── TimezoneEngine
└── React Hook Form Adapter

Keyboard navigation and ARIA support are important accessibility considerations for custom React components. The internal accessibility material also highlights keyboard navigation and ARIA labels as key practices.

Folder Structure
src/

components/

├── date-picker/

│ ├── DatePicker.tsx
│ ├── DateField.tsx
│ ├── Calendar.tsx
│ ├── MonthView.tsx
│ ├── YearView.tsx
│ ├── DayCell.tsx
│ ├── DateRangePicker.tsx
│ ├── hooks/
│ │ ├── useCalendar.ts
│ │ ├── useKeyboard.ts
│ │ ├── useValidation.ts
│ │
│ ├── utils/
│ │ ├── dateUtils.ts
│ │ ├── formatter.ts
│ │ ├── parser.ts
│
│ └── styles.css

```js
Core State
const [
selectedDate,
setSelectedDate
] = useState(null);

const [
focusedDate,
setFocusedDate
] = useState(new Date());

const [
visibleMonth,
setVisibleMonth
] = useState(new Date());

const [
isOpen,
setIsOpen
] = useState(false);

Date Input
function DateField({
value,
onChange
}) {

return (

<input

    value={value}

    placeholder="DD/MM/YYYY"

    onChange={event =>
      onChange(
        event.target.value
      )
    }

/>

);

}

Calendar Generation
function createMonth(
year,
month
){

const days = [];

const totalDays =
new Date(
year,
month + 1,
0
).getDate();

for(
let day = 1;
day <= totalDays;
day++
){

days.push(
new Date(
year,
month,
day
)
);

}

return days;

}

Day Cell
function DayCell({
date,
selected,
onSelect
}) {

return (

<button

    className={
      selected
        ? "selected"
        : ""
    }

    onClick={() =>
      onSelect(date)
    }

>

    {date.getDate()}

  </button>

);

}

Calendar View
function Calendar({
month,
year
}) {

const days =
createMonth(
year,
month
);

return (

  <div
    className="grid"
  >

{days.map(day => (

     <DayCell

       key={day.toISOString()}

       date={day}

       selected={
         isSameDate(
           day,
           selectedDate
         )
       }

       onSelect={
         handleSelect
       }

     />

))}

  </div>

);

}

Date Range Picker
const [
range,
setRange
] =
useState({

start:null,

end:null

});

Selection:

function selectDate(
date
){

if(
!range.start
){

setRange({

    start:date,

    end:null

});

return;
}

if(
date <
range.start
){

setRange({

    start:date,

    end:range.start

});

} else {

setRange({

    start:range.start,

    end:date

});

}

}

Validation Engine
function validateDate(
date
){

if(!date){

return "Required";
}

if(
isWeekend(date)
){

return "Weekends disabled";
}

return null;

}

```

Common validations:

Required
Min Date
Max Date
Disabled Dates
Holiday Dates
Past Dates
Future Dates
Custom Rules
Range Validation

Custom date validation is a common feature highlighted in date picker implementations and validation systems.

React Hook Form Integration

```js
<Controller
  name="joiningDate"
  control={control}
  rules={{
    required: "Joining Date Required",
  }}
  render={({ field }) => (
    <CustomDatePicker value={field.value} onChange={field.onChange} />
  )}
/>
```

Keyboard Navigation

```js
function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      movePreviousDay();

      break;

    case "ArrowRight":
      moveNextDay();

      break;

    case "ArrowUp":
      movePreviousWeek();

      break;

    case "ArrowDown":
      moveNextWeek();

      break;

    case "PageUp":
      movePreviousMonth();

      break;

    case "PageDown":
      moveNextMonth();

      break;

    case "Enter":
      selectFocusedDate();

      break;

    case "Escape":
      closeCalendar();
  }
}
```

// Accessibility

```js
<div
 role="grid"
 aria-label="Date Calendar"
>

<button
role="gridcell"

aria-selected={
selected
}

aria-label={
formattedDate
}

>
```

// ARIA labels and keyboard navigation are commonly recommended accessibility practices.

```js
Localization
new Intl.DateTimeFormat(
"en-IN"
)

new Intl.DateTimeFormat(
"fr-FR"
)

new Intl.DateTimeFormat(
"ar-SA"
)

Timezone Support
function convertTimezone(
date,
timezone
){

return new Date(

date.toLocaleString(
"en-US",
{
timeZone:
timezone
}
)

);

}
```

Advanced Enterprise Features
✅ Single Date

✅ Date Range

✅ Month Picker

✅ Year Picker

✅ Keyboard Navigation

✅ ARIA Support

✅ Localization

✅ RTL Support

✅ Disabled Dates

✅ Holiday Support

✅ Min/Max Date

✅ Timezone Support

✅ React Hook Form

✅ Form Validation

✅ Lazy Month Rendering

✅ Memoized Calendar

✅ Mobile Support

✅ Touch Support

✅ Virtualized Year List

✅ Custom Day Renderer

✅ Date Presets

✅ Fiscal Calendar

✅ Quarter Selection

Staff/Senior React Interview Answer

I build a DatePicker as a composition of independent modules: DateField, Calendar, Validation, Keyboard Navigation, Accessibility, Localization, and Date Range engines. The component maintains focused date, selected date, and visible month state separately. Keyboard interactions follow grid-style navigation using arrow keys, Home/End, PageUp/PageDown, Enter, and Escape. Validation, date formatting, localization, and form integration are isolated into reusable hooks so the picker can be reused across forms, editable tables, filters, reporting dashboards, and enterprise scheduling systems without depending on a third-party library.

A natural next step would be a fully custom TimePicker + DateTimePicker + Scheduler/Calendar (Outlook-style) implementation using the same architecture.

Custom TimePicker (No Third-Party Library)

A custom TimePicker can be built using the same architecture as a custom DatePicker:

TimeField
↓
Validation Engine
↓
Hour List
Minute List
AM/PM Selector
↓
Keyboard Navigation
↓
Accessibility Layer

Enterprise-grade picker implementations typically support validation, keyboard interactions, accessibility, localisation and controlled state management.

1. Custom TimePicker Component
   State
   ```js
   const [time, setTime] = useState({
     hour: 10,
     minute: 30,
     meridiem: "AM",
   });
   ```

```js
const [isOpen, setIsOpen] = useState(false);

// TimeField
function TimeField({ value, onClick }) {
  return (
    <input
      readOnly
      value={`${value.hour}:${String(value.minute).padStart(2, "0")} ${
        value.meridiem
      }`}
      onClick={onClick}
    />
  );
}
```

// Hour List

```js
const hours =
Array.from(
{ length: 12 },
(\_, i) => i + 1
);

<div className="column">

{hours.map(hour => (

    <button
      key={hour}
      onClick={() =>
        setTime(prev => ({
          ...prev,
          hour
        }))
      }
    >
      {hour}
    </button>

))}

</div>
```

// Minute List

```js
const minutes =
Array.from(
{ length: 60 },
(\_, i) => i
);

<div className="column">

{minutes.map(minute => (

    <button
      key={minute}
      onClick={() =>
        setTime(prev => ({
          ...prev,
          minute
        }))
      }
    >
      {minute
        .toString()
        .padStart(2, "0")}
    </button>

))}

</div>
```

// AM / PM Selector

```js
<select
  value={time.meridiem}
  onChange={(e) =>
    setTime((prev) => ({
      ...prev,
      meridiem: e.target.value,
    }))
  }
>
  <option>AM</option>
  <option>PM</option>
</select>
```

2. Holiday Support in DatePicker

Most enterprise applications need:

Public Holidays
Company Holidays
Regional Holidays
Restricted Holidays

Validation and disabled-date support are common date-picker capabilities.

Holiday Store

```js
const holidays = ["2026-01-26", "2026-08-15", "2026-10-02", "2026-12-25"];
```

Holiday Utility

```js
function isHoliday(date) {
  const formatted = date.toISOString().split("T")[0];

  return holidays.includes(formatted);
}
```

```js
// Disable Holiday
function isDisabledDate(
date
){

return (
isHoliday(date)
);

}

Calendar Cell
<button
disabled={
isDisabledDate(
day
)
}

> {day.getDate()}
> </button>

// Highlight Holiday
<button
className={
isHoliday(day)
? "holiday"
: ""
}

>

.holiday {
background:#fee2e2;
color:#dc2626;
}

Tooltip
const holidayMap = {
"2026-01-26":
"Republic Day",
"2026-08-15":
"Independence Day"
};

title={
holidayMap[
formattedDate
]
}
```

3. Virtualised Year List Rendering

A Year Picker typically supports:

1900
to
2100

Rendering all years is wasteful.

Generate Years

```js
const years =
Array.from(
{
length: 201
},
(\_, index) =>
1900 + index
);
```

Virtualisation Hook

```js
function useVirtualYears(
years,
rowHeight,
containerHeight,
scrollTop
){

const visibleCount =
Math.ceil(
containerHeight /
rowHeight
);

const startIndex =
Math.floor(
scrollTop /
rowHeight
);

const endIndex =
Math.min(
years.length,
startIndex +
visibleCount +
5
);

return {
startIndex,

visibleYears:
years.slice(
startIndex,
endIndex
),

totalHeight:
years.length \*
rowHeight
};
}
```

```js
//Year Picker
function YearPicker() {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, visibleYears, totalHeight } = useVirtualYears(
    years,
    40,
    400,
    scrollTop,
  );

  return (
    <div
      style={{
        height: 400,
        overflow: "auto",
      }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        {visibleYears.map((year, index) => (
          <button
            key={year}
            style={{
              position: "absolute",

              top: (startIndex + index) * 40,

              width: "100%",
            }}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
```

Keyboard Navigation for Year Picker

```js
function handleYearKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      previousYear();
      break;

    case "ArrowDown":
      nextYear();
      break;

    case "PageUp":
      move10YearsBack();
      break;

    case "PageDown":
      move10YearsForward();
      break;

    case "Enter":
      selectYear();
      break;
  }
}
```

Complete Enterprise Date-Time Picker Architecture
CustomDateTimePicker
│
├── DateField
├── Calendar
├── TimeField
├── Hour Picker
├── Minute Picker
├── AM/PM Selector
├── Holiday Engine
├── Validation Engine
├── Keyboard Navigation Engine
├── Accessibility Layer
├── Localization
├── Timezone Support
├── Virtualized Year Picker
├── Virtualized Month Picker
└── React Hook Form Adapter

Senior React Interview Answer

I build a DateTimePicker as a composition of DatePicker and TimePicker modules. Holiday support is implemented through a configurable holiday engine that disables or highlights special dates. Large year ranges are rendered with list virtualisation to avoid hundreds of DOM nodes. Keyboard accessibility is handled using arrow keys, PageUp/PageDown, Home/End, Enter, and Escape. The component remains fully controlled and can be integrated with React Hook Form, editable data grids, filter panels, and scheduling systems while maintaining accessibility and performance. Keyboard navigation, validation and accessibility are core considerations in modern date/time picker implementations.

1. Custom TimePicker with Validation
   Features
   ✅ Min Time
   ✅ Max Time
   ✅ Required
   ✅ Business Hours Validation
   ✅ Keyboard Navigation

Hook

```js
import { useState } from "react";

export function useTimePicker({ minTime = "09:00", maxTime = "18:00" }) {
  const [value, setValue] = useState({
    hour: 9,
    minute: 0,
    meridiem: "AM",
  });

  const [error, setError] = useState("");

  function convertTo24Hour(time) {
    let hour = time.hour;

    if (time.meridiem === "PM" && hour !== 12) {
      hour += 12;
    }

    if (time.meridiem === "AM" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + time.minute;
  }

  function validate() {
    const current = convertTo24Hour(value);

    const [minH, minM] = minTime.split(":").map(Number);

    const [maxH, maxM] = maxTime.split(":").map(Number);

    const min = minH * 60 + minM;

    const max = maxH * 60 + maxM;

    if (current < min) {
      setError("Time is before minimum");
      return false;
    }

    if (current > max) {
      setError("Time exceeds maximum");
      return false;
    }

    setError("");
    return true;
  }

  return {
    value,
    setValue,
    error,
    validate,
  };
}
```

Component

```js
function CustomTimePicker() {
const {
value,
setValue,
error,
validate
} = useTimePicker({
minTime: "09:00",
maxTime: "18:00"
});

return (

<div>
<select
value={value.hour}
onChange={e =>
setValue(prev => ({
...prev,
hour: Number(
e.target.value
)
}))
} >
{Array.from(
{ length: 12 },
(\_, i) => i + 1
).map(hour => (
<option
            key={hour}
            value={hour}
          >
{hour}
</option>
))}
</select>

      <select
        value={value.minute}
        onChange={e =>
          setValue(prev => ({
            ...prev,
            minute: Number(
              e.target.value
            )
          }))
        }
      >
        {Array.from(
          { length: 60 },
          (_, i) => i
        ).map(min => (
          <option
            key={min}
            value={min}
          >
            {min
              .toString()
              .padStart(2, "0")}
          </option>
        ))}
      </select>

      <select
        value={value.meridiem}
        onChange={e =>
          setValue(prev => ({
            ...prev,
            meridiem:
              e.target.value
          }))
        }
      >
        <option>AM</option>
        <option>PM</option>
      </select>

      <button
        onClick={validate}
      >
        Save
      </button>

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>

);
}
```

Custom date/time pickers commonly support validation constraints such as min/max values and invalid-state feedback.

2. Holiday Tooltip Support in DatePicker
   Holiday Configuration

```js
const holidays = {
  "2026-01-26": "Republic Day",

  "2026-08-15": "Independence Day",

  "2026-10-02": "Gandhi Jayanti",

  "2026-12-25": "Christmas",
};
```

// Utilities

```js
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getHoliday(date) {
  return holidays[formatDate(date)];
}
```

// Calendar Cell

```js
function DayCell({
date
}) {
const holiday =
getHoliday(date);

return (

<div
className={
holiday
? "holiday"
: ""
}
title={
holiday || ""
} >
{date.getDate()}

      {holiday && (
        <span
          className="holiday-dot"
        />
      )}
    </div>

);
}

// Tooltip Version
{holiday && (

  <div
    className="tooltip"
  >
    {holiday}
  </div>

)}

// Styles
.holiday {
background: #fee2e2;
position: relative;
}

.holiday-dot {
width: 6px;
height: 6px;
border-radius: 50%;
background: red;
position: absolute;
top: 4px;
right: 4px;
}

.tooltip {
position: absolute;
top: -30px;
background: black;
color: white;
padding: 4px 8px;
}
```

Holiday disabling and validation are common capabilities expected in modern DatePicker implementations.

3. Virtualised Month Picker Rendering

Instead of rendering:

January
...
December

all at once, render only visible months.

```js
// Month Data
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
```

// Virtual Hook

```js
function useVirtualMonths(
items,
rowHeight,
viewportHeight,
scrollTop
){

const visibleCount =
Math.ceil(
viewportHeight /
rowHeight
);

const startIndex =
Math.floor(
scrollTop /
rowHeight
);

const endIndex =
Math.min(
items.length,
startIndex +
visibleCount +
2
);

return {
startIndex,

visibleItems:
items.slice(
startIndex,
endIndex
),

totalHeight:
items.length \*
rowHeight
};
}
```

// Month Picker

```js
function MonthPicker() {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, visibleItems, totalHeight } = useVirtualMonths(
    months,
    40,
    300,
    scrollTop,
  );

  return (
    <div
      style={{
        height: 300,
        overflow: "auto",
      }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        {visibleItems.map((month, index) => (
          <button
            key={month}
            style={{
              position: "absolute",

              top: (startIndex + index) * 40,

              width: "100%",

              height: 40,
            }}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}
```

Senior Engineer Version (Production)
CustomDatePicker
↓
DateField
↓
Calendar
↓
Holiday Engine
↓
Validation Engine
↓
Keyboard Navigation
↓
Virtualized Month Picker
↓
Virtualized Year Picker
↓
Timezone + Localization
↓
React Hook Form Adapter

This modular approach aligns with modern picker architectures where validation, localisation, keyboard navigation, accessibility, and custom rendering are treated as independent concerns.

1. Production-Grade Time Validation

Instead of validating only on submit, validate while typing.

Validation Rules
✅ Required
✅ Valid Time
✅ Business Hours
✅ Disabled Time Slots
✅ Future Time Validation
✅ Time Range Validation

// Validation Utility

```js
function validateTime(
time
) {

if (!time) {
return "Time is required";
}

const {
hour,
minute,
meridiem
} = time;

if (
hour < 1 ||
hour > 12
) {
return "Invalid hour";
}

if (
minute < 0 ||
minute > 59
) {
return "Invalid minute";
}

const totalMinutes =
convertToMinutes(
hour,
minute,
meridiem
);

const officeStart =
9 \* 60;

const officeEnd =
18 \* 60;

if (
totalMinutes <
officeStart ||
totalMinutes >
officeEnd
) {
return (
"Outside business hours"
);
}

return "";
}

// Real-Time Validation
useEffect(() => {

const validationError =
validateTime(
value
);

setError(
validationError
);

}, [value]);
```
```js

// Visual Error State
<input
className={
error
? "invalid"
: ""
}
/>
```
```css
.invalid {
border: 1px solid red;
}

Disabled Time Slots
```

Example:

Lunch Break
1:00 PM–2:00 PM

```js
const blockedTimeRanges = [
  {
    start: "13:00",
    end: "14:00",
  },
];

function isBlocked(totalMinutes) {
  return blockedTimeRanges.some((range) => {
    const start = convertTimeString(range.start);

    const end = convertTimeString(range.end);

    return totalMinutes >= start && totalMinutes <= end;
  });
}
```

2. Advanced Holiday Tooltip Styling

The holiday cell should support:

Holiday Name
Holiday Type
Optional Holiday
Festival
Tooltip

//Holiday Data

```js
const holidays = {
  "2026-01-26": {
    title: "Republic Day",

    type: "National Holiday",
  },

  "2026-08-15": {
    title: "Independence Day",

    type: "National Holiday",
  },
};
```

// Cell Component

```js
function HolidayCell({ date }) {
  const holiday = holidays[formatDate(date)];

  return (
    <div className="day-cell">
      {date.getDate()}

      {holiday && (
        <div className="holiday-tooltip">
          <h4>{holiday.title}</h4>

          <span>{holiday.type}</span>
        </div>
      )}
    </div>
  );
}
```

```css
// Professional Tooltip Positioning
.day-cell {
  position: relative;

  cursor: pointer;
}

.holiday-tooltip {
  position: absolute;

  bottom: 120%;

  left: 50%;

  transform: translateX(-50%);

  min-width: 180px;

  background: #111827;

  color: white;

  padding: 10px;

  border-radius: 8px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  opacity: 0;

  visibility: hidden;

  transition: all 0.2s;

  z-index: 1000;
}

// Show Tooltip
.day-cell:hover
.holiday-tooltip {
  opacity: 1;

  visibility: visible;
}

// Tooltip Arrow
.holiday-tooltip::after {
  content: "";

  position: absolute;

  top: 100%;

  left: 50%;

  transform: translateX(-50%);

  border-width: 8px;

  border-style: solid;

  border-color: #111827 transparent transparent transparent;
}

// Mobile Friendly
@media
(max-width:768px) {
  .holiday-tooltip {
    left: 0;

    transform: none;
  }
}
```

3. Optimizing Virtualized Month Picker

The biggest mistake:

Render all months
Render all years
Re-render on each scroll

Bad

```js
months.map((month) => <Month key={month} />);
```

Every month re-renders.

Optimized Version
Memoized Month

```js
const MonthItem = React.memo(function MonthItem({ month }) {
  return <button>{month}</button>;
});
```

The enterprise React material also highlights memoization and avoiding unnecessary re-renders as key optimisation techniques. Sweeti Sawlikar_00002218_AI_Inteview_Evaluation.pdf mentions using react.memo, useMemo, and useCallback to reduce re-rendering.

Memoized List

```js
const visibleMonths = useMemo(() => {
  return months.slice(startIndex, endIndex);
}, [startIndex, endIndex]);
```

Using useMemo for expensive computations is described as a common React optimisation pattern.

Stable Callbacks

```js
const selectMonth = useCallback((month) => {
  setMonth(month);
}, []);
```

Throttled Scroll

```js
const handleScroll = useMemo(() => {
  return throttle(
    (event) => {
      setScrollTop(event.target.scrollTop);
    },

    16,
  );
}, []);
```

Overscan Buffer

Instead of rendering:

10 visible items

render:

10 visible

- 3 above
- 3 below

```js
const overscan = 3;

const startIndex = Math.max(0, visibleStart - overscan);
```

This prevents flickering.

Keep Row Height Fixed

```js
const MONTH_HEIGHT = 40;
```

Avoid:

Dynamic height

because virtualization calculations become expensive.

Mount Only Visible Months

```js
visibleMonths.map((month) => <MonthItem key={month} month={month} />);
```

Production Virtualized Month Picker
MonthPicker
↓
Virtual Engine
↓
Fixed Row Height
↓
Overscan
↓
Memoized Rows
↓
useMemo
↓
useCallback
↓
Throttled Scroll
↓
React.memo
↓
60 FPS Scrolling

Senior React Interview Answer

For production-grade date pickers, I virtualize month and year lists to minimise DOM nodes. I memoize rendered rows with React.memo, cache visible ranges with useMemo, and stabilise callbacks with useCallback. Scroll handlers are throttled and I render a small overscan buffer to eliminate flickering. Holiday support is implemented through a configurable holiday engine with tooltips, disabled dates, and category-based styling. TimePicker validation is separated into a dedicated validation engine supporting min/max time ranges, business-hour restrictions, blocked slots, and real-time error feedback. Accessibility considerations such as keyboard navigation, ARIA attributes, and focus management should also be included.
