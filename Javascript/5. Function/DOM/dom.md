For a **Senior React / JavaScript interview (10+ years)**, DOM questions are very common.

# Top DOM Interview Questions

***

# 1. What is DOM?

### Answer

DOM stands for:

```text
Document Object Model
```

Browser converts HTML into a tree-like structure.

HTML:


DOM Tree:

```text
Document
  |
 html
  |
 body
  |
 h1
```

DOM allows JavaScript to:

```text
✅ Read HTML
✅ Modify HTML
✅ Add Elements
✅ Remove Elements
✅ Handle Events
```

***

# 2. Difference Between HTML and DOM?

### HTML



Static markup.

### DOM

```javascript
document.querySelector("h1")
```

Live representation of HTML.

***

# 3. How to Select Elements?

### By ID

```javascript
document.getElementById("title");
```

***

### By Class

```javascript
document.getElementsByClassName(
  "card"
);
```

***

### Query Selector

```javascript
document.querySelector(".card");
```

***

### Multiple Elements

```javascript
document.querySelectorAll(".card");
```

***

# 4. Difference

```javascript
querySelector()
```

Returns:

```text
First Match
```

***

```javascript
querySelectorAll()
```

Returns:

```text
NodeList
```

***

# 5. Create Element

```javascript
const div =
  document.createElement("div");

div.textContent =
  "Hello";

document.body.appendChild(div);
```

***

# 6. Remove Element

```javascript
const element =
  document.getElementById(
    "box"
  );

element.remove();
```

***

# 7. innerHTML vs innerText vs textContent

### innerHTML

```javascript
element.innerHTML =
  "<h1>Hello</h1>";
```

Parses HTML.

***

### innerText

```javascript
element.innerText =
  "<h1>Hello</h1>";
```

Output:

```text
<h1>Hello</h1>
```

Respects CSS and hidden elements.

***

### textContent

```javascript
element.textContent =
  "<h1>Hello</h1>";
```

Faster.

Returns all text.

***

# Interview Question

Which is fastest?

```text
textContent ✅
```

***

# 8. Event Bubbling


```javascript
parent.addEventListener(
  "click",
  () =>
    console.log("parent")
);

child.addEventListener(
  "click",
  () =>
    console.log("child")
);
```

Output:

```text
child
parent
```

Event travels upward.

***

# 9. Stop Event Bubbling

```javascript
button.addEventListener(
  "click",
  event => {

    event.stopPropagation();

  }
);
```

***

# 10. Event Capturing

```javascript
parent.addEventListener(
  "click",
  handler,
  true
);
```

Output:

```text
parent
child
```

Direction:

```text
Top → Bottom
```

***

# 11. Event Delegation

### Most Asked Interview Question

Instead of:

```javascript
100 buttons
100 listeners
```

Use:

```javascript
1 listener
```

```javascript
list.addEventListener(
  "click",
  event => {

    if (
      event.target.tagName ===
      "LI"
    ) {
      console.log(
        event.target.innerText
      );
    }

  }
);
```

Benefits:

```text
✅ Better Performance
✅ Less Memory
✅ Dynamic Elements
```

***

# 12. Difference Between Event Bubbling and Capturing

### Bubbling

```text
Child → Parent
```

### Capturing

```text
Parent → Child
```

***

# 13. How Does React Handle Events?

React uses:

```text
Synthetic Events
```

Example:

```jsx
<button
  onClick={handleClick}
>
  Click
</button>
```

React doesn't attach listener to every node.

Uses:

```text
Event Delegation
```

behind the scenes.

***

# 14. Reflow vs Repaint

### Repaint

```text
Color Change
```

```javascript
div.style.color =
  "red";
```

Visual update only.

***

### Reflow

```text
Layout Change
```

```javascript
div.style.width =
  "500px";
```

Browser recalculates layout.

Expensive.

***

# 15. What Causes Reflow?

```text
width
height
margin
padding
position
font-size
```

