This is the perfect follow-up. Generating unit tests is arguably the highest-ROI (Return on Investment) use case for AI in frontend development. AI models are excellent at writing boilerplate Jest and React Testing Library (RTL) code, but they often hallucinate bad testing practices if you don't constrain them.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/scenario-problems/ai-generated-unit-tests.md`.

---

# Scenario: Generating Unit Tests with AI (Jest + RTL)

**The Task:** You just used AI to generate a `UserPricingPlanCard` component. Now, you need to write a robust test suite for it using Jest and React Testing Library without wasting an hour writing boilerplate `render` and `screen.getByRole` statements.

## 1. The Strategy: RTL Best Practices in 2026

Before prompting the AI, you must understand the current industry standards for React testing. If you don't explicitly tell the AI to follow these rules, it will write outdated tests:

* **Test Behavior, Not Implementation:** Avoid testing internal component state. React Testing Library is the default choice for React component tests. It focuses on testing the UI from the user's perspective.
* **Use `userEvent`:** Never use the legacy `fireEvent`. The `userEvent` utility replicates the actual series of events triggered by real user interactions (like focusing, typing, and clicking).
* **The AAA Pattern:** Tests should strictly follow the Arrange, Act, Assert structure.
* **Mock Network, Not Components:** Use tools like Mock Service Worker (MSW) to intercept network requests rather than mocking `fetch` manually.

## 2. The Master Testing Prompt

To get the AI (Claude or ChatGPT) to generate a flawless test suite, feed it the component code along with this strict constraints prompt:

```text
Act as a Senior Frontend QA Engineer. I need a comprehensive unit test suite for the attached React component using Jest and React Testing Library.

Strict Technical Constraints:
1. Use `@testing-library/react` for rendering and `screen` for querying.
2. Use `@testing-library/user-event` for ALL interactions. Do not use `fireEvent`.
3. Use `@testing-library/jest-dom` for assertions (e.g., `toBeInTheDocument`, `toBeVisible`).
4. Follow the Arrange-Act-Assert (AAA) pattern for every test block.

Test Cases Required:
- The component renders successfully with default props.
- The "Most Popular" badge displays ONLY when the `isPopular` prop is true.
- When the user clicks the "Choose Plan" button, it displays a loading state, simulates the API delay, and returns to the default state.

Do not test React's internal implementation details. Test only what the user sees and interacts with.

```

## 3. The Human Verification Phase

While AI can speed up test creation by up to 60%, humans must remain responsible for test design and maintenance. Once the AI spits out the code, you must review it for these common AI mistakes:

1. **Over-Mocking:** Did the AI mock out child components that should have been rendered? Limit mock data to only what is needed to render components independently.
2. **Bad Selectors:** Did the AI use `screen.getByTestId` everywhere? The AI should prioritize semantic queries like `screen.getByRole('button', { name: /choose plan/i })` because that is how a screen reader and an actual user find elements.
3. **Missing `await`:** When using `userEvent`, every action (like `.click()`) is asynchronous. Ensure the AI prepended `await userEvent.click(...)` and wrapped the test callback in an `async` function.

---

## 🧠 Interview Q&A: AI & Automated Testing

### Question 1: AI Test Generation Pitfalls

**Q:** *"If we let AI generate all our React Testing Library tests, what is the biggest risk to the long-term health of our codebase?"*

### Question 2: The Evolving Test Suite

**Q:** *"An AI tool just helped you achieve 100% test coverage on a new feature. Is the job done? How do you maintain these tests over the next 6 months?"*

---
