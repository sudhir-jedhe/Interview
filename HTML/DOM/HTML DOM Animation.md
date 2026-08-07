HTML DOM Animation in JavaScript allows you to create dynamic visual movements by programmatically updating an element's CSS properties (such as position, opacity, scale, or rotation) over time.

There are **three primary approaches** to animating the HTML DOM with JavaScript:

1. **`requestAnimationFrame()`** (Modern Standard)
2. **Web Animations API** (Pure JS Animation Engine)
3. **`setInterval()`** (Legacy Approach)

---

## 1. Modern Standard: `requestAnimationFrame()`

`window.requestAnimationFrame()` tells the browser you want to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. It runs at the browser's refresh rate (typically **60fps** or **120fps**) and pauses when the user switches tabs, saving CPU/battery.

### Example: Sliding Box

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    #container {
      width: 400px;
      height: 100px;
      position: relative;
      background: #f0f0f0;
      border: 2px solid #333;
    }
    #box {
      width: 50px;
      height: 50px;
      position: absolute;
      background: #3498db;
      left: 0px;
      top: 25px;
    }
  </style>
</head>
<body>

  <div id="container">
    <div id="box"></div>
  </div>
  <button id="startBtn">Start Animation</button>

  <script>
    const box = document.getElementById("box");
    const btn = document.getElementById("startBtn");

    let pos = 0;
    let animationId = null;

    function step() {
      pos += 2; // Increase position by 2px per frame
      box.style.left = pos + "px";

      // Continue animating until reaching target position (350px)
      if (pos < 350) {
        animationId = requestAnimationFrame(step);
      }
    }

    btn.addEventListener("click", () => {
      pos = 0;
      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(step);
    });
  </script>
</body>
</html>

```

---

## 2. Declarative JS: Web Animations API (WAAPI)

The **Web Animations API** connects the browser's CSS animation engine directly to JavaScript via the `.animate()` method. It requires no manually calculated loops or intervals.

### Example: Smooth Keyframe Animation

```javascript
const box = document.querySelector("#box");

// Animate using keyframe objects
const animation = box.animate([
  // Keyframes
  { transform: "translateX(0px) rotate(0deg)", opacity: 1 },
  { transform: "translateX(300px) rotate(360deg)", opacity: 0.5 },
  { transform: "translateX(0px) rotate(0deg)", opacity: 1 }
], {
  // Timing options
  duration: 2000,
  iterations: Infinity,
  easing: "ease-in-out"
});

// Control options
// animation.pause();
// animation.play();
// animation.reverse();

```

---

## 3. Legacy Approach: `setInterval()`

Historically, animations were built using `setInterval()`. While functional, it is **not recommended** for modern web applications because it does not sync with screen refresh rates, causing dropped frames ("jank"), and continues running in hidden background tabs.

```javascript
const box = document.getElementById("box");
let pos = 0;

const timer = setInterval(() => {
  if (pos >= 350) {
    clearInterval(timer); // Stop animation
  } else {
    pos++;
    box.style.left = pos + "px";
  }
}, 10); // Runs roughly every 10ms

```

---

## 4. Best Practices for DOM Animations

1. **Animate Composite Properties Only:** For maximum performance (60fps without layout shifts), animate CSS properties handled by the GPU compositor—specifically **`transform`** (`translate`, `scale`, `rotate`) and **`opacity`**. Avoid animating layout properties like `left`, `top`, `width`, or `height` when possible.

```javascript
// BAD (Forces Layout recalculation on every frame)
box.style.left = pos + "px";

// GOOD (Hardware accelerated via GPU)
box.style.transform = `translateX(${pos}px)`;

```

1. **Prefer CSS Transitions/Animations for Simple UI:** If an animation doesn't require complex dynamic JavaScript logic, use CSS transitions triggered by adding/removing JS class names:

```javascript
// JS simply toggles a class
element.classList.toggle("is-active");

```

```css
/* CSS handles hardware-accelerated movement */
.box {
  transition: transform 0.3s ease-out;
}
.box.is-active {
  transform: translateX(300px);
}

```

---

## Summary Comparison

| Approach                    | Performance   | Ease of Use | Control Features                      | Best For                                  |
| --------------------------- | ------------- | ----------- | ------------------------------------- | ----------------------------------------- |
| **CSS + JS Class Toggle**   | Highest (GPU) | Easiest     | Low (Basic triggers)                  | UI states, hovers, simple overlays        |
| **Web Animations API**      | Highest (GPU) | Easy        | High (Play, pause, reverse, timeline) | Complex keyframe sequences                |
| **`requestAnimationFrame`** | High          | Moderate    | Complete (Custom physics/math)        | Canvas/Games, custom interactive dragging |
| **`setInterval`**           | Low           | Easy        | Poor                                  | Legacy codebases only                     |
