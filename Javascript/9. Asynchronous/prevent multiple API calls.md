To prevent multiple API calls when a user rapidly clicks a login button, you can use a combination of **UI state management** (disabling the button) and **functional techniques** like **debouncing** or **throttling**.

Here is a breakdown of how to implement these concepts, particularly within asynchronous event handling in Java (such as in JavaFX, Android, or backend reactive streams).

---

### 1. Disabling the Button During Request (Recommended for UI)

The most common and user-friendly way to prevent duplicate submissions is to immediately disable the button when the click event is triggered, and re-enable it only after the asynchronous API call completes (whether it succeeds or fails).

* **Concept:** The event handler checks a flag or directly disables the UI component, executes the async task, and restores the button state in a callback (`finally` block).
* **Java (JavaFX / Android Example):**

```java
loginButton.setOnAction(event -> {
    loginButton.setDisable(true); // Disable immediately

    CompletableFuture.runAsync(() -> {
        // Perform network request
        authService.login(username, password);
    }).whenComplete((result, throwable) -> {
        // Re-enable on the UI thread
        Platform.runLater(() -> loginButton.setDisable(false));
    });
});

```

---

### 2. Throttling the Event Handler

**Throttling** ensures that even if the button is clicked 5 times in one second, the underlying login function is only executed **once per specified time window** (e.g., once every 2 seconds). Any extra clicks within that window are completely ignored.

* **Concept:** Maintain a timestamp of the last execution. If the current click happens before the cooldown period has elapsed, discard the event.
* **Java Implementation Example:**

```java
public class ThrottledClickListener implements EventHandler<ActionEvent> {
    private final long cooldownMillis;
    private long lastClickTime = 0;
    private final Runnable action;

    public ThrottledClickListener(long cooldownMillis, Runnable action) {
        this.cooldownMillis = cooldownMillis;
        this.action = action;
    }

    @Override
    public void handle(ActionEvent event) {
        long now = System.currentTimeMillis();
        if (now - lastClickTime >= cooldownMillis) {
            lastClickTime = now;
            action.run(); // Execute login
        }
    }
}

```

---

### 3. Debouncing the Event Handler

**Debouncing** delays the execution of the action until a specific amount of time has passed *since the last click*. If the user keeps clicking rapidly, the timer resets with every click, meaning the API call will only fire after the user completely stops clicking.

> [!NOTE]
> Debouncing is generally **not recommended for login buttons** because it delays the initial login request, making the app feel laggy. It is better suited for search bars or auto-save features.

* **Concept:** Use a scheduler or timer to delay execution, cancelling any previously scheduled tasks if a new click comes in.
* **Java Implementation Example (using `ScheduledExecutorService`):**

```java
public class DebouncedClickListener {
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private ScheduledFuture<?> scheduledTask;

    public void onClick(Runnable action) {
        // Cancel the previous task if it hasn't run yet
        if (scheduledTask != null && !scheduledTask.isDone()) {
            scheduledTask.cancel(false);
        }

        // Schedule the action to run after 500ms of inactivity
        scheduledTask = scheduler.schedule(action, 500, TimeUnit.MILLISECONDS);
    }
}

```

---

### Summary: Which should you choose?

| Approach           | Best Used For                             | Behavior on Rapid Clicks                                                |
| ------------------ | ----------------------------------------- | ----------------------------------------------------------------------- |
| **Disable Button** | **Login & Form Submissions**              | Blocks clicks visually until the async response returns.                |
| **Throttling**     | Button clicks, window resizing, scrolling | Executes the first click, ignores subsequent clicks for a set duration. |
| **Debouncing**     | Search inputs, auto-save                  | Waits until the user *stops* clicking/typing entirely before executing. |

So why not just trust the back end?

Relying solely on the backend to handle duplicate requests is a common anti-pattern for user-facing actions like logins or payments. While the backend **must** have validation and safeguards (like database unique constraints or idempotency keys), handling it strictly on the backend introduces several major drawbacks:

---

### Why Frontend Prevention is Crucial

* **1. Network Latency and Wasted Bandwidth:**
If a user clicks a button 5 times very quickly and you don't stop it on the frontend, your browser or app will fire 5 separate HTTP requests simultaneously. Even if the backend successfully rejects 4 of them, those requests still travel across the network, consume server resources, tie up database connections, and waste bandwidth.
* **2. Poor User Experience (UX):**
If the backend processes the first request and rejects the subsequent 4 as duplicates, the backend might return error codes (like `409 Conflict` or `429 Too Many Requests`). Translating those errors into a clean UI state is messy and can confuse the user with error messages or unexpected loading spinners flickering multiple times.
* **3. Race Conditions (Double Submissions):**
Even with backend validation, if two requests arrive milliseconds apart before the first one has finished writing to the database (e.g., checking if a username already exists during registration), a race condition can occur, potentially bypassing backend checks unless strict database locks or **idempotency keys** are implemented.

---

### The Ideal Architecture: Defense in Depth

The best software engineering approach is **Defense in Depth**—combining frontend prevention with backend protection:

1. **Frontend (The UX & Traffic Guard):**
Disables the button instantly to stop accidental multi-clicks, provides immediate visual feedback, and prevents garbage traffic from ever hitting your servers.
2. **Backend (The Data Integrity Guard):**
Validates the incoming payload, enforces business rules, and uses **Idempotency Keys** or unique database constraints to guarantee that even if a network glitch or malicious user bypasses the frontend, the backend will never process the exact same transaction twice.
