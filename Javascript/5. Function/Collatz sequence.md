The Collatz sequence is a fascinating sequence that begins with any positive integer and proceeds by applying the following rules until the number becomes 1:

- If the number is even, divide it by 2.
- If the number is odd, multiply it by 3 and then add 1.

The sequence ends when the number reaches 1.

### Explanation of the Two Versions of Collatz

You've implemented **two versions** of the Collatz sequence:

1. **Iterative Version** (`collatz`):
   - This version uses a `while` loop to continuously apply the Collatz operations until the number reaches 1.
   - At each step, the number is printed, and the sequence is updated based on whether the number is even or odd.
   - The loop runs until `num` equals 1, and the final number (1) is printed at the end.

2. **Tail Recursive Version** (`collatzTail`):
   - This version uses **tail recursion** to achieve the same result as the iterative version, but the logic is expressed in a recursive manner.
   - Instead of using a loop, it calls itself with the updated number (`num / 2` for even numbers, or `3 * num + 1` for odd numbers).
   - A `store` array is passed along to store the sequence of numbers as the recursion proceeds.

### Code Implementation

Here’s the breakdown of each function:

#### 1. Iterative Collatz Sequence (`collatz`):

```javascript
let collatz = (num) => {
  // Loop until the given num is not 1
  while (num != 1) {
    console.log(num); // Print the current number

    // If the number is even
    if (num % 2 == 0) {
      num = parseInt(num / 2); // Divide by 2 for even numbers
    } else {
      // If the number is odd
      num = num * 3 + 1; // Multiply by 3 and add 1 for odd numbers
    }
  }

  // Print the last number (1)
  console.log(num);
};
```

#### Example:

```javascript
collatz(6);
// Output: 6, 3, 10, 5, 16, 8, 4, 2, 1
```

#### 2. Tail Recursive Collatz Sequence (`collatzTail`):

```javascript
let collatzTail = (num, store = []) => {
  // If num is 1, add it to the store array and return
  if (num === 1) {
    store.push(1);
    return store;
  }

  // If num is even, store num / 2 and recurse
  else if (num % 2 === 0) {
    store.push(num);
    return collatzTail(parseInt(num / 2), store);
  }
  // If num is odd, store num * 3 + 1 and recurse
  else {
    store.push(num);
    return collatzTail(3 * num + 1, store);
  }
};
```

#### Example:

```javascript
console.log(collatzTail(6));
// Output: [6, 3, 10, 5, 16, 8, 4, 2, 1]
```

### Differences Between the Two Versions:

1. **Iteration vs Recursion**:
   - The **iterative version** uses a loop (`while`), which is the standard and efficient approach for tasks like the Collatz sequence.
   - The **recursive version** uses a function that calls itself, and this technique is known as **tail recursion**. It's not as efficient as the iterative approach for larger numbers due to the stack frame overhead but is often used to showcase recursive patterns.

2. **State Management**:
   - In the **iterative version**, the sequence of numbers is printed directly at each step.
   - In the **recursive version**, the numbers are stored in the `store` array and returned as the result at the end of recursion.

3. **Termination**:
   - Both versions stop when the number reaches `1`, but the iterative version prints the numbers in the process, while the recursive version builds a list of the numbers and returns it.

### Conclusion:

Both implementations are correct and give you the Collatz sequence for any starting number. The iterative version is more straightforward, while the tail-recursive version might be preferred in situations where recursion is the favored style or for functional programming enthusiasts.

However, for large numbers, **iteration** tends to be more efficient in JavaScript due to the function call stack limit and the potential for stack overflow errors with deep recursion.

The Collatz sequence is a fascinating sequence that begins with any positive integer and proceeds by applying the following rules until the number becomes 1:

- If the number is even, divide it by 2.
- If the number is odd, multiply it by 3 and then add 1.

Write a self-contained HTML and JavaScript app with interactive sliders to graph Collatz paths.

Here is a complete, self-contained HTML file. It includes an interactive chart, a custom slider with number input, real-time metrics (steps, peak height, and odd/even distribution), and a comparison mode that lets you overlay two numbers to see where their paths merge.