changes.

***

# 16. Difference Between

```javascript
event.target
```

and

```javascript
event.currentTarget
```

### target

Actual clicked element.

### currentTarget

Element where listener attached.


```text
Click LI

target = LI

currentTarget = UL
```

***

# 17. Document Fragment

### Interview Favourite

```javascript
const fragment =
  document.createDocumentFragment();

for(let i=0;i<1000;i++){

  const li =
    document.createElement("li");

  fragment.appendChild(li);
}

list.appendChild(fragment);
```

Benefits:

```text
✅ Fewer Reflows
✅ Better Performance
```

***

# 18. What is Virtual DOM?

### Browser DOM

```text
Real DOM
```

Updating:

```text
Expensive
```

***

### React DOM

```text
Virtual DOM
```

Process:

```text
State Change
    ↓
Virtual DOM
    ↓
Diffing
    ↓
Update Only Changed Nodes
```

***

# 19. Difference Between Virtual DOM and Real DOM

| Real DOM           | Virtual DOM      |
| ------------------ | ---------------- |
| Slow               | Fast             |
| Direct Update      | Diffing          |
| Browser Controlled | React Controlled |
| Reflow Expensive   | Optimized        |

***

# 20. Most Common Senior React DOM Questions

### Explain Event Delegation

### Explain Event Bubbling

### Explain Reflow and Repaint

### Explain Virtual DOM

### Difference Between:

```javascript
innerHTML
innerText
textContent
```

### Explain:

```javascript
event.target
event.currentTarget
```

### How React Handles DOM Updates?

```text
Virtual DOM
Diffing
Reconciliation
```

# Senior React Interview Answer

> The DOM is a tree representation of an HTML document that allows JavaScript to dynamically manipulate elements, attributes, styles, and events. Important interview topics include DOM traversal, event bubbling and capturing, event delegation, reflow versus repaint, document fragments, and the differences between the Real DOM and React's Virtual DOM. React improves DOM performance through reconciliation and selective updates rather than direct DOM manipulation.


# Difference Between Reflow and Repaint

This is one of the **most frequently asked JavaScript/React browser performance interview questions**.

***

# Browser Rendering Pipeline

```text
HTML
 ↓
DOM Tree
 ↓
CSSOM Tree
 ↓
Render Tree
 ↓
Layout (Reflow)
 ↓
Paint (Repaint)
 ↓
Composite
```

***

# 1. Reflow (Layout)

### Definition

Reflow occurs when the browser must **recalculate the layout and position** of elements.

The browser needs to determine:

```text
Width
Height
Position
Margins
Padding
```

***

## Example

```javascript
div.style.width = "500px";
```

Browser:

```text
Width Changed
      ↓
Recalculate Layout
      ↓
Repaint
```

***

## Properties That Cause Reflow

```javascript
width
height
padding
margin
border
font-size
display
position
top
left
right
bottom
```

Example:

```javascript
element.style.height =
  "300px";
```

Triggers:

```text
Reflow ✅
Repaint ✅
```

***

# 2. Repaint

### Definition

Repaint occurs when only the **appearance** changes.

No layout calculation required.

```text
Color
Background
Visibility
Outline
```

changes.

***

## Example

```javascript
div.style.color = "red";
```

Browser:

```text
Change color
      ↓
Paint again
```

No layout recalculation.

***

## Properties That Cause Repaint

```javascript
color
background-color
visibility
outline
```

Example:

```javascript
element.style.backgroundColor =
  "blue";
```

Triggers:

```text
Reflow ❌
Repaint ✅
```

***

# Visual Example

## Repaint

```javascript
div.style.color = "red";
```

Before:

```text
Hello
```

After:

```text
Hello (red)
```

Position unchanged.

***

## Reflow

```javascript
div.style.width = "500px";
```

Before:

```text
[Box]
```

After:

```text
[         Wider Box         ]
```

Layout changed.

