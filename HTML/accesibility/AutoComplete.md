# Accessible Autocomplete (Combobox) in React

Autocomplete is one of the **most difficult accessibility components** because it combines:

```text
Input
+
Dropdown
+
Keyboard Navigation
+
Focus Management
+
Screen Reader Support
```

WCAG recommends following the **WAI-ARIA Combobox Pattern**.

***

# Required ARIA Attributes

| Attribute               | Purpose                         |
| ----------------------- | ------------------------------- |
| `role="combobox"`       | Identifies autocomplete control |
| `aria-expanded`         | Dropdown open/closed state      |
| `aria-controls`         | Connects input to listbox       |
| `aria-activedescendant` | Active option                   |
| `aria-autocomplete`     | Type of autocomplete            |
| `role="listbox"`        | Dropdown list                   |
| `role="option"`         | Each option                     |
| `aria-selected`         | Selected option                 |

***

# Complete Accessible React Autocomplete

```jsx
import React, {
  useState,
  useRef
} from "react";

const skills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Angular",
  "Vue"
];

export default function AccessibleAutocomplete() {
  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [activeIndex, setActiveIndex] =
    useState(-1);

  const inputRef = useRef(null);

  const filteredOptions =
    skills.filter(skill =>
      skill
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
    );

  const handleKeyDown = e => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        setOpen(true);

        setActiveIndex(prev =>
          Math.min(
            prev + 1,
            filteredOptions.length - 1
          )
        );
        break;

      case "ArrowUp":
        e.preventDefault();

        setActiveIndex(prev =>
          Math.max(prev - 1, 0)
        );
        break;

      case "Enter":
        if (
          activeIndex >= 0
        ) {
          setQuery(
            filteredOptions[
              activeIndex
            ]
          );

          setOpen(false);

          setActiveIndex(-1);
        }
        break;

      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;

      default:
        break;
    }
  };

  return (
    <div
      style={{
        width: 300
      }}
    >
      <label htmlFor="skill">
        Skill
      </label>

      <input
        ref={inputRef}
        id="skill"
        type="text"
        value={query}
        onChange={e => {
          setQuery(
            e.target.value
          );
          setOpen(true);
        }}
        onKeyDown={
          handleKeyDown
        }
        role="combobox"
        aria-expanded={open}
        aria-controls="skills-listbox"
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0
            ? `option-${activeIndex}`
            : undefined
        }
      />

      {open &&
        filteredOptions
          .length > 0 && (
          <ul
            id="skills-listbox"
            role="listbox"
            style={{
              border:
                "1px solid #ccc",
              padding: 0,
              margin: 0,
              listStyle:
                "none"
            }}
          >
            {filteredOptions.map(
              (
                option,
                index
              ) => (
                <li
                  key={option}
                  id={`option-${index}`}
                  role="option"
                  aria-selected={
                    activeIndex ===
                    index
                  }
                  style={{
                    padding:
                      "8px",
                    background:
                      activeIndex ===
                      index
                        ? "#dbeafe"
                        : "white"
                  }}
                  onMouseDown={() => {
                    setQuery(
                      option
                    );

                    setOpen(
                      false
                    );
                  }}
                >
                  {option}
                </li>
              )
            )}
          </ul>
        )}
    </div>
  );
}
```

***

# Keyboard Support

Users must be able to:

```text
TAB
↓
Focus Input

Type "Re"
↓
React appears

Arrow Down
↓
Highlight React

Enter
↓
Select React

Escape
↓
Close Dropdown
```

***

# Understanding `aria-activedescendant`

Instead of moving focus into the list:

```text
Input stays focused
```

Screen reader is informed which option is active.

```jsx
aria-activedescendant="option-1"
```

***

# ARIA Autocomplete Values

## List Autocomplete

```jsx
aria-autocomplete="list"
```

Shows suggestions.

Example:

```text
Re
↓
React
Redux
```

***

## Inline Autocomplete

```jsx
aria-autocomplete="inline"
```

Example:

```text
Re
↓
React
```

completion appears inline.

***

## Both

```jsx
aria-autocomplete="both"
```

Uses:

```text
Inline Completion
+
Dropdown Suggestions
```

