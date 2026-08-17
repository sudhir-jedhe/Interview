This is an excellent topic to document. As AI tools evolve, interviewers want to see that you have a structured methodology for using them, rather than just copy-pasting prompts blindly. When building a React application, AI can be integrated into every single phase of the component lifecycle.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/scenario-problems/react-ai-workflow.md`.

---

# Scenario: The AI-Powered React Workflow

**The Scenario:** *"You are tasked with building a complex new feature in our React application (e.g., a data-heavy analytics dashboard). Walk me through exactly how you use AI tools like Cursor, GitHub Copilot, and ChatGPT at each stage of the React development lifecycle."*

## Phase 1: Architecture & State Planning (The "Brainstorm" Phase)

Before writing a single line of code, the biggest mistakes in React are made in state architecture. I use conversational AI (Claude or ChatGPT) as a sounding board.

* **The Prompt:** *"I need to build an analytics dashboard in React. It has a date picker, a line chart, and a data grid. Should I lift the date state to the parent, use React Context, or put it in the URL via React Router search params?"*
* **The AI Value:** The AI helps me weigh the pros and cons of URL state vs. Context, helping me prevent prop-drilling before I even start typing.

## Phase 2: Bootstrapping & Component Generation (The "Drafting" Phase)

Once the architecture is decided, I move to my IDE (using Cursor or GitHub Copilot) to generate the boilerplate.

* **Generating UI:** Instead of writing tedious JSX and Tailwind CSS classes from scratch, I use inline IDE prompts.
* *Prompt:* `Generate a responsive React functional component for a User Card using Tailwind. It should accept props for name, avatar, and role.`

* **Generating Custom Hooks:** AI is exceptionally good at abstracting React logic.
* *Prompt:* `Write a custom useFetch hook that takes a URL, handles loading/error states, and uses an AbortController to cancel the request if the component unmounts.`

## Phase 3: Debugging & Refactoring (The "Optimization" Phase)

React has specific gotchas (like stale closures or infinite re-renders). AI is my pair-programmer for fixing these.

* **Fixing `useEffect` Nightmares:** If a component is infinitely re-rendering, I highlight the code in my IDE and ask the AI to find the missing dependency or memoization issue.
* *Prompt:* `This useEffect is causing an infinite loop. Identify why the dependency array is triggering on every render and fix it using useCallback or useMemo.`

* **Deciphering React Errors:** When the console throws a massive, cryptic React error (like *"Maximum update depth exceeded"*), I feed the error trace and the component code to the AI to pinpoint the exact line causing the state cascade.

## Phase 4: Automated Testing (The "Coverage" Phase)

Writing tests in React Testing Library (RTL) can be repetitive. AI drastically speeds up this process.

* **Generating the Skeleton:** I highlight my completed React component and prompt the AI:
* *Prompt:* `Write a Jest and React Testing Library suite for this component. Include a test for the initial render, a test simulating a button click event using userEvent, and a test verifying the error state appears when the mock API fails.`

* **Human Verification:** AI often struggles with complex asynchronous RTL queries (like confusing `getBy` with `findBy`). I manually review the generated tests to ensure they are testing *behavior* (what the user sees), not *implementation details* (internal state).

---

## 🧠 Interview Q&A: React + AI

Add these questions to your Q&A section to prove you understand the limits of AI in React.

### Question 1: AI and React Performance

**Q:** *"If you ask an AI to build a complex React list component, it will usually give you working code. But what React performance principles do AI models frequently forget or implement poorly?"*

### Question 2: The "Stale Closure" Trap

**Q:** *"You use Copilot to generate a `setInterval` inside a `useEffect` that reads a piece of React state. The state updates, but the interval keeps logging the initial value. Why did the AI fail here, and how do you fix it?"*

### Question 3: Component Library Hallucinations

**Q:** *"You prompt the AI to build a modal using Material-UI (MUI) or Ant Design. The code looks perfect, but when you run it, React throws an 'Export not found' error. What happened?"*
