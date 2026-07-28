1. Real-Time Time Input Validation

For enterprise forms, validate:

✅ While Typing
✅ On Blur
✅ On Submit
✅ Min Time
✅ Max Time
✅ Disabled Slots
✅ Business Hours

Custom Hook
```js
function useTimeValidation() {
const [value, setValue] =
useState("");

const [error, setError] =
useState("");

function validate(
timeString
) {
if (!timeString) {
return "Time required";
}

    const pattern =
      /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

    if (
      !pattern.test(
        timeString
      )
    ) {
      return "Invalid format";
    }

    const [hour, minute] =
      timeString
        .split(":")
        .map(Number);

    const totalMinutes =
      hour * 60 + minute;

    const officeStart =
      9 * 60;

    const officeEnd =
      18 * 60;

    if (
      totalMinutes <
        officeStart ||
      totalMinutes >
        officeEnd
    ) {
      return "Outside business hours";
    }

    return "";

}

function handleChange(
nextValue
) {
setValue(nextValue);

    setError(
      validate(nextValue)
    );

}

return {
  value,
  error,
  handleChange
};
}
```
```js
// Usage
function CustomTimeInput() {

const {
value,
error,
handleChange
} =
useTimeValidation();

return (

<>
<input

       value={value}

       placeholder="HH:mm"

       onChange={e =>
         handleChange(
           e.target.value
         )
       }

     />

     {error && (

       <div
         className="error"
       >
         {error}
       </div>

     )}

</>

);

}

```
This pattern provides immediate feedback as the user types, which is consistent with validation-focused picker implementations.

2. Holiday Tooltip Appearance Customization

Instead of simple browser tooltips:

Republic Day

Create rich enterprise tooltips.