***

# Screen Reader Announcement

When user types:

```text
Re
```

Screen reader may announce:

```text
Skill
Combobox

2 suggestions available

React

Redux
```

***

# Focus Management Strategy

### Open Dropdown

Keep focus on input.

```jsx
<input />
```

Do NOT move focus to listbox.

***

### Arrow Keys

Update:

```jsx
aria-activedescendant
```

instead of moving focus.

***

### Enter

Select option.

***

### Escape

Close dropdown.

***

### Tab

Accept current value and move to next field.

***

# Real Enterprise Autocomplete Examples

Used in:

```text
Employee Search
Country Search
Skill Search
Product Search
Customer Lookup
```

Common ARIA Pattern:

```jsx
role="combobox"
aria-expanded
aria-controls
aria-activedescendant

role="listbox"

role="option"
aria-selected
```

***

# Common Accessibility Mistakes

### ❌ Missing Label

```jsx
<input />
```

### ✅

```jsx
<label htmlFor="skill">
  Skill
</label>
```

***

### ❌ Clickable Div Dropdown

```jsx
<div
  onClick={}
>
```

without keyboard support.

***

### ❌ Moving Focus into Dropdown

Bad UX.

Focus should remain in:

```jsx
<input />
```

while using:

```jsx
aria-activedescendant
```

***

### ❌ Missing Escape Support

Users must be able to close suggestions:

```text
ESC
```

***

# Senior React Interview Answer

> An accessible autocomplete should follow the WAI-ARIA Combobox pattern. The input uses `role="combobox"` with `aria-expanded`, `aria-controls`, and `aria-activedescendant`. Suggestions are rendered inside a `listbox` with `option` elements and keyboard support for Arrow keys, Enter, Escape, and Tab. Focus remains on the input while the active option is communicated through `aria-activedescendant`, ensuring a fully keyboard-accessible and screen-reader-friendly experience.
# Accessible React Autocomplete (Combobox) with Keyboard Navigation + `aria-activedescendant` + Form Integration

This is the **WAI-ARIA Authoring Practices compliant Combobox pattern** commonly asked in React, WCAG, and Accessibility interviews.

***

# What is `aria-activedescendant`?

Normally focus moves between elements:

```text
Input
↓
Option 1
↓
Option 2
↓
Option 3
```

For an accessible autocomplete, focus should remain on the input.

```text
Input (focus stays here)
↓
Arrow Down
↓
Option 1 highlighted

Arrow Down
↓
Option 2 highlighted
```

Screen readers are informed about the active option using:

```jsx
aria-activedescendant="option-1"
```

The active option is announced even though actual keyboard focus never leaves the input.

***

# Keyboard Navigation Requirements

| Key        | Behaviour                           |
| ---------- | ----------------------------------- |
| Tab        | Move to input                       |
| Arrow Down | Next option                         |
| Arrow Up   | Previous option                     |
| Enter      | Select option                       |
| Escape     | Close list                          |
| Tab        | Accept value and move to next field |

***

# Complete Accessible React Autocomplete + Form

