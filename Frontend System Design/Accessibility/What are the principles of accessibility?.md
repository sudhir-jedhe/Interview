In web accessibility and front-end system design, the universal foundation for accessibility is defined by the **W3C Web Content Accessibility Guidelines (WCAG)** under the **POUR** framework.

POUR stands for **Perceivable, Operable, Understandable, and Robust**. These four principles ensure that digital products can be used by everyone, including people with visual, auditory, motor, or cognitive disabilities.

---

## The 4 Principles of Accessibility (POUR)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE POUR ACCESSIBILITY FRAMEWORK                      │
│                                                                             │
│  1. PERCEIVABLE   ──► Information & UI must be presentable in ways users    │
│                       can sense (see, hear, or read).                       │
│  2. OPERABLE      ──► UI components & navigation must be usable via         │
│                       various inputs (keyboard, voice, screen readers).     │
│  3. UNDERSTANDABLE ──► Information & operation of the UI must be clear      │
│                       and predictable.                                      │
│  4. ROBUST        ──► Content must be compatible with diverse current and   │
│                       future assistive technologies.                        │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

### 1. Perceivable

*Information and user interface components must be presented to users in ways they can perceive (it cannot be invisible to all of their senses).*

* **Text Alternatives for Non-Text Content:** Provide informative `alt` text for images so screen readers can describe them to visually impaired users.
* **Captions & Transcripts:** Supply synchronized captions for video content and text transcripts for audio podcasts.
* **Adaptable Layouts:** Structure content logically using semantic HTML (`<main>`, `<nav>`, `<header>`, `<h1>-<h6>`) so information can be presented in different formats (e.g., screen reader speech or simplified reader mode) without losing meaning.
* **Distinguishable Content:** Make it easy for users to see and hear content:
* Maintain a minimum **color contrast ratio** (at least $4.5:1$ for normal text and $3:1$ for large text against its background under WCAG AA).
* **Never rely solely on color** to convey information (e.g., use an icon and text alongside red color to indicate an input error).

---

### 2. Operable

*User interface components and navigation must be operable (users must be able to operate the interface regardless of how they input commands).*

* **Keyboard Accessibility:** Ensure **100% of interactive functionality** (buttons, links, form fields, modals) can be navigated and operated using only a keyboard (`Tab`, `Enter`, `Space`, and arrow keys).
* **Visible Focus Indicator:** Provide clear visual focus outlines so keyboard-only users can identify which element currently has focus.
* **Sufficient Time:** Give users enough time to read and use content, allowing them to extend or adjust time limits on session timeouts or auto-advancing carousels.
* **Seizure Safety:** Avoid content that flashes or blinks more than three times per second to prevent photosensitive seizures.
* **Clear Navigation & Landmarks:** Provide skip links (e.g., "Skip to main content"), logical heading hierarchies, and clear page titles so users can navigate efficiently.
* **Pointer & Motion Alternatives:** Ensure gestures (swiping, pinching, or shaking the device) can also be triggered via standard single-pointer clicks or buttons.

---

### 3. Understandable

*Information and the operation of the user interface must be understandable (users must be able to comprehend the content and how the interface works).*

* **Readable Text:** Define the primary document language (`<html lang="en">`) so screen readers pronounce words correctly, and use plain, clear language.
* **Predictable Functionality:** Keep UI layouts and navigation consistent across pages. Interactive components should not trigger unexpected context shifts (such as submitting a form or opening a new page) merely upon receiving focus or input change.
* **Input Assistance & Error Handling:**
* Clearly label form fields (`<label htmlFor="...">`) and identify required inputs.
* Provide descriptive, accessible error messages that explain *how* to correct the error (`aria-describedby`).
* Allow users to review, confirm, or reverse critical submissions (e.g., financial transactions or legal forms).

---

### 4. Robust

*Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.*

* **Semantic HTML First:** Use native HTML elements (`<button>`, `<dialog>`, `<select>`) rather than re-creating them with unsemantic `<div>` or `<span>` tags.
* **Proper ARIA Usage:** When custom complex UI patterns are necessary (e.g., tabs, comboboxes, accordions), apply standard **Accessible Rich Internet Applications (ARIA)** roles, states, and properties (`aria-expanded`, `aria-selected`, `role="dialog"`).
* **Clean Code & Validation:** Ensure valid HTML syntax without duplicate IDs or broken tag nesting so browser engines and screen readers parse the DOM tree accurately.
* **Assistive Technology Compatibility:** Test UI components across diverse combinations of screen readers (NVDA, VoiceOver, JAWS) and browser engines.

---

## POUR Summary Matrix

| Principle          | Core Objective                  | Key Front-End Implementation Strategy                                             |
| ------------------ | ------------------------------- | --------------------------------------------------------------------------------- |
| **Perceivable**    | Users can see/hear the content. | High color contrast ($\ge 4.5:1$), image `alt` text, semantic HTML landmarks.     |
| **Operable**       | Users can navigate the UI.      | Full keyboard navigation (`Tab`/`Enter`), visible focus rings, no keyboard traps. |
| **Understandable** | Users comprehend the UI.        | Explicit form `<label>` elements, clear error messages, predictable navigation.   |
| **Robust**         | Assistive tools parse the UI.   | Native semantic tags, correct ARIA attributes (`aria-live`, `aria-expanded`).     |