***

# Which is More Expensive?

```text
Reflow > Repaint
```

Because:

```text
Reflow
 ↓
Layout Calculation
 ↓
Paint

Repaint
 ↓
Paint Only
```

***

# React Interview Scenario

## Bad Example

```javascript
for(let i=0;i<1000;i++){

  element.style.width =
    `${i}px`;
}
```

Problem:

```text
1000 Reflows
```

Very expensive.

***

## Better

```javascript
element.style.cssText =
  "width:500px;height:300px";
```

Single layout update.

***

# Avoiding Reflow

## Use CSS Transforms

Instead of:

```javascript
element.style.left =
  "100px";
```

Use:

```javascript
element.style.transform =
  "translateX(100px)";
```

Benefits:

```text
Fewer Layout Calculations
Better Performance
GPU Optimisation
```

***

# React Example

### Bad

```jsx
setState({
  width: width + 1
});
```

repeated rapidly during:

```text
scroll
mousemove
resize
```

can cause many reflows.

***

### Better

Use:

```text
Throttling
Debouncing
requestAnimationFrame
```

***

# Interview Comparison

| Feature              | Reflow | Repaint |
| -------------------- | ------ | ------- |
| Layout Recalculation | ✅      | ❌       |
| Position Changed     | ✅      | ❌       |
| Width/Height Changed | ✅      | ❌       |
| Colour Changed       | ❌      | ✅       |
| More Expensive       | ✅      | ❌       |
| Triggers Paint       | ✅      | ✅       |

***

# Common Interview Questions

### What causes Reflow?

```text
Width
Height
Margin
Padding
Position
Font Size
Display Changes
```

***

### What causes Repaint?

```text
Color
Background
Visibility
Outline
```

***

### Which is more expensive?

✅ **Reflow**

Because:

```text
Layout Calculation
+
Paint
```

***

### Does Reflow cause Repaint?

✅ Yes

```text
Reflow
 ↓
Repaint
```

***

### Does Repaint cause Reflow?

❌ No

```text
Color Change
 ↓
Paint Only
```

***

# Senior React Interview Answer

> **Reflow (Layout)** happens when the browser recalculates the size, position, or geometry of elements due to changes such as width, height, margin, padding, or positioning. **Repaint** happens when only visual styles such as colour or background change without affecting layout. Reflow is more expensive because it triggers layout calculations and then repainting, whereas repaint only updates the visual appearance. In React applications, minimising unnecessary reflows through batching updates, throttling high-frequency events, and using CSS transforms can significantly improve rendering performance.


# 1. How Does React Handle DOM Events?

This is a **very common Senior React interview question**.

## Traditional DOM Event Handling

```javascript
const button =
  document.getElementById("btn");

button.addEventListener(
  "click",
  () => {
    console.log("Clicked");
  }
);
```

Every DOM element gets its own event listener.

***

## React Event Handling

```jsx
function App() {

  const handleClick = () => {
    console.log("Clicked");
  };

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

React does not attach listeners to every element individually.

***

# React Uses Event Delegation

Instead of:

```text
100 Buttons
↓
100 Event Listeners
```

React uses:

```text
1 Listener
↓
Root Container
```

Then React determines:

```text
Which Component Triggered Event
```

This improves:

```text
✅ Memory Usage
✅ Performance
✅ Event Management
```

***

# Synthetic Events

React wraps native browser events inside:

```text
SyntheticEvent
```

Example:

```jsx
function handleClick(event) {

  console.log(event);

}
```

React gives:

```javascript
SyntheticEvent
```

Benefits:

```text
✅ Cross Browser Compatibility
✅ Same API Everywhere
✅ Consistent Behavior
```

***

# Event Bubbling in React

```jsx
<div
  onClick={() =>
    console.log("Parent")
  }
>
  <button
    onClick={() =>
      console.log("Child")
    }
  >
    Click
  </button>