Holiday Model
```js
const holidays = {

"2026-01-26": {

title:
"Republic Day",

type:
"National Holiday",

color:
"#ef4444"

},

"2026-08-15": {

title:
"Independence Day",

type:
"National Holiday",

color:
"#22c55e"

}

};

Rich Holiday Tooltip
function HolidayTooltip({
holiday
}) {

return (

  <div
    className="
      holiday-tooltip
    "
  >

    <h4>
      {holiday.title}
    </h4>

    <span>
      {holiday.type}
    </span>

  </div>

);

}

Day Cell
function DayCell({
date
}) {

const holiday =

holidays[
formatDate(date)
];

return (

  <div
    className="day-cell"
  >

    {date.getDate()}

    {holiday && (

      <HolidayTooltip
        holiday={
          holiday
        }
      />

    )}

  </div>

);

}

Professional Styling
.day-cell {

position: relative;

display: flex;

justify-content: center;

align-items: center;

}

Glass Tooltip
.holiday-tooltip {

position: absolute;

bottom: 120%;

left: 50%;

transform:
translateX(-50%);

min-width: 220px;

padding: 12px;

border-radius: 12px;

background:
rgba(
17,
24,
39,
0.95
);

color: white;

backdrop-filter:
blur(12px);

box-shadow:
0 20px 40px
rgba(0,0,0,.3);

z-index: 1000;

opacity: 0;

visibility: hidden;

transition:
all .2s;
}

Hover Effect
.day-cell:hover
.holiday-tooltip {

opacity: 1;

visibility: visible;

}

Tooltip Arrow
.holiday-tooltip::after {

content: "";

position: absolute;

top: 100%;

left: 50%;

transform:
translateX(-50%);

border: 8px solid;

border-color:

rgba(
17,
24,
39,
0.95
)

transparent

transparent

transparent;
}

3. Month Picker Scroll Performance

The biggest performance killer is:

scroll event
↓
state update
↓
rerender
↓
scroll event

repeating hundreds of times.

Technique 1: React.memo
const MonthItem =
React.memo(
function MonthItem({
month
}) {

return (
<button>
{month}
</button>
);

});

Memoisation is a commonly used React optimisation strategy to avoid unnecessary re-renders. AI_Inteview_Evaluation_Mahesh Ganjare_00003252.pdf and 00-executive-summary-ReactCodeBase.pdf both reference React.memo and memoisation techniques for performance optimisation.

Technique 2: useMemo
const visibleMonths =
useMemo(
() => {

     return months.slice(
       startIndex,
       endIndex
     );

},
[
startIndex,
endIndex
]
);

useMemo is commonly used to avoid recalculating expensive values during rendering.

Technique 3: useCallback
const selectMonth =
useCallback(

month => {

     setMonth(
       month
     );

},

[]

);

Technique 4: requestAnimationFrame Scroll

Instead of:

onScroll={handleScroll}

Use:

const ticking =
useRef(false);

function handleScroll(
event
){

if(
ticking.current
) {
return;
}

ticking.current =
true;

requestAnimationFrame(
() => {

     setScrollTop(
       event.target
         .scrollTop
     );

     ticking.current =
       false;

}
);

}

Technique 5: Overscan

Render:

Visible Months

plus:

3 above
3 below

const overscan = 3;

const startIndex =
Math.max(
0,
visibleStart -
overscan
);

This prevents visual flickering during fast scrolling.

Technique 6: Fixed Heights

Good:

const MONTH_HEIGHT = 40;

Bad:

Dynamic Heights

Fixed sizes make virtualization calculations O(1).

Technique 7: Avoid Re-Creating Arrays

Bad:

[
"Jan",
"Feb",
"Mar"
]

inside render.

Good:

const MONTHS =
useMemo(
() => [...],
[]
);

Production Virtualized Month Picker
React.memo
↓
useMemo
↓
useCallback
↓
requestAnimationFrame
↓
Overscan
↓
Fixed Heights
↓
60 FPS Scrolling

Senior React Interview Answer

For a production-grade virtualized month picker, I keep row heights fixed, render only visible months plus an overscan buffer, memoize month rows with React.memo, compute visible ranges using useMemo, and stabilise event handlers with useCallback. Scroll updates are throttled using requestAnimationFrame to avoid excessive state updates. For custom date pickers, holiday metadata is rendered through rich tooltips with configurable styling, positioning and accessibility support, while time validation is implemented as a dedicated validation engine that provides real-time feedback as users type.

Controlled CustomTimePicker (React Controlled Pattern)

In a controlled component, the parent owns the state.

Parent State
↓
value
↓
CustomTimePicker
↓
onChange
↓
Parent State Update

Parent Component
import { useState } from "react";
import { CustomTimePicker } from "./CustomTimePicker";

export default function App() {

const [time, setTime] =
useState("09:30");

return (
<CustomTimePicker
      value={time}
      onChange={setTime}
      minTime="09:00"
      maxTime="18:00"
    />
);
}

Controlled TimePicker
type Props = {

value: string;

onChange: (
value: string
) => void;

minTime?: string;

maxTime?: string;
};

export function CustomTimePicker({
value,
onChange,
minTime,
maxTime
}: Props) {

const [error, setError] =
useState("");

function validate(
nextValue: string
) {

    const regex =
      /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regex.test(nextValue)) {

      setError(
        "Invalid time"
      );

      return;
    }

    if (
      minTime &&
      nextValue < minTime
    ) {

      setError(
        `Minimum ${minTime}`
      );

      return;
    }

    if (
      maxTime &&
      nextValue > maxTime
    ) {

      setError(
        `Maximum ${maxTime}`
      );

      return;
    }

    setError("");

}

function handleChange(
event
) {

    const nextValue =
      event.target.value;

    onChange(
      nextValue
    );

    validate(
      nextValue
    );

}

return (

    <div>

      <input

        type="time"

        value={value}

        onChange={
          handleChange
        }

        aria-invalid={
          !!error
        }

        aria-describedby={
          error
            ? "time-error"
            : undefined
        }

      />

      {error && (

        <div
          id="time-error"
          role="alert"
        >
          {error}
        </div>

      )}

    </div>

);

}

Accessible Holiday Tooltip

For accessibility, use:

✅ role="tooltip"
✅ aria-describedby
✅ Keyboard Focus
✅ ESC Support
✅ Screen Reader Support

According to ARIA tooltip guidance, the tooltip container should use role="tooltip" and the trigger element should reference it through aria-describedby.

The accessibility guidance in Addendum 6_Comprehensive accessibility framework.pptx and AI_Inteview_Evaluation_Mahesh Ganjare_00003252.pdf also emphasises keyboard navigation, ARIA usage and accessible interaction patterns.

Holiday Cell
function HolidayCell({
date,
holiday
}) {

const tooltipId =
`holiday-${date}`;

return (

    <button

      className="day-cell"

      aria-describedby={
        tooltipId
      }

    >

      {date}

      <HolidayTooltip
        id={tooltipId}
        holiday={holiday}
      />

    </button>

);

}

Tooltip Component
function HolidayTooltip({
id,
holiday
}) {

return (

    <div

      id={id}

      role="tooltip"

      aria-hidden="true"

      className="
        holiday-tooltip
      "

    >

      <h4>
        {holiday.title}
      </h4>

      <p>
        {holiday.type}
      </p>

      <p>
        Holiday Date:
        {" "}
        {holiday.date}
      </p>

    </div>

);

}

The ARIA tooltip pattern specifically uses a tooltip container with role="tooltip" associated to the trigger via aria-describedby.

Keyboard Accessible Version
function HolidayCell({
holiday
}) {

const [
open,
setOpen
] = useState(false);

return (

<button

    aria-describedby={
      open
        ? holiday.id
        : undefined
    }

    onFocus={() =>
      setOpen(true)
    }

    onBlur={() =>
      setOpen(false)
    }

    onMouseEnter={() =>
      setOpen(true)
    }

    onMouseLeave={() =>
      setOpen(false)
    }

    onKeyDown={event => {

      if (
        event.key ===
        "Escape"
      ) {

        setOpen(false);

      }

    }}

>

{holiday.day}

{open && (

    <div

      role="tooltip"

      id={holiday.id}

    >

      {holiday.title}

    </div>

)}

  </button>

);

}

ARIA tooltip guidance states that tooltips should appear on focus/hover and be dismissible with Escape while remaining associated with the triggering element.

Production-Ready ARIA Structure
<button
aria-describedby="holiday-1"

> 15
> </button>

<div
  id="holiday-1"
  role="tooltip"
>
  Independence Day
</div>

Additional Accessibility Enhancements
role="grid"
role="row"
role="gridcell"

aria-selected

aria-current="date"

aria-disabled

aria-describedby

aria-label

Keyboard navigation, ARIA labels, roles, and focus management are highlighted as important accessibility practices in AI_Inteview_Evaluation_Mahesh Ganjare_00003252.pdf.

Senior React Interview Answer

For a controlled CustomTimePicker, the parent component owns the selected time and passes it through value and onChange. Validation runs during user input and exposes errors through aria-invalid and role="alert". For holiday tooltips, I follow the ARIA Tooltip pattern: the date cell references the tooltip using aria-describedby, while the tooltip uses role="tooltip". The tooltip appears on focus and hover, supports Escape to dismiss, and remains fully accessible to keyboard and screen-reader users.

1. Keyboard Accessible Holiday Tooltip

A holiday tooltip should work for:

✅ Mouse Hover
✅ Keyboard Focus
✅ Screen Readers
✅ Escape Key
✅ Touch Devices

ARIA guidance recommends associating the trigger element with the tooltip using aria-describedby and marking the tooltip container with role="tooltip". The tooltip should appear on hover or focus and support dismissal with Escape.

Holiday Cell
import {
useState
} from "react";

function HolidayCell({
day,
holiday
}) {

const [open, setOpen] =
useState(false);

const tooltipId =
`holiday-${day}`;

function handleKeyDown(
event
) {
if (event.key === "Escape") {
setOpen(false);
}
}

return (

    <button
      className="holiday-cell"

      aria-describedby={
        open
          ? tooltipId
          : undefined
      }

      aria-label={
        `${day} ${holiday.title}`
      }

      onFocus={() =>
        setOpen(true)
      }

      onBlur={() =>
        setOpen(false)
      }

      onMouseEnter={() =>
        setOpen(true)
      }

      onMouseLeave={() =>
        setOpen(false)
      }

      onKeyDown={
        handleKeyDown
      }
    >

      {day}

      {open && (

        <div

          id={tooltipId}

          role="tooltip"

          className="
            holiday-tooltip
          "

        >

          <strong>
            {holiday.title}
          </strong>

          <div>
            {holiday.type}
          </div>

          <div>
            {holiday.description}
          </div>

        </div>

      )}

    </button>

);

}

2. ARIA Roles for CustomTimePicker
   Recommended Structure
   TimePicker Wrapper
   ↓
   Text Input
   ↓
   Error Message
   ↓
   Time Options Popup

Accessibility implementations commonly use ARIA labels, keyboard navigation, semantic roles and focus management.

Time Input
<input

type="text"

role="combobox"

aria-label="Select time"

aria-expanded={isOpen}

aria-controls="time-listbox"

aria-autocomplete="none"

aria-invalid={!!error}

aria-describedby={
error
? "time-error"
: undefined
}

value={value}

onChange={handleChange}

/>

Why
ARIA Purposerole="combobox" Time selector
aria-expanded Popup open/closed
aria-controls Links popup
aria-invalid Validation
aria-describedby Error association
Time Popup

<ul

id="time-listbox"

role="listbox"

>

{options.map(time => (

    <li

      key={time}

      role="option"

      aria-selected={
        time === value
      }

    >

      {time}

    </li>

))}

</ul>

Error Message

<div

id="time-error"

role="alert"

>

Invalid time

</div>

role="alert" ensures screen readers immediately announce validation errors.

3. Responsive Holiday Tooltip CSS
   Base Design
   .holiday-tooltip {

position: absolute;

bottom: 120%;

left: 50%;

transform:
translateX(-50%);

background: #111827;

color: white;

min-width: 220px;

max-width: 320px;

padding: 12px;

border-radius: 12px;

box-shadow:
0 12px 30px
rgba(0,0,0,.25);

z-index: 999;

}

Arrow
.holiday-tooltip::after {

content: "";

position: absolute;

top: 100%;

left: 50%;

transform:
translateX(-50%);

border-width: 8px;

border-style: solid;

border-color:

    #111827
    transparent
    transparent
    transparent;

}

Mobile Responsive
@media (
max-width: 768px
) {

.holiday-tooltip {

    left: 0;

    right: 0;

    transform: none;

    min-width: auto;

    width: 220px;

}

}

Prevent Screen Overflow
.holiday-tooltip {

max-width:
min(
320px,
calc(
100vw - 24px
)
);

word-wrap:
break-word;
}

Dark / Light Theme Support
.holiday-tooltip {

background:
var(
--tooltip-bg
);

color:
var(
--tooltip-text
);
}

:root {

--tooltip-bg:
#111827;

--tooltip-text:
white;

}

Better Focus Visibility
.holiday-cell:focus {

outline:
2px solid
#2563eb;

outline-offset:
2px;

}

This aligns with accessibility practices that emphasise keyboard navigation, focus handling, ARIA attributes and operable interfaces.

Senior React Interview Answer

For holiday tooltips, I follow the ARIA Tooltip pattern by connecting the tooltip to the date cell with aria-describedby and using role="tooltip" on the popup. The tooltip opens on hover and keyboard focus, closes on blur or Escape, and remains accessible to screen readers. For a custom TimePicker, I model the input as a combobox with a listbox popup, expose validation through aria-invalid, and announce errors through role="alert". Responsive tooltip design uses viewport-aware widths, proper layering, focus indicators, and mobile-friendly positioning to avoid clipping and overflow.
