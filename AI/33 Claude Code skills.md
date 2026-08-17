This PDF guide, titled **"I tried 33 Claude Code skills. These are the best."** by Ashwini (Senior AI/ML Engineer), highlights the top 6 skills that allow Claude Code to effectively plan, test, and review its own work.

---

### 🛠️ Setup: How to Install a Skill

1. **Open Claude Code** in your terminal.

2. **Paste the skill's install command**.

3. **If it has its own marketplace**, add it first.

4. **Restart Claude Code** to pick it up.
*Note: Most skills install in under a minute; install the ones you use everywhere "globally."*

---

### 🌟 The 6 Best Claude Code Skills

#### 1. Skill Creator

* **What it does:** The official Anthropic skill that builds other skills. You describe a task in plain English (like explaining it to a coworker), and Claude drafts, tests, and packages it into something you can reuse forever.

* **Install Command:**

```bash
/plugin install skill-creator@claude-plugins-official

```

* **Why use it:** Every custom skill you make later comes out of this.

#### 2. Grill Me (by Matt Pocock)

* **What it does:** Claude loves to rush into a plan and output code before understanding what you want. This skill interviews you relentlessly (16 questions in a session, or 30–50 on bigger features) down every branch before writing a single line of code.

* **Install Command:**

```bash
npx skills@latest add mattpocock/skills -s grill-me -g

```

* **Why use it:** Most mistakes come from Claude guessing. Grilling kills the guessing.

#### 3. Superpowers

* **What it does:** Slows Claude down so it doesn't sprint out of the gate and write broken code. It forces Claude to plan the whole thing first, work in an isolated environment so nothing breaks your main project, and write tests before code while reviewing its own work twice.

* **Install Command:**

```bash
/plugin install superpowers@claude-plugins-official

```

* **Why use it:** Slowing Claude down just enough gets your first pass to 80% accuracy, not 60%.

#### 4. Frontend Design

* **What it does:** Fixes the generic, "AI-generated" look of websites, slide decks, landing pages, and UI components by applying professional design standards.

* **Install Command:**

```bash
/plugin install frontend-design@claude-plugins-official

```

* **Why use it:** The official Anthropic skill for making what Claude builds actually look good.

#### 5. Context Mode

* **What it does:** After ~30 minutes, Claude's memory typically gets sluggish and starts forgetting files. Context mode filters out the junk, keeps a running session log of files edited and tasks in progress, and picks up right where you left off even after Claude resets.

* **Install Command (Marketplace + Install):**

```bash
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode

```

* **Why use it:** Sessions that used to die at the 30-minute mark now run for hours.

#### 6. Claude Mem

* **What it does:** Claude Code normally starts every new session from scratch, forcing you to re-explain the project. Claude Mem captures what happened (file edits, decisions, bug fixes), compresses it into summaries stored locally on your machine, and pulls the relevant parts back automatically in every new session.

* **Install Command (Marketplace + Install):**

```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem

```

* **Why use it:** It writes and updates your project notes while you work so you never repeat yourself.

---

### 🔍 Bonus: Built-In Comparison (`/review` vs `/ultra-review`)

* **`/review`:** Provides a structured review of what you just built, hunts bugs, edge cases, and design issues. It is fast, free, and designed to be used on everything.

* **`/ultra-review`:** Sends work to the cloud where a team of agents attacks every angle. Best saved for high-stakes changes like payments, databases, and massive architecture shifts.

---

### 💡 Golden Rule for Adoption

**Don't install them all at once.** That is the fastest way to get overwhelmed and use none of them. Instead:

1. **Pick one** (start with *Skill Creator* or *Grill Me*).

2. **Learn it** by building a few things with it.

3. **Then add the next** one skill at a time.

[text](1786368926903.pdf)