</div>
```

Output:

```text
Child
Parent
```

React follows:

```text
Event Bubbling
```

***

# Stop Propagation

```jsx
function handleClick(e) {

  e.stopPropagation();

}
```

***

# React Event Lifecycle

```text
Click
 ↓
Browser Event
 ↓
Synthetic Event
 ↓
React Event System
 ↓
Component Handler
```

***

# 2. Optimising Reflow & Repaint in React

First understand:

***

## Reflow (Layout)

Browser recalculates:

```text
Width
Height
Position
Layout
```

Expensive.

***

## Repaint

Visual update only.

```text
Color
Background
Border Color
```

Cheaper.

***

# Optimisation Techniques

***

## 1. Use CSS Transform Instead of Top/Left

### Bad

```javascript
element.style.left =
  "100px";
```

Triggers:

```text
Reflow + Repaint
```

***

### Good

```javascript
element.style.transform =
  "translateX(100px)";
```

Triggers:

```text
Repaint Only
```

GPU Optimised.

***

# 2. Batch State Updates

### Bad

```jsx
setWidth(100);
setHeight(200);
setColor("red");
```

Multiple renders.

***

### Better

```jsx
setState({
  width: 100,
  height: 200,
  color: "red"
});
```

Single render.

***

# 3. Avoid Excessive Re-renders

### Bad

```jsx
function Parent() {

  const handleClick =
    () => {};

  return (
    <Child
      onClick={handleClick}
    />
  );
}
```

New function every render.

***

### Better

```jsx
const handleClick =
  useCallback(() => {

  }, []);
```

***

# 4. Use React.memo

### Prevent Unnecessary DOM Updates

```jsx
const Child =
  React.memo(
    function Child() {

      return <div />;
    }
  );
```

If props don't change:

```text
No Re-render
```

***

# 5. Debounce Expensive Updates

### Bad

```jsx
<input
  onChange={e =>
    search(
      e.target.value
    )
  }
/>
```

100 keystrokes:

```text
100 API Calls
```

***

### Better

```jsx
const debouncedSearch =
  debounce(
    search,
    500
  );
```

***

# 6. Throttle Scroll Events

### Bad

```javascript
window.addEventListener(
  "scroll",
  handleScroll
);
```

Thousands of executions.

***

### Better

```javascript
const throttledScroll =
  throttle(
    handleScroll,
    500
  );
```

***

# 7. Virtualise Large Lists

### Bad

```jsx
10,000 rows
```

All rendered.

***

### Better

```jsx
react-window
react-virtualized
```

Only visible rows rendered.

```text
10,000 Data
↓
20 DOM Nodes
```

Huge performance gain.

***

# 8. Minimise Layout Reads

### Bad

```javascript
for(let i=0;i<100;i++){

  element.offsetWidth;

  element.style.width =
    `${i}px`;
}
```

Causes:

```text
Layout Thrashing
```

***

### Better

```javascript
const width =
  element.offsetWidth;

for(let i=0;i<100;i++){

  element.style.width =
    `${width + i}px`;
}
```

Read once.

***

# 9. Use Document Fragments

Vanilla JS example:

```javascript
const fragment =
  document.createDocumentFragment();

for(let i=0;i<1000;i++){

  const li =
    document.createElement("li");

  fragment.appendChild(li);
}

list.appendChild(fragment);
```

Reduces:

```text
Reflow Count
```

***

# Senior React Interview Answer

> React handles DOM events using a Synthetic Event system and event delegation. Instead of registering listeners on every DOM node, React attaches a small number of listeners at the root and dispatches events internally. This provides better performance and cross-browser consistency. To optimise reflow and repaint in React, minimise unnecessary renders with `React.memo`, `useCallback`, and `useMemo`, use debouncing and throttling for high-frequency events, prefer CSS transforms over layout-changing properties, virtualise large lists, and batch state updates. Reflow is more expensive than repaint because it requires layout recalculation before painting.
