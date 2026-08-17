This is a highly practical guide to add to your repository. Prompt engineering for UI components is a specific skill. Because Claude features "Artifacts" (a live browser environment inside the chat), you can iteratively design and test a React component visually before ever pasting it into your local codebase.

> **Repo Organization Tip:** Save this content inside `10-Modern-Dev-Workflows/scenario-problems/claude-component-generation.md`.

---

# Scenario: Generating React Components with Claude

**The Task:** You need to build a reusable UI component. Instead of writing the boilerplate, CSS, and basic state manually, you want to use Claude to generate a production-ready component that you can instantly preview.

## The Strategy: The "Zero-Shot" Component Prompt

To get a perfect component on the first try, your prompt must act like a strict Jira ticket. It needs four ingredients:

1. **The Tech Stack:** (e.g., React, Tailwind, Lucide Icons, TypeScript).
2. **The Visual Layout:** (e.g., Card, Flexbox, Sidebar).
3. **The Data/Props:** (What data does it ingest?)
4. **The Interactivity/State:** (What happens when the user clicks?)

### Step 1: The Master Prompt

Here is the exact template you should use when asking Claude to build a component:

```text
Act as an expert Frontend React Developer. 
I need a responsive React component for a "User Pricing Plan Card".

Tech Stack Constraints:
- Use React (Functional components with hooks).
- Use Tailwind CSS for all styling.
- Use 'lucide-react' for icons.
- Do NOT use any external component libraries (like MUI or Radix).

Props/Data Requirements:
- planName (string)
- price (number)
- features (array of strings)
- isPopular (boolean)

Visual & State Requirements:
- The card should have a white background, rounded corners, and a subtle shadow.
- If `isPopular` is true, add a purple border and a "Most Popular" badge at the top.
- Include a "Choose Plan" button. 
- Create a local state called `isLoading`. When the button is clicked, set `isLoading` to true, simulate a 2-second API delay, then set it back to false. The button should show a loading spinner while true.

Render this entirely within a Claude Artifact so I can interact with it.

```

### Step 2: Utilizing the Claude Artifact

When you send this prompt, Claude will not just output text. It will open a side panel (the Artifact) showing the actual rendered React component.

This is where the magic happens:

* **Interact:** Click the "Choose Plan" button directly in the chat to see if the loading state works correctly.
* **Inspect:** Resize your browser window to ensure the Tailwind classes made it responsive.

### Step 3: The Iteration Loop

Rarely is the first output 100% perfect for your specific app. Instead of fixing it locally, use Claude to iterate visually:

* **Prompt:** *"The loading spinner works, but the 'Most Popular' badge overlaps with the `planName`. Move the badge to the top-right corner using absolute positioning, and make the button color change on hover."*

### Step 4: Exporting to Your Codebase

Once the Artifact behaves exactly as required, click the "Copy Code" button in Claude. Paste it into your codebase, knowing the logic, state, and styling are already validated.

---

## 🧠 Key Interview Talking Points

If an interviewer asks, *"How do you write prompts for AI to generate code?"* use these talking points to sound like a senior engineer:

1. **"I constraint the AI's creativity."**
"AI tends to hallucinate libraries or use outdated syntax. I explicitly define the stack (e.g., 'Use Tailwind, do NOT use CSS modules') to ensure the output perfectly matches our codebase conventions."
2. **"I separate data from presentation in my prompts."**
"I explicitly list the TypeScript interfaces or prop structures I want the component to accept. This ensures the AI doesn't hardcode data and builds a truly reusable component."
3. **"I use AI for the 'Happy Path', and my brain for the Edge Cases."**
"I use Claude to generate the boilerplate layout and basic state interactions to save time. But once it's in my codebase, I manually review it for accessibility (ARIA tags) and complex edge cases that the AI might have missed."

---

Would you like to document how to use AI to generate the Unit Tests (Jest/RTL) for this newly created component next?