```jsx
import React, {
  useState,
  useRef,
  useId
} from "react";

const SKILLS = [
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Next.js"
];

export default function EmployeeForm() {
  const [skill, setSkill] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [activeIndex, setActiveIndex] =
    useState(-1);

  const [submitted, setSubmitted] =
    useState(false);

  const inputId = useId();

  const filteredOptions =
    SKILLS.filter(item =>
      item
        .toLowerCase()
        .includes(
          skill.toLowerCase()
        )
    );

  const selectOption = value => {
    setSkill(value);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = event => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setOpen(true);

        setActiveIndex(prev =>
          Math.min(
            prev + 1,
            filteredOptions.length - 1
          )
        );
        break;

      case "ArrowUp":
        event.preventDefault();

        setActiveIndex(prev =>
          Math.max(prev - 1, 0)
        );
        break;

      case "Enter":
        if (
          open &&
          activeIndex >= 0
        ) {
          event.preventDefault();

          selectOption(
            filteredOptions[
              activeIndex
            ]
          );
        }
        break;

      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;

      default:
        break;
    }
  };

  const submitForm = e => {
    e.preventDefault();

    setSubmitted(true);
  };

  return (
    <form
      onSubmit={submitForm}
      style={{
        maxWidth: "400px"
      }}
    >
      <h2>
        Employee Registration
      </h2>

      {/* Name */}

      <label htmlFor="name">
        Employee Name
      </label>

      <input
        id="name"
        type="text"
      />

      <br />
      <br />

      {/* Accessible Combobox */}

      <label htmlFor={inputId}>
        Primary Skill
      </label>

      <input
        id={inputId}
        type="text"
        value={skill}
        onChange={e => {
          setSkill(
            e.target.value
          );

          setOpen(true);

          setActiveIndex(-1);
        }}
        onKeyDown={
          handleKeyDown
        }
        onFocus={() =>
          setOpen(true)
        }
        role="combobox"
        aria-expanded={open}
        aria-controls="skills-listbox"
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0
            ? `option-${activeIndex}`
            : undefined
        }
        aria-describedby="skill-help"
      />

      <div id="skill-help">
        Use Arrow keys and Enter
        to select a skill.
      </div>

      {open &&
        filteredOptions
          .length > 0 && (
          <ul
            id="skills-listbox"
            role="listbox"
            aria-label="Skills"
            style={{
              border:
                "1px solid #ccc",
              padding: 0,
              marginTop: 4,
              listStyle:
                "none",
              maxHeight:
                "200px",
              overflowY:
                "auto"
            }}
          >
            {filteredOptions.map(
              (
                option,
                index
              ) => (
                <li
                  key={option}
                  id={`option-${index}`}
                  role="option"
                  aria-selected={
                    activeIndex ===
                    index
                  }
                  onMouseDown={() =>
                    selectOption(
                      option
                    )
                  }
                  style={{
                    padding:
                      "8px",
                    backgroundColor:
                      activeIndex ===
                      index
                        ? "#dbeafe"
                        : "white",
                    cursor:
                      "pointer"
                  }}
                >
                  {option}
                </li>
              )
            )}
          </ul>
        )}

      <br />

      <button
        type="submit"
      >
        Submit
      </button>

      {/* Live Region */}

      <div
        role="status"
        aria-live="polite"
      >
        {submitted &&
          `Submitted Skill: ${skill}`}
      </div>
    </form>
  );
}
```

***

# Accessibility Features Used

## Input

```jsx
role="combobox"
```

Tells screen readers:

```text
This is a combobox/autocomplete
```

***

## Dropdown Relationship

```jsx
aria-controls="skills-listbox"
```

Connects:

```text
Input
↓
Dropdown List
```

***

## Dropdown State

```jsx
aria-expanded={open}
```

Screen reader:

```text
Expanded
```

or

```text
Collapsed
```

***

## Active Option

```jsx
aria-activedescendant
```

Example:

```jsx
aria-activedescendant="option-2"
```

Screen reader announces:

```text
TypeScript
```

while focus stays on the input.

***

## Listbox

```jsx
role="listbox"
```

Identifies suggestions container.

***

## Option

```jsx
role="option"
```

Identifies each selectable item.

***

## Selected State

```jsx
aria-selected={true}
```

Announces:

```text
Selected
```

***

## Instructions

```jsx
aria-describedby
```

Provides keyboard guidance.

***

## Submission Status

```jsx
role="status"
aria-live="polite"
```

Screen reader announces successful submission without moving focus.

***

# Focus Flow

```text
Tab
↓
Skill Input

Type "Re"
↓
React displayed

Arrow Down
↓
React highlighted

Arrow Down
↓
Redux highlighted

Enter
↓
Select Redux

Tab
↓
Submit Button
```

***

# Senior React Interview Answer

> An accessible React autocomplete should implement the WAI-ARIA Combobox pattern using `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"`, and `role="option"`. Focus must remain on the input while keyboard navigation updates the active option through `aria-activedescendant`. The component should support Arrow keys, Enter, Escape, and Tab, provide instructions through `aria-describedby`, and announce changes using live regions where appropriate. This ensures proper keyboard and screen-reader accessibility in compliance with WCAG guidelines.
