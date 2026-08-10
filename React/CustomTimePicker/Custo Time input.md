Here is a lightweight, customizable **Custom Time Input** component built with React and Tailwind CSS. It supports standard 12-hour (AM/PM) or 24-hour modes, arrow key navigation, auto-focus jumping between hours/minutes, and keyboard incrementing.

---

### Custom Time Input Component

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CustomTimeInput({
  value = '12:00 PM',
  onChange,
  use24Hour = false,
  className = '',
}) {
  // Parse initial state or incoming value
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: '12', minutes: '00', period: 'AM' };
    
    if (use24Hour) {
      const [h, m] = timeStr.split(':');
      return {
        hours: (h || '00').padStart(2, '0'),
        minutes: (m || '00').padStart(2, '0'),
        period: '',
      };
    } else {
      const parts = timeStr.split(' ');
      const [h, m] = (parts[0] || '12:00').split(':');
      return {
        hours: (h || '12').padStart(2, '0'),
        minutes: (m || '00').padStart(2, '0'),
        period: parts[1] || 'AM',
      };
    }
  };

  const [time, setTime] = useState(() => parseTime(value));
  const [focusedField, setFocusedField] = useState(null);

  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  // Sync internal state if prop updates externally
  useEffect(() => {
    setTime(parseTime(value));
  }, [value, use24Hour]);

  // Helper to emit formatted time back to parent
  const emitChange = (updatedTime) => {
    setTime(updatedTime);
    if (onChange) {
      const formatted = use24Hour
        ? `${updatedTime.hours}:${updatedTime.minutes}`
        : `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.period}`;
      onChange(formatted);
    }
  };

  // Input sanitization & formatting helpers
  const pad = (num) => String(num).padStart(2, '0');

  const handleHoursChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    const max = use24Hour ? 23 : 12;

    if (!isNaN(num)) {
      if (num > max) val = pad(max);
      if (val.length === 2) {
        minutesRef.current?.focus(); // Jump to minutes on 2 digits
      }
    }

    emitChange({ ...time, hours: val });
  };

  const handleMinutesChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = '59';

    emitChange({ ...time, minutes: val });
  };

  const togglePeriod = () => {
    if (use24Hour) return;
    const nextPeriod = time.period === 'AM' ? 'PM' : 'AM';
    emitChange({ ...time, period: nextPeriod });
  };

  // Keyboard navigation & arrow adjustments
  const handleKeyDown = (e, field) => {
    const isUp = e.key === 'ArrowUp';
    const isDown = e.key === 'ArrowDown';

    if (field === 'hours' && (isUp || isDown)) {
      e.preventDefault();
      let current = parseInt(time.hours || '0', 10);
      const min = use24Hour ? 0 : 1;
      const max = use24Hour ? 23 : 12;

      let next = isUp ? current + 1 : current - 1;
      if (next > max) next = min;
      if (next < min) next = max;

      emitChange({ ...time, hours: pad(next) });
    }

    if (field === 'minutes' && (isUp || isDown)) {
      e.preventDefault();
      let current = parseInt(time.minutes || '0', 10);
      let next = isUp ? current + 1 : current - 1;
      if (next > 59) next = 0;
      if (next < 0) next = 59;

      emitChange({ ...time, minutes: pad(next) });
    }

    if (e.key === 'ArrowRight' && field === 'hours') {
      minutesRef.current?.focus();
    }
    if (e.key === 'ArrowLeft' && field === 'minutes') {
      hoursRef.current?.focus();
    }
  };

  // Ensure double zero format when user clicks away
  const handleBlur = (field) => {
    setFocusedField(null);
    if (field === 'hours') {
      const min = use24Hour ? '00' : '12';
      const formatted = time.hours ? pad(Math.max(use24Hour ? 0 : 1, parseInt(time.hours, 10))) : min;
      emitChange({ ...time, hours: formatted });
    }
    if (field === 'minutes') {
      const formatted = time.minutes ? pad(parseInt(time.minutes, 10)) : '00';
      emitChange({ ...time, minutes: formatted });
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all ${className}`}
    >
      <Clock className="w-4 h-4 text-gray-400 ml-1" />

      {/* Hours Field */}
      <input
        ref={hoursRef}
        type="text"
        inputMode="numeric"
        placeholder="12"
        value={time.hours}
        onChange={handleHoursChange}
        onKeyDown={(e) => handleKeyDown(e, 'hours')}
        onFocus={() => setFocusedField('hours')}
        onBlur={() => handleBlur('hours')}
        className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
      />

      <span className="text-gray-400 font-bold select-none">:</span>

      {/* Minutes Field */}
      <input
        ref={minutesRef}
        type="text"
        inputMode="numeric"
        placeholder="00"
        value={time.minutes}
        onChange={handleMinutesChange}
        onKeyDown={(e) => handleKeyDown(e, 'minutes')}
        onFocus={() => setFocusedField('minutes')}
        onBlur={() => handleBlur('minutes')}
        className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
      />

      {/* AM/PM Toggle (12-Hour Mode Only) */}
      {!use24Hour && (
        <button
          type="button"
          onClick={togglePeriod}
          className="ml-1 px-2 py-0.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
        >
          {time.period}
        </button>
      )}
    </div>
  );
}

```

---

### Example Usage

```jsx
import React, { useState } from 'react';
import CustomTimeInput from './CustomTimeInput';

export default function App() {
  const [meetingTime, setMeetingTime] = useState('09:30 AM');
  const [militaryTime, setMilitaryTime] = useState('14:45');

  return (
    <div className="p-8 space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Time (12-Hour Format)
        </label>
        <CustomTimeInput
          value={meetingTime}
          onChange={setMeetingTime}
        />
        <p className="mt-1 text-xs text-gray-500">Selected: {meetingTime}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shift Start (24-Hour Format)
        </label>
        <CustomTimeInput
          value={militaryTime}
          onChange={setMilitaryTime}
          use24Hour={true}
        />
        <p className="mt-1 text-xs text-gray-500">Selected: {militaryTime}</p>
      </div>
    </div>
  );
}

```

---

### Key Features

* **Focus Jumping**: Typing two digits in the hours input automatically moves focus to the minutes input.
* **Arrow Keys Navigation**: Pressing ↑ or ↓ inside a field increments or decrements the value automatically. ← and → move focus between fields.
* **Zero Padding**: Automatically formats values on blur (e.g., `9` becomes `09`).

How do I add a popover with scrollable hours and minutes picker columns to this CustomTimeInput component?

Here is an upgraded version of your `CustomTimeInput` component that includes a **popover menu with dual scrollable columns** for selecting hours and minutes visually, complete with click-outside closing and auto-scrolling to the active value when opened.

### Complete Interactive Component

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CustomTimeInput({
  value = '12:00 PM',
  onChange,
  use24Hour = false,
  className = '',
}) {
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: '12', minutes: '00', period: 'AM' };

    if (use24Hour) {
      const [h, m] = timeStr.split(':');
      return {
        hours: (h || '00').padStart(2, '0'),
        minutes: (m || '00').padStart(2, '0'),
        period: '',
      };
    } else {
      const parts = timeStr.split(' ');
      const [h, m] = (parts[0] || '12:00').split(':');
      return {
        hours: (h || '12').padStart(2, '0'),
        minutes: (m || '00').padStart(2, '0'),
        period: parts[1] || 'AM',
      };
    }
  };

  const [time, setTime] = useState(() => parseTime(value));
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const hoursColumnRef = useRef(null);
  const minutesColumnRef = useRef(null);

  // Lists for scrollable picker
  const hoursList = use24Hour
    ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
    : Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const minutesList = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Sync internal state if prop updates externally
  useEffect(() => {
    setTime(parseTime(value));
  }, [value, use24Hour]);

  // Click Outside to Close Popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll selected hours/minutes into view when popover opens
  useEffect(() => {
    if (isOpen) {
      const scrollSelectedIntoView = (columnEl, selectedVal) => {
        if (!columnEl) return;
        const activeItem = columnEl.querySelector(`[data-value="${selectedVal}"]`);
        if (activeItem) {
          activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      };

      scrollSelectedIntoView(hoursColumnRef.current, time.hours);
      scrollSelectedIntoView(minutesColumnRef.current, time.minutes);
    }
  }, [isOpen, time.hours, time.minutes]);

  // Emit changes to parent
  const emitChange = (updatedTime) => {
    setTime(updatedTime);
    if (onChange) {
      const formatted = use24Hour
        ? `${updatedTime.hours}:${updatedTime.minutes}`
        : `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.period}`;
      onChange(formatted);
    }
  };

  const pad = (num) => String(num).padStart(2, '0');

  // Input Handlers
  const handleHoursChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    const max = use24Hour ? 23 : 12;

    if (!isNaN(num)) {
      if (num > max) val = pad(max);
      if (val.length === 2) minutesRef.current?.focus();
    }

    emitChange({ ...time, hours: val });
  };

  const handleMinutesChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = '59';

    emitChange({ ...time, minutes: val });
  };

  const togglePeriod = () => {
    if (use24Hour) return;
    const nextPeriod = time.period === 'AM' ? 'PM' : 'AM';
    emitChange({ ...time, period: nextPeriod });
  };

  const handleBlur = (field) => {
    if (field === 'hours') {
      const min = use24Hour ? '00' : '12';
      const formatted = time.hours ? pad(Math.max(use24Hour ? 0 : 1, parseInt(time.hours, 10))) : min;
      emitChange({ ...time, hours: formatted });
    }
    if (field === 'minutes') {
      const formatted = time.minutes ? pad(parseInt(time.minutes, 10)) : '00';
      emitChange({ ...time, minutes: formatted });
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Input Trigger Bar */}
      <div
        className={`inline-flex items-center gap-1.5 p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all ${className}`}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-0.5 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* Hours Field */}
        <input
          ref={hoursRef}
          type="text"
          inputMode="numeric"
          placeholder="12"
          value={time.hours}
          onFocus={() => setIsOpen(true)}
          onChange={handleHoursChange}
          onBlur={() => handleBlur('hours')}
          className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
        />

        <span className="text-gray-400 font-bold select-none">:</span>

        {/* Minutes Field */}
        <input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          placeholder="00"
          value={time.minutes}
          onFocus={() => setIsOpen(true)}
          onChange={handleMinutesChange}
          onBlur={() => handleBlur('minutes')}
          className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
        />

        {/* AM/PM Toggle */}
        {!use24Hour && (
          <button
            type="button"
            onClick={togglePeriod}
            className="ml-1 px-2 py-0.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
          >
            {time.period}
          </button>
        )}
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
            <span className="flex-1">Hours</span>
            <span className="flex-1">Minutes</span>
            {!use24Hour && <span className="w-14">Period</span>}
          </div>

          <div className="flex h-44 gap-1">
            {/* Hours Scroll Column */}
            <div
              ref={hoursColumnRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 space-y-1 pr-1"
            >
              {hoursList.map((h) => (
                <button
                  key={h}
                  data-value={h}
                  type="button"
                  onClick={() => emitChange({ ...time, hours: h })}
                  className={`w-full text-center py-1.5 text-sm rounded-lg font-mono transition-colors ${
                    time.hours === h
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-[1px] bg-gray-100 my-1" />

            {/* Minutes Scroll Column */}
            <div
              ref={minutesColumnRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 space-y-1 pr-1"
            >
              {minutesList.map((m) => (
                <button
                  key={m}
                  data-value={m}
                  type="button"
                  onClick={() => emitChange({ ...time, minutes: m })}
                  className={`w-full text-center py-1.5 text-sm rounded-lg font-mono transition-colors ${
                    time.minutes === m
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* AM/PM Column (12-Hour Mode) */}
            {!use24Hour && (
              <>
                <div className="w-[1px] bg-gray-100 my-1" />
                <div className="w-14 flex flex-col justify-center gap-2 pl-1">
                  {['AM', 'PM'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => emitChange({ ...time, period: p })}
                      className={`w-full text-center py-2 text-xs font-bold rounded-lg transition-colors ${
                        time.period === p
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Done Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

```

---

### Key Improvements Added

1. **Auto-Scroll Behavior (`scrollIntoView`)**: When the popover opens, `useEffect` calculates the position of the currently selected hour and minute and scrolls both list columns directly to them.
2. **Click Outside Handler**: A global `mousedown` listener ensures clicking anywhere outside the popover cleanly closes it.
3. **Seamless State Sync**: Clicking items in the scroll columns immediately reflects in both the text input fields and the parent state callback (`onChange`).

How do I add seconds precision or a timezone dropdown to this custom time input?

Adding seconds precision and timezone support expands our `CustomTimeInput` state model to track five key parameters: **hours**, **minutes**, **seconds**, **period** (AM/PM), and **timezone**.

Below is the updated component featuring:

1. An optional `showSeconds` boolean prop (adds an extra numeric input and a 3rd scroll column in the popover).
2. An optional `showTimezone` boolean prop (adds a searchable or selectable timezone dropdown).
3. Auto-scroll behavior for seconds alongside hours and minutes.

---

### Refactored Component with Seconds & Timezone

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

const COMMON_TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'EST (UTC-5)', value: 'America/New_York' },
  { label: 'CST (UTC-6)', value: 'America/Chicago' },
  { label: 'MST (UTC-7)', value: 'America/Denver' },
  { label: 'PST (UTC-8)', value: 'America/Los_Angeles' },
  { label: 'GMT (UTC+0)', value: 'Europe/London' },
  { label: 'CET (UTC+1)', value: 'Europe/Paris' },
  { label: 'IST (UTC+5:30)', value: 'Asia/Kolkata' },
  { label: 'JST (UTC+9)', value: 'Asia/Tokyo' },
];

export default function CustomTimeInput({
  value = '12:00:00 PM',
  timezone = 'America/New_York',
  onChange,
  onTimezoneChange,
  use24Hour = false,
  showSeconds = true,
  showTimezone = true,
  className = '',
}) {
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: '12', minutes: '00', seconds: '00', period: 'AM' };

    if (use24Hour) {
      const [h, m, s] = timeStr.split(':');
      return {
        hours: (h || '00').padStart(2, '0'),
        minutes: (m || '00').padStart(2, '0'),
        seconds: (s || '00').padStart(2, '0'),
        period: '',
      };
    } else {
      const parts = timeStr.split(' ');
      const timeParts = (parts[0] || '12:00:00').split(':');
      return {
        hours: (timeParts[0] || '12').padStart(2, '0'),
        minutes: (timeParts[1] || '00').padStart(2, '0'),
        seconds: (timeParts[2] || '00').padStart(2, '0'),
        period: parts[1] || 'AM',
      };
    }
  };

  const [time, setTime] = useState(() => parseTime(value));
  const [selectedTz, setSelectedTz] = useState(timezone);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  const hoursColumnRef = useRef(null);
  const minutesColumnRef = useRef(null);
  const secondsColumnRef = useRef(null);

  // List arrays for picker columns
  const hoursList = use24Hour
    ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
    : Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const sixtyList = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Sync internal state when external props update
  useEffect(() => {
    setTime(parseTime(value));
  }, [value, use24Hour]);

  useEffect(() => {
    setSelectedTz(timezone);
  }, [timezone]);

  // Click Outside to Close Popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll selected values into view when popover opens
  useEffect(() => {
    if (isOpen) {
      const scrollSelected = (columnEl, val) => {
        if (!columnEl) return;
        const activeItem = columnEl.querySelector(`[data-value="${val}"]`);
        if (activeItem) {
          activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      };

      scrollSelected(hoursColumnRef.current, time.hours);
      scrollSelected(minutesColumnRef.current, time.minutes);
      if (showSeconds) scrollSelected(secondsColumnRef.current, time.seconds);
    }
  }, [isOpen, time, showSeconds]);

  // Format and emit time string back to parent
  const emitChange = (updatedTime) => {
    setTime(updatedTime);
    if (onChange) {
      const timeCore = showSeconds
        ? `${updatedTime.hours}:${updatedTime.minutes}:${updatedTime.seconds}`
        : `${updatedTime.hours}:${updatedTime.minutes}`;

      const formatted = use24Hour ? timeCore : `${timeCore} ${updatedTime.period}`;
      onChange(formatted);
    }
  };

  const handleTzChange = (e) => {
    const newTz = e.target.value;
    setSelectedTz(newTz);
    if (onTimezoneChange) onTimezoneChange(newTz);
  };

  const pad = (num) => String(num).padStart(2, '0');

  // Input Field Change Handlers
  const handleHoursChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    const max = use24Hour ? 23 : 12;

    if (!isNaN(num)) {
      if (num > max) val = pad(max);
      if (val.length === 2) minutesRef.current?.focus();
    }
    emitChange({ ...time, hours: val });
  };

  const handleMinutesChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = '59';

    if (val.length === 2 && showSeconds) {
      secondsRef.current?.focus();
    }
    emitChange({ ...time, minutes: val });
  };

  const handleSecondsChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(-2);

    let num = parseInt(val, 10);
    if (!isNaN(num) && num > 59) val = '59';

    emitChange({ ...time, seconds: val });
  };

  const togglePeriod = () => {
    if (use24Hour) return;
    const nextPeriod = time.period === 'AM' ? 'PM' : 'AM';
    emitChange({ ...time, period: nextPeriod });
  };

  const handleBlur = (field) => {
    if (field === 'hours') {
      const min = use24Hour ? '00' : '12';
      const formatted = time.hours ? pad(Math.max(use24Hour ? 0 : 1, parseInt(time.hours, 10))) : min;
      emitChange({ ...time, hours: formatted });
    }
    if (field === 'minutes') {
      const formatted = time.minutes ? pad(parseInt(time.minutes, 10)) : '00';
      emitChange({ ...time, minutes: formatted });
    }
    if (field === 'seconds') {
      const formatted = time.seconds ? pad(parseInt(time.seconds, 10)) : '00';
      emitChange({ ...time, seconds: formatted });
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Container Bar */}
      <div
        className={`inline-flex items-center gap-1.5 p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all ${className}`}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-0.5 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* Hours Field */}
        <input
          ref={hoursRef}
          type="text"
          inputMode="numeric"
          placeholder="12"
          value={time.hours}
          onFocus={() => setIsOpen(true)}
          onChange={handleHoursChange}
          onBlur={() => handleBlur('hours')}
          className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
        />

        <span className="text-gray-400 font-bold select-none">:</span>

        {/* Minutes Field */}
        <input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          placeholder="00"
          value={time.minutes}
          onFocus={() => setIsOpen(true)}
          onChange={handleMinutesChange}
          onBlur={() => handleBlur('minutes')}
          className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
        />

        {/* Seconds Field (Optional) */}
        {showSeconds && (
          <>
            <span className="text-gray-400 font-bold select-none">:</span>
            <input
              ref={secondsRef}
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={time.seconds}
              onFocus={() => setIsOpen(true)}
              onChange={handleSecondsChange}
              onBlur={() => handleBlur('seconds')}
              className="w-7 text-center font-mono text-sm text-gray-800 bg-transparent focus:outline-none focus:bg-indigo-50 rounded"
            />
          </>
        )}

        {/* AM/PM Toggle */}
        {!use24Hour && (
          <button
            type="button"
            onClick={togglePeriod}
            className="ml-1 px-2 py-0.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
          >
            {time.period}
          </button>
        )}

        {/* Timezone Selector (Inline trigger) */}
        {showTimezone && (
          <div className="flex items-center pl-1 border-l border-gray-200 ml-1">
            <Globe className="w-3.5 h-3.5 text-gray-400 mr-1" />
            <select
              value={selectedTz}
              onChange={handleTzChange}
              className="text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-100 ${
            showSeconds ? 'w-80' : 'w-64'
          }`}
        >
          {/* Popover Column Headers */}
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
            <span className="flex-1">Hours</span>
            <span className="flex-1">Minutes</span>
            {showSeconds && <span className="flex-1">Seconds</span>}
            {!use24Hour && <span className="w-12">Period</span>}
          </div>

          <div className="flex h-44 gap-1">
            {/* Hours Column */}
            <div
              ref={hoursColumnRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 space-y-1 pr-1"
            >
              {hoursList.map((h) => (
                <button
                  key={h}
                  data-value={h}
                  type="button"
                  onClick={() => emitChange({ ...time, hours: h })}
                  className={`w-full text-center py-1.5 text-sm rounded-lg font-mono transition-colors ${
                    time.hours === h ? 'bg-indigo-600 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <div className="w-[1px] bg-gray-100 my-1" />

            {/* Minutes Column */}
            <div
              ref={minutesColumnRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 space-y-1 pr-1"
            >
              {sixtyList.map((m) => (
                <button
                  key={m}
                  data-value={m}
                  type="button"
                  onClick={() => emitChange({ ...time, minutes: m })}
                  className={`w-full text-center py-1.5 text-sm rounded-lg font-mono transition-colors ${
                    time.minutes === m ? 'bg-indigo-600 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Seconds Column (Optional) */}
            {showSeconds && (
              <>
                <div className="w-[1px] bg-gray-100 my-1" />
                <div
                  ref={secondsColumnRef}
                  className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 space-y-1 pr-1"
                >
                  {sixtyList.map((s) => (
                    <button
                      key={s}
                      data-value={s}
                      type="button"
                      onClick={() => emitChange({ ...time, seconds: s })}
                      className={`w-full text-center py-1.5 text-sm rounded-lg font-mono transition-colors ${
                        time.seconds === s ? 'bg-indigo-600 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* AM/PM Column */}
            {!use24Hour && (
              <>
                <div className="w-[1px] bg-gray-100 my-1" />
                <div className="w-12 flex flex-col justify-center gap-2 pl-1">
                  {['AM', 'PM'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => emitChange({ ...time, period: p })}
                      className={`w-full text-center py-2 text-xs font-bold rounded-lg transition-colors ${
                        time.period === p ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Popover Footer Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

```

---

### Example Usage

```jsx
import React, { useState } from 'react';
import CustomTimeInput from './CustomTimeInput';

export default function App() {
  const [time, setTime] = useState('02:30:45 PM');
  const [timezone, setTimezone] = useState('America/New_York');

  return (
    <div className="p-8 max-w-lg mx-auto space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Event Schedule
      </label>
      
      <CustomTimeInput
        value={time}
        timezone={timezone}
        onChange={setTime}
        onTimezoneChange={setTimezone}
        showSeconds={true}
        showTimezone={true}
      />

      <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 font-mono text-gray-600">
        <div><strong>Time:</strong> {time}</div>
        <div><strong>Timezone:</strong> {timezone}</div>
      </div>
    </div>
  );
}

```

How do I restrict the minute picker column to 15-minute or 30-minute intervals?

To restrict the minute picker column to custom step intervals (such as 15-minute or 30-minute blocks), you can add a **`minuteStep`** prop (e.g., `minuteStep = 15`) and update three areas in the component:

1. **The Popover Column List**: Generate minute options using the step increment (`00`, `15`, `30`, `45`).
2. **Blur Sanitation**: Round manual typed entries to the nearest step increment when the user leaves the input field.
3. **Keyboard Incrementing**: Adjust arrow key navigation to jump by the step interval.

---

### Key Modifications

#### 1. Dynamic Minute List Generation

Replace the 60-item minute array with a generator based on `minuteStep`:

```javascript
// Generates ['00', '15', '30', '45'] for step = 15
// Generates ['00', '30'] for step = 30
const minutesList = Array.from(
  { length: Math.floor(60 / minuteStep) },
  (_, i) => String(i * minuteStep).padStart(2, '0')
);

```

#### 2. Nearest Step Rounding Function

Add a helper function to snap any typed numeric value to the closest valid step interval:

```javascript
const roundToNearestStep = (val, step) => {
  const num = parseInt(val, 10);
  if (isNaN(num)) return '00';
  const rounded = Math.round(num / step) * step;
  const clamped = rounded >= 60 ? 60 - step : rounded;
  return String(clamped).padStart(2, '0');
};

```

---

### Updated Component Snippet

Here is how the prop and logic integrate into the component:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CustomTimeInput({
  value = '12:00 PM',
  onChange,
  use24Hour = false,
  minuteStep = 15, // 1, 5, 10, 15, 30, etc.
  className = '',
}) {
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: '12', minutes: '00', period: 'AM' };
    const parts = timeStr.split(' ');
    const [h, m] = (parts[0] || '12:00').split(':');
    return {
      hours: (h || '12').padStart(2, '0'),
      minutes: (m || '00').padStart(2, '0'),
      period: parts[1] || 'AM',
    };
  };

  const [time, setTime] = useState(() => parseTime(value));
  const [isOpen, setIsOpen] = useState(false);

  // Generate minutes based on minuteStep prop
  const minutesList = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => String(i * minuteStep).padStart(2, '0')
  );

  const hoursList = use24Hour
    ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
    : Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const emitChange = (updatedTime) => {
    setTime(updatedTime);
    if (onChange) {
      const formatted = use24Hour
        ? `${updatedTime.hours}:${updatedTime.minutes}`
        : `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.period}`;
      onChange(formatted);
    }
  };

  // Round manually entered digits to nearest valid interval on blur
  const handleBlur = (field) => {
    if (field === 'minutes') {
      const pad = (num) => String(num).padStart(2, '0');
      const num = parseInt(time.minutes, 10);
      
      let formatted = '00';
      if (!isNaN(num)) {
        const rounded = Math.round(num / minuteStep) * minuteStep;
        const clamped = rounded >= 60 ? 60 - minuteStep : rounded;
        formatted = pad(clamped);
      }
      
      emitChange({ ...time, minutes: formatted });
    }
  };

  // Arrow Up/Down key stepping
  const handleKeyDown = (e, field) => {
    if (field === 'minutes' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const current = parseInt(time.minutes || '0', 10);
      let next = e.key === 'ArrowUp' ? current + minuteStep : current - minuteStep;
      
      if (next >= 60) next = 0;
      if (next < 0) next = 60 - minuteStep;

      const pad = (num) => String(num).padStart(2, '0');
      emitChange({ ...time, minutes: pad(next) });
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Input Fields */}
      <div className={`inline-flex items-center gap-1.5 p-2 bg-white border border-gray-300 rounded-lg shadow-sm ${className}`}>
        <Clock className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={time.hours}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => emitChange({ ...time, hours: e.target.value })}
          className="w-7 text-center font-mono text-sm focus:outline-none"
        />
        <span>:</span>
        <input
          type="text"
          value={time.minutes}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => handleKeyDown(e, 'minutes')}
          onBlur={() => handleBlur('minutes')}
          onChange={(e) => emitChange({ ...time, minutes: e.target.value })}
          className="w-7 text-center font-mono text-sm focus:outline-none"
        />
      </div>

      {/* Popover Column */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex h-44 gap-1">
          {/* Hours Column */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {hoursList.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => emitChange({ ...time, hours: h })}
                className={`w-full text-center py-1.5 text-sm rounded-lg font-mono ${
                  time.hours === h ? 'bg-indigo-600 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="w-[1px] bg-gray-100" />

          {/* Stepped Minutes Column */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {minutesList.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => emitChange({ ...time, minutes: m })}
                className={`w-full text-center py-1.5 text-sm rounded-lg font-mono ${
                  time.minutes === m ? 'bg-indigo-600 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### Usage Example

Pass `minuteStep={15}` or `minuteStep={30}` as needed:

```jsx
// 15-minute intervals (00, 15, 30, 45)
<CustomTimeInput minuteStep={15} value="09:15 AM" onChange={setTime} />

// 30-minute intervals (00, 30)
<CustomTimeInput minuteStep={30} value="10:00 AM" onChange={setTime} />

```
