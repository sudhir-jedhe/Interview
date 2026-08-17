Based on the provided infographic by Eric Melillo, titled **"The Right Claude Model For Every Job,"** here is a breakdown of how to match the right model to your task to optimize performance and prevent rate-limit burn:

---

### 1. Haiku (e.g., Haiku 4.5)

* **Profile:** Fastest, cheapest ($1\times$ burn rate, 200K context).

* **Best For:** Fast, high-volume tasks with instant answers and zero reasoning overhead.

* **Pros & Cons:** Great for handling ten answers for the price of one Fable call, but falls over on real reasoning.

* **Example Prompts:**
* *"Summarize this in 3 bullets"*

* *"Clean this list into a table"*

* *"Draft 5 subject lines"*

* *"Tag these 40 leads by industry"*

* **Claude Code Command:** `/model haiku`

### 2. Sonnet (e.g., Sonnet 5 — *Default*)

* **Profile:** The daily driver ($3\times$ burn rate, 1M context). Strong enough for most tasks, cheap enough to run all day.

* **Best For:** Everyday workflow and standard development tasks.
* **Pros & Cons:** The cost-sane default, though it can top out on hard reasoning.

* **Example Prompts:**
* *"Make this email sound like me"*

* *"Turn this call into action items"*

* *"Draft a post from this idea"*

* *"Answer this client question"*

* **Claude Code Command:** `/model sonnet`

### 3. Opus (e.g., Opus 5)

* **Profile:** Deep reasoning ($5\times$ burn rate, 1M context).

* **Best For:** Hard, multi-step reasoning where the wrong answer costs more than the call (high stakes).

* **Pros & Cons:** Worth $5\times$ when the job matters, but burns limits $5\times$ faster than Haiku.

* **Example Prompts:**
* *"Stress-test this launch plan"*

* *"Find the risk in this contract"*

* *"Compare 3 plans and pick one"*

* *"Model the numbers on this deal"*

* **Claude Code Command:** `/model opus`

### 4. Fable (e.g., Fable 5)

* **Profile:** Most capable, agentic ($10\times$ burn rate, 1M context).

* **Best For:** Long jobs that run on their own. Hand it a project, not a prompt, and let it work unattended until done.

* **Pros & Cons:** Ships whole projects unattended, but 1 call costs as much as 10 Haiku calls.

* **Example Prompts:**
* *"Build and test this feature solo"*

* *"Rebuild this legacy codebase"*

* *"Run this research start to finish"*

* *"Test and document this system"*

* **Claude Code Command:** `/model fable`

---

### Effort & Strategy Takeaway

* **Effort Scale:** Ranges from **Low** (for speed) to **Max** (when being wrong is expensive), with **High** as the default setting.

* **Pro Rule of Thumb:** Stop burning your limits on simple tasks by routing lightweight parsing to **Haiku**, everyday coding and communication to **Sonnet**, deep architectural analysis to **Opus**, and autonomous background execution to **Fable**.

![alt text](1786368299928.jpeg)