Save the code below as an `.html` file (e.g., `collatz.html`) and open it in any web browser:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Collatz Sequence Visualizer</title>
    <style>
      :root {
        --bg: #0f172a;
        --card: #1e293b;
        --accent: #38bdf8;
        --accent-alt: #f43f5e;
        --text: #f8fafc;
        --text-muted: #94a3b8;
        --border: #334155;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
      }

      body {
        background-color: var(--bg);
        color: var(--text);
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }

      .container {
        width: 100%;
        max-width: 900px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      }

      header {
        margin-bottom: 20px;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 6px;
        color: var(--accent);
      }

      p.subtitle {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        background: #0f172a80;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      @media (max-width: 600px) {
        .controls {
          grid-template-columns: 1fr;
        }
      }

      .control-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .control-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .inputs {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      input[type="range"] {
        flex: 1;
        accent-color: var(--accent);
        cursor: pointer;
      }

      input[type="number"] {
        width: 90px;
        background: var(--bg);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 6px 10px;
        border-radius: 6px;
        font-weight: bold;
      }

      .toggle-group {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        margin-top: 10px;
        cursor: pointer;
      }

      .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }

      .metric-card {
        background: #0f172a50;
        border: 1px solid var(--border);
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }

      .metric-card .title {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .metric-card .value {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--accent);
      }

      .canvas-container {
        position: relative;
        width: 100%;
        height: 380px;
        background: var(--bg);
        border-radius: 8px;
        border: 1px solid var(--border);
        overflow: hidden;
      }

      canvas {
        width: 100%;
        height: 100%;
        display: block;
      }

      .legend {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        font-size: 0.8rem;
        margin-top: 10px;
        color: var(--text-muted);
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 3px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Collatz Sequence Visualizer</h1>
        <p class="subtitle">If even: n ÷ 2 &nbsp;|&nbsp; If odd: 3n + 1</p>
      </header>

      <div class="controls">
        <div class="control-group">
          <div class="control-header">
            <label for="num1-slider" style="color: var(--accent);"
              >Primary Number (N1)</label
            >
          </div>
          <div class="inputs">
            <input
              type="range"
              id="num1-slider"
              min="1"
              max="1000"
              value="27"
            />
            <input
              type="number"
              id="num1-input"
              min="1"
              max="1000000"
              value="27"
            />
          </div>
        </div>

        <div class="control-group">
          <div class="control-header">
            <label for="num2-slider" style="color: var(--accent-alt);"
              >Comparison Number (N2)</label
            >
          </div>
          <div class="inputs">
            <input
              type="range"
              id="num2-slider"
              min="1"
              max="1000"
              value="42"
              disabled
            />
            <input
              type="number"
              id="num2-input"
              min="1"
              max="1000000"
              value="42"
              disabled
            />
          </div>
          <label class="toggle-group">
            <input type="checkbox" id="compare-toggle" /> Enable Comparison
            Overlay
          </label>
        </div>
      </div>

      <div class="metrics">
        <div class="metric-card">
          <div class="title">Total Steps (N1)</div>
          <div class="value" id="m-steps">-</div>
        </div>
        <div class="metric-card">
          <div class="title">Peak Height (N1)</div>
          <div class="value" id="m-peak">-</div>
        </div>
        <div class="metric-card">
          <div class="title">Odd / Even Ratio</div>
          <div class="value" id="m-ratio">-</div>
        </div>
        <div class="metric-card" id="m-merge-card" style="display: none;">
          <div class="title">Paths Merge At</div>
          <div class="value" id="m-merge" style="color: var(--accent-alt);">
            -
          </div>
        </div>
      </div>

      <div class="canvas-container">
        <canvas id="collatz-canvas"></canvas>
      </div>

      <div class="legend">
        <div class="legend-item">
          <div class="legend-color" style="background: var(--accent);"></div>
          <span>Primary Path</span>
        </div>
        <div class="legend-item" id="legend-compare" style="display: none;">
          <div
            class="legend-color"
            style="background: var(--accent-alt);"
          ></div>
          <span>Comparison Path</span>
        </div>
      </div>
    </div>

    <script>
      // State Elements
      const num1Slider = document.getElementById("num1-slider");
      const num1Input = document.getElementById("num1-input");
      const num2Slider = document.getElementById("num2-slider");
      const num2Input = document.getElementById("num2-input");
      const compareToggle = document.getElementById("compare-toggle");

      // Metric Elements
      const mSteps = document.getElementById("m-steps");
      const mPeak = document.getElementById("m-peak");
      const mRatio = document.getElementById("m-ratio");
      const mMerge = document.getElementById("m-merge");
      const mMergeCard = document.getElementById("m-merge-card");
      const legendCompare = document.getElementById("legend-compare");

      // Canvas Setup
      const canvas = document.getElementById("collatz-canvas");
      const ctx = canvas.getContext("2d");

      // Collatz Calculator Function
      function getCollatzPath(n) {
        if (n <= 0) return [1];
        const path = [n];
        let current = n;
        while (current > 1) {
          if (current % 2 === 0) {
            current = current / 2;
          } else {
            current = 3 * current + 1;
          }
          path.push(current);
        }
        return path;
      }

      // High-DPI Canvas Resizing
      function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        render();
      }

      // Main Draw Function
      function render() {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);

        const n1 = parseInt(num1Input.value) || 1;
        const path1 = getCollatzPath(n1);

        const isComparing = compareToggle.checked;
        let path2 = [];
        if (isComparing) {
          const n2 = parseInt(num2Input.value) || 1;
          path2 = getCollatzPath(n2);
        }

        // Calculate combined metrics
        const maxSteps = Math.max(path1.length, path2.length);
        const maxValue = Math.max(...path1, ...path2, 1);

        // Update Dashboard Metrics for Path 1
        const peak1 = Math.max(...path1);
        const odds1 = path1.filter((x) => x % 2 !== 0).length;
        const evens1 = path1.length - odds1;

        mSteps.textContent = path1.length - 1;
        mPeak.textContent = peak1.toLocaleString();
        mRatio.textContent = `${odds1}:${evens1}`;

        if (isComparing) {
          // Find where paths merge
          const set1 = new Set(path1);
          const mergeVal = path2.find((val) => set1.has(val));
          mMerge.textContent = mergeVal ? mergeVal.toLocaleString() : "None";
          mMergeCard.style.display = "block";
          legendCompare.style.display = "flex";
        } else {
          mMergeCard.style.display = "none";
          legendCompare.style.display = "none";
        }

        // Drawing padding
        const padLeft = 50;
        const padRight = 20;
        const padTop = 20;
        const padBottom = 30;

        const graphWidth = width - padLeft - padRight;
        const graphHeight = height - padTop - padBottom;

        // Draw Grid Lines
        ctx.strokeStyle = "#33415530";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 4; i++) {
          const y = padTop + (graphHeight / 4) * i;
          ctx.moveTo(padLeft, y);
          ctx.lineTo(width - padRight, y);

          // Y-Axis Labels
          const val = Math.round(maxValue - (maxValue / 4) * i);
          ctx.fillStyle = "#94a3b8";
          ctx.font = "10px monospace";
          ctx.textAlign = "right";
          ctx.fillText(val.toLocaleString(), padLeft - 8, y + 3);
        }
        ctx.stroke();

        // Plot Path Helper
        function plotPath(path, color, isDashed = false) {
          if (path.length < 2) return;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          if (isDashed) ctx.setLineDash([4, 4]);
          else ctx.setLineDash([]);

          path.forEach((val, index) => {
            const x = padLeft + (index / (maxSteps - 1)) * graphWidth;
            const y = padTop + graphHeight - (val / maxValue) * graphHeight;

            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();

          // Draw points
          ctx.fillStyle = color;
          path.forEach((val, index) => {
            const x = padLeft + (index / (maxSteps - 1)) * graphWidth;
            const y = padTop + graphHeight - (val / maxValue) * graphHeight;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Render Path 2 (Comparison) first if active
        if (isComparing) {
          plotPath(path2, "#f43f5e", true);
        }

        // Render Path 1 (Primary)
        plotPath(path1, "#38bdf8");
      }

      // Sync Controls (Sliders <-> Number Inputs)
      function bindInputPair(slider, input) {
        slider.addEventListener("input", () => {
          input.value = slider.value;
          render();
        });

        input.addEventListener("input", () => {
          slider.value = input.value;
          render();
        });
      }

      bindInputPair(num1Slider, num1Input);
      bindInputPair(num2Slider, num2Input);

      // Toggle comparison controls
      compareToggle.addEventListener("change", (e) => {
        const enabled = e.target.checked;
        num2Slider.disabled = !enabled;
        num2Input.disabled = !enabled;
        render();
      });

      // Window Resize Handler
      window.addEventListener("resize", resizeCanvas);

      // Initial Trigger
      resizeCanvas();
    </script>
  </body>
</html>
```

### Features Built-In:

- **Interactive Sliders & Inputs:** Two-way bound inputs so you can drag the slider for quick exploration or type an exact large number into the box.
- **Comparison Mode:** Toggle the checkbox to overlay a second number (e.g., compare `27` vs `42`). It visually highlights the point where both numbers collide and merge into the same trajectory.
- **Real-time Analytics:** Instant calculation of step count, peak value height, and odd vs. even sequence ratio.
- **HiDPI Retina Canvas Rendering:** Automatically handles pixel-ratio scaling so graph lines look crisp on screens of any density.
