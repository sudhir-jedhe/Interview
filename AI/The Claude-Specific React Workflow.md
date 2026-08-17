Adding a specific section on **Claude** is highly relevant right now. While GitHub Copilot is great for line-by-line autocomplete inside your IDE, Claude (specifically the Claude 3.5 Sonnet model) has become the industry favorite for frontend developers due to two major features: its **massive context window** and **Claude Artifacts** (the ability to visually render React components right in the chat).

Here is how you can document a Claude-specific workflow for your repository.

> **Repo Organization Tip:** Save this content as a sub-section inside `10-Modern-Dev-Workflows/scenario-problems/react-ai-workflow.md` or as a dedicated file like `claude-specific-workflow.md`.

---

# Scenario: The Claude-Specific React Workflow

**The Question:** *"How do you specifically leverage Claude in your React development process compared to an inline tool like GitHub Copilot?"*

## 1. UI Prototyping with Claude Artifacts

Unlike other LLMs that just spit out raw text, Claude features "Artifacts." It can write a React component and actually render it visually in the browser chat window, complete with interactive state and Tailwind CSS.

* **The Workflow:** When starting a new UI feature, I don't build it in my IDE first. I build the prototype in Claude.
* **The Prompt:** *"Create a React component for a Kanban board using Tailwind CSS and Lucide React icons. It needs three columns (To Do, In Progress, Done). Make the cards draggable and include a button to add a new task. Render this as an Artifact so I can test the UI."*
* **The Value:** I can click the buttons and test the layout visually in Claude. Once the prototype looks exactly how the designer intended, I copy the code into my actual codebase to wire up the real backend APIs.

## 2. Multi-File Context Refactoring

GitHub Copilot struggles when a bug spans across multiple files. Claude has a massive context window (200K+ tokens), meaning I can upload entire folder structures to it.

* **The Workflow:** If I am migrating a legacy app from Redux to Zustand, or upgrading React Router v5 to v6, I upload the exact files involved.
* **The Prompt:** I upload `App.jsx`, `routes.js`, and `authReducer.js` into Claude and prompt: *"I am refactoring this app from Redux to Zustand. Read these three files. Create a new Zustand store file that replicates the Redux logic, and rewrite the App component to consume the new Zustand store instead of the Redux Provider."*
* **The Value:** Claude understands how the files connect to each other and rewrites the architecture holistically, rather than guessing line-by-line.

## 3. Unblocking Cryptic Build Errors

When Vite, Webpack, or TypeScript throw a 50-line wall of red text in the terminal, it is often a dependency conflict deep in the `node_modules`.

* **The Workflow:** I copy my `package.json`, my `vite.config.js`, and the entire terminal error log, and dump it all into Claude.
* **The Prompt:** *"My React build is failing with this ESM module resolution error. Here is the error trace, my package.json, and my bundler config. Identify the conflicting package and give me the exact npm command to fix the resolution."*

---

## 🧠 Interview Q&A: Claude vs. Copilot

### Question 1: Choosing the Right Tool

**Q:** *"You have access to both GitHub Copilot and Claude. In what scenario would you explicitly choose to use Claude over Copilot, and vice versa?"*

---
