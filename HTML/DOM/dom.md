Since you're preparing for **Senior React / Tech Lead / Architect** roles, interviewers usually move beyond `getElementById()` and focus on **DOM architecture, performance, rendering pipeline, scalability, browser internals, and framework integration**. Topics such as event propagation and DOM manipulation also appear in internal interview question collections like [UI_Interview_Questions.docx](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1&EntityRepresentationId=a277f7bf-5ea0-4ba5-8552-f39522cee321). [[UI_Intervi..._Questions | Word]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# Architect-Level DOM Questions

## DOM Internals & Browser Rendering

### 1.

**Explain the complete browser rendering pipeline from HTML download to pixels on the screen. Where does the DOM fit into this process?**

**Expected Discussion**

# Explain the Complete Browser Rendering Pipeline: HTML → Pixels

This is a favourite **Architect / Staff Engineer** interview question because it tests browser internals, performance optimisation, and React rendering knowledge.

---

# High-Level Flow

```text
1. Download HTML
        ↓
2. Parse HTML
        ↓
3. Build DOM Tree
        ↓
4. Download & Parse CSS
        ↓
5. Build CSSOM Tree
        ↓
6. Create Render Tree
        ↓
7. Layout (Reflow)
        ↓
8. Paint
        ↓
9. Composite
        ↓
10. Pixels on Screen
```

---

# Step 1: HTML Download

The browser sends an HTTP request.

```text
Browser
   ↓
Server
   ↓
HTML Response
```

Example:

```html
<html>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

The browser receives HTML as a stream.

---

# Step 2: HTML Parsing

The browser parses HTML token by token.

```html
<div>
  <span>Hello</span>
</div>
```

Creates tokens:

```text
HTML
 ↓
Tag Tokens
 ↓
DOM Nodes
```

---

# Step 3: DOM Tree Creation

The browser converts HTML into a **DOM (Document Object Model)** tree. DOM manipulation, traversal, and performance considerations are commonly highlighted in DOM interview preparation materials. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://www.measurethat.net/Benchmarks/Show/13556/0/createelement-vs-createdocumentfragment-1)

HTML:

```html
<body>
  <div>
    <p>Hello</p>
  </div>
</body>
```

DOM:

```text
Document
 └── html
      └── body
           └── div
                └── p
                     └── "Hello"
```

### Where Does the DOM Fit?

✅ The DOM is created immediately after HTML parsing.

✅ It represents the page structure in memory.

✅ JavaScript interacts with the page through the DOM.

Example:

```javascript
document.querySelector("p").textContent = "Updated";
```

---

# Step 4: CSS Download & Parsing

While building the DOM, the browser discovers:

```html
style.css
```

The CSS file is downloaded.

Example:

```css
p {
  color: red;
}
```

Browser parses CSS into another tree.

---

# Step 5: CSSOM Tree Creation

CSS becomes the **CSS Object Model (CSSOM)**.

```text
CSS
   ↓
CSSOM
```

Example:

```css
body {
  margin: 0;
}

p {
  color: red;
}
```

Produces:

```text
CSSOM
 ├── body
 └── p
```

---

# Step 6: Render Tree Creation

Now the browser combines:

```text
DOM
+
CSSOM
=
Render Tree
```

Important:

```html
<div style="display:none">Hidden</div>
```

The node exists in:

✅ DOM

But not in:

❌ Render Tree

Because:

```css
display: none;
```

removes it from rendering.

---

# Step 7: Layout (Reflow)

Now the browser calculates:

```text
Position
Width
Height
Margins
Coordinates
```

Example:

```css
width: 300px;
height: 100px;
```

Browser computes:

```text
x = 10
y = 20
width = 300
height = 100
```

This process is called:

```text
Layout
or
Reflow
```

---

## What Triggers Reflow?

```javascript
element.style.width = "500px";
```

```javascript
element.classList.add("active");
```

```javascript
window.resize();
```

These require recalculating positions of elements.

---

# Step 8: Paint

After layout is complete, the browser paints:

```text
Text
Border
Background
Shadow
Image
Colour
```

Example:

```css
background: blue;
border: 1px solid black;
```

The browser paints each visual element.

---

## What Triggers Repaint?

```javascript
element.style.color = "red";
```

Colour changes.

Layout remains same.

Only paint is required.

---

# Step 9: Compositing

Modern browsers use multiple layers.

Example:

```css
transform: translateX()
opacity
position: fixed
```

can create separate compositor layers.

```text
Layer 1
Layer 2
Layer 3
```

The GPU combines them.

This stage is called:

```text
Compositing
```

---

# Step 10: Pixels on Screen

After compositing:

```text
GPU
 ↓
Screen Buffer
 ↓
Pixels Displayed
```

User finally sees:

```html
Hello World
```

on screen.

---

# What Happens When JavaScript Changes the DOM?

```javascript
document.getElementById("title").textContent = "New Title";
```

Flow becomes:

```text
DOM Updated
     ↓
Render Tree Updated
     ↓
Layout (if needed)
     ↓
Paint
     ↓
Composite
```

This is why excessive DOM manipulation can hurt performance. DOM manipulation and performance impacts are specifically called out as key interview topics. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://www.measurethat.net/Benchmarks/Show/13556/0/createelement-vs-createdocumentfragment-1)

---

# How React Optimises This

The React training material from your organisation's frontend masterclass explains that React creates a Virtual DOM in memory, compares the old and new Virtual DOM (diffing), and updates only the changed part of the real DOM. [3](https://gist.github.com/lukasz-zak/48486ab35f7ea4bc1ba4)

```text
State Change
      ↓
New Virtual DOM
      ↓
Diffing
      ↓
Find Changes
      ↓
Update Real DOM
      ↓
Browser Rendering Pipeline
```

This reduces unnecessary DOM updates and browser re-render work. [3](https://gist.github.com/lukasz-zak/48486ab35f7ea4bc1ba4)

---

# Architect-Level Interview Answer (2 Minutes)

> When a browser receives HTML, it parses the document and builds the DOM tree. CSS files are downloaded and parsed into the CSSOM tree. The browser combines the DOM and CSSOM to create the Render Tree, which contains only visible elements. It then performs Layout (Reflow) to calculate element positions and dimensions, followed by Paint to draw pixels. Finally, the compositor combines rendering layers and sends them to the GPU for display. The DOM sits at the centre of this pipeline as the in-memory representation of the document structure. Any DOM or style changes can trigger render tree updates, layout recalculations, paints, and compositing operations. React optimises this process by using a Virtual DOM and updating only the changed parts of the real DOM. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[3](https://gist.github.com/lukasz-zak/48486ab35f7ea4bc1ba4)

# 1. How CSSOM Affects the Rendering Pipeline

CSSOM (CSS Object Model) is the browser's representation of all CSS rules.

### Rendering Pipeline

```text
HTML
  ↓
DOM Tree
  ↓
CSS
  ↓
CSSOM Tree
  ↓
DOM + CSSOM
  ↓
Render Tree
  ↓
Layout (Reflow)
  ↓
Paint
  ↓
Composite
```

### Why CSSOM Matters

The browser cannot build the Render Tree until it has:

```text
DOM
+
CSSOM
```

because it needs to know:

- Which elements are visible
- Final computed styles
- Element dimensions
- Positioning information

Example:

```html
<div class="box">Hello</div>
```

```css
.box {
  display: none;
}
```

The element:

✅ Exists in DOM

❌ Does not appear in Render Tree

because CSSOM determines that it is hidden.

---

## CSS is Render-Blocking

Example:

```html
styles.css
```

The browser pauses rendering until:

```text
CSS Downloaded
     ↓
CSS Parsed
     ↓
CSSOM Created
```

This avoids Flash Of Unstyled Content (FOUC). [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)

---

## Architect Insight

A large CSS file impacts:

- First Paint
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

Common optimisations:

```text
Critical CSS
Minification
Code Splitting
CSS Modules
```

---

# 2. What Triggers Reflow (Layout)?

Reflow occurs when the browser must recalculate:

```text
Position
Width
Height
Coordinates
Layout of other elements
```

Because layout changes can affect neighbouring nodes.

---

## Common Reflow Triggers

### 1. Adding/Removing DOM Elements

```javascript
parent.appendChild(div);
```

```javascript
element.remove();
```

Browser must recalculate layout.

---

### 2. Changing Element Size

```javascript
element.style.width = "500px";
```

```javascript
element.style.height = "200px";
```

---

### 3. Changing Font Properties

```javascript
element.style.fontSize = "20px";
```

Text dimensions change.

---

### 4. Window Resize

```javascript
window.onresize;
```

Responsive calculations must run again.

---

### 5. Reading Layout Properties

These force the browser to calculate layout immediately:

```javascript
element.offsetWidth;
element.offsetHeight;
element.clientWidth;
element.getBoundingClientRect();
```

This is called:

```text
Forced Synchronous Reflow
```

and is a major performance issue.

---

## Layout Thrashing

Bad Example:

```javascript
for (let i = 0; i < 1000; i++) {
  element.style.width = i + "px";

  console.log(element.offsetWidth);
}
```

Each read forces layout.

```text
Write
Read
Write
Read
Write
Read
```

1000 expensive recalculations.

---

## Cost of Reflow

```text
Low
 ↓
Single Element

High
 ↓
Entire Page Layout
 ↓
Nested Components
 ↓
Complex Tables
```

---

# 3. What Triggers Repaint?

Repaint happens when:

```text
Visual appearance changes
BUT
Layout remains same
```

---

## Examples

### Text Colour

```javascript
element.style.color = "red";
```

---

### Background Colour

```javascript
element.style.background = "blue";
```

---

### Border Colour

```javascript
element.style.borderColor = "green";
```

---

### Visibility

```javascript
element.style.visibility = "hidden";
```

Layout remains reserved.

Only paint changes.

---

## Reflow vs Repaint

| Operation              | Reflow | Repaint |
| ---------------------- | ------ | ------- |
| Width Change           | ✅     | ✅      |
| Height Change          | ✅     | ✅      |
| Font Size Change       | ✅     | ✅      |
| Background Colour      | ❌     | ✅      |
| Text Colour            | ❌     | ✅      |
| Layout Position Change | ✅     | ✅      |

---

## Important Rule

Every reflow causes:

```text
Reflow
   ↓
Repaint
```

But:

```text
Repaint
```

does NOT necessarily cause:

```text
Reflow
```

---

# 4. React's Virtual DOM Optimisation Process

Your internal React masterclass materials describe React creating a Virtual DOM, comparing old and new trees, and updating only the changed parts of the real DOM. [2](https://www.geeksforgeeks.org/javascript/difference-between-textcontent-and-innerhtml/)[3](https://dev.to/megha_m/innertext-vs-innerhtml-vs-textcontent-whats-the-real-difference-3cp6)

---

## Without Virtual DOM

```javascript
document.getElementById("count").textContent = count;
```

Developer manually updates DOM.

Large applications become difficult to optimise.

---

## With Virtual DOM

### Step 1: Initial Render

React creates:

```text
Virtual DOM Tree
```

in memory.

```jsx
<App />
```

↓

```text
Virtual DOM
```

↓

```text
Real DOM
```

[2](https://www.geeksforgeeks.org/javascript/difference-between-textcontent-and-innerhtml/)[3](https://dev.to/megha_m/innertext-vs-innerhtml-vs-textcontent-whats-the-real-difference-3cp6)

---

### Step 2: State Changes

```javascript
setCount(1);
```

React creates:

```text
Old Virtual DOM
```

and

```text
New Virtual DOM
```

[2](https://www.geeksforgeeks.org/javascript/difference-between-textcontent-and-innerhtml/)

---

### Step 3: Diffing

React compares:

```text
Old Tree
vs
New Tree
```

Algorithm:

```text
Reconciliation
```

React finds:

```text
Exactly what changed
```

[2](https://www.geeksforgeeks.org/javascript/difference-between-textcontent-and-innerhtml/)

---

### Step 4: Minimal Updates

Example:

```text
Count: 0
```

↓

```text
Count: 1
```

Only the text node is updated.

Not:

```text
Entire Component
Entire Page
Entire DOM Tree
```

[2](https://www.geeksforgeeks.org/javascript/difference-between-textcontent-and-innerhtml/)

---

### Step 5: Browser Rendering Pipeline

After React updates Real DOM:

```text
DOM Updated
     ↓
Render Tree Updated
     ↓
Layout
     ↓
Paint
     ↓
Composite
```

React reduces DOM work but cannot eliminate browser rendering costs.

---

# Architect Interview Answer (1 Minute)

> CSSOM is the browser's representation of CSS rules and is combined with the DOM to create the Render Tree. Without CSSOM, the browser cannot determine visibility, dimensions, or styling. Reflow occurs when layout-affecting changes such as size, position, font, or DOM structure modifications require recalculating element geometry. Repaint occurs when only visual properties like colour or background change without affecting layout. React optimises rendering by maintaining a Virtual DOM, creating a new tree after state updates, diffing it against the previous tree, and applying only the minimal set of changes to the real DOM, reducing unnecessary browser work. [2](https://www.geeksforgeeks.org/javascript/difference-between-textcontent-and-innerhtml/)[3](https://dev.to/megha_m/innertext-vs-innerhtml-vs-textcontent-whats-the-real-difference-3cp6)[1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)

---

# How Browsers Optimize Reflows and Repaints

A common misconception is:

> "Every DOM change immediately causes a reflow and repaint."

Modern browsers are much smarter.

They use several optimization techniques to reduce rendering work. [1](https://bing.com/search?q=browser+optimize+reflow+repaint+virtual+DOM+diffing)[2](https://dev.to/austinwdigital/understanding-web-rendering-reflows-repaints-and-performance-optimization-32bp)

---

# 1. Render Queue (Batching)

When JavaScript changes the DOM:

```javascript
div.style.width = "200px";
div.style.height = "100px";
div.style.margin = "10px";
```

The browser usually does **not** perform:

```text
Reflow
Reflow
Reflow
```

Instead it delays work and batches updates.

```text
DOM Changes
     ↓
Render Queue
     ↓
Single Layout Pass
```

This reduces expensive layout calculations. [1](https://bing.com/search?q=browser+optimize+reflow+repaint+virtual+DOM+diffing)[2](https://dev.to/austinwdigital/understanding-web-rendering-reflows-repaints-and-performance-optimization-32bp)

---

# 2. Deferred Layout Calculation

Browsers postpone layout work until it's absolutely necessary.

Example:

```javascript
div.style.width = "300px";
div.style.height = "100px";
```

The browser marks:

```text
Layout = Dirty
```

but doesn't calculate immediately.

Only when rendering is required does it run layout. [2](https://dev.to/austinwdigital/understanding-web-rendering-reflows-repaints-and-performance-optimization-32bp)[3](https://dev.to/satyaveer_jaligama/how-browsers-render-webpages-a-deep-dive-into-reflow-paint-and-repaint-m5n)

---

# 3. Layout Invalidation Tracking

Browsers track which parts of the page changed.

Instead of:

```text
Recalculate Entire DOM Tree
```

they try:

```text
Recalculate Only Impacted Subtree
```

Example:

```javascript
sidebar.style.width = "400px";
```

Browser may only update:

```text
Sidebar
Children
Affected Neighbours
```

rather than the whole page. [1](https://bing.com/search?q=browser+optimize+reflow+repaint+virtual+DOM+diffing)[2](https://dev.to/austinwdigital/understanding-web-rendering-reflows-repaints-and-performance-optimization-32bp)

---

# 4. Paint Optimization

If only visual styling changes:

```javascript
div.style.color = "red";
```

the browser skips layout entirely.

```text
No Reflow
     ↓
Only Repaint
```

This is significantly cheaper. [1](https://bing.com/search?q=browser+optimize+reflow+repaint+virtual+DOM+diffing)[3](https://dev.to/satyaveer_jaligama/how-browsers-render-webpages-a-deep-dive-into-reflow-paint-and-repaint-m5n)

---

# 5. GPU Compositing Layers

Modern browsers promote certain elements to separate layers.

Example:

```css
transform
opacity
position: fixed
```

These often become compositor layers.

```text
Layer A
Layer B
Layer C
```

The GPU can move or fade these layers without triggering layout or repaint of the whole page. [2](https://dev.to/austinwdigital/understanding-web-rendering-reflows-repaints-and-performance-optimization-32bp)[3](https://dev.to/satyaveer_jaligama/how-browsers-render-webpages-a-deep-dive-into-reflow-paint-and-repaint-m5n)

---

# 6. Avoiding Layout Thrashing

The biggest performance killer is:

```text
Read
Write
Read
Write
Read
Write
```

Example:

```javascript
for (let i = 0; i < 1000; i++) {
  div.style.width = i + "px";

  console.log(div.offsetWidth);
}
```

Every:

```javascript
offsetWidth;
```

forces the browser to flush pending layout work immediately. [4](https://blog.carlosrojas.dev/performance-optimization-in-dom-manipulation-6669ae153847)[5](https://www.softwarepatternslexicon.com/patterns-js/13/4/)

Called:

```text
Forced Synchronous Layout
```

or

```text
Layout Thrashing
```

---

# How Virtual DOM Diffing Reduces Layout Thrashing

## Problem Without Virtual DOM

Imagine updating 100 rows manually:

```javascript
for (let item of items) {
  document.getElementById(item.id).textContent = item.value;
}
```

Potential result:

```text
DOM Mutation
↓
Style Recalc
↓
Layout
↓
Paint

(repeated many times)
```

Thousands of DOM operations can generate excessive rendering work. [5](https://www.softwarepatternslexicon.com/patterns-js/13/4/)[4](https://blog.carlosrojas.dev/performance-optimization-in-dom-manipulation-6669ae153847)

---

# React Approach

Internal React training materials describe the process as:

```text
Old Virtual DOM
        vs
New Virtual DOM
```

React compares both trees and updates only the changed parts of the real DOM. [6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[7](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

---

# Step 1: State Changes

```javascript
setCount(5);
```

React does NOT immediately touch the browser DOM.

Instead:

```text
New Virtual DOM
```

is created in memory. [6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[7](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

---

# Step 2: Diffing

React compares:

```text
Old VDOM
vs
New VDOM
```

React identifies:

```text
Exactly What Changed
```

instead of blindly updating everything. [6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[7](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

---

# Step 3: Minimal DOM Updates

Suppose:

```jsx
<h1>Count: 1</h1>
```

becomes

```jsx
<h1>Count: 2</h1>
```

React updates:

```text
Text Node Only
```

instead of:

```text
Remove Component
Create Component
Rebuild DOM
```

[7](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)[6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)

---

# Step 4: Batching Updates

Multiple state updates:

```javascript
setName("Sudhir");
setAge(35);
setRole("Lead");
```

can be batched into a single render cycle. Automatic batching is called out in React architecture material. [8](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

Conceptually:

```text
Multiple Updates
       ↓
Single Diff
       ↓
Single DOM Commit
```

This reduces DOM churn dramatically. [8](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)

---

# Why This Reduces Layout Thrashing

Without optimization:

```text
Update DOM
Read Layout
Update DOM
Read Layout
Update DOM
Read Layout
```

Many forced layouts.

With React:

```text
State Changes
      ↓
Virtual DOM
      ↓
Diffing
      ↓
One Commit Phase
      ↓
Browser Layout
```

Far fewer real DOM mutations occur, meaning fewer opportunities to trigger expensive layout recalculations. React's own training materials explicitly note that Virtual DOM avoids direct DOM manipulation, reduces browser re-render work, and updates only changed parts of the UI. [6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[7](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

---

# Architect-Level Interview Answer

> Browsers optimize reflows by batching DOM mutations, delaying layout calculations, tracking invalidated regions, and using compositor layers to avoid unnecessary rendering work. Layout thrashing occurs when code repeatedly alternates between DOM writes and layout reads, forcing synchronous reflows. React reduces this problem through its Virtual DOM. State updates first modify an in-memory tree, React diffs the old and new trees, determines the minimal set of actual DOM changes, batches updates, and commits them together. This drastically reduces direct DOM mutations and helps minimize unnecessary layout recalculations and rendering work. [1](https://bing.com/search?q=browser+optimize+reflow+repaint+virtual+DOM+diffing)[5](https://www.softwarepatternslexicon.com/patterns-js/13/4/)[6](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[8](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

Explain how browsers batch DOM updates to optimize performanceDescribe techniques to avoid forced synchronous layouts in JavaScriptSummarize how React batches multiple state updates before DOM commit

### 2.

**What causes a reflow and repaint? How would you detect and optimize them in a large application?**

**Expected Discussion**

- Layout Thrashing
- Forced synchronous layout
- Browser DevTools
- requestAnimationFrame
- CSS containment
- # Architect-Level Deep Dive

These are keywords interviewers expect when discussing DOM performance:

- Layout Thrashing
- Forced Synchronous Layout
- Browser DevTools
- requestAnimationFrame
- CSS Containment

---

# 1. Layout Thrashing

## Definition

Layout thrashing occurs when JavaScript repeatedly alternates between:

```text
DOM Writes
↓
DOM Reads
↓
DOM Writes
↓
DOM Reads
```

Each read forces the browser to recalculate layout before continuing execution. [1](https://www.css-animation.com/core-css-animation-fundamentals/hardware-accelerated-properties/avoiding-layout-thrashing-in-css-animations/)[2](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

---

## Bad Example

```javascript
for (let i = 0; i < 1000; i++) {
  element.style.width = i + "px"; // Write

  console.log(element.offsetWidth); // Read
}
```

Flow:

```text
Write
↓
Layout
↓
Read

Write
↓
Layout
↓
Read
```

1000 times.

Result:

❌ High CPU

❌ Dropped frames

❌ Slow scrolling

❌ Input lag

[1](https://www.css-animation.com/core-css-animation-fundamentals/hardware-accelerated-properties/avoiding-layout-thrashing-in-css-animations/)[3](https://www.debugbear.com/blog/forced-reflows)

---

## Solution

Separate reads from writes.

```javascript
const width = element.offsetWidth; // Read

for (let i = 0; i < 1000; i++) {
  element.style.width = width + i + "px";
}
```

```text
Read Once
↓
Write Many
```

Much more efficient. [4](https://stackoverflow.com/questions/3397161/should-i-use-document-createdocumentfragment-or-document-createelement)[1](https://www.css-animation.com/core-css-animation-fundamentals/hardware-accelerated-properties/avoiding-layout-thrashing-in-css-animations/)

---

# 2. Forced Synchronous Layout

## Definition

A forced synchronous layout occurs when JavaScript asks the browser for layout information before the browser planned to calculate it.

Normally:

```text
JS
↓
Style
↓
Layout
↓
Paint
```

Browser batches everything.

But this code breaks batching:

```javascript
element.style.width = "500px";

console.log(element.offsetWidth);
```

The browser must immediately stop:

```text
JavaScript
↓
Force Layout NOW
↓
Return Width
↓
Continue JS
```

This is called:

```text
Forced Reflow
Forced Synchronous Layout
```

[3](https://www.debugbear.com/blog/forced-reflows)[5](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

---

## Common APIs That Force Layout

```javascript
offsetWidth;
offsetHeight;
offsetTop;
offsetLeft;

clientWidth;
clientHeight;

scrollWidth;
scrollHeight;

getBoundingClientRect();

scrollTop;
scrollLeft;
```

Many layout metrics force recalculation. [5](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)[3](https://www.debugbear.com/blog/forced-reflows)

---

# 3. Browser DevTools

## Detecting Layout Issues

### Chrome DevTools

```text
Performance Tab
```

Steps:

```text
1. Open DevTools
2. Performance
3. Record
4. Interact with App
5. Stop Recording
```

Look for:

```text
Layout
Recalculate Style
Paint
Composite Layers
```

Large spikes indicate performance bottlenecks. [3](https://www.debugbear.com/blog/forced-reflows)[2](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

---

## What You Want to See

Good:

```text
JS
Layout
Paint
```

small and infrequent.

Bad:

```text
JS
Layout
Layout
Layout
Layout
Paint
```

Many repeated layouts indicate thrashing.

---

## Rendering Tools

Enable:

```text
Paint Flashing
FPS Meter
Layer Borders
```

These help visualize rendering work.

---

# 4. requestAnimationFrame (rAF)

## What Is It?

```javascript
requestAnimationFrame(callback);
```

Schedules work right before the browser renders the next frame. [6](https://dev.to/kapil_thukral_b4fd1a02bee/browser-rendering-cycle-uselayouteffect-and-requestanimationframe-56p0)

---

## Why It Exists

Screen refresh rate:

```text
60 FPS
=
16.6ms/frame
```

Without rAF:

```javascript
setInterval(update, 16);
```

Browser timing becomes inaccurate.

With rAF:

```javascript
requestAnimationFrame(update);
```

Browser executes at the optimal rendering moment.

[6](https://dev.to/kapil_thukral_b4fd1a02bee/browser-rendering-cycle-uselayouteffect-and-requestanimationframe-56p0)[1](https://www.css-animation.com/core-css-animation-fundamentals/hardware-accelerated-properties/avoiding-layout-thrashing-in-css-animations/)

---

## Good Animation

```javascript
function animate() {
  element.style.transform = "translateX(10px)";

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

---

## Why rAF Helps

```text
Read Layout
↓
Compute
↓
Write Changes
↓
Browser Paint
```

Everything stays synchronized with rendering.

---

# 5. CSS Containment

## Problem

Without containment:

```text
Change Child
↓
Browser Unsure Impact
↓
Recalculate Parent
↓
Recalculate Siblings
↓
Recalculate Large DOM Area
```

---

## CSS Containment

```css
.card {
  contain: layout;
}
```

Tells browser:

> Changes inside this element stay inside this element.

---

## Types

### Layout Containment

```css
contain: layout;
```

Isolates layout calculations.

---

### Paint Containment

```css
contain: paint;
```

Limits repaint region.

---

### Content Containment

```css
contain: content;
```

Combines several containment rules.

---

### Strict Containment

```css
contain: strict;
```

Maximum isolation.

---

## Example

```css
.sidebar {
  contain: layout paint;
}
```

Now:

```text
Sidebar Changes
↓
Only Sidebar Recalculated
```

Instead of:

```text
Entire Page Recalculated
```

This significantly reduces rendering work on large applications. [7](https://modern-css-layouts.com/css-only-micro-interactions-animations/performance-gpu-acceleration/optimizing-css-animations-for-60fps/)

---

# How These Concepts Work Together

### Poor Performance

```text
DOM Update
↓
Read offsetWidth
↓
Forced Layout

DOM Update
↓
Read offsetHeight
↓
Forced Layout
```

Result:

```text
Layout Thrashing
↓
Dropped Frames
↓
Poor UX
```

---

### Optimized Version

```text
Read Once
↓
requestAnimationFrame
↓
Batch Writes
↓
CSS Containment
↓
Scoped Layout
↓
Paint
```

Result:

✅ Smooth 60 FPS

✅ Lower CPU

✅ Reduced Reflows

✅ Better INP & Core Web Vitals

---

# Architect Interview Answer (30 Seconds)

> Layout thrashing happens when code repeatedly alternates between DOM writes and layout reads, causing multiple layout recalculations. Forced synchronous layouts occur when APIs like `offsetWidth` or `getBoundingClientRect()` require immediate layout information, forcing the browser to flush pending work. I detect these issues using Chrome DevTools Performance profiling and Rendering tools. To optimise, I batch DOM reads and writes, schedule animations with `requestAnimationFrame`, avoid layout-triggering properties when possible, and use CSS containment to isolate layout and paint work so rendering changes don't cascade across the entire application. [1](https://www.css-animation.com/core-css-animation-fundamentals/hardware-accelerated-properties/avoiding-layout-thrashing-in-css-animations/)[2](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)[3](https://www.debugbear.com/blog/forced-reflows)[7](https://modern-css-layouts.com/css-only-micro-interactions-animations/performance-gpu-acceleration/optimizing-css-animations-for-60fps/)

# What Causes a Reflow and Repaint? How Would You Detect and Optimize Them in a Large Application?

This is a classic **Senior/Architect Frontend** interview question because it evaluates:

- Browser rendering knowledge
- Performance optimisation
- DOM internals
- React rendering understanding
- Production debugging skills

---

# 1. Reflow (Layout)

## Definition

A **reflow** occurs when the browser must recalculate:

```text
Position
Width
Height
Layout
Geometry
```

of one or more elements. Reflow is part of the browser's rendering pipeline and occurs when layout-affecting changes are made. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

## Common Reflow Triggers

### DOM Structure Changes

```javascript
parent.appendChild(div);
parent.removeChild(div);
```

Adding or removing elements forces layout recalculation. [3](https://persistentsystems.sharepoint.com/sites/RevenueTrackingSystem_Uat/ResponsiveAssets/JS/jquery-3.3.1.min.js?web=1)[1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)

---

### Layout Property Changes

```javascript
element.style.width = "500px";
element.style.height = "200px";
element.style.margin = "20px";
```

These directly affect geometry and trigger reflow. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

### Font Changes

```javascript
element.style.fontSize = "24px";
```

Changing text dimensions impacts layout. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)

---

### Window Resize

```javascript
window.addEventListener("resize");
```

Responsive layouts require recalculation. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

### Reading Layout Properties

```javascript
element.offsetWidth;
element.offsetHeight;
element.clientWidth;
element.getBoundingClientRect();
```

These can force the browser to immediately flush pending layout work, creating a **forced synchronous layout**. [4](https://blog.moretools.net/browser/javascript-differences-between-document-createdocumentfragment-and-document-createelement/)[5](https://stackoverflow.com/questions/3397161/should-i-use-document-createdocumentfragment-or-document-createelement)

---

# 2. Repaint

## Definition

A **repaint** occurs when only visual appearance changes while layout remains unchanged. [3](https://persistentsystems.sharepoint.com/sites/RevenueTrackingSystem_Uat/ResponsiveAssets/JS/jquery-3.3.1.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

## Common Repaint Triggers

### Text Colour

```javascript
element.style.color = "red";
```

---

### Background

```javascript
element.style.backgroundColor = "blue";
```

---

### Border Colour

```javascript
element.style.borderColor = "green";
```

---

### Visibility

```javascript
element.style.visibility = "hidden";
```

These affect pixels but not geometry. Therefore:

```text
Repaint
Without
Reflow
```

is often possible. [3](https://persistentsystems.sharepoint.com/sites/RevenueTrackingSystem_Uat/ResponsiveAssets/JS/jquery-3.3.1.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

# Cost Comparison

```text
Cheapest
   ↓
Composite Only

   ↓
Repaint

   ↓
Reflow + Repaint

Most Expensive
```

Every reflow typically leads to repaint work, but a repaint does not necessarily require reflow. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

# Example of Layout Thrashing

## Bad Code

```javascript
for (let i = 0; i < 1000; i++) {
  element.style.width = i + "px";

  console.log(element.offsetWidth);
}
```

This creates:

```text
Write
Read
Write
Read
Write
Read
```

Repeated layout recalculations. This pattern is commonly called **layout thrashing**. [4](https://blog.moretools.net/browser/javascript-differences-between-document-createdocumentfragment-and-document-createelement/)[5](https://stackoverflow.com/questions/3397161/should-i-use-document-createdocumentfragment-or-document-createelement)

---

# How Would You Detect Reflows and Repaints?

## 1. Chrome DevTools Performance Tab

Record:

```text
Performance
  ↓
Record
  ↓
User Interaction
```

Look for:

```text
Layout
Recalculate Style
Paint
Composite Layers
```

Large spikes indicate rendering bottlenecks.

---

## 2. Rendering Tab

Enable:

```text
Paint Flashing
Layer Borders
FPS Meter
```

This visually highlights repaint areas.

---

## 3. Lighthouse

Use:

```text
Chrome Lighthouse
```

to identify:

- Main thread blocking
- Excessive rendering work
- Layout shifts

---

## 4. Web Vitals Monitoring

Monitor:

```text
CLS
LCP
INP
```

Excessive reflows frequently contribute to poor user experience metrics. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)

---

# How Would You Optimize Reflows?

## Batch DOM Updates

### Bad

```javascript
list.style.color = "red";
list.style.fontSize = "20px";
list.style.margin = "10px";
```

### Better

```javascript
list.style.cssText = "color:red;font-size:20px;margin:10px";
```

Batching reduces rendering work. [5](https://stackoverflow.com/questions/3397161/should-i-use-document-createdocumentfragment-or-document-createelement)

---

## Use DocumentFragment

### Bad

```javascript
for (let i = 0; i < 10000; i++) {
  ul.appendChild(li);
}
```

### Better

```javascript
const frag = document.createDocumentFragment();
```

Build off-screen and append once, reducing DOM insertions and layout work. [3](https://persistentsystems.sharepoint.com/sites/RevenueTrackingSystem_Uat/ResponsiveAssets/JS/jquery-3.3.1.min.js?web=1)[4](https://blog.moretools.net/browser/javascript-differences-between-document-createdocumentfragment-and-document-createelement/)

---

## Separate Reads and Writes

### Bad

```javascript
read;
write;
read;
write;
```

### Better

```javascript
Read All
   ↓
Write All
```

Prevents layout thrashing. [4](https://blog.moretools.net/browser/javascript-differences-between-document-createdocumentfragment-and-document-createelement/)[5](https://stackoverflow.com/questions/3397161/should-i-use-document-createdocumentfragment-or-document-createelement)

---

## Use Virtualization

For large grids:

```text
100,000 Rows
```

Render only:

```text
Visible Rows
```

instead of the entire DOM.

---

# How Would You Optimize Repaints?

Prefer:

```css
transform
opacity
```

instead of:

```css
top
left
width
height
```

because transform/opacity are often handled by compositor layers and may avoid layout work. Modern browsers use compositor layers and GPU-assisted compositing to optimise rendering. [1](https://persistentsystems.sharepoint.com/sites/DevPi/ResponsiveAssets/js/jquery.dataTables.min.js?web=1)[2](https://persistentsystems.sharepoint.com/sites/CBox_QE/ResponsiveAssets/JS/jquery.dataTables.min.js?web=1)

---

# React-Specific Optimization

Your internal React material explains that React:

1. Creates a Virtual DOM
2. Builds a new Virtual DOM after state changes
3. Diffs old and new trees
4. Updates only changed DOM nodes
5. Batches updates where possible [6](https://persistentsystems.sharepoint.com/sites/EnterpriseAnalytics_Dev/ResponsiveAssets/JS/jquery-4.0.0.min.js?web=1)[7](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/SiteAssets/JS/jquery-4.0.0.min.js?web=1)[8](https://persistentsystems.sharepoint.com/sites/EnterpriseApplications/ResponsiveAssets/JS/jquery-4.0.0.min.js?web=1)

Practical optimisations:

```jsx
React.memo
useMemo
useCallback
Virtualization
Code Splitting
```

These reduce unnecessary rendering and DOM mutations.

---

# Architect-Level Answer (2 Minutes)

> Reflow occurs when a DOM or style change affects layout, forcing the browser to recalculate element positions and dimensions. Common triggers include adding or removing elements, changing layout-related CSS properties, resizing the window, or reading layout metrics such as `offsetWidth`. Repaint occurs when only visual properties such as colour or background change without affecting geometry. To detect rendering issues in a large application, I use Chrome DevTools Performance profiling, Paint Flashing, Lighthouse, and Core Web Vitals monitoring. To optimise performance, I batch DOM updates, avoid layout thrashing by separating reads from writes, use DocumentFragment for bulk DOM operations, virtualise large lists, and prefer compositor-friendly properties like `transform` and `opacity`. In React applications, Virtual DOM diffing and batched updates help minimise direct DOM mutations and therefore reduce unnecessary reflows and repaints. [3](https://persistentsystems.sharepoint.com/sites/RevenueTrackingSystem_Uat/ResponsiveAssets/JS/jquery-3.3.1.min.js?web=1)[4](https://blog.moretools.net/browser/javascript-differences-between-document-createdocumentfragment-and-document-createelement/)[6](https://persistentsystems.sharepoint.com/sites/EnterpriseAnalytics_Dev/ResponsiveAssets/JS/jquery-4.0.0.min.js?web=1)[8](https://persistentsystems.sharepoint.com/sites/EnterpriseApplications/ResponsiveAssets/JS/jquery-4.0.0.min.js?web=1)

---

### 3.

**How does `innerHTML` differ from DOM API manipulation (`createElement`) in terms of performance, security, and maintainability?**

# How does `innerHTML` differ from DOM API manipulation (`createElement`) in terms of Performance, Security, and Maintainability?

This is a very common **Senior Frontend / Architect** interview question because there's no single "best" choice. The answer depends on the use case. Internal JavaScript training materials describe `innerHTML` as parsing HTML content and `createElement()` as creating DOM nodes programmatically. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)

---

# Quick Summary

| Aspect          | innerHTML                            | createElement()                |
| --------------- | ------------------------------------ | ------------------------------ |
| Performance     | Fast for large static HTML insertion | Better for incremental updates |
| Security        | XSS risk                             | Much safer                     |
| Maintainability | Shorter but harder for complex UI    | More verbose but structured    |
| Event Handlers  | Can destroy existing handlers        | Preserves existing nodes       |
| DOM References  | Recreates DOM subtree                | Keeps existing references      |
| Dynamic UI      | Less ideal                           | Preferred                      |
| User Input      | Dangerous                            | Recommended                    |

---

# 1. Performance

## Using `innerHTML`

```javascript
container.innerHTML = "<p>Hello</p>";
```

Browser workflow:

```text
String
 ↓
HTML Parser
 ↓
Create DOM Nodes
 ↓
Replace Existing Content
```

The browser must:

1. Parse the HTML string
2. Build nodes
3. Potentially destroy existing DOM nodes
4. Recreate the DOM subtree

This can be efficient when inserting a large block of static markup in one operation, but repeated updates may require reparsing and recreating nodes. [2](https://www.javascripttutorial.net/javascript-dom/javascript-innerhtml-vs-createelement/)[3](https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml)

---

## Using `createElement`

```javascript
const p = document.createElement("p");

p.textContent = "Hello";

container.appendChild(p);
```

Browser workflow:

```text
Create Node
 ↓
Append Node
```

Benefits:

- No HTML parsing
- Incremental DOM updates
- Existing DOM preserved

Repeated additions generally work better with DOM APIs than repeatedly modifying `innerHTML`. [2](https://www.javascripttutorial.net/javascript-dom/javascript-innerhtml-vs-createelement/)[3](https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml)

---

## Architect-Level Performance Insight

### Bad

```javascript
for (let i = 0; i < 1000; i++) {
  container.innerHTML += `<li>${i}</li>`;
}
```

This can repeatedly reparse content.

### Better

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");

  li.textContent = i;

  fragment.appendChild(li);
}

container.appendChild(fragment);
```

Using `DocumentFragment` batches DOM insertion work. [2](https://www.javascripttutorial.net/javascript-dom/javascript-innerhtml-vs-createelement/)

---

# 2. Security

## The Biggest Difference

### Dangerous

```javascript
container.innerHTML = userInput;
```

If:

```javascript
userInput = "<script>alert('XSS')</script>";
```

the content may be interpreted as HTML and create security issues. Secure coding guidance specifically warns about using `innerHTML` with untrusted input and discusses HTML injection/XSS risks. [4](https://persistentsystemsnam.sharepoint.com/sites/KnowledgeCenter/Shared%20Documents/secure_coding.pdf?web=1)

---

### Safer

```javascript
const div = document.createElement("div");

div.textContent = userInput;
```

Output:

```html
<div>&lt;script&gt;alert('XSS')&lt;/script&gt;</div>
```

Rendered as text instead of executable markup. Secure coding guidance recommends using safe DOM APIs such as text-based insertion or DOM element creation where possible. [4](https://persistentsystemsnam.sharepoint.com/sites/KnowledgeCenter/Shared%20Documents/secure_coding.pdf?web=1)

---

## Architect Rule

```text
Trusted HTML
      ↓
innerHTML

Untrusted User Input
      ↓
createElement + textContent
```

[4](https://persistentsystemsnam.sharepoint.com/sites/KnowledgeCenter/Shared%20Documents/secure_coding.pdf?web=1)

---

# 3. Maintainability

## innerHTML

```javascript
container.innerHTML = `
  <div class="card">
    <h3>Profile</h3>
    <button>Edit</button>
  </div>
`;
```

Pros:

✅ Short

✅ Readable for templates

✅ Easy for static markup

---

Cons:

```javascript
container.innerHTML += ...
```

can become difficult to maintain as complexity grows.

Large templates often become:

```text
String Concatenation
+
Dynamic Values
+
Conditional Logic
```

which can be harder to debug. [3](https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml)

---

## createElement

```javascript
const card = document.createElement("div");

card.className = "card";

const title = document.createElement("h3");

title.textContent = "Profile";

card.appendChild(title);
```

Pros:

✅ Strong structure

✅ Easier dynamic manipulation

✅ Better separation of concerns

✅ Less string-based logic

---

Cons:

❌ More verbose

❌ More code

---

# Event Handlers

## Problem with innerHTML

```javascript
button.addEventListener("click", save);

container.innerHTML += "<div>New Node</div>";
```

When `innerHTML` rewrites content, DOM nodes may be recreated and existing references or event handlers may be lost. [3](https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml)

---

## createElement

```javascript
const btn = document.createElement("button");

btn.addEventListener("click", save);
```

Existing nodes remain intact.

[3](https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml)

---

# React Connection

React generally avoids direct `innerHTML` usage.

Instead:

```jsx
<div>{name}</div>
```

React creates and updates DOM nodes internally using its rendering engine and Virtual DOM approach. Internal React training materials describe React updating only changed parts of the UI rather than rebuilding everything. React-PPT-v4 2.pdf explains this Virtual DOM diffing workflow. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)

React only uses HTML injection explicitly through:

```jsx
dangerouslySetInnerHTML;
```

which is intentionally named to highlight security concerns.

---

# Architect Interview Answer (2 Minutes)

> `innerHTML` works by parsing an HTML string and generating DOM nodes, while `createElement()` builds DOM nodes programmatically. From a performance perspective, `innerHTML` can be efficient for inserting large static HTML blocks once, but frequent updates may require reparsing and recreating DOM structures. `createElement()` is generally better for incremental updates and preserving existing DOM state. From a security perspective, `innerHTML` can introduce XSS vulnerabilities when used with untrusted data, whereas `createElement()` combined with `textContent` safely renders user input as text. From a maintainability standpoint, `innerHTML` is concise for simple templates, but DOM APIs provide better structure, preserve event handlers and references, and scale better in complex applications. [2](https://www.javascripttutorial.net/javascript-dom/javascript-innerhtml-vs-createelement/)[3](https://stackoverflow.com/questions/2946656/advantages-of-createelement-over-innerhtml)[4](https://persistentsystemsnam.sharepoint.com/sites/KnowledgeCenter/Shared%20Documents/secure_coding.pdf?web=1)

---

## DOM Performance

### 4.

**A page contains 50,000 rows in a data grid. Direct DOM rendering causes performance issues. Design a scalable solution.**

**Expected Discussion**

- Virtualization
- Windowing
- Infinite Scroll
- Intersection Observer
- React Virtualized / AG Grid

# Architect Question

## A page contains 50,000 rows in a data grid. Direct DOM rendering causes performance issues. Design a scalable solution.

---

# Problem Analysis

Naively rendering:

```text
50,000 Rows
×
20 Columns
=
1,000,000 Cells
```

would create hundreds of thousands (or millions) of DOM nodes.

Issues:

❌ Long initial load time

❌ Huge memory consumption

❌ Slow scrolling

❌ Expensive reflows/repaints

❌ Browser may become unresponsive

Modern grid solutions avoid rendering all rows and instead render only what the user can see. Virtualization and DOM virtualisation techniques are specifically designed for large datasets. [1](https://www.ag-grid.com/angular-data-grid/dom-virtualisation/)[2](https://ej2.syncfusion.com/angular/documentation/grid/scrolling/virtual-scrolling)

---

# High-Level Architecture

```text
API
 ↓
Server Pagination
 ↓
Grid Store
 ↓
Virtualization Layer
 ↓
Visible Rows Only
 ↓
DOM
```

---

# Solution 1: Row Virtualization (Most Important)

## Core Idea

Render only visible rows.

Example:

```text
Total Rows: 50,000

Visible Rows: 30
Overscan: 10

DOM Rows:
≈ 40
```

instead of:

```text
DOM Rows:
50,000
```

Virtualization libraries render only rows inside the viewport and dynamically add/remove rows as the user scrolls. [1](https://www.ag-grid.com/angular-data-grid/dom-virtualisation/)[3](https://mui.com/x/react-data-grid/virtualization/)

---

## Visual Example

### Without Virtualization

```text
DOM
├── Row 1
├── Row 2
├── Row 3
...
├── Row 50000
```

### With Virtualization

```text
DOM
├── Row 2050
├── Row 2051
├── Row 2052
...
├── Row 2080
```

Only visible rows exist.

---

# Solution 2: Windowing

Windowing is a virtualization technique.

Example viewport:

```text
Viewport Height = 600px

Row Height = 30px

Visible Rows = 20
```

Render:

```text
20 visible
+
10 above
+
10 below
```

```text
40 DOM rows
```

As the user scrolls:

```text
Rows Removed
Rows Added
```

The DOM size remains constant.

Libraries such as AG Grid and MUI Data Grid use row virtualisation/windowing approaches. [1](https://www.ag-grid.com/angular-data-grid/dom-virtualisation/)[3](https://mui.com/x/react-data-grid/virtualization/)

---

# Solution 3: Infinite Scroll

Never load 50,000 records initially.

Instead:

```text
Load 100
↓
Scroll
↓
Load Next 100
↓
Scroll
↓
Load Next 100
```

Benefits:

✅ Faster initial load

✅ Lower memory usage

✅ Better network utilization

---

# Solution 4: Intersection Observer

Avoid:

```javascript
window.addEventListener("scroll");
```

which fires continuously.

Instead:

```javascript
const observer = new IntersectionObserver(callback);
```

When the sentinel row becomes visible:

```text
Load Next Page
```

An internal example references an infinite-scroll hook that lazy-loads content using `IntersectionObserver`. [4](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/Shivani_Pote_Resume.pdf?web=1)

---

## Example

```javascript
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    loadNextPage();
  }
});

observer.observe(loaderRef.current);
```

---

# Solution 5: Server-Side Pagination

Never send:

```text
50,000 rows
```

to the browser.

API:

```http
GET /customers?page=10&size=100
```

Response:

```json
{
  "rows": [...],
  "total": 50000
}
```

Benefits:

✅ Smaller payloads

✅ Faster startup

✅ Better scalability

---

# Solution 6: Column Virtualization

Often forgotten.

Example:

```text
200 Columns
```

User can only see:

```text
10 Columns
```

Render:

```text
Only Visible Columns
```

AG Grid and modern data-grid engines support row and column virtualization. [1](https://www.ag-grid.com/angular-data-grid/dom-virtualisation/)[3](https://mui.com/x/react-data-grid/virtualization/)

---

# React Stack Recommendation

## Option A: react-window

```bash
npm install react-window
```

Best for:

```text
Very Large Lists
Simple Implementation
```

---

## Option B: React Virtualized

```bash
npm install react-virtualized
```

Provides:

```text
Grid
Table
List
AutoSizer
InfiniteLoader
```

---

## Option C: AG Grid Enterprise

Best Enterprise Solution.

Features:

✅ Row Virtualization

✅ Column Virtualization

✅ Server-Side Row Model

✅ Infinite Scrolling

✅ Column Pinning

✅ Grouping

✅ Tree Data

Enterprise implementations within your organisation reference AG Grid Enterprise grids and infinite-scroll patterns. [4](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/Shivani_Pote_Resume.pdf?web=1)

---

# Production Optimizations

## Memoization

```javascript
React.memo(Row);
```

Avoids unnecessary row rerenders.

---

## Stable Keys

```jsx
<Row key={row.id} />
```

Never:

```jsx
key = { index };
```

for dynamic data.

---

## Batch Updates

Use:

```javascript
startTransition();
```

for non-blocking updates.

---

## Avoid Layout Thrashing

Bad:

```javascript
read;
write;
read;
write;
```

Good:

```javascript
read all
↓
write all
```

---

# Architecture Diagram

```text
           API
            │
            ▼
   Server Pagination
            │
            ▼
      Grid Store
            │
            ▼
   Infinite Loader
            │
            ▼
 IntersectionObserver
            │
            ▼
     Virtualization
            │
            ▼
      Windowed DOM
       (~40 rows)
```

---

# Architect-Level Answer (2 Minutes)

> Rendering 50,000 rows directly is not scalable because it creates excessive DOM nodes, memory pressure, layout calculations, and repaint costs. My solution would combine server-side pagination, row and column virtualization, windowing, and lazy data loading. The grid should render only the rows and columns visible in the viewport plus a small overscan buffer. Additional data should be fetched incrementally using infinite scrolling triggered by an `IntersectionObserver` rather than scroll listeners. For React, I would use `react-window`, `react-virtualized`, or AG Grid's DOM virtualization and server-side row model. This reduces DOM size from tens of thousands of nodes to only a few dozen visible rows, providing smooth scrolling, low memory usage, and enterprise-scale performance. [1](https://www.ag-grid.com/angular-data-grid/dom-virtualisation/)[3](https://mui.com/x/react-data-grid/virtualization/)[2](https://ej2.syncfusion.com/angular/documentation/grid/scrolling/virtual-scrolling)[4](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/Shivani_Pote_Resume.pdf?web=1)

---

### 5.

**How would you measure DOM performance in production without affecting user experience?**

**Expected Discussion**

- Performance API
- Long Tasks API
- Web Vitals
- Lighthouse

# How Would You Measure DOM Performance in Production Without Affecting User Experience?

## Architect Mindset

A common mistake is:

```text
Open DevTools
Run Profiling
Check FPS
```

This works in development but not in production.

In production, we need:

✅ Real User Monitoring (RUM)

✅ Low overhead

✅ Useful metrics

✅ Automated alerts

✅ No impact on users

---

# Architecture

```text
User Browser
       │
       ▼
Performance API
       │
       ▼
Long Tasks API
       │
       ▼
Web Vitals Collection
       │
       ▼
Monitoring Platform
(Sentry / Datadog / New Relic)
       │
       ▼
Dashboards & Alerts
```

---

# 1. Performance API

## Why?

The browser already exposes timing information.

No heavy profiling needed.

### Navigation Timing

```javascript
const navigation = performance.getEntriesByType("navigation")[0];

console.log(navigation.domContentLoadedEventEnd);
```

Measures:

```text
TTFB
DOM Load
Page Load
Resource Timing
```

---

## Measure Custom DOM Operations

```javascript
performance.mark("grid-start");

renderGrid();

performance.mark("grid-end");

performance.measure("grid-render", "grid-start", "grid-end");
```

Output:

```text
Grid Render Time
```

with very little overhead.

---

# 2. Long Tasks API

## Why?

Users complain:

```text
Page freezes
Scrolling lags
Clicks delayed
```

Often caused by:

```text
Main Thread Blocking
```

---

## Detect Long Tasks

```javascript
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(entry.duration);
  });
}).observe({
  type: "longtask",
  buffered: true,
});
```

Long task:

```text
> 50ms
```

indicates:

```text
Heavy JS
Large DOM updates
Layout Thrashing
Expensive Rendering
```

---

## Production Use

Send only:

```json
{
  "page": "/grid",
  "longTask": 320
}
```

instead of full traces.

Keeps monitoring lightweight.

---

# 3. Web Vitals

This is what I would prioritize most for real users.

Your internal notes summarize Core Web Vitals as:

```text
LCP = Loading
INP = Responsiveness
CLS = Visual Stability
```

and show using `PerformanceObserver` to measure them. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)

---

## Metrics

### LCP

```text
Largest Contentful Paint
```

Measures:

```text
How quickly major content becomes visible
```

Target:

```text
< 2.5 sec
```

---

### INP

```text
Interaction to Next Paint
```

Measures:

```text
Click responsiveness
```

---

### CLS

```text
Cumulative Layout Shift
```

Measures:

```text
Unexpected UI movement
```

Target:

```text
< 0.1
```

---

## Production Collection

```javascript
new PerformanceObserver((list) => {
  console.log(list.getEntries());
}).observe({
  type: "largest-contentful-paint",
  buffered: true,
});
```

This provides real-user metrics with minimal impact. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)

---

# 4. Lighthouse

## Important Architecture Point

### Lighthouse is NOT Production Monitoring

Interview trick.

Many candidates say:

```text
"We use Lighthouse in Production."
```

Wrong.

Lighthouse is mainly:

```text
Lab Testing
Synthetic Testing
CI/CD Validation
Pre-release Analysis
```

Lighthouse measures Core Web Vitals and provides diagnostics, but it should be complemented with real user monitoring because lab data alone doesn't reflect all real-user conditions. [2](https://web.dev/articles/optimize-vitals-lighthouse)[3](https://qaskills.sh/blog/performance-monitoring-testing-guide)

---

## How Architects Use Lighthouse

### CI/CD

```text
Pull Request
      ↓
Lighthouse Audit
      ↓
Performance Budget Check
      ↓
Pass / Fail
```

Example:

```text
LCP > 2.5s
Fail Build
```

---

## Continuous Tracking

Many teams run:

```text
Scheduled Lighthouse Audits
```

and compare:

```text
Current Score
vs
Baseline
```

to catch regressions before users notice them. [3](https://qaskills.sh/blog/performance-monitoring-testing-guide)[4](https://www.lighthouse-aimetrics.com/web-performance-monitoring)

---

# What I Would Measure in a Large React App

## Rendering Metrics

```text
Component Render Time
Commit Time
Hydration Time
```

---

## DOM Metrics

```text
DOM Node Count
Long Tasks
Layout Shifts
```

---

## User Metrics

```text
LCP
INP
CLS
```

---

## Business Metrics

```text
Grid Load Time
Search Response Time
Dashboard Render Time
```

---

# Production Monitoring Strategy

### Development

```text
Chrome DevTools
React Profiler
Lighthouse
```

---

### Staging

```text
Lighthouse CI
Performance Budgets
```

---

### Production

```text
Performance API
+
Long Tasks API
+
Web Vitals
+
RUM Dashboard
```

---

# Architect-Level Interview Answer (2 Minutes)

> In production, I avoid heavyweight profiling because it can impact users. Instead, I rely on browser-native APIs and Real User Monitoring. I use the Performance API to measure navigation timing and custom rendering milestones, the Long Tasks API to identify main-thread blocking and expensive DOM work, and Web Vitals such as LCP, INP, and CLS to understand actual user experience. These metrics are sampled and sent asynchronously to monitoring platforms for dashboards and alerts. Lighthouse is valuable, but I use it primarily in development, CI/CD pipelines, and synthetic monitoring to catch regressions before release. My overall strategy is to combine lightweight browser instrumentation in production with Lighthouse-based performance audits in pre-production environments. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)[2](https://web.dev/articles/optimize-vitals-lighthouse)[3](https://qaskills.sh/blog/performance-monitoring-testing-guide)

# Architect Question

## Explain how to implement Real User Monitoring (RUM) for DOM performance and list best practices for minimizing production DOM bottlenecks.

---

# What is Real User Monitoring (RUM)?

RUM measures performance from actual users in production rather than synthetic lab tests.

Instead of:

```text
DevTools
Lighthouse
Test Environment
```

You collect:

```text
Real Device
Real Browser
Real Network
Real User Interaction
```

data continuously. Core Web Vitals and `PerformanceObserver` are commonly used building blocks for this approach. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)[2](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

---

# Production RUM Architecture

```text
User Browser
      │
      ▼
PerformanceObserver
      │
      ▼
Collect Metrics
      │
      ▼
Batch + Sample
      │
      ▼
Analytics Endpoint
      │
      ▼
Dashboard
```

---

# Step 1: Collect Core Web Vitals

Monitor:

```text
LCP
INP
CLS
```

These represent:

```text
Loading
Responsiveness
Layout Stability
```

which directly correlate with user experience. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)[3](https://unpacked.danielhowells.com/performance/performance-observer)

### Example

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    sendMetric({
      metric: "LCP",
      value: entry.startTime,
    });
  }
});

observer.observe({
  type: "largest-contentful-paint",
  buffered: true,
});
```

`PerformanceObserver` provides asynchronous observation with low overhead. [2](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)[4](https://developer.chrome.com/blog/performance-observer/)

---

# Step 2: Monitor Long Tasks

Long Tasks indicate:

```text
Blocked Main Thread
Heavy JavaScript
Large DOM Updates
Layout Thrashing
```

Tasks exceeding roughly:

```text
50ms
```

are typically considered problematic. [3](https://unpacked.danielhowells.com/performance/performance-observer)

### Example

```javascript
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    sendMetric({
      type: "longtask",
      duration: entry.duration,
    });
  });
}).observe({
  type: "longtask",
  buffered: true,
});
```

---

# Step 3: Measure DOM Rendering

Instrument expensive UI operations.

```javascript
performance.mark("grid-start");

renderGrid();

performance.mark("grid-end");

performance.measure("grid-render", "grid-start", "grid-end");
```

Track:

```text
Grid Render Time
Search Render Time
Dashboard Render Time
Modal Open Time
```

using custom measurements. `PerformanceObserver` supports observing mark/measure events. [2](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)[5](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/PerformanceObserver)

---

# Step 4: Sample Data

Never send metrics for every user.

Bad:

```text
100%
Traffic Collection
```

Good:

```text
1%
5%
10%
Sampling
```

Example:

```javascript
if (Math.random() < 0.05) {
  enableMonitoring();
}
```

---

# Step 5: Send Metrics Asynchronously

Use:

```javascript
navigator.sendBeacon();
```

instead of blocking requests.

```javascript
navigator.sendBeacon("/rum", JSON.stringify(metrics));
```

Benefits:

✅ Non-blocking

✅ Works during page unload

✅ Minimal UX impact

---

# DOM Metrics I Monitor in Production

## Core Metrics

```text
LCP
INP
CLS
```

[1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)

---

## DOM Metrics

```text
DOM Node Count
Long Tasks
Layout Shift Count
Largest Grid Render Time
```

---

## Interaction Metrics

```text
Search Response Time
Filter Application Time
Dropdown Open Time
```

---

# Best Practices for Minimizing DOM Bottlenecks

---

# 1. Reduce DOM Size

Bad:

```text
50,000 Rows
```

Good:

```text
Virtualized Viewport
```

Use:

```text
react-window
react-virtualized
AG Grid Virtualization
```

Only render visible content.

---

# 2. Avoid Layout Thrashing

Bad:

```javascript
write;
read;
write;
read;
```

Example:

```javascript
el.style.width = "500px";

console.log(el.offsetWidth);
```

This forces layout recalculation.

Good:

```text
Read All
↓↓↓
Write All
```

---

# 3. Use Virtualization Everywhere

Virtualize:

```text
Rows
Columns
Dropdown Lists
Trees
Huge Menus
```

Even:

```text
1000+ Options
```

should not all exist in the DOM.

---

# 4. Use requestAnimationFrame

Bad:

```javascript
setTimeout(update, 16);
```

Good:

```javascript
requestAnimationFrame(update);
```

Allows updates to align with the browser rendering cycle.

---

# 5. Prefer Compositor-Friendly Properties

Avoid:

```css
width
height
top
left
```

Prefer:

```css
transform
opacity
```

These often avoid layout work and can be handled more efficiently by the browser compositor. [3](https://unpacked.danielhowells.com/performance/performance-observer)

---

# 6. Batch DOM Updates

Bad:

```javascript
for (...) {
  parent.appendChild(node);
}
```

Better:

```javascript
const fragment = document.createDocumentFragment();
```

Append once.

```javascript
parent.appendChild(fragment);
```

---

# 7. Use CSS Containment

```css
.grid {
  contain: layout paint;
}
```

Limits layout recalculations to specific sections of the page.

---

# 8. Memoize React Components

```jsx
export default React.memo(Row);
```

Reduces unnecessary rerenders.

---

# 9. Monitor DOM Growth

Production alerts:

```text
DOM Nodes > 5000
```

```text
Long Tasks > 200ms
```

```text
CLS > 0.1
```

These often signal performance regressions.

---

# 10. Automate Lighthouse in CI/CD

Use Lighthouse before deployment for:

```text
LCP
CLS
INP
Accessibility
Performance Budgets
```

Lighthouse is excellent for catching regressions before production, while RUM captures what users actually experience.

---

# Architect-Level Answer (2 Minutes)

> For production monitoring, I implement Real User Monitoring using the browser's `PerformanceObserver`, Performance API, Long Tasks API, and Core Web Vitals collection. Metrics are sampled, batched, and sent asynchronously to a monitoring backend using low-overhead mechanisms such as `sendBeacon`. I track LCP, INP, CLS, long tasks, custom render timings, and high-cost UI operations such as grid rendering. To minimize DOM bottlenecks, I focus on virtualization, reducing DOM size, avoiding layout thrashing, batching DOM updates, using `requestAnimationFrame`, preferring `transform` and `opacity` for animations, applying CSS containment, and continuously monitoring production metrics for regressions. Lighthouse is used in CI/CD, while RUM provides real-world performance visibility from actual users. [2](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)[3](https://unpacked.danielhowells.com/performance/performance-observer)[4](https://developer.chrome.com/blog/performance-observer/)

---

### 6.

**What are the trade-offs between using `DocumentFragment`, Virtual DOM, and direct DOM updates?** [[projectpractical.com]](https://www.projectpractical.com/document-object-model-interview-questions-and-answers/), [[Masterclas...: July'26 | Meeting]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

# What are the trade-offs between `DocumentFragment`, Virtual DOM, and Direct DOM Updates?

This is a favourite **Senior/Staff/Architect UI performance question** because it tests whether you understand:

```text
DOM Cost Model
Rendering Pipeline
Reconciliation
Browser Performance
Framework Trade-offs
```

---

# High-Level Comparison

| Feature               | Direct DOM Updates | DocumentFragment         | Virtual DOM          |
| --------------------- | ------------------ | ------------------------ | -------------------- |
| Complexity            | Low                | Low                      | Medium/High          |
| Runtime Overhead      | Lowest             | Very Low                 | Higher               |
| Initial Rendering     | Fast               | Faster for large inserts | Slightly slower      |
| Frequent Updates      | Poor               | Poor                     | Excellent            |
| Diffing               | No                 | No                       | Yes                  |
| Large Lists           | Can be expensive   | Good                     | Good with diffing    |
| State Management      | Manual             | Manual                   | Built-in patterns    |
| Framework Requirement | No                 | No                       | Usually React/Vue    |
| Best Use Case         | Small updates      | Batch inserts            | Dynamic applications |

Virtual DOM is an in-memory representation of the real DOM that is reconciled and synced with the browser DOM. This description is also reflected in the internal React reference document What is ReactJS.docx. [1](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 1. Direct DOM Updates

## Example

```javascript
const div = document.getElementById("app");

div.textContent = "Hello";
```

---

## How It Works

```text
JavaScript
    ↓
Real DOM
    ↓
Style Recalc
    ↓
Layout
    ↓
Paint
```

Every change immediately touches the live DOM.

---

## Advantages

### Fastest for Small Changes

```javascript
button.textContent = "Save";
```

No abstraction.

No diffing.

No extra memory.

---

### Minimal Memory Usage

```text
Only Real DOM exists
```

No duplicate tree.

---

### Predictable

What you change:

```javascript
element.style.color = "red";
```

is exactly what happens.

---

## Disadvantages

### Frequent Updates Become Expensive

Bad:

```javascript
for (let i = 0; i < 1000; i++) {
  list.appendChild(item);
}
```

Many DOM insertions can trigger repeated browser work. [2](https://dev.to/alex_aslam/optimizing-dom-updates-in-javascript-for-better-performance-90k)[3](https://blog.carlosrojas.dev/performance-optimization-in-dom-manipulation-6669ae153847)

---

### Layout Thrashing Risk

```javascript
read;
write;
read;
write;
```

Example:

```javascript
el.style.width = "300px";

console.log(el.offsetWidth);
```

Can force synchronous layouts repeatedly. [2](https://dev.to/alex_aslam/optimizing-dom-updates-in-javascript-for-better-performance-90k)[3](https://blog.carlosrojas.dev/performance-optimization-in-dom-manipulation-6669ae153847)

---

## Best For

```text
Simple Websites
Small Components
One-off Updates
Widget Libraries
```

---

# 2. DocumentFragment

## Example

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");

  li.textContent = i;

  fragment.appendChild(li);
}

list.appendChild(fragment);
```

---

## How It Works

```text
Create Nodes
       ↓
DocumentFragment
       ↓
Single DOM Insert
```

A `DocumentFragment` is not part of the active document tree, so changes to it do not affect the live DOM until appended. [4](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)

---

## Advantages

### Excellent for Batch Inserts

Instead of:

```text
1000 DOM Inserts
```

you get:

```text
1 DOM Insert
```

which reduces style/layout work significantly. [3](https://blog.carlosrojas.dev/performance-optimization-in-dom-manipulation-6669ae153847)[2](https://dev.to/alex_aslam/optimizing-dom-updates-in-javascript-for-better-performance-90k)

---

### No Additional Runtime

Browser-native feature.

No framework.

No diffing engine.

---

### Very Memory Efficient

Only temporary storage.

No virtual tree maintained.

---

## Disadvantages

### No Diffing

If 1 item changes:

```text
You manage updates manually
```

DocumentFragment does not determine what changed.

---

### Doesn't Help Ongoing Updates

Good for:

```text
Initial Render
Bulk Creation
```

Not for:

```text
100 updates per second
```

---

## Best For

```text
Large Lists
Table Generation
Dropdown Creation
HTML Templates
Bulk DOM Insertion
```

---

# 3. Virtual DOM

## Example (React)

```jsx
function App() {
  return <div>Hello</div>;
}
```

---

## How It Works

```text
State Change
      ↓
New Virtual DOM
      ↓
Diff Algorithm
      ↓
Find Changes
      ↓
Update Real DOM
```

The Virtual DOM keeps an in-memory UI representation and synchronizes only the required changes with the real DOM. [1](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[5](https://www.javaspring.net/blog/javascript-is-the-entire-dom-updated-when-you-make-changes-to-the-dom/)

---

## Advantages

### Efficient for Frequent UI Updates

Example:

```text
Chat Apps
Dashboards
Data Grids
Trading Platforms
```

Only changed nodes are updated.

---

### Declarative Programming

Instead of:

```javascript
createElement;
appendChild;
removeChild;
```

you write:

```jsx
return <UserCard />;
```

---

### Better Maintainability

State drives UI:

```text
State → UI
```

rather than:

```text
DOM Manipulation → UI
```

---

### Reconciliation

React determines:

```text
What Changed?
```

Developers don't.

---

## Disadvantages

### Additional Memory

You maintain:

```text
Real DOM
+
Virtual DOM
```

---

### Diffing Cost

Every update requires:

```text
Virtual Tree Comparison
```

Even though the cost is usually worth it for complex UIs.

---

### Not Always Faster

For tiny updates:

```javascript
element.textContent = "Done";
```

Direct DOM is often faster because there is no reconciliation step. [5](https://www.javaspring.net/blog/javascript-is-the-entire-dom-updated-when-you-make-changes-to-the-dom/)

---

# Architect Perspective

## Small Application

```text
Direct DOM
```

Example:

```text
Marketing website
Landing page
Simple widgets
```

---

## Large Batch Rendering

```text
DocumentFragment
```

Example:

```text
10,000 Rows
Large Menu
Table Generation
```

---

## Enterprise React Application

```text
Virtual DOM
```

Example:

```text
Banking Dashboard
Trading Platform
CRM
Admin Portal
```

---

# Real-World Example

Imagine an AG Grid with 10,000 rows.

### Direct DOM

```text
Every row manually updated
```

Hard to maintain.

---

### DocumentFragment

```text
Fast initial rendering
```

But updates still manual.

---

### Virtual DOM

```text
State Changes
↓
React Diff
↓
Minimal Updates
```

Best developer productivity and maintainability.

---

# Architect-Level Answer (1 Minute)

> Direct DOM updates offer the lowest overhead and are ideal for small, infrequent changes, but they can become expensive when many updates trigger layout recalculations. DocumentFragment improves performance for bulk DOM creation by allowing nodes to be built off-screen and inserted into the live DOM in a single operation, reducing reflows. However, it provides no diffing or state management. Virtual DOM introduces an abstraction layer that keeps an in-memory representation of the UI, performs reconciliation, and applies only the minimal set of changes to the real DOM. This adds memory and diffing overhead but significantly improves maintainability and performance for complex, frequently-updating applications. In modern React applications, Virtual DOM is generally preferred for dynamic UIs, while DocumentFragment remains a valuable optimisation for large batch insertions and direct DOM is best for simple, targeted updates.

# Compare Performance Impacts

## 1. Direct DOM Updates

### Performance Characteristics

```javascript
element.textContent = "Updated";
```

### Pros

✅ Fastest for a single update

✅ No abstraction layer

✅ No memory overhead

✅ No diffing cost

### Cons

❌ Repeated DOM operations can trigger style recalculation, layout, and paint repeatedly

❌ High risk of layout thrashing in large UIs

❌ Performance degrades significantly with thousands of updates

Example:

```javascript
for (let i = 0; i < 10000; i++) {
  list.appendChild(item);
}
```

This can cause significant rendering work because every insertion touches the live DOM.

### Performance Rating

| Scenario             | Rating     |
| -------------------- | ---------- |
| Single Update        | ⭐⭐⭐⭐⭐ |
| Large Batch Insert   | ⭐⭐       |
| Frequent UI Updates  | ⭐⭐       |
| Large Enterprise App | ⭐⭐       |

---

# 2. DocumentFragment

### Performance Characteristics

```javascript
const fragment = document.createDocumentFragment();
```

The fragment exists outside the active DOM tree, allowing changes to be made without affecting the rendered document until insertion.

### Pros

✅ Excellent for bulk DOM creation

✅ Dramatically reduces DOM insertions

✅ Reduces style/layout recalculations

✅ Tiny memory footprint

Example:

```javascript
fragment.appendChild(row1);
fragment.appendChild(row2);
fragment.appendChild(row3);

table.appendChild(fragment);
```

Instead of thousands of live DOM insertions, the browser performs a single insertion operation.

### Cons

❌ No diffing

❌ No reconciliation

❌ No help with future updates

❌ State management remains manual

### Performance Rating

| Scenario             | Rating     |
| -------------------- | ---------- |
| Single Update        | ⭐⭐⭐     |
| Large Batch Insert   | ⭐⭐⭐⭐⭐ |
| Frequent UI Updates  | ⭐⭐       |
| Large Enterprise App | ⭐⭐⭐     |

---

# 3. Virtual DOM

### Performance Characteristics

```text
Old Virtual DOM
        ↓
      Diff
        ↓
New Virtual DOM
        ↓
Minimal Real DOM Updates
```

The Virtual DOM keeps an in-memory representation of the UI and synchronizes only required changes with the real DOM through reconciliation. [5](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BC38BA756-1760-4DB8-B6E4-DE2EB4FF858D%7D&file=1401873575744_Cloud%20and%20Monitoring%20Case%20Studies%20-%20Soumen%20v1.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

### Pros

✅ Minimizes unnecessary real DOM mutations

✅ Excellent for frequently-changing UIs

✅ Avoids many manual optimisation problems

✅ Works very well with component architectures

### Cons

❌ Requires memory for Virtual DOM tree

❌ Diffing itself has computational cost

❌ For tiny updates, direct DOM can actually be faster

### Performance Rating

| Scenario             | Rating     |
| -------------------- | ---------- |
| Single Update        | ⭐⭐⭐     |
| Large Batch Insert   | ⭐⭐⭐⭐   |
| Frequent UI Updates  | ⭐⭐⭐⭐⭐ |
| Large Enterprise App | ⭐⭐⭐⭐⭐ |

---

# Security Considerations

## Direct DOM Updates

### Safe

```javascript
element.textContent = userInput;
```

User input becomes text.

### Dangerous

```javascript
element.innerHTML = userInput;
```

Can introduce:

```text
XSS
HTML Injection
Script Injection
```

if input is not sanitised.

---

## DocumentFragment

### Safe Pattern

```javascript
const div = document.createElement("div");

div.textContent = userInput;

fragment.appendChild(div);
```

Since nodes are created programmatically, the attack surface is smaller.

However:

```javascript
div.innerHTML = userInput;
```

inside a fragment is still vulnerable.

### Security Rating

```text
High
```

when used with:

```javascript
createElement();
textContent;
setAttribute();
```

---

## Virtual DOM

### React Example

```jsx
<div>{userInput}</div>
```

Frameworks typically escape content before rendering.

Example:

```jsx
<script>alert(1)</script>
```

renders as text rather than executable code in normal React rendering.

### Dangerous Exception

```jsx
dangerouslySetInnerHTML;
```

This bypasses protections and requires sanitisation.

### Security Rating

```text
Very High
```

when using normal component rendering.

---

# Best Use Cases

## When to Use Direct DOM Updates

### Best For

```text
Simple Widgets
Small Websites
Browser Extensions
Tiny Components
```

Example:

```javascript
counter.textContent++;
```

Small, targeted updates.

---

# When to Use DocumentFragment

### Best For

```text
10,000 Row Table
Large Dropdown
Dynamic Menu
Bulk DOM Generation
Initial Rendering
```

Example:

```text
Generate 20,000 rows
Insert Once
```

DocumentFragment shines when you are building lots of DOM nodes up front and want to minimise live DOM work.

### Real-World Examples

```text
File Explorers
Large Select Lists
Table Rendering Engines
Template Builders
```

---

# When to Use Virtual DOM

### Best For

```text
React Applications
Admin Dashboards
CRM Systems
Banking Portals
Trading Platforms
Complex Forms
```

Example:

```text
State Changes Hundreds of Times
Per Minute
```

The reconciliation engine determines what changed and updates only the affected DOM nodes. [5](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BC38BA756-1760-4DB8-B6E4-DE2EB4FF858D%7D&file=1401873575744_Cloud%20and%20Monitoring%20Case%20Studies%20-%20Soumen%20v1.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

### Real-World Examples

```text
Facebook
Gmail-style UI
AG Grid Integrations
Real-time Dashboards
```

---

# Architect Recommendation

### Use Direct DOM

If:

```text
UI is small
Few updates
No framework needed
```

---

### Use DocumentFragment

If:

```text
You are creating thousands of elements at once
Initial render is the bottleneck
Updates are infrequent
```

---

### Use Virtual DOM

If:

```text
State-driven UI
Complex interactions
Frequent updates
Large React/Vue applications
```

---

# Interview One-Liner

> Direct DOM updates provide the lowest runtime overhead but do not scale well for large or frequent updates. DocumentFragment is ideal for batching large DOM creations because it reduces live DOM insertions and reflows. Virtual DOM introduces memory and diffing overhead, but it excels in complex state-driven applications by minimizing unnecessary real DOM mutations and greatly improving maintainability.

---

## Event Architecture

### 7.

# Architect Question

## How would you design an event handling strategy for an application containing 100,000 interactive DOM nodes?

---

# First Principle

A bad solution would be:

```javascript
100000 elements
↓
100000 event listeners
```

Example:

```javascript
items.forEach((item) => {
  item.addEventListener("click", handleClick);
});
```

Problems:

❌ Huge memory usage

❌ Slower page initialization

❌ More GC pressure

❌ Hard to manage dynamic elements

For applications with very large numbers of interactive elements, event delegation is the preferred approach. Internal training materials explicitly describe event delegation as attaching a listener to a parent and handling events from child elements. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/ScenarioBased%20question-Updated.pdf?web=1)

---

# High-Level Architecture

```text
100,000 Nodes
        │
        ▼
Single Parent Listener
        │
        ▼
Event Delegation
        │
        ▼
event.target
        │
        ▼
Execute Action
```

---

# 1. Event Delegation (Primary Strategy)

Instead of:

```text
100,000 Listeners
```

Use:

```text
1 Listener
```

on a container.

---

## Example

```html
<div id="grid">100000 rows</div>
```

```javascript
document.getElementById("grid").addEventListener("click", handleGridClick);
```

```javascript
function handleGridClick(event) {
  const row = event.target.closest(".row");

  if (!row) return;

  openDetails(row.dataset.id);
}
```

The parent handles clicks from all children using `event.target`. This pattern is specifically called out in internal JavaScript training materials. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/ScenarioBased%20question-Updated.pdf?web=1)

---

# Memory Comparison

### Bad

```text
100,000 Listeners
≈ 100,000 Closures
≈ Large Memory Cost
```

### Good

```text
1 Container Listener
≈ Constant Memory
```

---

# 2. Use Event Bubbling

Delegation relies on bubbling.

When a user clicks:

```html
<button></button>
```

Event flow:

```text
Button
 ↓
Cell
 ↓
Row
 ↓
Grid
 ↓
Document
```

Event bubbling means an event on a child travels upward through parent elements. Internal training notes describe bubbling as the default behaviour and highlight that it is useful for delegation. [3](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)[1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)

---

## Example

```javascript
grid.addEventListener("click", (event) => {
  console.log(event.target);
});
```

Single listener handles all rows.

---

# 3. Event Capturing (Selective Usage)

Most handlers should use:

```text
Bubble Phase
```

(default)

But some global concerns are easier in:

```text
Capture Phase
```

Examples:

```text
Security Auditing
Global Analytics
Access Control
Modal Management
```

Enable capturing:

```javascript
document.addEventListener("click", handler, true);
```

Internal notes describe capturing as the phase where the event travels from parent down to target and can be enabled using `capture: true`. [3](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)[1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)

---

## Event Flow

```text
Capture
↓
Target
↓
Bubble
```

```text
Document
 ↓
Grid
 ↓
Row
 ↓
Button
 ↓
Row
 ↓
Grid
 ↓
Document
```

---

# 4. Categorize Events by Container

Large systems should not delegate everything globally.

Bad:

```text
document
```

handling every UI event.

---

## Better

```text
Grid Container
Sidebar Container
Modal Container
Tree Container
```

Example:

```javascript
grid.addEventListener(...)

sidebar.addEventListener(...)

modal.addEventListener(...)
```

This reduces selector matching overhead.

---

# 5. Support Dynamic Elements

Delegation automatically supports:

```text
New Rows
Virtualized Rows
Lazy Loaded Data
Infinite Scroll
```

No need to attach listeners repeatedly.

Example:

```javascript
grid.innerHTML += newRow;
```

Existing delegated listener still works.

---

# 6. Virtualized Grids

For a 100,000-row grid:

```text
Virtualization
+
Event Delegation
```

is the ideal combination.

```text
100000 Rows Total
40 Rows Rendered
1 Listener
```

Result:

```text
Minimal DOM
Minimal Event Handlers
```

---

# 7. Prevent Unnecessary Propagation

Some elements should stop bubbling.

Example:

```html
<Row>
  <DeleteButton />
</Row>
```

Clicking Delete should not trigger:

```text
Open Row
```

Use:

```javascript
event.stopPropagation();
```

for special cases.

This pattern is also referenced in internal scenario-based interview material. [2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/ScenarioBased%20question-Updated.pdf?web=1)[4](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/Angular/Chetan%20Solanki_00002678_AI_Inteview_Evaluation.pdf?web=1)

---

# 8. Memory Optimization

## Avoid Per-Node Closures

Bad:

```javascript
rows.forEach(row => {
  row.addEventListener(
    "click",
    () => {
       ...
    }
  );
});
```

Creates:

```text
100,000 Functions
```

---

## Reuse Handlers

```javascript
function handleClick(e) {}

grid.addEventListener("click", handleClick);
```

---

## Remove Global Listeners

```javascript
removeEventListener();
```

when modals, popups, or temporary components are removed.

---

# Event Architecture Diagram

```text
User Click
      │
      ▼
   Button
      │
      ▼
     Row
      │
      ▼
     Grid
      │
      ▼
Single Delegated Listener
      │
      ▼
event.target.closest()
      │
      ▼
Required Action
```

---

# React/Enterprise Approach

For an enterprise React application:

```text
Virtualized Grid
       +
Event Delegation
       +
Memoized Components
       +
Single Event Bus
```

Example stack:

```text
AG Grid
TanStack Virtual
react-window
```

with delegated event handling at container level.

---

# Architect-Level Answer (2 Minutes)

> For an application with 100,000 interactive nodes, I would avoid attaching listeners to individual elements because the memory and initialization cost would be excessive. Instead, I would use event delegation by attaching a small number of listeners to logical container elements and relying on event bubbling to identify the actual target through `event.target` or `closest()`. Bubbling would be the primary propagation mechanism, while capturing would only be used for cross-cutting concerns such as analytics or security monitoring. I would combine delegation with virtualization so that only visible DOM nodes are rendered at any time. To optimise memory further, I would avoid per-node closures, reuse shared handlers, and clean up temporary listeners. This approach keeps listener count nearly constant, supports dynamically added elements, reduces memory consumption dramatically, and scales efficiently to hundreds of thousands of interactive elements. [3](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/Java_Interview_Notes.pdf?web=1)[1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/JavaScript%20PPT-v2%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/ScenarioBased%20question-Updated.pdf?web=1)[5](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)

---

### 8.

# Architect Question

## If a page has nested micro-frontends developed by different teams, how would you prevent event collisions and propagation issues?

This is a **Staff/Principal Frontend Architect** question.

The challenge is not DOM events themselves.

The challenge is:

```text
Team A → React
Team B → Angular
Team C → Vue
Team D → Vanilla JS

All running on the same page
```

Without governance, you'll see:

❌ Event collisions

❌ Duplicate listeners

❌ stopPropagation() breaking other MFEs

❌ Global event pollution

❌ Memory leaks

❌ Unexpected side effects

Micro-frontend guidance in your enterprise content recommends loose coupling and communication through events or event buses rather than tight dependencies. 28 MM Micro-Frontends Communication 15 Nov.docx discusses event buses and custom events, while Cross-interactivity using events - AWS Prescriptive Guidance recommends an event-bus pattern orchestrated by the shell. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[2](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/cross-interactivity.html)

---

# High-Level Architecture

```text
                 Shell
                   │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
        MFE-A    MFE-B    MFE-C
           \       |      /
            \      |     /
             ▼     ▼    ▼
              Event Bus
```

Rule:

```text
Micro Frontends
Should NOT Talk Directly
```

Instead:

```text
Publish Event
      ↓
Event Bus
      ↓
Subscribers React
```

This preserves loose coupling. [2](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/cross-interactivity.html)[3](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/routing-communication.html)[1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 1. Namespace Every Event

One of the most common problems:

```javascript
window.dispatchEvent(new CustomEvent("open"));
```

Which team owns:

```text
"open"
```

?

Nobody knows.

---

## Better

```javascript
checkout: open - cart;

search: query - change;

profile: user - updated;
```

Example:

```javascript
new CustomEvent("checkout:open-cart");
```

This avoids collisions between teams.

---

# 2. Use an Event Bus Instead of Global DOM Events

Avoid:

```javascript
window.addEventListener(...)
```

everywhere.

Enterprise micro-frontend guidance recommends injecting an event bus through the container/shell and letting micro-frontends publish and subscribe to events. 28 MM Micro-Frontends Communication 15 Nov.docx explicitly describes this pattern. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

## Shell

```javascript
eventBus.publish("cart:item-added", payload);
```

---

## Subscriber

```javascript
eventBus.subscribe("cart:item-added", callback);
```

Benefits:

✅ Loose Coupling

✅ Versioning

✅ Discoverability

✅ Easier Testing

✅ No DOM propagation problems

---

# 3. Avoid stopPropagation() as Architecture

Bad:

```javascript
event.stopPropagation();
```

used across multiple MFEs.

Why?

```text
Team A blocks event
Team B never receives event
```

and debugging becomes a nightmare.

Use it only for component-level behaviour:

```text
Dropdown
Modal
Tooltip
Context Menu
```

not as a communication mechanism.

---

# 4. Create Event Boundaries

Every MFE should own its root.

```html
<div id="checkout-app"></div>

<div id="search-app"></div>

<div id="profile-app"></div>
```

Delegate events only inside that boundary.

```javascript
checkoutRoot.addEventListener("click", handler);
```

Never:

```javascript
document.addEventListener(...)
```

for feature-specific actions.

---

# 5. Use Custom Events Instead of Raw Click Propagation

Enterprise material and micro-frontend examples both highlight using custom events for communication between independently deployed modules. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[4](<https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20(1).pdf?web=1>)[3](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/routing-communication.html)

### Instead of

```text
Click
↓
Bubble
↓
Bubble
↓
Bubble
```

---

### Use

```javascript
dispatchEvent(
  new CustomEvent("cart:item-added", {
    detail: {
      productId: 10,
    },
  }),
);
```

Business intent becomes explicit.

---

# 6. Isolate Framework Internals

Problem:

```text
React Synthetic Events
Angular Events
Vue Events
DOM Events
```

may coexist.

Architecture rule:

```text
Framework Events Stay Internal
```

Only expose:

```text
Custom Events
Event Bus Messages
Public Contracts
```

to other MFEs.

---

# 7. Introduce Event Contracts

Treat events like APIs.

Create documentation:

```typescript
interface CartItemAdded {
  event: "cart:item-added";

  productId: string;

  quantity: number;
}
```

Only event contracts are shared.

Not implementation details.

This aligns with event definitions acting as communication contracts between producers and consumers. [3](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/routing-communication.html)[2](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/cross-interactivity.html)

---

# 8. Consider Shadow DOM for Isolation

For highly independent micro-frontends:

```text
Web Components
+
Shadow DOM
```

Benefits:

✅ Event isolation

✅ Style isolation

✅ Reduced collision surface

---

# 9. Automatic Cleanup

Huge source of MFE bugs:

```javascript
window.addEventListener(...)
```

without cleanup.

Always:

```javascript
useEffect(() => {
  bus.subscribe(...);

  return () =>
    bus.unsubscribe(...);
}, []);
```

or equivalent lifecycle cleanup.

This concern is echoed in enterprise interview examples describing proper cleanup of custom event subscriptions when MFEs are unloaded. [4](<https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20(1).pdf?web=1>)

---

# Enterprise Architecture Example

### Checkout MFE

```javascript
eventBus.publish("checkout:started");
```

---

### Analytics MFE

```javascript
eventBus.subscribe("checkout:started");
```

---

### Profile MFE

```javascript
eventBus.subscribe("checkout:started");
```

No direct dependency.

```text
Publisher doesn't know subscribers

Subscribers don't know publisher
```

Perfect micro-frontend isolation. [2](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/cross-interactivity.html)[3](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/routing-communication.html)[1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Architect-Level Answer (2 Minutes)

> For nested micro-frontends developed by multiple teams, I would avoid relying on native DOM propagation as the primary communication mechanism. Instead, I would establish clear ownership boundaries and use an event-bus or well-defined CustomEvent contracts orchestrated by the shell application. All shared events would be namespaced, versioned, and documented to prevent collisions. Each micro-frontend would handle delegated events only within its root container and expose business-level events such as `cart:item-added` rather than raw DOM interactions. I would avoid using `stopPropagation()` except for local UI concerns because it creates hidden coupling across teams. Framework-specific events remain internal, while cross-MFE communication happens through an event bus, ensuring loose coupling, easier testing, predictable behaviour, and independent deployments. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[2](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/cross-interactivity.html)[3](https://docs.aws.amazon.com/prescriptive-guidance/latest/micro-frontends-aws/routing-communication.html)

---

### 9.

# Design a Custom Event Bus using DOM `CustomEvent`

## 1. Why use DOM Custom Events?

A DOM `CustomEvent` lets independently developed modules communicate using browser-native events and a custom payload through the `detail` property. In micro-frontend communication, internal Persistent material lists **event emitter**, **custom events**, **web storage**, and **query strings** as communication options, and specifically describes custom events as normal events with a custom body. 28 MM Micro-Frontends Communication 15 Nov.docx also notes that an event bus can be injected into micro-frontends so interested micro-frontends can listen and react. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

External micro-frontend guidance also recommends asynchronous event-based communication to reduce coupling between micro-frontends, using mechanisms such as native DOM events, JavaScript event emitters, or reactive stream libraries. [2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B098E59EE-13D7-4387-AA2A-692D3B65D100%7D&file=12%20MM%20MicroFrontEnds%2026%20July.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 2. Basic Event Bus Design

Instead of allowing every micro-frontend to directly call another micro-frontend, we create a small publish/subscribe layer.

```text
Micro-frontend A
      │
      ▼
 publish("cart:item-added")
      │
      ▼
 Event Bus
      │
      ▼
 subscribers react
```

---

# 3. TypeScript Event Contract

First define event contracts.

```ts
type AppEvents = {
  "cart:item-added": {
    productId: string;
    quantity: number;
  };

  "auth:user-logged-in": {
    userId: string;
    name: string;
  };

  "notification:show": {
    message: string;
    type: "success" | "error" | "info";
  };
};
```

This avoids random event names such as:

```ts
"open";
"update";
"change";
```

and encourages namespaced event names.

---

# 4. Event Bus Implementation using `EventTarget`

```ts
type EventCallback<T> = (payload: T) => void;

class DOMEventBus<Events extends Record<string, any>> {
  private target: EventTarget;

  constructor() {
    this.target = new EventTarget();
  }

  publish<K extends keyof Events>(eventName: K, payload: Events[K]): void {
    const event = new CustomEvent(String(eventName), {
      detail: payload,
    });

    this.target.dispatchEvent(event);
  }

  subscribe<K extends keyof Events>(
    eventName: K,
    callback: EventCallback<Events[K]>,
  ): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Events[K]>;
      callback(customEvent.detail);
    };

    this.target.addEventListener(String(eventName), handler);

    return () => {
      this.target.removeEventListener(String(eventName), handler);
    };
  }
}

export const eventBus = new DOMEventBus<AppEvents>();
```

The browser `PerformanceObserver` source is not related here, but the DOM event approach itself is supported by browser-native event APIs; `CustomEvent` is commonly used as a zero-dependency event bus pattern in micro-frontend communication guidance. [3](https://micro-frontend-architecture.com/cross-app-state-context-sharing/event-bus-patterns-for-decoupled-apps/broadcastchannel-vs-rxjs-vs-customevent-for-event-bus/)[4](https://docs.bswen.com/blog/2026-04-30-customevent-state-management/)

---

# 5. Publishing an Event

Example: Cart micro-frontend publishes an event.

```ts
eventBus.publish("cart:item-added", {
  productId: "P101",
  quantity: 2,
});
```

---

# 6. Subscribing to an Event

Example: Header micro-frontend updates cart count.

```ts
const unsubscribe = eventBus.subscribe("cart:item-added", (payload) => {
  console.log("Product added:", payload.productId);

  updateCartBadge(payload.quantity);
});
```

When the component unmounts:

```ts
unsubscribe();
```

Cleanup is important because stale subscriptions can cause memory leaks or unexpected behaviour. In micro-frontend examples, unsubscription/cleanup is typically a key lifecycle concern when components are mounted and unmounted independently. [3](https://micro-frontend-architecture.com/cross-app-state-context-sharing/event-bus-patterns-for-decoupled-apps/broadcastchannel-vs-rxjs-vs-customevent-for-event-bus/)

---

# 7. React Usage Example

```tsx
import { useEffect } from "react";
import { eventBus } from "./eventBus";

function CartBadge() {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe("cart:item-added", (payload) => {
      console.log(payload.quantity);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <div>Cart Badge</div>;
}
```

---

# 8. Vanilla JavaScript Version

If you do not want a class, you can use `document` or `window`.

```js
function publish(eventName, payload) {
  window.dispatchEvent(
    new CustomEvent(eventName, {
      detail: payload,
    }),
  );
}

function subscribe(eventName, callback) {
  const handler = (event) => {
    callback(event.detail);
  };

  window.addEventListener(eventName, handler);

  return () => {
    window.removeEventListener(eventName, handler);
  };
}
```

Internal micro-frontend material mentions that custom events can be dispatched via an object available to all micro-frontends, such as the `window` object. 28 MM Micro-Frontends Communication 15 Nov.docx also notes that iframe-based micro-frontends introduce additional complexity because each iframe has its own `window` object. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 9. When is DOM Custom Event Bus Preferred?

## Prefer Event Bus when:

```text
Micro-frontends are loosely coupled
Different teams own different modules
Different frameworks are used
Events are transient
No shared global state is required
Communication is cross-boundary
```

Examples:

```text
cart:item-added
notification:show
modal:open
analytics:track-click
auth:user-logged-out
```

External guidance describes CustomEvent as useful when you want zero dependencies and DOM-native semantics for in-page communication, while BroadcastChannel is more suitable when communication must cross browser tabs. [3](https://micro-frontend-architecture.com/cross-app-state-context-sharing/event-bus-patterns-for-decoupled-apps/broadcastchannel-vs-rxjs-vs-customevent-for-event-bus/)

---

# 10. When is Redux Better?

Redux is better when you need:

```text
Global application state
Predictable state transitions
Debugging with DevTools
Middleware
Time-travel debugging
Derived selectors
Complex workflows
```

Example:

```text
User session
Cart state
Permissions
Feature flags
Theme
Tenant context
```

Micro-frontend Redux guidance warns that synchronising Redux across independently deployed micro-frontends can introduce issues such as duplicate store instances, action type collisions, hydration races, and stale subscriptions. [5](https://micro-frontend-architecture.com/cross-app-state-context-sharing/synchronizing-redux-across-micro-frontends/)

So Redux is powerful, but only if you genuinely need shared state and can control the store architecture.

---

# 11. When is Context API Better?

Context API is better when communication is:

```text
Inside one React application
Within one component tree
Mostly static or low-frequency
Framework-specific
```

Good examples:

```text
ThemeContext
AuthContext
LocaleContext
FeatureFlagContext
```

But Context is not ideal for cross-framework micro-frontends because Angular, Vue, and vanilla JavaScript cannot directly consume React Context. This is an architectural limitation based on Context being tied to React’s component tree, so for cross-MFE communication a CustomEvent or event bus is usually more framework-agnostic.

---

# 12. Event Bus vs Redux vs Context API

| Criteria                     | DOM Custom Event Bus | Redux                                   | Context API            |
| ---------------------------- | -------------------- | --------------------------------------- | ---------------------- |
| Best for                     | Cross-MFE events     | Shared application state                | React tree state       |
| Coupling                     | Low                  | Medium/High                             | Medium                 |
| Framework-agnostic           | Yes                  | Mostly JS, but store integration needed | No, React-specific     |
| Persistent state             | No                   | Yes                                     | Yes, within React tree |
| Debugging                    | Limited              | Strong with DevTools                    | Limited                |
| Replay/history               | No                   | Yes, with tooling                       | No                     |
| Setup cost                   | Low                  | Medium                                  | Low                    |
| Use across React/Angular/Vue | Good                 | Possible but needs architecture         | Poor                   |
| Good for transient events    | Excellent            | Overkill                                | Not ideal              |

---

# 13. Security and Governance

For enterprise micro-frontends, do not allow uncontrolled event names and payloads.

## Recommended Rules

```text
1. Namespace event names
2. Define TypeScript contracts
3. Validate payloads at boundaries
4. Avoid sensitive data in events
5. Do not use query strings for sensitive data
6. Always unsubscribe on unmount
7. Keep events business-oriented, not DOM-oriented
```

Internal material specifically warns that query strings should be used carefully and are not the most secure way to pass sensitive data such as passwords and user IDs. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 14. Best Event Naming Convention

Use:

```text
domain:action
```

Examples:

```ts
"cart:item-added";
"cart:item-removed";
"auth:user-logged-in";
"auth:user-logged-out";
"profile:updated";
"notification:show";
```

Avoid:

```ts
"click";
"update";
"open";
"change";
```

---

# 15. Architect-Level Answer

> I would design a DOM CustomEvent-based event bus as a lightweight publish/subscribe layer using `EventTarget` or `window`. Each event would be namespaced and strongly typed with a clear payload contract. Micro-frontends would publish business-level events such as `cart:item-added` or `auth:user-logged-out`, and other micro-frontends would subscribe without knowing who published the event. This keeps teams loosely coupled and supports React, Angular, Vue, or vanilla JavaScript on the same page. I would prefer this approach over Redux or Context API when the communication is cross-micro-frontend, transient, framework-agnostic, and does not require persistent shared state. I would prefer Redux when I need predictable global state, middleware, DevTools, and complex state-driven workflows. I would prefer Context API only inside a single React application tree for local shared concerns such as theme, locale, or authentication context. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BD0615EB2-EDC6-455C-9C16-7BF5AB558081%7D&file=28%20MM%20Micro-Frontends%20Communication%2015%20Nov.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[2](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B098E59EE-13D7-4387-AA2A-692D3B65D100%7D&file=12%20MM%20MicroFrontEnds%2026%20July.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[3](https://micro-frontend-architecture.com/cross-app-state-context-sharing/event-bus-patterns-for-decoupled-apps/broadcastchannel-vs-rxjs-vs-customevent-for-event-bus/)[5](https://micro-frontend-architecture.com/cross-app-state-context-sharing/synchronizing-redux-across-micro-frontends/)

---

## Virtual DOM vs Real DOM

### 10.

**Explain how React's Virtual DOM works internally and why it improves performance.** The React masterclass materials and meeting discussion explicitly describe creating a Virtual DOM in memory, diffing old vs new Virtual DOM, and updating only changed parts of the real DOM. [[Masterclas...: July'26 | Meeting]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d), [[Masterclas...: July'26 | Meeting]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

# Explain How React's Virtual DOM Works Internally and Why It Improves Performance

This is one of the most important **Senior React / Architect** interview questions.

A strong answer should cover:

- Real DOM
- Virtual DOM
- Reconciliation
- Diffing Algorithm
- Fiber Architecture
- Render Phase vs Commit Phase
- Why it improves performance

Internal React training materials describe the Virtual DOM as an in-memory JavaScript representation of the UI that React compares and synchronises with the real DOM through a diffing process. React-PPT-v4 2.pdf and What is ReactJS.docx both describe this reconciliation process. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 1. What is the Real DOM?

The browser converts HTML into:

```html
<div>
  <h1>Hello</h1>
</div>
```

↓

```text
Document
 └─ div
     └─ h1
```

This is called:

```text
Real DOM
```

Whenever you modify it:

```javascript
heading.textContent = "Hi";
```

the browser may need to perform:

```text
Style Recalculation
↓
Layout (Reflow)
↓
Paint
↓
Composite
```

These operations become expensive in large applications. [3](https://dev.to/alamfatima1999/react-virtual-dom-reconciliation-fiber-354n)[4](https://medium.com/@ddhote780/react-behind-the-scenes-virtual-dom-reconciliation-render-phase-commit-phase-fiber-explained-c7625609491a)

---

# 2. What is Virtual DOM?

The Virtual DOM is:

```text
A lightweight JavaScript object tree
stored in memory
```

Example:

```jsx
<div>
  <h1>Hello</h1>
</div>
```

becomes something conceptually similar to:

```javascript
{
  type: "div",
  children: [
    {
      type: "h1",
      children: ["Hello"]
    }
  ]
}
```

React keeps this representation in memory instead of manipulating the browser DOM directly. What is ReactJS.docx describes the Virtual DOM as an in-memory representation of the real DOM. [2](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 3. What Happens When State Changes?

Consider:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button>{count}</button>;
}
```

User clicks:

```javascript
setCount(1);
```

React performs:

```text
Old Virtual DOM
        ↓
Create New Virtual DOM
        ↓
Compare Both Trees
        ↓
Find Differences
        ↓
Update Real DOM
```

Internal React training material describes exactly this workflow: create old Virtual DOM, create new Virtual DOM after state change, compare them, and update only the changed parts of the real DOM. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[5](https://persistentsystems-my.sharepoint.com/personal/sonali_ogale_persistent_com/Documents/Forms/DispForm.aspx?ID=29793&web=1)

---

# 4. Reconciliation

The comparison process is called:

```text
Reconciliation
```

Its purpose:

```text
Keep UI in sync
with minimum DOM work
```

React compares:

```text
Old Virtual DOM
vs
New Virtual DOM
```

and determines:

```text
What changed?
```

without re-rendering the entire page. [2](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)

---

# 5. Diffing Algorithm

Imagine:

### Before

```jsx
<button>Click</button>
```

### After

```jsx
<button>Submit</button>
```

React compares:

```text
Button
Same Element Type ✅
```

Only text changed.

Instead of rebuilding:

```html
<button>Submit</button>
```

React updates only:

```text
textContent
```

This results in minimal DOM mutation. [6](https://bing.com/search?q=React+Virtual+DOM+reconciliation+React+Fiber)[7](https://dev.to/ad99526/react-reconciliation-fiber-and-virtual-dom-explained-without-the-jargon-51ng)

---

# 6. React Diffing Rules

## Rule 1

Different element types:

### Before

```jsx
<div />
```

### After

```jsx
<span />
```

React:

```text
Remove Old Node
Create New Node
```

---

## Rule 2

Same element type:

### Before

```jsx
<div className="red" />
```

### After

```jsx
<div className="blue" />
```

React:

```text
Update Attribute Only
```

---

## Rule 3

Lists Need Keys

```jsx
users.map((user) => <Row key={user.id} />);
```

Keys help React identify:

```text
Added Items
Removed Items
Moved Items
```

efficiently. [8](https://github.com/SuryaSahh/-Virtual-DOM-Reconciliation-and-React-Fiber)

---

# 7. Render Phase vs Commit Phase

Modern React separates updates into two phases.

---

## Render Phase

React:

```text
Creates New Virtual DOM
Runs Diffing
Builds Work Tree
Calculates Changes
```

No actual DOM updates occur yet.

According to React Fiber descriptions, this phase can be interrupted and resumed. [9](https://www.codingfizz.in/2024/06/react-fiber.html)[10](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

---

## Commit Phase

React:

```text
Applies Changes
to Real DOM
```

This phase is synchronous.

React updates:

```text
DOM
Refs
Effects
```

at this stage. [9](https://www.codingfizz.in/2024/06/react-fiber.html)[10](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

---

# 8. React Fiber (Modern React Internals)

Older React:

```text
Stack Reconciler
```

performed all work synchronously.

Problem:

```text
Large Tree
↓
Long Blocking Work
↓
Frozen UI
```

---

React introduced:

```text
Fiber
```

which is the reconciliation engine responsible for scheduling and processing updates. 00-executive-summary-ReactCodeBase.pdf describes Fiber as supporting incremental rendering, prioritisation, pausing, aborting, and reusing work. What is ReactJS.docx also describes Fiber as React's reconciliation engine that enables incremental rendering. [10](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# How Fiber Works

Instead of:

```text
Process Entire Tree
```

Fiber does:

```text
Split Work
↓
Process Small Units
↓
Pause
↓
Resume Later
```

Benefits:

```text
Responsive UI
Smooth Animations
No Main Thread Blocking
```

[10](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[9](https://www.codingfizz.in/2024/06/react-fiber.html)

---

# Example of Prioritisation

React treats updates differently:

### High Priority

```text
Typing
Clicking
Animations
```

### Low Priority

```text
Background Lists
Filtering
Transitions
```

Fiber schedules work based on priority instead of processing everything immediately. [10](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[9](https://www.codingfizz.in/2024/06/react-fiber.html)

---

# Why Virtual DOM Improves Performance

Many developers think:

```text
Virtual DOM = Faster DOM
```

Not exactly.

The benefit is:

```text
Less Real DOM Work
```

---

## Without Virtual DOM

```text
State Change
↓
Developer Updates DOM
↓
Many DOM Operations
↓
Layout
↓
Paint
```

---

## With Virtual DOM

```text
State Change
↓
Create New VDOM
↓
Diff
↓
Find Smallest Change
↓
Update Real DOM
```

Result:

✅ Fewer DOM mutations

✅ Less layout recalculation

✅ Less repainting

✅ Better maintainability

✅ Declarative programming model

[1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[6](https://bing.com/search?q=React+Virtual+DOM+reconciliation+React+Fiber)

---

# Important Interview Clarification

Many senior interviewers expect this:

> Virtual DOM is **not always faster** than direct DOM updates.

For example:

```javascript
button.textContent = "Done";
```

A direct DOM update can be faster than creating a new Virtual DOM tree.

The advantage of Virtual DOM appears when:

```text
Large Component Trees
Frequent State Changes
Complex UI Updates
```

because React can efficiently determine and batch minimal updates. [6](https://bing.com/search?q=React+Virtual+DOM+reconciliation+React+Fiber)[7](https://dev.to/ad99526/react-reconciliation-fiber-and-virtual-dom-explained-without-the-jargon-51ng)

---

# Architect-Level Answer (2 Minutes)

> React's Virtual DOM is an in-memory JavaScript representation of the UI. When state or props change, React creates a new Virtual DOM tree and compares it with the previous one using the reconciliation process and diffing algorithm. React identifies the minimal set of changes and applies only those updates to the real DOM instead of rebuilding the entire UI. Modern React uses the Fiber reconciliation engine, which breaks rendering work into smaller units, assigns priorities, and can pause and resume rendering to keep the application responsive. The main performance benefit is not that the Virtual DOM itself is faster, but that it reduces expensive real DOM operations, layout recalculations, and paints while providing a scalable and maintainable programming model for large applications. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)[10](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[6](https://bing.com/search?q=React+Virtual+DOM+reconciliation+React+Fiber)
>
> # React Fiber's Role in Virtual DOM Updates

Most developers think:

```text
State Change
↓
Virtual DOM
↓
Diff
↓
DOM Update
```

But modern React actually works through **Fiber**, which is React's reconciliation engine. Internal React architecture material describes Fiber as the core reconciler responsible for incremental rendering, prioritisation, pausing, aborting, and reusing work.

---

## Before React Fiber

Older React used a synchronous reconciliation model:

```text
State Change
↓
Process Entire Component Tree
↓
Update DOM
```

Problem:

```text
Large Tree
↓
Long Running Work
↓
Main Thread Blocked
↓
UI Freeze
```

A large update could delay:

- Typing
- Scrolling
- Animations
- User interactions

---

## React Fiber Architecture

Fiber breaks rendering work into small units.

```text
State Change
↓
Build Work-In-Progress Tree
↓
Process Component A
↓
Pause
↓
Process Component B
↓
Pause
↓
Resume Later
```

React can:

✅ Pause work

✅ Resume work

✅ Abort work

✅ Re-prioritise work

✅ Reuse completed work

This capability is specifically highlighted in React's Fiber architecture documentation.

---

## Fiber + Virtual DOM

### Virtual DOM's Job

```text
What should the UI look like?
```

### Fiber's Job

```text
How and when should React update it?
```

Think of it as:

```text
Virtual DOM
     =
Blueprint

Fiber
     =
Construction Manager
```

The Virtual DOM describes UI changes, while Fiber schedules and executes those changes efficiently.

---

# React Diffing Algorithm (Detailed)

The core challenge:

When state changes:

```jsx
setCount(count + 1);
```

React must determine:

```text
What actually changed?
```

without rebuilding the entire UI.

---

## Step 1: Create New Virtual DOM Tree

### Before

```jsx
<button>Click</button>
```

Virtual DOM:

```javascript
{
  type: "button",
  children: ["Click"]
}
```

---

### After

```jsx
<button>Submit</button>
```

New Virtual DOM:

```javascript
{
  type: "button",
  children: ["Submit"]
}
```

---

## Step 2: Compare Trees

This is called:

```text
Diffing
```

React compares:

```text
Old Tree
vs
New Tree
```

Internal React training material describes this process as comparing the old and new Virtual DOM and updating only the changed parts.

---

## Diffing Rule #1

### Different Element Types

Before:

```jsx
<div />
```

After:

```jsx
<span />
```

React assumes:

```text
Entire Subtree Changed
```

and performs:

```text
Unmount Old Tree
Create New Tree
```

---

## Diffing Rule #2

### Same Element Type

Before:

```jsx
<div className="red" />
```

After:

```jsx
<div className="blue" />
```

React updates:

```text
className only
```

instead of recreating the entire node.

---

## Diffing Rule #3

### Text Node Changes

Before:

```jsx
<button>Click</button>
```

After:

```jsx
<button>Submit</button>
```

React updates:

```javascript
button.textContent = "Submit";
```

Only the text changes.

---

## Diffing Rule #4

### Lists Use Keys

Bad:

```jsx
items.map((item) => <Row />);
```

Good:

```jsx
items.map((item) => <Row key={item.id} />);
```

Keys allow React to identify:

```text
Added Items
Removed Items
Moved Items
```

efficiently. React reconciliation guidance explicitly notes that keys help React track additions, removals, and movement in lists.

---

## Time Complexity

Naive tree diffing:

```text
O(n³)
```

React's heuristics:

```text
O(n)
```

because React assumes:

1. Different element types create different trees.
2. Keys identify stable children.

These assumptions make reconciliation practical for large applications.

---

# Render Phase vs Commit Phase

React updates happen in two major phases.

---

## Render Phase

React:

```text
Builds New Tree
Runs Diffing
Calculates Changes
Creates Effects List
```

No DOM changes yet.

Fiber may:

```text
Pause
Resume
Prioritise
```

during this phase.

---

## Commit Phase

React:

```text
Apply DOM Updates
Run Effects
Update Refs
```

This phase is synchronous and cannot be interrupted. React architecture documentation explicitly separates render work from the commit phase that applies DOM changes.

---

# Performance Benefits: Virtual DOM vs Direct DOM

---

## Direct DOM Approach

```javascript
el.innerHTML = ...
```

or

```javascript
appendChild();
removeChild();
replaceChild();
```

Every update may trigger:

```text
Style Recalculation
↓
Layout
↓
Paint
↓
Composite
```

These operations are expensive.

---

## Virtual DOM Approach

```text
State Change
↓
Create New VDOM
↓
Diff Old vs New
↓
Minimal Patch
↓
Update Real DOM
```

Only necessary updates are performed.

---

## Example

### Without Diffing

```text
10,000 Cell Grid

1 Cell Changes

Re-render Everything
```

---

### With Diffing

```text
10,000 Cell Grid

1 Cell Changes

Update 1 Cell Only
```

---

# Why It Improves Performance

## 1. Fewer DOM Operations

Instead of:

```text
Many DOM Mutations
```

React computes:

```text
Minimal DOM Mutations
```

Internal React materials explicitly state that React updates only the changed parts of the UI rather than the whole page.

---

## 2. Batched Updates

Multiple state changes:

```javascript
setA(...)
setB(...)
setC(...)
```

can be combined into fewer renders and commits. Modern React uses batching to reduce unnecessary work.

---

## 3. Prioritised Rendering

With Fiber:

```text
Typing
↑ High Priority

Analytics Update
↑ Low Priority
```

Urgent updates reach the screen faster.

---

## 4. Interruptible Work

Old React:

```text
All Work
Must Complete
```

Fiber:

```text
Pause
Resume
Yield to Browser
Continue Later
```

This keeps applications responsive during large updates.

---

# Important Architect-Level Clarification

A common misconception:

```text
Virtual DOM is always faster
```

❌ Not always.

For a tiny update:

```javascript
button.textContent = "Done";
```

direct DOM can be faster because there is no reconciliation overhead.

The advantage appears when:

```text
Large Component Trees
Frequent State Updates
Complex UI
Real-Time Dashboards
Enterprise Applications
```

where React can calculate and batch minimal changes rather than having developers manually manage DOM updates.

---

# Architect Interview Answer (90 Seconds)

> React's Virtual DOM is an in-memory JavaScript representation of the UI. When state changes, React creates a new Virtual DOM tree and compares it with the previous tree through reconciliation. The diffing algorithm uses heuristics such as element type comparison and keys to identify the minimal set of changes required. Modern React uses Fiber as its reconciliation engine. Fiber breaks rendering work into smaller units, assigns priorities, and allows rendering to be paused, resumed, or aborted, keeping the UI responsive. The Virtual DOM improves performance primarily by reducing expensive real DOM mutations, batching updates, and updating only the changed portions of the interface. Fiber further enhances performance by enabling incremental rendering and prioritised scheduling of updates, especially in large enterprise applications.

---

### 11.

**When can direct DOM manipulation outperform Virtual DOM? Give real-world examples.**

**Expected Discussion**

- Canvas
- SVG editors
- Charts
- Animations

# When Can Direct DOM Manipulation Outperform Virtual DOM?

This is a classic **Staff/Architect React** question.

A common misconception is:

```text
Virtual DOM = Always Faster
```

❌ False.

The Virtual DOM introduces its own costs:

```text
Create New Virtual DOM Tree
↓
Diffing
↓
Reconciliation
↓
Fiber Scheduling
↓
DOM Updates
```

For many UI applications, this trade-off is worth it because React performs minimal DOM updates and manages complexity well. However, there are scenarios where direct DOM manipulation is measurably better because the overhead of diffing and reconciliation provides little value. React's Virtual DOM works by creating a new virtual tree, comparing it with the old tree, and updating only the changed parts of the real DOM.

---

# 1. Canvas Rendering

## Why Direct Manipulation Wins

Canvas is:

```text
Immediate Mode Rendering
```

React cannot efficiently diff:

```text
Pixels
```

because Canvas is not a DOM tree.

Example:

```javascript
ctx.clearRect(0, 0, width, height);

ctx.fillRect(x, y, 100, 100);
```

The browser simply redraws pixels.

Using React for every frame would involve:

```text
State Update
↓
Virtual DOM Creation
↓
Diffing
↓
Canvas Render
```

which adds unnecessary work.

---

## Real-World Examples

### Games

```text
Chess Boards
Racing Games
Strategy Games
```

### Financial Trading

```text
Tick-by-tick Charts
Order Book Heatmaps
```

### Mapping Systems

```text
Google Maps Layers
GIS Viewers
```

### Whiteboards

```text
Miro
Excalidraw
Figma Canvas Areas
```

In these scenarios, drawing directly to Canvas is usually preferable because the primary workload is pixel rendering rather than DOM tree updates.

---

# 2. SVG Editors

## Why Direct Updates Can Be Better

Imagine:

```text
10,000 SVG Shapes
```

being dragged continuously.

Bad flow:

```text
Mouse Move
↓
setState()
↓
Virtual DOM Diff
↓
SVG Update
```

60 times per second.

Better:

```javascript
element.setAttribute("x", newX);
```

Directly updating the SVG node avoids repeated reconciliation work.

---

## Real-World Examples

```text
Figma
Lucidchart
Draw.io
Visio-like Editors
CAD Tools
```

Thousands of objects may move every frame.

For such workloads, direct SVG manipulations are often more efficient than rerendering a large React component tree.

---

# 3. High-Frequency Charts

Consider:

```text
Stock Market Dashboard
```

receiving:

```text
100 updates/second
```

React approach:

```text
WebSocket Event
↓
State Update
↓
Virtual DOM
↓
Diff
↓
Commit
```

100 times every second.

Instead, charting libraries typically update the rendering surface directly.

---

## Examples

```text
TradingView
Bloomberg Terminals
Crypto Exchanges
Monitoring Dashboards
```

Libraries such as:

```text
D3
Canvas-based Charts
WebGL Charts
High-performance Graphing Engines
```

often bypass React rendering for the drawing layer.

---

# 4. Animations

## Slow Approach

```jsx
setState({
  x: x + 1,
});
```

Every frame:

```text
60 FPS
↓
60 React Renders
↓
60 Diffs
```

---

## Better Approach

```javascript
element.style.transform = `translateX(${x}px)`;
```

inside:

```javascript
requestAnimationFrame();
```

Direct DOM updates can avoid unnecessary React work and align changes with the browser's rendering cycle.

---

## Examples

```text
Drag and Drop
Parallax Effects
Particle Systems
Cursor Tracking
Physics Engines
```

---

# 5. Extremely Simple DOM Changes

Sometimes:

```javascript
button.textContent = "Saved";
```

is faster than:

```jsx
setSaved(true);
```

because React must still:

```text
Create VDOM
Diff
Commit
```

whereas direct DOM performs one update immediately. React's reconciliation process intentionally performs extra work in memory to minimise future DOM mutations.

---

# Performance Comparison

| Use Case                        | Direct DOM          | Virtual DOM                 |
| ------------------------------- | ------------------- | --------------------------- |
| Single Text Update              | ✅ Faster           | ❌ Extra overhead           |
| Canvas Drawing                  | ✅ Much Faster      | ❌ Not ideal                |
| SVG Dragging Thousands of Nodes | ✅ Usually Faster   | ⚠ Depends                   |
| High-Frequency Charts           | ✅ Usually Faster   | ⚠ Depends                   |
| Complex Forms                   | ❌ Harder to manage | ✅ Better                   |
| Enterprise Dashboard UI         | ⚠ Mixed             | ✅ Better                   |
| Large Component Trees           | ❌ Hard to maintain | ✅ Better                   |
| Animations (60 FPS)             | ✅ Better           | ⚠ Often avoid React updates |

---

# Architect Rule

## Use Virtual DOM For

```text
Business Applications
Forms
Dashboards
Admin Portals
CRM Systems
E-commerce
```

Because:

```text
Maintainability
Predictability
Component Reuse
```

matter more than micro-optimisations.

---

## Use Direct DOM / Canvas / SVG APIs For

```text
Games
Real-Time Charts
Graphics Editors
Drawing Tools
Animation Engines
Visualization Platforms
```

Because:

```text
Frame Rate
Rendering Speed
Latency
```

matter more than component abstraction.

---

# Hybrid Architecture (What Architects Actually Do)

The best production systems often use both approaches.

Example:

```text
React
 ├─ Toolbar
 ├─ Sidebar
 ├─ Menus
 └─ Settings

Canvas/WebGL
 └─ Rendering Surface
```

Example:

```text
React UI Controls
        +
Canvas Rendering
```

This pattern is commonly used in:

```text
Figma
Miro
Trading Platforms
3D Editors
GIS Systems
```

---

# Architect-Level Interview Answer

> Direct DOM manipulation can outperform React's Virtual DOM when updates occur at extremely high frequency or when the rendering target is not naturally represented as a DOM tree. Examples include Canvas-based games, SVG editors, real-time financial charts, drag-and-drop systems, and animation engines. In these scenarios, React's diffing, reconciliation, and scheduling introduce overhead that provides little benefit because the application is primarily updating pixels, coordinates, or transforms rather than complex UI structures. Virtual DOM excels for state-driven business applications because it minimises DOM mutations and improves maintainability, but for graphics-intensive workloads, developers often use direct Canvas, SVG, or WebGL APIs and let React manage only the surrounding UI.

# 1. Examples of Virtual DOM Overhead in Complex Applications

Most React developers assume:

```text
Virtual DOM = Performance
```

Reality:

```text
Virtual DOM adds overhead
```

because React still must:

```text
Create New VDOM Tree
↓
Run Diffing
↓
Run Reconciliation
↓
Fiber Scheduling
↓
Commit Changes
```

Before any DOM update happens. React's architecture explicitly includes Virtual DOM diffing, reconciliation, and Fiber scheduling as part of its rendering pipeline. [1](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)

---

## Example 1: Drag-and-Drop Canvas Editor

Think:

```text
Figma
Miro
Web Whiteboard
CAD Editor
```

Mouse moves:

```text
60-120 times/sec
```

Bad React approach:

```jsx
setPosition({
  x: mouseX,
  y: mouseY,
});
```

Every movement causes:

```text
State Update
↓
Component Re-render
↓
Virtual DOM Creation
↓
Diffing
↓
Commit
```

120 times/sec.

Much of that work provides little value because you're just changing coordinates.

---

## Example 2: Real-Time Trading Dashboard

```text
10,000 updates/sec
```

Example:

```text
Stock Prices
Order Books
Heat Maps
Market Depth
```

React may spend significant time:

```text
Re-rendering Components
Comparing Trees
Scheduling Updates
```

before displaying changes.

This is why many trading platforms draw directly using:

```text
Canvas
WebGL
```

while React manages surrounding controls.

---

## Example 3: Particle Animation

```text
5000 particles
```

Moving every frame:

```text
60 FPS
```

React would repeatedly:

```text
Render Components
Create VDOM
Diff
Commit
```

Instead:

```javascript
requestAnimationFrame(render);
```

with Canvas/WebGL updates pixels directly.

---

## Example 4: SVG Diagram Editor

```text
20,000 SVG Nodes
```

Dragging:

```text
Rectangle
Arrow
Connector
```

through React state updates can produce substantial diffing work.

Direct:

```javascript
element.setAttribute("x", newX);
```

may be much cheaper.

---

# 2. How to Optimise React for Animation-Heavy UIs

Architects rarely choose:

```text
React OR Canvas
```

They combine them.

---

## Strategy #1: Keep React Out of Animation Loops

Bad:

```jsx
setX(x + 1);
```

60 times per second.

Good:

```javascript
requestAnimationFrame(update);
```

Use refs:

```jsx
const boxRef = useRef();
```

```javascript
boxRef.current.style.transform = `translateX(${x}px)`;
```

No React render required.

---

## Strategy #2: Animate with CSS Transforms

Prefer:

```css
transform
opacity
```

instead of:

```css
top
left
width
height
```

Benefits:

✅ GPU accelerated

✅ Less layout work

✅ Smoother rendering

---

## Strategy #3: React.memo()

```jsx
const Particle = React.memo(Component);
```

Prevents unnecessary renders.

React's rendering performance guidance highlights built-in optimisation mechanisms such as memoisation. [1](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

---

## Strategy #4: useMemo()

```jsx
const data = useMemo(computeData, [input]);
```

Avoid expensive recalculations.

---

## Strategy #5: useCallback()

```jsx
const handleMove = useCallback(() => {}, []);
```

Reduces handler recreation.

---

## Strategy #6: Virtualisation

For:

```text
100,000 rows
```

Use:

```text
react-window
react-virtualized
AG Grid
```

Render only visible items.

---

## Strategy #7: Concurrent Features

Modern React supports:

```jsx
startTransition();
```

and

```jsx
useTransition();
```

to mark non-urgent updates.

React's internal Fiber architecture supports prioritised rendering and concurrent scheduling. [1](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

Example:

```jsx
startTransition(() => {
   setFilteredRows(...)
});
```

The UI remains responsive while React processes lower-priority work.

---

## Strategy #8: Move Graphics to Canvas/WebGL

Best practice:

```text
React
 ├─ Toolbar
 ├─ Settings
 ├─ Filters
 └─ Layout

Canvas/WebGL
 └─ Graphics Engine
```

This is how many high-performance products are architected.

---

# 3. React Virtual DOM vs WebGL Rendering

---

## Rendering Model

### React

```text
State
↓
Virtual DOM
↓
Diff
↓
Real DOM
↓
Browser Render
```

React updates UI through DOM operations after reconciliation. React training material explicitly describes creating and comparing virtual DOM trees before updating only changed portions of the real DOM. [2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[1](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

---

### WebGL

```text
GPU Buffers
↓
Shaders
↓
GPU Rendering Pipeline
↓
Pixels
```

No DOM tree.

No reconciliation.

No diffing.

---

# Performance Comparison

| Metric                 | React Virtual DOM | WebGL              |
| ---------------------- | ----------------- | ------------------ |
| DOM UI                 | ✅ Excellent      | ❌ Poor            |
| Forms                  | ✅ Excellent      | ❌ Difficult       |
| Enterprise Apps        | ✅ Excellent      | ❌ Not Intended    |
| Complex Graphics       | ⚠ Limited         | ✅ Excellent       |
| 10,000 Objects         | ⚠ Possible        | ✅ Easy            |
| 100,000 Objects        | ❌ Struggles      | ✅ Designed For It |
| 60 FPS Animations      | ⚠ Depends         | ✅ Excellent       |
| GPU Utilisation        | Limited           | Full GPU Pipeline  |
| Developer Productivity | ✅ High           | ⚠ Lower            |

---

# Real-World Mapping

### React Virtual DOM

Best for:

```text
CRM
Banking Apps
E-commerce
Admin Portals
Enterprise Dashboards
Forms
```

React's strengths are predictable state-driven UIs, efficient diffing, batching, and maintainability. [2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[1](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)

---

### WebGL

Best for:

```text
3D Games
CAD Systems
GIS Mapping
3D Configurators
Massive Data Visualisation
Particle Simulations
Digital Twins
```

---

# Architect Decision Matrix

### Choose React Virtual DOM When

```text
UI Complexity > Graphics Complexity
```

Examples:

```text
Bank Portal
Insurance App
CRM Platform
Admin Console
```

---

### Choose WebGL When

```text
Graphics Complexity > UI Complexity
```

Examples:

```text
Figma Canvas
3D Product Viewer
Game Engine
Trading Heatmap
Scientific Visualisation
```

---

# Architect-Level Answer

> Virtual DOM overhead becomes noticeable when applications perform extremely frequent updates, such as drag-and-drop editors, real-time trading dashboards, SVG editors, and particle animations. In these scenarios, React repeatedly creates virtual trees, performs diffing, and schedules work through Fiber, while the actual requirement is often just updating coordinates or pixels. To optimise animation-heavy UIs, I minimise React participation in rendering loops by using refs, `requestAnimationFrame`, CSS transforms, memoisation, virtualisation, and React concurrent features for non-urgent updates. For graphics-intensive workloads, I typically use a hybrid architecture where React manages the surrounding UI and Canvas or WebGL handles rendering. Compared to Virtual DOM, WebGL bypasses the DOM entirely and renders directly through the GPU pipeline, making it dramatically more efficient for large-scale visualisation, 60 FPS animations, and thousands of moving objects, while React remains superior for business applications and complex state-driven interfaces. [1](https://persistentsystems.sharepoint.com/sites/extensure479/Shared%20Documents/00-executive-summary-ReactCodeBase.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[3](https://orion-blog.hashnode.dev/how-react-s-virtual-dom-actually-works)

---

### 12.

**If React already uses a Virtual DOM, why do libraries like React Window or AG Grid still need virtualization?**

# If React Already Uses a Virtual DOM, Why Do Libraries Like React Window or AG Grid Still Need Virtualization?

This is one of the most common **Senior React Architect** interview questions.

The key insight is:

```text
Virtual DOM ≠ List Virtualization
```

They solve completely different problems.

---

# What Virtual DOM Solves

React's Virtual DOM:

```text
Old Virtual DOM
↓
New Virtual DOM
↓
Diffing
↓
Minimal DOM Updates
```

React creates a virtual representation of the UI, compares old and new trees, and updates only the changed parts of the real DOM. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/sonali_ogale_persistent_com/Documents/Forms/DispForm.aspx?ID=29793&web=1)

Goal:

```text
Reduce unnecessary DOM updates
```

---

# What Virtual DOM Does NOT Solve

Imagine:

```text
100,000 rows
```

React still creates:

```text
100,000 React Components
100,000 Virtual DOM Nodes
100,000 Real DOM Nodes
```

Even if nothing changes.

Virtual DOM helps update them efficiently.

But it does NOT eliminate them.

---

# The Common Misunderstanding

Many developers assume:

```text
React Virtual DOM
=
Only Render What Is Visible
```

❌ Wrong.

React still renders:

```jsx
users.map((user) => <Row key={user.id} />);
```

for every item.

If there are:

```text
100,000 rows
```

React still creates:

```text
100,000 Fibers
100,000 VDOM Nodes
100,000 DOM Elements
```

before diffing can even happen.

---

# Where The Bottleneck Comes From

Even before DOM updates:

```text
Memory Usage
↓
Component Creation
↓
Fiber Creation
↓
Virtual DOM Tree
↓
Layout Work
↓
Paint Work
```

becomes huge.

Virtual DOM reduces update cost.

It does NOT reduce tree size.

---

# What Virtualization Solves

Libraries like:

```text
React Window
React Virtualized
AG Grid
TanStack Virtual
```

solve:

```text
DOM Size Problem
```

not:

```text
DOM Update Problem
```

---

# Example

Dataset:

```text
100,000 Rows
```

Visible:

```text
30 Rows
```

Without Virtualization:

```text
Rendered Rows = 100,000
```

---

With Virtualization:

```text
Visible Rows = 30

Overscan = 10

Rendered Rows ≈ 40
```

Only visible rows are mounted.

Industry explanations of react-window and react-virtualized describe virtualization/windowing as rendering only the visible portion of a list into the DOM rather than the entire dataset. [3](https://blog.logrocket.com/react-virtualized-vs-react-window/)[4](https://dev.to/bnevilleoneill/windowing-wars-react-virtualized-vs-react-window-3i7j)

---

# Visual Comparison

## Virtual DOM Only

```text
100,000 Rows

VDOM:
100,000 Nodes

DOM:
100,000 Nodes
```

Diffing is efficient.

Memory is not.

---

## Virtual DOM + Virtualization

```text
100,000 Rows

VDOM:
40 Nodes

DOM:
40 Nodes
```

Now React has far less work to perform.

---

# Why AG Grid Still Uses Virtualization

AG Grid already benefits from React rendering when used with React.

But a grid may contain:

```text
50,000 rows
200 columns
```

Potentially:

```text
10 million cells
```

Rendering everything:

```text
Memory Explosion
Slow Scroll
Huge Layout Cost
```

Virtualization ensures only the viewport area is rendered.

---

# Real-World Example

## Dropdown with 10,000 Options

Without Virtualization:

```jsx
<select>10000 options</select>
```

Problems:

✅ Slow open

✅ High memory usage

✅ Slow scrolling

---

With Virtualization:

```text
10 Visible Options
+
Buffer
```

Only a small subset exists in the DOM at any time.

An internal interview example describes using React virtualization for a dropdown with 1000+ records so that only visible records were rendered during scrolling, significantly improving performance. [5](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Mahesh%20Ganjare_00003252.pdf?web=1)

---

# Performance Comparison

| Concern             | Virtual DOM | Virtualization |
| ------------------- | ----------- | -------------- |
| Reduce Re-renders   | ✅          | ❌             |
| Reduce Diffing Cost | ✅          | ✅             |
| Reduce DOM Nodes    | ❌          | ✅             |
| Reduce Memory       | ❌          | ✅             |
| Improve Large Lists | ⚠️ Limited  | ✅             |
| Improve Scrolling   | ⚠️ Limited  | ✅             |
| Handle 100k Rows    | ❌          | ✅             |

---

# Architect Mental Model

## Virtual DOM

Optimizes:

```text
How UI Updates
```

Example:

```text
Button Text Changes
Form Updates
State Updates
```

---

## Virtualization

Optimizes:

```text
How Much UI Exists
```

Example:

```text
Huge Lists
Data Grids
Dropdowns
Tables
Trees
```

---

# Why Both Are Needed

Think:

```text
Virtual DOM
=
Smart Mechanic
```

it knows:

```text
What should change
```

---

Virtualization:

```text
=
Smaller Vehicle
```

it reduces:

```text
How much needs maintenance
```

---

# Perfect Enterprise Solution

For:

```text
100,000 Row AG Grid
```

Use:

```text
Virtual DOM
+
Fiber Scheduling
+
Row Virtualization
+
Column Virtualization
+
Memoized Cells
```

Together they solve:

```text
Update Cost
+
Memory Cost
+
Render Cost
+
Scroll Cost
```

---

# Architect-Level Interview Answer

> React's Virtual DOM and list virtualization solve different problems. Virtual DOM optimizes updates by diffing old and new UI trees and applying only the necessary DOM changes. However, it still requires React to create component instances, Fiber nodes, Virtual DOM nodes, and real DOM nodes for every rendered item. If a page contains 100,000 rows, React still has to manage 100,000 elements even if updates are efficient. Libraries like React Window and AG Grid introduce virtualization, or windowing, which reduces the total number of mounted elements by rendering only the rows currently visible in the viewport. Virtual DOM makes updates cheaper, while virtualization reduces the amount of UI React must manage in the first place. For large grids, tables, dropdowns, and infinite-scroll experiences, both techniques are required for optimal performance. [1](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1)[2](https://persistentsystems-my.sharepoint.com/personal/sonali_ogale_persistent_com/Documents/Forms/DispForm.aspx?ID=29793&web=1)[3](https://blog.logrocket.com/react-virtualized-vs-react-window/)[4](https://dev.to/bnevilleoneill/windowing-wars-react-virtualized-vs-react-window-3i7j)
>
> # How React Window Improves Scrolling Performance

## The Core Problem

Consider:

```text
100,000 rows
```

Without virtualization:

```text
100,000 React Components
100,000 Virtual DOM Nodes
100,000 DOM Elements
```

Even though the user can only see:

```text
20–50 rows
```

at a time.

React's Virtual DOM helps update elements efficiently, but React still has to manage all rendered elements if they exist in the tree.

---

# How React Window Works

React Window implements:

```text
Windowing (List Virtualization)
```

Instead of rendering all rows:

```text
100,000 rows
```

it renders only:

```text
Visible Rows
+
Small Overscan Buffer
```

For example:

```text
Total Rows: 100,000

Visible Rows: 25

Overscan: 10
```

Only:

```text
~35 Rows
```

exist in the DOM.

Industry guidance describes react-window as rendering only the visible portion of a list into the DOM while the remaining items are not mounted. [3](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/_layouts/15/Doc.aspx?sourcedoc=%7B0B096160-0A33-4D7D-941E-9BEF187903DE%7D&file=Nilesh%20Suresh%20Patil.doc&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Scrolling Flow

### Without React Window

```text
100,000 DOM Nodes
      ↓
Scroll
      ↓
Browser Must Manage
100,000 Elements
```

Problems:

❌ High memory usage

❌ Expensive layout calculations

❌ Slow scrolling

❌ Increased garbage collection

---

### With React Window

```text
40 DOM Nodes
      ↓
Scroll
      ↓
Recycle Existing Rows
      ↓
Update Content
```

DOM size remains almost constant.

This dramatically reduces the work the browser performs while scrolling. React Window works by calculating which items should currently be rendered and writing only those items to the DOM. [3](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/_layouts/15/Doc.aspx?sourcedoc=%7B0B096160-0A33-4D7D-941E-9BEF187903DE%7D&file=Nilesh%20Suresh%20Patil.doc&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Why Scrolling Becomes Smooth

The browser performs less work in:

```text
Style Recalculation
Layout
Paint
Memory Management
```

because there are only a few DOM elements to track.

Instead of:

```text
100,000 DOM nodes
```

the browser may only manage:

```text
30–50 DOM nodes
```

during scrolling. [3](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/_layouts/15/Doc.aspx?sourcedoc=%7B0B096160-0A33-4D7D-941E-9BEF187903DE%7D&file=Nilesh%20Suresh%20Patil.doc&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Best Practices for Combining Virtual DOM and Virtualization

## 1. Use Virtualization for Large Lists

When datasets exceed:

```text
500+
1000+
5000+
```

rows.

Examples:

```text
AG Grid
User Tables
Search Results
Audit Logs
Trees
Dropdowns
```

Internal interview examples describe significant performance improvements when virtualization was applied to large dropdown datasets because only visible rows were rendered.

---

## 2. Keep Row Components Lightweight

Bad:

```jsx
<Row>20 nested components 10 hooks expensive calculations</Row>
```

Good:

```jsx
<Row />
```

with minimal rendering logic.

Virtualization reduces row count, but each visible row should still be efficient.

---

## 3. Use `React.memo`

```jsx
const Row = React.memo(({ item }) => {
  return <div>{item.name}</div>;
});
```

Benefits:

```text
Prevent unnecessary row rerenders
```

React's performance guidance highlights memoisation as an important optimisation technique.

---

## 4. Avoid Inline Objects and Functions

Bad:

```jsx
<Row style={{ color: "red" }} onClick={() => handle(id)} />
```

Creates new references every render.

Prefer:

```jsx
const style = useMemo(...)

const handleClick =
  useCallback(...)
```

---

## 5. Use Stable Keys

Bad:

```jsx
key = { index };
```

Good:

```jsx
key={row.id}
```

Stable keys help React reconcile efficiently.

---

## 6. Virtualize Both Rows and Columns

For data grids:

```text
50,000 rows
200 columns
```

Use:

```text
Row Virtualization
+
Column Virtualization
```

AG Grid follows this approach to avoid rendering the entire grid.

---

## 7. Avoid Frequent Global State Updates

Bad:

```text
Redux Update
↓
All Rows Re-render
```

Prefer:

```text
Local State
Selectors
Memoization
```

to minimise updates reaching virtualized components.

---

## 8. Use Overscan Correctly

Example:

```jsx
overscanCount={5}
```

Benefits:

✅ Smooth scrolling

✅ Avoid blank areas

Too much overscan:

```text
More DOM Nodes
```

Too little:

```text
Visible Loading During Fast Scroll
```

---

## 9. Measure with React Profiler

Validate:

```text
Render Count
Commit Time
Dropped Frames
```

Don't assume performance improvements—measure them.

---

## 10. Combine with React Concurrent Features

Modern React supports:

```jsx
useTransition();
startTransition();
```

for non-urgent rendering work.

React's Fiber architecture supports priority-based scheduling, time slicing, batching, and concurrent rendering features.

---

# Architect-Level Answer

> React's Virtual DOM optimises how UI updates occur, but it does not reduce the number of elements React must manage. If we render 100,000 rows, React still creates component instances, Fiber nodes, Virtual DOM nodes, and real DOM elements for those rows. React Window solves a different problem by implementing virtualization, rendering only the rows currently visible in the viewport plus a small buffer. This keeps DOM size nearly constant, dramatically reducing memory usage, layout work, paint cost, and scrolling overhead. In enterprise applications, the best approach is to combine Virtual DOM with virtualization, memoized row components, stable keys, column virtualization, and React concurrent features to achieve smooth scrolling and scalable performance for very large datasets. [3](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/_layouts/15/Doc.aspx?sourcedoc=%7B0B096160-0A33-4D7D-941E-9BEF187903DE%7D&file=Nilesh%20Suresh%20Patil.doc&action=default&mobileredirect=true&DefaultItemOpen=1)

---

## Web Components & Shadow DOM

### 13.

**How would you design an enterprise component library using Shadow DOM?**

**Expected Discussion**

- Style Isolation
- Slots
- Reusability
- Encapsulation

---

### 14.

**What problems does Shadow DOM solve that CSS Modules cannot?**

# What Problems Does Shadow DOM Solve That CSS Modules Cannot?

This is a great **Architect-level Web Components** question.

Many developers think:

```text
CSS Modules = Shadow DOM
```

❌ Not true.

Both provide style isolation, but they operate at completely different levels.

---

# Quick Answer

## CSS Modules Solve

✅ Class name collisions

```css
.button
```

becomes:

```css
.button_x7a92
```

at build time.

---

## Shadow DOM Solves

✅ Class collisions

✅ Style leakage

✅ DOM encapsulation

✅ Query selector isolation

✅ Framework independence

✅ True component boundaries

✅ Third-party CSS protection

Shadow DOM creates a separate DOM tree with scoped styles that do not bleed across boundaries. External styles generally do not affect elements inside the shadow tree, and styles inside do not leak out. [1](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scoping)[2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

---

# 1. True CSS Isolation

---

## CSS Modules

### Component

```css
.title {
  color: red;
}
```

Generated:

```css
.title_a123
```

This prevents naming collisions.

---

But global CSS still affects elements.

Example:

```css
div {
  font-size: 50px;
}
```

or

```css
* {
  box-sizing: border-box;
}
```

may still impact your component.

CSS Modules only scope class names—they do not create a browser-level boundary. [3](https://bing.com/search?q=Shadow+DOM+vs+CSS+Modules+encapsulation)

---

## Shadow DOM

```html
<my-button>
  #shadow-root
  <button></button
></my-button>
```

Global styles cannot penetrate the shadow boundary by default.

```css
button {
  color: red;
}
```

outside the component does not affect:

```html
#shadow-root button
```

inside the component. [1](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scoping)[2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

---

# 2. DOM Encapsulation

CSS Modules only affect CSS.

They do NOT hide DOM structure.

---

## CSS Modules

Anyone can do:

```javascript
document.querySelector(".button_x7a92");
```

and manipulate your component.

---

## Shadow DOM

```html
my-component #shadow-root
```

Internal structure is separated from the page DOM.

Shadow DOM was specifically designed so page code cannot accidentally break a reusable component’s internal implementation. [2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

---

# 3. Protection From Framework CSS

Imagine:

```text
Bootstrap
Tailwind
Material UI
Legacy CSS
```

all loaded together.

---

## CSS Modules Problem

Even though classes are renamed:

```css
.btn_x123
```

global rules still apply:

```css
button {
  border: none;
}
```

```css
* {
  margin: 0;
}
```

Unexpected visual issues may occur.

---

## Shadow DOM

```html
<custom-grid></custom-grid>
```

inside:

```html
#shadow-root
```

Bootstrap styles do not automatically leak in.

Your component remains stable.

Shadow DOM provides an encapsulation barrier that prevents many global framework styles from reaching internal markup. [4](https://www.xjavascript.com/blog/can-shadow-dom-elements-inherit-css/)[2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

---

# 4. Query Selector Isolation

---

## CSS Modules

All elements remain in:

```text
Document DOM
```

So:

```javascript
document.querySelectorAll("button");
```

may find component internals.

---

## Shadow DOM

Must explicitly access:

```javascript
shadowRoot.querySelector();
```

The DOM boundary separates component internals from the page. [2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

---

# 5. Third-Party Widget Safety

Imagine shipping:

```text
Date Picker
Chat Widget
Analytics Widget
Payment Widget
```

to be embedded on any website.

---

## CSS Modules

Customer CSS may still break the widget.

```css
input {
  display: none;
}
```

could affect internal elements.

---

## Shadow DOM

The widget remains isolated regardless of page CSS.

This is one of the primary reasons Web Components rely on Shadow DOM. [2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)[5](https://javascript.plainenglish.io/inside-shadow-dom-encapsulation-styling-and-modern-patterns-213223f9fd2d)

---

# 6. Web Components Support

Shadow DOM is a native part of:

```text
Web Components
```

including:

```text
Custom Elements
Templates
Slots
Shadow Root
```

Web Component architectures are built around Shadow DOM encapsulation. [1](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scoping)[2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)[6](https://persistentsystems.sharepoint.com/sites/BUReq_LWC_4-12thAug21/Shared%20Documents/General/LWC_Session_I.pdf?web=1)

CSS Modules cannot provide:

```javascript
attachShadow();
```

or

```html
<slot></slot>
```

capabilities.

---

# Example

## CSS Modules

```jsx
import styles from "./Button.module.css";

<button className={styles.button}>Save</button>;
```

Provides:

✅ Unique class names

But:

❌ DOM visible

❌ Styles may leak in

❌ Global selectors still apply

---

## Shadow DOM

```javascript
const shadow = host.attachShadow({
  mode: "open",
});
```

```html
#shadow-root <button>Save</button>
```

Provides:

✅ CSS isolation

✅ DOM isolation

✅ Selector isolation

✅ Reusable component boundary

---

# Architect Comparison

| Feature                    | CSS Modules | Shadow DOM |
| -------------------------- | ----------- | ---------- |
| Unique Class Names         | ✅          | ✅         |
| Prevent Class Collisions   | ✅          | ✅         |
| Prevent Global CSS Leakage | ❌          | ✅         |
| Prevent CSS From Escaping  | ❌          | ✅         |
| DOM Encapsulation          | ❌          | ✅         |
| Query Isolation            | ❌          | ✅         |
| Browser-Level Boundary     | ❌          | ✅         |
| Web Component Support      | ❌          | ✅         |
| Third-Party Widget Safety  | ⚠️          | ✅         |
| Build Tool Required        | ✅          | ❌         |

---

# When Would You Choose Each?

### Use CSS Modules

```text
React SPA
Next.js
Internal Enterprise Application
Dashboard
Admin Portal
```

Benefits:

```text
Simple
Fast
Easy Build Integration
```

---

### Use Shadow DOM

```text
Design Systems
Web Components
Embeddable Widgets
Cross-Framework Components
Browser Extensions
Micro Frontends
```

Benefits:

```text
True Encapsulation
Framework Independence
Strong Isolation
```

---

# Architect-Level Interview Answer

> CSS Modules and Shadow DOM both help avoid CSS conflicts, but they solve different problems. CSS Modules provide build-time scoping by generating unique class names, which prevents class-name collisions. However, they do not create actual DOM isolation, so global selectors, framework styles, and document queries can still affect the component. Shadow DOM provides browser-level encapsulation by creating a separate DOM tree with its own style scope. Styles inside the shadow tree do not leak out, external styles generally cannot leak in, and internal elements are isolated from normal document queries. This makes Shadow DOM ideal for Web Components, third-party widgets, design systems, and micro-frontends where true encapsulation and framework independence are required. [1](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scoping)[2](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)[3](https://bing.com/search?q=Shadow+DOM+vs+CSS+Modules+encapsulation)[7](https://persistentsystems-my.sharepoint.com/personal/harsha_bobade_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B50675524-9F63-4DB9-89F4-9CE8E1744842%7D&file=What%20is%20ReactJS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# Compare Shadow DOM with CSS-in-JS Solutions

Examples of CSS-in-JS:

```text
Styled Components
Emotion
JSS
Linaria
```

Both Shadow DOM and CSS-in-JS aim to reduce styling conflicts, but they achieve it very differently.

---

## Architecture Comparison

| Feature                      | Shadow DOM    | CSS-in-JS                  |
| ---------------------------- | ------------- | -------------------------- |
| Style Isolation              | Browser-level | Library/build-time         |
| DOM Isolation                | ✅ Yes        | ❌ No                      |
| Query Selector Isolation     | ✅ Yes        | ❌ No                      |
| Global CSS Protection        | ✅ Yes        | ⚠️ Partial                 |
| Works Across Frameworks      | ✅ Yes        | Usually framework-specific |
| Supports Web Components      | ✅ Native     | ❌ No                      |
| Requires Runtime Library     | ❌ No         | Often Yes                  |
| Encapsulates Markup + Styles | ✅ Yes        | ❌ Styles Only             |

Shadow DOM creates a separate DOM tree with scoped styles and encapsulation boundaries, while CSS-in-JS primarily scopes styles through generated class names or runtime styling systems.

---

## CSS-in-JS Example

```jsx
const Button = styled.button`
  color: white;
  background: blue;
`;
```

Generated:

```css
.css-abc123 {
  color: white;
}
```

This avoids class-name collisions.

However:

```javascript
document.querySelector("button");
```

can still access the component because it remains part of the main DOM tree.

---

## Shadow DOM Example

```javascript
const shadow = host.attachShadow({
  mode: "open",
});
```

```html
<my-button>
  #shadow-root
  <button>Save</button></my-button
>
```

Benefits:

```text
Separate DOM Tree
Separate CSS Scope
Separate Query Scope
```

Global page styles generally do not penetrate the shadow boundary by default.

---

# How Shadow DOM Affects Component Testing

Testing becomes slightly more complex because the component has:

```text
Main DOM
+
Shadow DOM
```

instead of a single DOM tree.

---

## Normal DOM Testing

```javascript
screen.getByText("Save");
```

Typically works immediately.

---

## Shadow DOM Testing

Need to access:

```javascript
element.shadowRoot;
```

Example:

```javascript
const host = document.querySelector("my-button");

host.shadowRoot.querySelector("button");
```

Because component internals are intentionally isolated behind the shadow boundary.

---

## Challenges During Testing

### 1. Querying Internal Elements

Harder than:

```javascript
document.querySelector();
```

because elements may live inside:

```text
shadowRoot
```

---

### 2. Snapshot Testing

Snapshots often need to include:

```text
Shadow Tree
```

otherwise important structure may be missed.

---

### 3. Style Verification

Styles are encapsulated.

You may need to test:

```javascript
getComputedStyle(...)
```

inside the shadow root rather than relying on global stylesheet assumptions.

---

### 4. E2E Testing

Tools like:

```text
Playwright
Cypress
Selenium
```

usually require Shadow DOM-aware selectors when interacting with encapsulated elements.

---

## Testing Benefits

Shadow DOM can actually reduce flaky tests because:

```text
External CSS
Random DOM Changes
Third-Party Libraries
```

are less likely to interfere with component internals.

The same isolation that protects components in production also improves predictability during testing.

---

# Best Use Cases for Shadow DOM

Not every React application needs Shadow DOM.

Its biggest value appears when **true encapsulation** is required.

---

## 1. Design Systems

Example:

```text
Company UI Library
Button
Modal
Date Picker
Dropdown
```

Requirements:

```text
Reusable
Framework Independent
Protected from Host CSS
```

Shadow DOM is ideal.

---

## 2. Web Components

Web Components are built around:

```text
Custom Elements
Templates
Slots
Shadow DOM
```

Shadow DOM is a core browser capability used to encapsulate Web Components.

---

## 3. Third-Party Widgets

Examples:

```text
Live Chat Widget
Payment Widget
Analytics Widget
Feedback Widget
```

Installed on:

```text
Thousands of Unknown Websites
```

You cannot trust host-page CSS.

Shadow DOM protects the widget from customer styles.

---

## 4. Micro-Frontends

Multiple teams:

```text
Angular
React
Vue
Lit
```

on the same page.

Benefits:

```text
Style Isolation
DOM Isolation
Reduced CSS Conflicts
```

---

## 5. Browser Extensions

Examples:

```text
Grammarly
Password Managers
Browser Toolbars
```

Need to inject UI into arbitrary pages.

Shadow DOM prevents site CSS from breaking extension UI.

---

## 6. Enterprise Embedded Components

Example:

```text
Shared Date Picker
Chart Component
User Profile Card
```

used across:

```text
20+ Applications
```

Shadow DOM ensures consistent behaviour regardless of the host application.

---

# When NOT to Use Shadow DOM

Avoid if:

```text
Simple Internal React SPA
Admin Portal
Dashboard
Small Team Project
```

In these cases:

```text
CSS Modules
Styled Components
Emotion
Tailwind
```

are often simpler and easier to maintain.

---

# Architect-Level Answer

> CSS-in-JS solutions and Shadow DOM both help prevent style conflicts, but CSS-in-JS primarily provides style scoping through generated class names, while Shadow DOM provides true browser-level encapsulation of both styles and DOM structure. Shadow DOM prevents external CSS from leaking into components, protects internal markup, and isolates query selectors. From a testing perspective, Shadow DOM introduces additional complexity because tests must traverse the `shadowRoot` to access internal elements, but it also makes tests more reliable by reducing interference from outside styles or scripts. Shadow DOM is best suited for Web Components, design systems, micro-frontends, browser extensions, and third-party embeddable widgets where strong isolation and framework independence are critical. CSS-in-JS is typically sufficient for standard React applications where style scoping is needed but full DOM encapsulation is not.

---

# How Shadow DOM Affects CSS Specificity

This is an advanced frontend architecture topic.

The important thing to understand is:

```text
Shadow DOM does NOT change
how CSS specificity is calculated.

It changes WHERE specificity applies.
```

---

# Normal CSS Specificity

Outside Shadow DOM:

```css
button {
  color: blue;
}
```

Specificity:

```text
0-0-1
```

---

```css
.container button {
  color: red;
}
```

Specificity:

```text
0-1-1
```

The browser compares specificity and applies the most specific rule.

---

# What Changes With Shadow DOM?

Shadow DOM creates a:

```text
Style Boundary
```

A selector outside the shadow tree cannot normally compete with selectors inside the shadow tree because they belong to different scopes. Styles are either globally scoped or scoped to a shadow tree, and selectors do not bleed between scopes.

Example:

## Main Page

```css
button {
  color: red;
}
```

---

## Shadow Component

```html
<my-button>
  #shadow-root
  <button>Save</button></my-button
>
```

```css
button {
  color: blue;
}
```

Result:

```text
Blue ✅
```

Even if the page contains:

```css
button {
  color: red !important;
}
```

the shadow-scoped button styling is isolated by the shadow boundary. Shadow DOM was specifically designed so page styles do not accidentally break component internals.

---

# Specificity Is Calculated Per Scope

Think of Shadow DOM as creating:

```text
Page CSS Scope
```

and

```text
Shadow CSS Scope
```

independently.

---

## Without Shadow DOM

```css
button {
}
.container button {
}
#main button {
}
```

All rules compete.

---

## With Shadow DOM

```text
Global Scope
   ↓
Cannot compete directly with
   ↓
Shadow Scope
```

Most global selectors never enter the competition because they cannot reach inside the shadow tree.

---

# Host Element Specificity

The host element sits on the boundary.

```html
<my-card></my-card>
```

Inside Shadow DOM:

```css
:host {
  display: block;
}
```

Shadow DOM provides dedicated selectors such as `:host` for styling the host element from within the shadow tree.

---

## Example

```css
:host {
  color: blue;
}
```

This styles:

```html
<my-card></my-card>
```

itself.

Specificity is similar to a pseudo-class selector.

---

# :host() and Specificity

```css
:host(.primary) {
  background: green;
}
```

Example:

```html
<my-button class="primary"></my-button>
```

The selector combines:

```text
:host
+
.primary
```

allowing state-based styling of the host element. Shadow DOM scoping APIs explicitly include `:host()` support.

---

# ::slotted()

Used for projected content.

```html
<my-card>
  <h1>Hello</h1>
</my-card>
```

Shadow DOM:

```css
::slotted(h1) {
  color: red;
}
```

Shadow DOM exposes `::slotted()` specifically for styling slotted content.

---

# Why Specificity Becomes Easier

Without Shadow DOM:

Developers often fight:

```css
.component button
.page .container button
.layout .sidebar button
```

resulting in:

```text
Specificity Wars
```

and eventually:

```css
!important
```

everywhere.

---

With Shadow DOM:

```css
button {
  color: blue;
}
```

is often enough because:

```text
External CSS
Cannot Interfere
```

The encapsulation boundary significantly reduces specificity conflicts.

---

# Real-World Example

## CSS Modules

```css
.btn_x7af3
```

avoids naming collisions.

But global rules still affect components:

```css
button {
  font-size: 24px;
}
```

may impact your button.

---

## Shadow DOM

```html
<my-button>
  #shadow-root
  <button></button
></my-button>
```

Global rules generally cannot style the internal button because of the shadow boundary.

---

# Architect-Level Summary

### CSS Modules

```text
Solves:
✓ Class Name Collisions

Does NOT Solve:
✗ Specificity Conflicts
✗ Global Selector Leakage
```

---

### Shadow DOM

```text
Solves:
✓ Class Name Collisions
✓ Global Style Leakage
✓ Specificity Battles
✓ Style Encapsulation
✓ DOM Encapsulation
```

---

# Interview Answer (60 Seconds)

> Shadow DOM does not change the CSS specificity algorithm itself; a selector's specificity is still calculated using the normal CSS rules. What Shadow DOM changes is the style scope. Selectors inside a shadow tree only compete with other selectors inside that same shadow tree, while global page selectors generally cannot cross the shadow boundary. This greatly reduces specificity conflicts because component styles are isolated from application-wide styles. Features such as `:host`, `:host()`, and `::slotted()` provide controlled ways to style the host element and projected content while maintaining encapsulation. As a result, Shadow DOM helps eliminate many of the "specificity wars" commonly seen in large applications where global CSS, third-party libraries, and component styles compete with each other.

### 15.

**How would you make Web Components communicate with React, Angular, and Vue applications simultaneously?**

# Architect Question

## How would you make Web Components communicate with React, Angular, and Vue applications simultaneously?

This is a **Principal Frontend / Micro-Frontend Architecture** question.

The key principle is:

```text
Do NOT use framework-specific communication.
```

Avoid:

```text
React Context
Angular Services
Vue Store
Redux
```

because Web Components must remain:

```text
Framework Agnostic
```

Web Components are designed to be reusable across React, Angular, Vue, and plain JavaScript applications. Web Components: The Future of Cross-Framework Reusability (with Angular Integration) specifically describes them as framework-independent UI components. [1](https://www.c-sharpcorner.com/article/web-components-the-future-of-cross-framework-reusability-with-angular-integrat/)

---

# High-Level Architecture

```text
            Event Bus

        ▲       ▲       ▲
        │       │       │

      React   Angular   Vue
          ▲      ▲      ▲
          │      │      │

        Web Components
```

Use:

```text
Properties/Attributes
↓
Custom Events
↓
Shared Event Bus
```

as the communication contract.

---

# Communication Pattern 1: Data Into Web Components

Use:

```text
Properties
Attributes
Methods
```

---

## Web Component

```javascript
class UserCard extends HTMLElement {
  set user(value) {
    this.render(value);
  }
}
```

---

## React

```jsx
<user-card user-id="101" />
```

or

```jsx
ref.current.user = user;
```

---

## Angular

```html
<user-card [user-id]="userId"> </user-card>
```

Angular supports custom elements through the Custom Elements API. [2](https://bing.com/search?q=Web+Components+communicate+React+Angular+Vue+CustomEvent)

---

## Vue

```html
<user-card :user-id="userId"> </user-card>
```

All frameworks can pass data through standard DOM properties and attributes.

---

# Communication Pattern 2: Web Component → Framework

Use:

```text
CustomEvent
```

This is the most important technique.

Internal examples show React and Angular integrations communicating through custom events. AI_Inteview_Evaluation_Girija Ghatge 00003242 (1).pdf describes Angular and React components listening to each other's custom events. [3](<https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20(1).pdf?web=1>)

---

## Web Component

```javascript
this.dispatchEvent(
  new CustomEvent("user-selected", {
    detail: {
      id: 101,
    },
    bubbles: true,
    composed: true,
  }),
);
```

The `composed: true` setting is important when Shadow DOM is involved, allowing events to cross the shadow boundary. [4](https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component)

---

# React Listener

```jsx
useEffect(() => {
  const element = ref.current;

  const handler = (e) => {
    console.log(e.detail);
  };

  element.addEventListener("user-selected", handler);

  return () => element.removeEventListener("user-selected", handler);
}, []);
```

---

# Angular Listener

```html
<user-card (user-selected)="onUserSelected($event)"> </user-card>
```

or

```typescript
element.addEventListener(...)
```

---

# Vue Listener

```html
<user-card @user-selected="handleUser"> </user-card>
```

---

# Communication Pattern 3: Cross-Framework Messaging

Problem:

```text
React App
Angular App
Vue App

Need Shared Events
```

Do NOT let them call each other directly.

Use:

```text
Event Bus
```

instead.

Multiple sources describe CustomEvent/Event Bus approaches as the preferred way to decouple independently developed applications and web components. [5](https://dev.to/ujja/web-components-in-angular-integrating-react-components-across-framework-boundaries-29l5)[6](https://docs.bswen.com/blog/2026-04-30-customevent-state-management/)[7](https://stackoverflow.com/questions/55001211/how-to-communicate-between-web-components-native-ui)

---

## Shared Event Bus

```javascript
class EventBus {
  publish(eventName, payload) {
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload,
      }),
    );
  }

  subscribe(eventName, handler) {
    window.addEventListener(eventName, handler);
  }
}
```

---

# Example

### Web Component

```javascript
eventBus.publish("cart:item-added", {
  productId: 10,
});
```

---

### React

```javascript
eventBus.subscribe("cart:item-added", callback);
```

---

### Angular

```javascript
eventBus.subscribe("cart:item-added", callback);
```

---

### Vue

```javascript
eventBus.subscribe("cart:item-added", callback);
```

None of the applications need to know who emitted the event.

---

# Communication Pattern 4: Parent Orchestrator

For large systems:

```text
React
Angular
Vue
Web Components
```

introduce a shell application.

```text
Shell
 ├─ React MFE
 ├─ Angular MFE
 ├─ Vue MFE
 └─ Web Components
```

The shell becomes:

```text
Event Router
State Coordinator
```

This aligns with recommendations that parent applications mediate interactions instead of tightly coupling sibling components. [7](https://stackoverflow.com/questions/55001211/how-to-communicate-between-web-components-native-ui)

---

# Important Shadow DOM Considerations

If Web Components use:

```text
Shadow DOM
```

events must be created as:

```javascript
new CustomEvent("user-selected", {
  bubbles: true,
  composed: true,
});
```

Without:

```text
composed: true
```

the event may not escape the Shadow Root. [4](https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component)

---

# Event Naming Convention

Avoid:

```text
open
update
change
submit
```

Use:

```text
cart:item-added
user:selected
auth:login
notification:show
```

This prevents collisions across teams and frameworks.

---

# Best Practices

### ✅ Use

```text
Properties
Attributes
Methods
Custom Events
Shared Event Bus
```

### ❌ Avoid

```text
React Context
Angular Service Injection
Redux Dependencies
Framework-Specific APIs
```

because Web Components should remain framework-independent. [1](https://www.c-sharpcorner.com/article/web-components-the-future-of-cross-framework-reusability-with-angular-integrat/)[8](https://www.acldigital.com/blogs/the-ultimate-guide-to-lit-build-once-use-across-angular-react-and-vue-frameworks)

---

# Architect-Level Answer

> To make Web Components communicate simultaneously with React, Angular, and Vue, I would use browser-native communication primitives rather than framework-specific state management. Data would flow into Web Components through properties, attributes, or public methods, while data would flow out using strongly typed CustomEvents. For application-wide communication, I would introduce a lightweight event bus based on CustomEvent or EventTarget so that React, Angular, Vue, and Web Components all subscribe to the same event contracts. If Shadow DOM is used, I would ensure events are emitted with `bubbles: true` and `composed: true` so they can cross shadow boundaries. This approach keeps components loosely coupled, framework-agnostic, easy to test, and ideal for micro-frontends, design systems, and enterprise-scale applications. [3](<https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Girija%20Ghatge%2000003242%20(1).pdf?web=1>)[5](https://dev.to/ujja/web-components-in-angular-integrating-react-components-across-framework-boundaries-29l5)[6](https://docs.bswen.com/blog/2026-04-30-customevent-state-management/)[4](https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component)

---

# React Listening to Web Component Events

The recommended approach is for the Web Component to emit a `CustomEvent`, and for React to subscribe using `addEventListener`. This keeps the Web Component framework-agnostic and allows the same component to work with React, Angular, Vue, or plain JavaScript.

---

# 1. Web Component

```javascript
class UserCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <button id="selectBtn">
        Select User
      </button>
    `;
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#selectBtn")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("user-selected", {
            detail: {
              id: 101,
              name: "Sudhir",
            },
            bubbles: true,
            composed: true,
          }),
        );
      });
  }
}

customElements.define("user-card", UserCard);
```

> `composed: true` allows the event to cross Shadow DOM boundaries, while `detail` carries the payload.

---

# 2. React Component

```jsx
import { useEffect, useRef } from "react";

function App() {
  const userCardRef = useRef(null);

  useEffect(() => {
    const element = userCardRef.current;

    const handleUserSelected = (event) => {
      console.log("User Selected:", event.detail);
    };

    element.addEventListener("user-selected", handleUserSelected);

    return () => {
      element.removeEventListener("user-selected", handleUserSelected);
    };
  }, []);

  return <user-card ref={userCardRef} />;
}

export default App;
```

---

# 3. Expected Output

When the button inside the Web Component is clicked:

```javascript
{
  id: 101,
  name: "Sudhir"
}
```

will be available in:

```javascript
event.detail;
```

---

# 4. Production Pattern (Reusable Hook)

```jsx
import { useEffect } from "react";

export function useWebComponentEvent(ref, eventName, handler) {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    element.addEventListener(eventName, handler);

    return () => {
      element.removeEventListener(eventName, handler);
    };
  }, [ref, eventName, handler]);
}
```

Usage:

```jsx
const ref = useRef();

useWebComponentEvent(ref, "user-selected", (e) => {
  console.log(e.detail);
});
```

---

# Architect-Level Best Practice

For enterprise micro-frontends:

```text
React
Angular
Vue
Web Components
```

Use:

```text
Input
  → Properties / Attributes

Output
  → Custom Events

Cross-App Communication
  → Event Bus (CustomEvent/EventTarget)
```

Avoid coupling Web Components to:

```text
React Context
Redux
Angular Services
Vuex / Pinia
```

This keeps the component reusable across all frameworks.

### Interview One-Liner

> In React, Web Components should communicate outward using `CustomEvent`, while React listens via `addEventListener` inside `useEffect` and cleans up the subscription on unmount. This keeps the Web Component completely framework-agnostic and enables reuse across React, Angular, Vue, and plain JavaScript applications.

## Accessibility & Enterprise UI

### 16.

**How would you architect DOM updates for accessibility-first applications?**

**Expected Discussion**

- Focus Management
- ARIA Live Regions
- Keyboard Navigation
- WCAG

---

# How Would You Architect DOM Updates for Accessibility-First Applications?

This is a **Principal Frontend Architect** question.

Most teams optimise DOM updates for:

```text
Performance
```

An accessibility-first team optimises for:

```text
Performance
+
Screen Readers
+
Keyboard Users
+
Focus Management
+
Assistive Technologies
```

The key principle:

> Every DOM update must be evaluated not only for visual impact, but also for its effect on the accessibility tree, focus state, keyboard navigation, and screen reader announcements.

Accessibility guidance consistently emphasises keyboard focus handling, ARIA usage, semantic HTML, and proper announcements for dynamic content. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B687A718E-18F6-4990-AA50-928DC8ED9989%7D&file=Addendum%206_Comprehensive%20accessibility%20framework.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)[2](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Mahesh%20Ganjare_00003252.pdf?web=1)[3](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BC897A911-8DD2-4F21-87E3-9429781FBF0D%7D&file=Inkling_Persistent_Proposal_Nov2022_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# Architecture Layers

```text
Application State
        ↓

Accessibility State
(Focus, ARIA, Announcements)

        ↓

React / Framework State

        ↓

DOM Updates

        ↓

Accessibility Tree

        ↓

Screen Readers
Keyboard Users
Assistive Technology
```

---

# 1. Prefer Semantic HTML Over DOM Manipulation

Bad:

```html
<div role="button" tabindex="0">Submit</div>
```

Better:

```html
<button>Submit</button>
```

Semantic elements automatically provide:

✅ Keyboard support

✅ Screen reader support

✅ Proper accessible roles

Enterprise accessibility guidance emphasises semantic HTML, keyboard navigation, roles, and ARIA labels as foundational accessibility practices. [2](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Mahesh%20Ganjare_00003252.pdf?web=1)[3](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BC897A911-8DD2-4F21-87E3-9429781FBF0D%7D&file=Inkling_Persistent_Proposal_Nov2022_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# 2. Never Break Focus During DOM Updates

One of the biggest accessibility failures:

```text
DOM Re-render
↓
Focused Element Removed
↓
Keyboard User Lost
```

Example:

```jsx
{
  isOpen && <Modal />;
}
```

If the modal closes:

```text
Focus Should Return
to Trigger Button
```

---

## Recommended Pattern

```jsx
const triggerRef = useRef();

function closeModal() {
  setOpen(false);

  triggerRef.current.focus();
}
```

Focus management is a core accessibility requirement because assistive technology users rely heavily on keyboard navigation. [4](https://www.telerik.com/blogs/creating-web-next-billion-users-aria-focus-focus-management)[2](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Mahesh%20Ganjare_00003252.pdf?web=1)

---

# 3. Centralised Live Region Announcer

Problem:

```text
Data Loaded
Toast Shown
Validation Error
Search Results Updated
```

Screen readers may not know about dynamic changes.

---

## Solution

Create:

```html
<div aria-live="polite" id="announcer"></div>
```

Dynamic updates that occur without page reloads should be announced through ARIA live regions so assistive technologies can detect them. [5](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)[6](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)[7](https://developer.mozilla.org.cach3.com/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

---

## React Service

```jsx
function announce(message) {
  const region = document.getElementById("announcer");

  region.textContent = "";

  requestAnimationFrame(() => {
    region.textContent = message;
  });
}
```

Usage:

```jsx
announce("Search results loaded");
```

---

# 4. Design DOM Updates Around WCAG Announcements

---

## Example: Search Results

Bad:

```text
Results Change
Visually Updated
No Announcement
```

Screen reader:

```text
Nothing Happens
```

---

## Better

```jsx
announce(`${count} results found`);
```

`aria-live="polite"` is recommended for most non-urgent updates such as search results or status information. [5](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)[6](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)

---

# 5. Use Polite vs Assertive Correctly

---

## Polite

```html
aria-live="polite"
```

Examples:

```text
Search Results
Save Successful
Cart Updated
```

---

## Assertive

```html
aria-live="assertive"
```

Examples:

```text
Payment Failed
Session Expiring
Critical Error
```

Accessibility guidance warns that assertive announcements interrupt users and should be reserved for truly urgent situations. [5](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)[6](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)

---

# 6. Avoid Replacing Entire DOM Subtrees

Bad:

```jsx
container.innerHTML = hugeMarkup;
```

Effects:

```text
Focus Lost
Virtual Cursor Lost
Screen Reader Context Lost
```

---

Prefer:

```text
Incremental Updates
```

React's reconciliation model naturally supports this through controlled updates rather than complete DOM replacement.

---

# 7. Accessibility-First Virtualisation

Large grids often use:

```text
React Window
AG Grid
```

Problem:

```text
Rows disappear
from DOM
```

Screen readers may become confused.

---

## Architect Solution

Expose:

```text
aria-rowcount
aria-rowindex
aria-setsize
aria-posinset
```

and preserve keyboard navigation.

Large, virtualized interfaces must keep accessibility metadata synchronized with visible content. Accessibility governance documents emphasise handling keyboard focus and ARIA correctly during UI updates. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B687A718E-18F6-4990-AA50-928DC8ED9989%7D&file=Addendum%206_Comprehensive%20accessibility%20framework.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)[3](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BC897A911-8DD2-4F21-87E3-9429781FBF0D%7D&file=Inkling_Persistent_Proposal_Nov2022_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# 8. Accessibility State Layer

Store more than UI state.

Example:

```typescript
{
  modalOpen: true,

  focusedElement:
    "edit-button",

  announcement:
    "Profile Updated",

  keyboardMode: true
}
```

Architecture becomes:

```text
Application State
+
Accessibility State
```

This prevents accessibility regressions during updates.

---

# 9. ARIA Only When Necessary

Bad:

```html
<div role="button" aria-label="Submit"></div>
```

Good:

```html
<button>Submit</button>
```

Accessibility guidance repeatedly warns that ARIA is often used incorrectly and that semantic HTML should be preferred whenever possible. [8](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjg2OTA0NjEwNDQxNjI1NiJ9)[2](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Mahesh%20Ganjare_00003252.pdf?web=1)

---

# 10. Accessibility Testing Pipeline

For every DOM update verify:

### Keyboard

```text
Tab
Shift+Tab
Enter
Escape
Arrow Keys
```

### Screen Reader

```text
JAWS
NVDA
VoiceOver
```

### Automated

```text
axe-core
Lighthouse
Deque Axe DevTools
```

Enterprise accessibility frameworks reference tools such as JAWS, axe-core, Lighthouse, ARC Toolkit, and Deque Axe DevTools as part of accessibility validation. [1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B687A718E-18F6-4990-AA50-928DC8ED9989%7D&file=Addendum%206_Comprehensive%20accessibility%20framework.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)[9](https://persistentsystems.sharepoint.com/sites/intranet/SASVA/_layouts/15/Doc.aspx?sourcedoc=%7B25E69E62-30CF-4811-8C5D-1A5DF65AA1B2%7D&file=2_Incluscan_SASVA3.0_Hackathon_Presentation.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# Example Architecture

```text
React Component
        ↓

State Update
        ↓

Accessibility Middleware
        ↓

Focus Decision
        ↓

ARIA Decision
        ↓

Announcement Decision
        ↓

DOM Update
        ↓

Accessibility Tree Update
```

Before any DOM mutation ask:

```text
Will focus move?
Will screen readers know?
Will keyboard flow remain intact?
```

---

# Architect-Level Interview Answer

> I would architect DOM updates around accessibility as a first-class concern rather than treating it as a post-processing step. Every UI update would pass through an accessibility layer responsible for focus management, ARIA updates, and live-region announcements. I would prefer semantic HTML over custom widgets, preserve focus during component re-renders, use centralised `aria-live` regions for dynamic updates, and ensure virtualized content exposes the necessary ARIA metadata. For non-visual users, a DOM update is only successful if it updates the accessibility tree correctly. Therefore, I would continuously validate keyboard navigation, screen reader behaviour, and WCAG compliance using automated tools such as axe-core and manual testing with assistive technologies. [5](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)[6](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)[1](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B687A718E-18F6-4990-AA50-928DC8ED9989%7D&file=Addendum%206_Comprehensive%20accessibility%20framework.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)[9](https://persistentsystems.sharepoint.com/sites/intranet/SASVA/_layouts/15/Doc.aspx?sourcedoc=%7B25E69E62-30CF-4811-8C5D-1A5DF65AA1B2%7D&file=2_Incluscan_SASVA3.0_Hackathon_Presentation.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

# Key ARIA Roles Every Frontend Architect Should Know

> Rule #1: Use native HTML first (`button`, `input`, `nav`, `table`, etc.). Only use ARIA roles when native semantics are unavailable. Incorrect ARIA usage can reduce accessibility rather than improve it.

---

## Landmark Roles

These help screen-reader users navigate the page quickly.

| Role            | Purpose           |
| --------------- | ----------------- |
| `banner`        | Site header       |
| `navigation`    | Navigation menu   |
| `main`          | Main content area |
| `complementary` | Sidebar content   |
| `contentinfo`   | Footer            |
| `search`        | Search region     |

Example:

```html
<main role="main">...</main>
```

These roles improve page structure and assistive technology navigation.

---

## Interactive Widget Roles

### Button

```html
<div role="button" tabindex="0">Save</div>
```

Prefer:

```html
<button>Save</button>
```

---

### Dialog

```html
<div role="dialog" aria-modal="true"></div>
```

Used for:

```text
Modal
Popup
Drawer
```

---

### Tab System

```html
role="tablist" role="tab" role="tabpanel"
```

---

### Menu System

```html
role="menu" role="menuitem"
```

---

### Tree View

```html
role="tree" role="treeitem"
```

Often used in file explorers and navigation trees. ARIA is commonly needed for complex widgets such as comboboxes and tree views.

---

## Form Roles

### Combobox

```html
role="combobox"
```

### Listbox

```html
role="listbox"
```

### Option

```html
role="option"
```

Useful for custom dropdowns and autocomplete controls.

---

## Status & Live Region Roles

### Status

```html
<div role="status"></div>
```

For non-critical updates.

Example:

```text
Profile Saved Successfully
```

---

### Alert

```html
<div role="alert"></div>
```

For urgent updates.

Example:

```text
Payment Failed
Session Expired
```

Live-region roles are intended to announce dynamic content changes to assistive technologies.

---

# Focus Management Techniques

Focus management is one of the most important aspects of accessibility because keyboard and screen-reader users rely on predictable navigation.

---

# 1. Preserve Focus During DOM Updates

Bad:

```text
Modal Opens
↓
Focus Stays Behind Modal
```

User becomes trapped.

Good:

```text
Modal Opens
↓
Move Focus Into Modal
```

```jsx
useEffect(() => {
  firstInputRef.current.focus();
}, []);
```

---

# 2. Return Focus When Closing Components

Before opening:

```text
Focus = Edit Button
```

Modal opens:

```text
Focus = Modal
```

Modal closes:

```text
Focus → Edit Button
```

```jsx
triggerRef.current.focus();
```

This preserves user context.

---

# 3. Focus Trap for Dialogs

While a modal is open:

```text
Tab
Shift + Tab
```

should stay inside the dialog.

```text
❌ User Tabs Behind Modal
✅ User Stays Inside Modal
```

Typical implementation:

```text
First Element
↓
...
↓
Last Element
↓
Loops Back
```

---

# 4. Visible Focus Indicators

Never remove:

```css
outline: none;
```

unless replaced with an accessible alternative.

Good:

```css
:focus-visible {
  outline: 3px solid blue;
}
```

Users must always know where keyboard focus is located.

---

# 5. Logical Tab Order

Users should tab through the page in a predictable sequence.

Good:

```text
Logo
↓
Navigation
↓
Search
↓
Content
↓
Footer
```

Bad:

```text
Logo
↓
Footer
↓
Search
↓
Sidebar
```

Accessibility reviews specifically check keyboard focus handling and tab order.

---

# 6. Use Roving Tabindex for Complex Widgets

Instead of:

```html
tabindex="0" tabindex="0" tabindex="0"
```

Use:

```html
tabindex="0" tabindex="-1" tabindex="-1"
```

and move focus using arrow keys.

Common for:

```text
Tabs
Menus
Grid Navigation
Tree Views
```

---

# 7. Announce Dynamic Changes

If DOM changes without moving focus:

```text
Search Results Updated
Toast Appears
Validation Message Added
```

use a live region.

```html
<div aria-live="polite"></div>
```

Dynamic updates should be communicated via ARIA live regions so assistive technologies can announce changes.

---

# 8. Avoid Focusing Hidden Elements

Bad:

```html
<button aria-hidden="true"></button>
```

Accessibility guidance explicitly warns against hidden focusable elements.

---

# Architect-Level Interview Answer

> For accessibility-first applications, I focus on three areas: semantic HTML, ARIA only where necessary, and robust focus management. Key ARIA roles include landmarks (`main`, `navigation`, `banner`), widgets (`dialog`, `tab`, `menu`, `tree`), and live-region roles (`status`, `alert`). For focus management, I ensure focus is moved appropriately when components open and close, trap focus inside modals, maintain logical tab order, preserve focus during DOM updates, provide visible focus indicators, and announce dynamic changes using `aria-live` regions. Accessibility is successful only when both the visual DOM and the accessibility tree remain synchronized.

# ARIA Attributes for Dynamic Content

When content changes without a page reload, screen readers may not automatically detect those changes. ARIA live-region attributes help announce updates to assistive technologies.

---

## 1. `aria-live`

Controls how updates are announced.

### Polite Updates

```html
<div aria-live="polite"></div>
```

Use for:

```text
Search results
Profile updates
Cart changes
```

Screen readers announce changes when the user is idle.

### Assertive Updates

```html
<div aria-live="assertive"></div>
```

Use for:

```text
Payment failures
Session expiration
Critical errors
```

Interrupts current speech and should be used sparingly.

---

## 2. `aria-atomic`

Controls whether the entire region or only changed text is announced.

```html
<div aria-live="polite" aria-atomic="true"></div>
```

When the value changes:

```text
Cart Total: ₹500
↓
Cart Total: ₹750
```

The full message is announced.

---

## 3. `aria-relevant`

Specifies which changes should be announced.

```html
<div aria-live="polite" aria-relevant="additions"></div>
```

Options:

```text
additions
removals
text
all
```

---

## 4. `aria-busy`

Prevents announcements during multiple updates.

```html
<div aria-live="polite" aria-busy="true"></div>
```

After updates complete:

```javascript
element.setAttribute("aria-busy", "false");
```

Screen readers wait until updates finish before announcing.

---

# React Example: Live Region Announcer

```jsx
function LiveAnnouncer() {
  return (
    <div
      id="announcer"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
```

Announcement helper:

```javascript
function announce(message) {
  const region = document.getElementById("announcer");

  region.textContent = "";

  setTimeout(() => {
    region.textContent = message;
  }, 50);
}
```

Usage:

```javascript
announce("Profile saved successfully");
```

Live regions are specifically designed to announce dynamic content updates that occur without a page refresh.

---

# Focus Trap in Modal Dialogs

## Goal

When a modal opens:

✅ Focus moves inside modal

✅ Tab stays inside modal

✅ Shift + Tab stays inside modal

✅ Focus returns when modal closes

This is a key accessibility requirement for keyboard users.

---

# React Focus Trap Example

```jsx
import { useEffect, useRef } from "react";

function Modal({ isOpen, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;

    const focusable = modal.querySelectorAll("button, input, a, textarea");

    const first = focusable[0];

    const last = focusable[focusable.length - 1];

    first.focus();

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    modal.addEventListener("keydown", handleKeyDown);

    return () => {
      modal.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" ref={modalRef}>
      <input placeholder="Name" />

      <button>Save</button>

      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

---

# Returning Focus After Modal Close

```jsx
const triggerRef = useRef();

function openModal() {
  setOpen(true);
}

function closeModal() {
  setOpen(false);

  triggerRef.current.focus();
}
```

This preserves keyboard context and prevents users from becoming "lost" after closing the modal.

---

# Automated Accessibility Testing Tools

Enterprise accessibility frameworks and accessibility audit guidance reference the following tools for automated and semi-automated validation.

| Tool                                    | Purpose                           |
| --------------------------------------- | --------------------------------- |
| **axe-core**                            | Accessibility rule engine         |
| **Deque Axe DevTools**                  | Browser extension & CI testing    |
| **Lighthouse**                          | Accessibility scoring in Chrome   |
| **ARC Toolkit**                         | Accessibility inspection          |
| **Wave**                                | Accessibility analysis            |
| **JAWS Inspect**                        | Screen-reader testing support     |
| **NVDA**                                | Screen-reader validation          |
| **Chrome DevTools Accessibility Panel** | Accessibility tree inspection     |
| **Selenium + axe-core**                 | Automated E2E accessibility tests |
| **Playwright + axe-core**               | Accessibility regression testing  |

---

# Example: Playwright + Axe

```javascript
import AxeBuilder from "@axe-core/playwright";

test("Accessibility Audit", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const results = await new AxeBuilder({
    page,
  }).analyze();

  expect(results.violations).toEqual([]);
});
```

---

# Architect-Level Interview Answer

> For dynamic content, I use ARIA live-region attributes such as `aria-live`, `aria-atomic`, `aria-relevant`, and `aria-busy` to ensure screen readers are informed of DOM updates. For modals and overlays, I implement focus management with focus trapping, logical Tab navigation, initial focus placement, and focus restoration when the modal closes. Finally, I integrate automated accessibility testing into CI/CD using tools like axe-core, Axe DevTools, Lighthouse, Playwright with axe-core, and Selenium-based accessibility audits, while validating critical user journeys with screen readers such as JAWS and NVDA.

### 17.

**What challenges arise when dynamically updating DOM for screen readers?**

---

## Memory Management

### 18.

**How do DOM memory leaks occur?**

**Expected Discussion**

- Detached DOM Nodes
- Event Listeners
- Closures
- Timers

---

# How Do DOM Memory Leaks Occur?

A **memory leak** occurs when objects are no longer needed but are still referenced somewhere, preventing JavaScript's Garbage Collector (GC) from reclaiming memory. Over time, memory usage grows, performance degrades, and long-running SPAs become sluggish or may crash. [1](https://medium.com/@rahul.jindal57/memory-leaks-in-dom-elements-and-closures-b3452f129dac)[2](https://frontendchecklist.io/rules/javascript/memory-leaks)[3](https://medium.com/@manappa.kammar777/understanding-memory-leaks-in-single-page-applications-a-frontend-engineers-guide-07a72f8798ed)

---

# Memory Leak Architecture

```text
DOM Node
    ↓
Referenced by JS
    ↓
Removed from DOM
    ↓
Still Referenced
    ↓
Garbage Collector
Cannot Free Memory
    ↓
Memory Leak
```

The root cause of nearly every DOM memory leak is:

```text
Unwanted References
```

---

# 1. Detached DOM Nodes

This is the most common DOM leak.

A detached node is:

```text
Removed From DOM
BUT
Still Referenced By JavaScript
```

Microsoft's DevTools documentation describes detached elements as DOM nodes no longer attached to the DOM tree but still retained by JavaScript references. [4](https://learn.microsoft.com/en-us/microsoft-edge/devtools/memory-problems/dom-leaks-memory-tool-detached-elements)[5](https://bing.com/search?q=DOM+memory+leaks+detached+DOM+nodes+event+listeners+closures+timers)

---

## Leaking Example

```javascript
let element = document.createElement("div");

document.body.appendChild(element);

document.body.removeChild(element);

// Still referenced
console.log(element);
```

Problem:

```text
DOM Node Removed
JS Reference Exists
```

GC cannot reclaim memory.

---

## Fix

```javascript
document.body.removeChild(element);

element = null;
```

Now the element becomes eligible for garbage collection. [6](https://dev.to/muhammadaqib86/javascript-memory-leaks-the-silent-killers-and-how-to-fix-them-ik2)[1](https://medium.com/@rahul.jindal57/memory-leaks-in-dom-elements-and-closures-b3452f129dac)

---

# 2. Event Listener Leaks

Event listeners create hidden references.

Example:

```javascript
button.addEventListener("click", handler);
```

The listener holds references to:

```text
Element
Handler
Closure Variables
```

---

## Leaking Example

```javascript
const button = document.getElementById("btn");

button.addEventListener("click", handleClick);

button.remove();
```

Problem:

```text
Button Removed
Listener Still Exists
```

Memory remains allocated.

Forgotten event listeners are one of the most common memory leak sources. [2](https://frontendchecklist.io/rules/javascript/memory-leaks)[6](https://dev.to/muhammadaqib86/javascript-memory-leaks-the-silent-killers-and-how-to-fix-them-ik2)[7](https://rune.codes/hub/javascript/how-to-prevent-memory-leaks-in-javascript-closures)

---

## Fix

```javascript
button.removeEventListener("click", handleClick);

button.remove();
```

---

## React Example

Bad:

```jsx
useEffect(() => {
  window.addEventListener("resize", onResize);
}, []);
```

Leaks after unmount.

---

Good:

```jsx
useEffect(() => {
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
  };
}, []);
```

Proper cleanup of event listeners is a common solution to memory leaks in React applications. [8](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)[2](https://frontendchecklist.io/rules/javascript/memory-leaks)

---

# 3. Closure Leaks

Closures retain variables from outer scopes.

Normally:

```javascript
function outer() {
  let count = 0;

  return function () {
    count++;
  };
}
```

This is fine.

---

## Leak Example

```javascript
function createLeak() {
  const hugeData = new Array(1000000).fill("data");

  return function () {
    console.log(hugeData.length);
  };
}

const fn = createLeak();
```

Problem:

```text
Closure Exists
↓
hugeData Exists
↓
GC Cannot Remove It
```

Closures can retain large objects or DOM references longer than intended. [1](https://medium.com/@rahul.jindal57/memory-leaks-in-dom-elements-and-closures-b3452f129dac)[6](https://dev.to/muhammadaqib86/javascript-memory-leaks-the-silent-killers-and-how-to-fix-them-ik2)[7](https://rune.codes/hub/javascript/how-to-prevent-memory-leaks-in-javascript-closures)

---

## DOM + Closure Leak

```javascript
function setup() {
  const element = document.getElementById("panel");

  return function () {
    console.log(element.innerHTML);
  };
}
```

Even if:

```javascript
element.remove();
```

the closure still retains:

```text
Detached Element
```

causing a leak.

---

# 4. Timer Leaks

Timers continue running after components disappear.

Example:

```javascript
setInterval(() => {
  fetchData();
}, 1000);
```

If not cleared:

```text
Interval
↓
Callback
↓
Closure
↓
Referenced Objects
```

stay alive forever.

Intervals and timers are a well-known memory leak source when not cleaned up. [6](https://dev.to/muhammadaqib86/javascript-memory-leaks-the-silent-killers-and-how-to-fix-them-ik2)[9](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)[8](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

## Leaking Example

```javascript
function start() {
  setInterval(() => {
    console.log("running");
  }, 1000);
}
```

No cleanup.

Memory grows over time.

---

## Fix

```javascript
const id =
 setInterval(...);

clearInterval(id);
```

---

## React Example

Bad:

```jsx
useEffect(() => {
  setInterval(refresh, 1000);
}, []);
```

---

Good:

```jsx
useEffect(() => {
  const id = setInterval(refresh, 1000);

  return () => clearInterval(id);
}, []);
```

Enterprise interview examples explicitly identify uncleared `setInterval` calls as a root cause of memory leaks. [8](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)[9](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)

---

# Other Common Sources

## Pending API Requests

```javascript
fetch(...)
```

Component unmounts:

```text
Request Continues
↓
State Update Fires Later
```

Use:

```javascript
AbortController;
```

to cancel stale requests. [9](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)[8](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)

---

## WebSocket Leaks

Bad:

```javascript
socket = new WebSocket(...)
```

Never closed.

---

Good:

```javascript
socket.close();
```

when component unmounts.

---

# Detecting DOM Memory Leaks

Use:

```text
Chrome DevTools
Edge DevTools
Memory Tab
Heap Snapshot
Detached Elements
Allocation Timeline
```

Modern browser tools specifically include detached-element analysis for identifying DOM leaks. [4](https://learn.microsoft.com/en-us/microsoft-edge/devtools/memory-problems/dom-leaks-memory-tool-detached-elements)[5](https://bing.com/search?q=DOM+memory+leaks+detached+DOM+nodes+event+listeners+closures+timers)

---

# Architect-Level Interview Answer

> DOM memory leaks occur when JavaScript maintains references to objects that are no longer needed, preventing garbage collection. The most common causes are detached DOM nodes, forgotten event listeners, closures retaining large objects or DOM references, and uncleared timers or intervals. In React applications, leaks often appear after repeated mount/unmount cycles when `useEffect` cleanup is missing. I typically detect leaks using Chrome or Edge DevTools Memory profiling, heap snapshots, and detached element analysis. My prevention strategy is to remove event listeners, clear timers, cancel pending requests using `AbortController`, close subscriptions, and ensure all component side effects have proper cleanup functions during unmount. [4](https://learn.microsoft.com/en-us/microsoft-edge/devtools/memory-problems/dom-leaks-memory-tool-detached-elements)[2](https://frontendchecklist.io/rules/javascript/memory-leaks)[8](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Ankita%20Malviya_00003253.pdf?web=1)[9](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)

# 1. Code Examples for Cleaning Up Event Listeners

Forgotten event listeners are one of the most common causes of memory leaks because they keep references to DOM elements, handlers, and captured variables alive.

---

## Vanilla JavaScript

### ❌ Memory Leak

```javascript
const button = document.getElementById("save");

button.addEventListener("click", handleSave);

// Element removed
button.remove();

// Listener still exists
```

Problem:

```text
Element removed
↓
Listener reference remains
↓
GC cannot reclaim memory
```

---

### ✅ Correct Cleanup

```javascript
const button = document.getElementById("save");

function handleSave() {
  console.log("saved");
}

button.addEventListener("click", handleSave);

// Cleanup
button.removeEventListener("click", handleSave);

button.remove();
```

---

## React Example

### ❌ Wrong

```jsx
useEffect(() => {
  window.addEventListener("resize", onResize);
}, []);
```

The listener remains after component unmount.

---

### ✅ Correct

```jsx
useEffect(() => {
  function onResize() {
    console.log(window.innerWidth);
  }

  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
  };
}, []);
```

Proper cleanup of side effects such as event listeners is a recommended solution for React memory leaks.

---

## Using AbortController

Modern browsers support automatic listener cleanup.

```javascript
const controller = new AbortController();

window.addEventListener("resize", onResize, {
  signal: controller.signal,
});

// Cleanup
controller.abort();
```

---

# 2. How to Detect Memory Leaks with DevTools

Both Chrome DevTools and Edge DevTools provide memory analysis tools for finding leaks, detached DOM nodes, and retained objects. [6](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

## Method 1: Heap Snapshot

### Steps

```text
Open DevTools
↓
Memory Tab
↓
Take Heap Snapshot
↓
Perform User Actions
↓
Take Another Snapshot
↓
Compare Results
```

Look for:

```text
Detached HTMLDivElement
Detached HTMLButtonElement
Detached Nodes
```

Detached DOM elements are often indicators of memory leaks. [6](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

## Method 2: Detached Elements Profiling

### Steps

```text
DevTools
↓
Memory
↓
Detached Elements
↓
Start Recording
↓
Navigate Application
↓
Stop Recording
```

The tool shows:

```text
DOM Nodes
Still Retained By JS
```

and helps identify exactly what is preventing garbage collection. [6](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

## Method 3: Monitor Memory Growth

### Performance Monitor

```text
DevTools
↓
More Tools
↓
Performance Monitor
```

Watch:

```text
JS Heap Size
DOM Node Count
Event Listener Count
```

Warning sign:

```text
Navigate App
↓
Memory Keeps Growing
↓
Never Returns Down
```

Potential leak.

---

## Method 4: React Applications

### Symptoms

```text
Repeated Navigation
↓
Memory Increases
↓
Components Unmount
↓
Memory Not Released
```

This pattern is commonly seen with uncleared intervals, listeners, subscriptions, or pending API requests.

---

# 3. Best Practices to Prevent Timer-Related Leaks

Timers are dangerous because they keep callbacks and closures alive indefinitely. Uncleared timers are a common source of React and SPA memory leaks.

---

## ✅ Always Store Timer ID

```javascript
const timerId = setInterval(() => {
  refreshData();
}, 1000);
```

---

## ✅ Always Clear Timers

```javascript
clearInterval(timerId);
```

or

```javascript
clearTimeout(timerId);
```

---

## ✅ Cleanup Timers in React

```jsx
useEffect(() => {
  const id = setInterval(() => {
    refresh();
  }, 1000);

  return () => {
    clearInterval(id);
  };
}, []);
```

This is the recommended pattern for avoiding timer-related leaks in React components.

---

## ✅ Stop Timers When Not Visible

```javascript
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(id);
  }
});
```

Useful for:

```text
Dashboards
Charts
Real-time Monitoring
```

---

## ✅ Prefer Recursive setTimeout

Instead of:

```javascript
setInterval(fetchData, 1000);
```

Use:

```javascript
function poll() {
  fetchData();

  timer = setTimeout(poll, 1000);
}
```

Benefits:

```text
Better Control
Avoid Overlapping Calls
Easier Cleanup
```

---

## ✅ Cancel Pending Async Work

Bad:

```javascript
setTimeout(() => {
  setState(data);
}, 5000);
```

Component may already be gone.

Good:

```javascript
const timer =
  setTimeout(...);

clearTimeout(timer);
```

---

## ✅ Clear WebSocket/Subscription Timers

```javascript
socket.close();

clearInterval(heartbeatTimer);
```

Timers tied to subscriptions should always be cleaned up when the subscription ends.

---

# Architect-Level Interview Answer

> To prevent memory leaks, I always ensure that event listeners, timers, subscriptions, and async operations have explicit cleanup paths. I use Chrome or Edge DevTools Memory profiling with heap snapshots and detached element analysis to identify retained objects and detached DOM nodes. For timer-related leaks, I store timer IDs, clear intervals and timeouts during component unmount, cancel pending requests, and avoid long-running background work without cleanup. In React, every `useEffect` that creates a listener, timer, subscription, or side effect should return a cleanup function.

# React Cleanup Example with Multiple Listeners

In complex applications, a component may register:

```text
Window Events
Document Events
Media Queries
Custom Events
Timers
Subscriptions
```

All of them must be cleaned up during unmount.

---

## ❌ Incorrect Implementation

```jsx
useEffect(() => {
  window.addEventListener("resize", onResize);

  document.addEventListener("keydown", onKeyDown);

  window.addEventListener("scroll", onScroll);
}, []);
```

Problem:

```text
Component Unmounts
↓
Listeners Remain
↓
Old Closures Remain
↓
Memory Leak
```

Forgotten event listeners are one of the most common memory leak patterns.

---

## ✅ Proper Cleanup

```jsx
useEffect(() => {
  function onResize() {
    console.log("resize");
  }

  function onKeyDown(e) {
    console.log(e.key);
  }

  function onScroll() {
    console.log("scroll");
  }

  window.addEventListener("resize", onResize);

  document.addEventListener("keydown", onKeyDown);

  window.addEventListener("scroll", onScroll);

  return () => {
    window.removeEventListener("resize", onResize);

    document.removeEventListener("keydown", onKeyDown);

    window.removeEventListener("scroll", onScroll);
  };
}, []);
```

This pattern ensures listeners do not survive after component unmount.

---

## Advanced Example

```jsx
useEffect(() => {
  const controller = new AbortController();

  const timer = setInterval(refreshData, 5000);

  window.addEventListener("resize", onResize);

  fetch("/api/data", {
    signal: controller.signal,
  });

  return () => {
    clearInterval(timer);

    controller.abort();

    window.removeEventListener("resize", onResize);
  };
}, []);
```

This cleans:

```text
Event Listeners
Intervals
API Requests
```

which are all common leak sources.

---

# Detecting Memory Leaks in Production Applications

In production you cannot rely entirely on DevTools because you do not have direct access to end-user browser sessions.

Instead use a combination of monitoring and telemetry.

---

## 1. Monitor Heap Growth

Watch:

```text
JS Heap Size
DOM Node Count
Listener Count
```

Warning sign:

```text
30 Minutes Usage
↓
Memory Only Increases
↓
Never Drops
```

This often indicates retained references preventing garbage collection.

---

## 2. Real User Monitoring (RUM)

Track:

```text
Page Memory Usage
Long Tasks
Page Responsiveness
Crash Frequency
```

Indicators:

```text
Tab Becomes Slower
Scrolling Degrades
Browser Crashes
```

after long sessions.

---

## 3. Compare Navigation Cycles

Test:

```text
Navigate Page A
↓
Navigate Page B
↓
Repeat 50 Times
```

Expected:

```text
Memory Stabilises
```

Leak:

```text
Memory Continues Growing
```

This pattern is frequently observed in SPAs where components mount and unmount repeatedly.

---

## 4. Production Logging

Track:

```javascript
console.count("Component Mounted");
```

and

```javascript
console.count("Component Unmounted");
```

If:

```text
Mount Count > Unmount Count
```

you may have retained components.

---

## 5. Periodic Heap Snapshots (Staging)

Use:

```text
Chrome DevTools
Edge DevTools
Heap Snapshots
Detached Elements
```

to compare memory before and after repeated user flows. DevTools specifically provides Detached Elements profiling to identify DOM nodes retained by JavaScript references. [7](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

# Best Practices for Managing Closures

Closures themselves are not leaks.

Leaks occur when closures retain references longer than necessary.

---

## ✅ Keep Closures Small

Bad:

```javascript
const hugeData = new Array(1000000);

button.onclick = () => {
  process(hugeData);
};
```

Closure retains:

```text
1M Records
```

indefinitely.

---

## ✅ Avoid Capturing DOM Nodes

Bad:

```javascript
const element = document.getElementById("grid");

function listener() {
  console.log(element.innerHTML);
}
```

If the element is removed but the closure survives, the DOM node may remain in memory.

---

## ✅ Null Large References

```javascript
let data = loadHugeDataset();

/* use data */

data = null;
```

after the data is no longer required.

---

## ✅ Cleanup Event Listeners

Every listener creates a closure.

```javascript
button.addEventListener("click", handler);
```

Always remove it:

```javascript
button.removeEventListener("click", handler);
```

Event listeners frequently keep closures alive much longer than expected.

---

## ✅ Cleanup Timers

Timers also retain closures.

```javascript
const id = setInterval(() => {
  processData();
}, 1000);
```

Cleanup:

```javascript
clearInterval(id);
```

Uncleared timers are a common production memory leak source.

---

## ✅ Use useCallback Carefully

Bad:

```jsx
const handler = useCallback(() => {
  // captures 20 props
  // captures huge data
}, []);
```

The callback may unintentionally keep large objects alive.

Capture only what is necessary.

---

# Architect-Level Interview Answer

> Memory leaks in React applications commonly occur when event listeners, timers, or closures continue to hold references after components have unmounted. My strategy is to ensure every `useEffect` has a corresponding cleanup function that removes listeners, clears timers, aborts requests, and unsubscribes from external resources. In production, I monitor heap growth, user-session performance degradation, crash frequency, and repeated navigation cycles. For closures, I minimise captured variables, avoid retaining DOM nodes or large datasets, clean up listeners and timers promptly, and verify memory behaviour using heap snapshots and detached element analysis during performance testing.

### 19.

**A page memory footprint keeps increasing after navigation. Walk me through your debugging strategy.**

# Architect-Level Answer

## Scenario

> A page's memory footprint keeps increasing after navigation between routes. Walk me through your debugging strategy.

My goal is to answer three questions:

```text
1. Is memory actually leaking?
2. What objects are being retained?
3. Which code path is holding references?
```

---

# Step 1: Reproduce the Problem

First, I want a deterministic reproduction.

```text
Home
↓
Dashboard
↓
Settings
↓
Back
↓
Repeat 20-50 Times
```

I'm looking for:

```text
Memory Increase
DOM Node Increase
Listener Increase
```

that never returns to baseline.

A common indicator is memory continuing to grow after components mount and unmount repeatedly.

---

# Step 2: Confirm It Is a Memory Leak

Open:

```text
Chrome DevTools
→ Performance Monitor
```

Watch:

```text
JS Heap Size
DOM Node Count
Event Listener Count
```

Expected:

```text
Memory goes up
↓
GC runs
↓
Memory drops
```

Leak:

```text
Memory goes up
↓
GC runs
↓
Memory stays high
↓
Repeats forever
```

This indicates objects are still reachable and cannot be garbage collected.

---

# Step 3: Take Heap Snapshots

Open:

```text
DevTools
↓
Memory Tab
↓
Heap Snapshot
```

Process:

```text
Snapshot #1
↓
Navigate 20 Times
↓
Snapshot #2
```

Compare:

```text
Object Counts
Retained Size
Detached Elements
```

DevTools heap snapshots help identify retained objects that should have been released. [5](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

# Step 4: Look for Detached DOM Nodes

This is usually my first suspect.

Search:

```text
Detached
```

Common findings:

```text
Detached HTMLDivElement
Detached HTMLTableElement
Detached HTMLButtonElement
```

A detached DOM node means:

```text
Removed From DOM
BUT
Still Referenced In JS
```

which is a classic memory leak pattern. [5](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

# Step 5: Inspect Retainer Chain

The most important step.

For any leaked node:

```text
Retainers
```

shows:

```text
Window
 ↓
Component
 ↓
Listener
 ↓
Detached Element
```

or

```text
Timer
 ↓
Closure
 ↓
Large Object
```

This identifies exactly what is keeping memory alive. DevTools specifically exposes retained references for detached elements. [5](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

# Step 6: Check Event Listeners

Common leak:

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);
```

Missing cleanup:

```jsx
return () => {
  window.removeEventListener("resize", handleResize);
};
```

Event listeners are one of the most common reasons components remain in memory after unmount.

---

# Step 7: Check Timers

Search for:

```javascript
setInterval;
setTimeout;
requestAnimationFrame;
```

Typical leak:

```javascript
setInterval(() => {
  fetchData();
}, 1000);
```

without:

```javascript
clearInterval(id);
```

Uncleared timers keep callbacks, closures, and referenced data alive indefinitely.

---

# Step 8: Check Closures

Example:

```javascript
function createChart() {
  const hugeData = new Array(500000);

  return function () {
    console.log(hugeData.length);
  };
}
```

Question:

```text
Who owns this closure?
```

If the closure survives:

```text
hugeData survives
```

Closures can unintentionally retain large objects and DOM references.

---

# Step 9: Check Async Operations

I look for:

```javascript
fetch();
axios();
WebSockets();
EventSource();
```

Common issue:

```javascript
fetch(...)
```

Component unmounts.

```text
Request Completes
↓
Closure Executes
↓
Component Data Retained
```

Use:

```javascript
AbortController;
```

and cleanup logic. Enterprise examples explicitly cite cancelling requests and cleaning subscriptions to avoid memory leaks.

---

# Step 10: Verify React Component Cleanup

I add temporary instrumentation.

```jsx
useEffect(() => {
  console.log("mounted");

  return () => {
    console.log("unmounted");
  };
}, []);
```

Expected:

```text
mount
unmount
mount
unmount
```

If:

```text
mount
mount
mount
```

appears without matching unmounts, I investigate component lifecycle handling.

---

# Step 11: Validate the Fix

After cleanup:

```text
Navigate 50 Times
↓
Take Heap Snapshot
↓
Compare
```

Expected:

```text
Heap Stabilises
Detached Nodes Reduced
Listener Count Stable
```

Memory may fluctuate temporarily, but should return close to a steady baseline after garbage collection.

---

# Typical Root Causes I Find

| Leak Source        | What I Check                             |
| ------------------ | ---------------------------------------- |
| Detached DOM Nodes | Heap Snapshot → Detached Elements        |
| Event Listeners    | Missing `removeEventListener`            |
| Closures           | Large captured objects                   |
| Timers             | Missing `clearInterval` / `clearTimeout` |
| Fetch Calls        | Missing `AbortController`                |
| WebSockets         | Missing `close()`                        |
| Observers          | Missing `disconnect()`                   |
| Global Caches      | Unbounded growth                         |

These patterns are consistently identified in memory leak investigations and DevTools guidance.

---

# 90-Second Architect Interview Answer

> I start by reproducing the issue and confirming that memory growth persists across repeated navigation cycles. Then I use Chrome DevTools Memory and Performance tools to monitor heap size, take heap snapshots, and compare retained objects over time. My first focus is detached DOM nodes because they are a common indicator of leaks. Next, I inspect retainer chains to identify whether listeners, timers, closures, subscriptions, or caches are keeping objects alive. I specifically review React `useEffect` cleanup logic, ensuring listeners are removed, intervals cleared, requests cancelled with `AbortController`, and subscriptions closed on unmount. After implementing fixes, I repeat the navigation scenario and verify that heap usage stabilises and detached elements no longer accumulate. [5](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

# Common Memory Leak Fixes (With Code)

## 1. Event Listener Leaks

### ❌ Leak

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);
```

Problem:

```text
Component Unmounts
↓
Listener Still Registered
↓
Closure Still Alive
```

---

### ✅ Fix

```jsx
useEffect(() => {
  const handleResize = () => {
    console.log(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

Forgotten event listeners are one of the most common memory leak sources.

---

## 2. Timer Leaks

### ❌ Leak

```jsx
useEffect(() => {
  setInterval(() => {
    refreshData();
  }, 1000);
}, []);
```

---

### ✅ Fix

```jsx
useEffect(() => {
  const intervalId = setInterval(() => {
    refreshData();
  }, 1000);

  return () => {
    clearInterval(intervalId);
  };
}, []);
```

Uncleared timers are a common source of memory leaks in SPAs and React applications.

---

## 3. Fetch Request Leaks

### ❌ Leak

```jsx
useEffect(() => {
  fetch("/api/users")
    .then((r) => r.json())
    .then(setUsers);
}, []);
```

Component may unmount while request is running.

---

### ✅ Fix

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/users", {
    signal: controller.signal,
  })
    .then((r) => r.json())
    .then(setUsers);

  return () => {
    controller.abort();
  };
}, []);
```

Cancelling async operations is a commonly recommended strategy to avoid memory leaks.

---

## 4. WebSocket Leaks

### ❌ Leak

```javascript
const socket = new WebSocket(url);
```

Never closed.

---

### ✅ Fix

```jsx
useEffect(() => {
  const socket = new WebSocket(url);

  return () => {
    socket.close();
  };
}, []);
```

---

## 5. Detached DOM Nodes

### ❌ Leak

```javascript
let element = document.createElement("div");

document.body.appendChild(element);

document.body.removeChild(element);

// Still referenced
```

---

### ✅ Fix

```javascript
document.body.removeChild(element);

element = null;
```

Detached DOM nodes retained by JavaScript references are a classic memory leak pattern. [7](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

# How to Monitor Memory During Long User Sessions

Long-running enterprise applications such as:

```text
Trading Platforms
Admin Portals
CRM Systems
Monitoring Dashboards
```

often expose leaks that do not appear during short testing sessions.

---

## Strategy 1: Watch Heap Size

Open:

```text
Chrome DevTools
↓
Performance Monitor
```

Track:

```text
JS Heap Size
DOM Node Count
Event Listener Count
```

Healthy Application:

```text
Memory rises
↓
GC runs
↓
Memory falls
```

Leaking Application:

```text
Memory rises
↓
Memory rises again
↓
Never returns
```

Persistent heap growth is a strong signal that objects are being retained unexpectedly.

---

## Strategy 2: Navigation Stress Test

Simulate:

```text
Page A
↓
Page B
↓
Page C
↓
Repeat 100 Times
```

Monitor:

```text
Heap Size
DOM Nodes
Listener Count
```

Expected:

```text
Eventually stabilises
```

If growth continues indefinitely:

```text
Potential Leak
```

Repeated navigation with continuously increasing memory is a common SPA leak symptom.

---

## Strategy 3: Heap Snapshots

Take:

```text
Snapshot Before
↓
Navigate 50 Times
↓
Snapshot After
```

Compare:

```text
Detached Elements
Retained Objects
Large Arrays
Closures
```

Heap snapshots are a primary tool for identifying retained objects and detached DOM elements. [7](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

## Strategy 4: Detached Elements View

Use:

```text
Memory
↓
Detached Elements
```

Look for:

```text
Detached HTMLDivElement
Detached HTMLTableElement
Detached HTMLButtonElement
```

These indicate nodes removed from the DOM but still referenced elsewhere. [7](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

## Strategy 5: Production Monitoring

Track metrics such as:

```text
JS Heap Usage
Page Responsiveness
Long Tasks
Session Duration
```

Investigate users who report:

```text
App gets slower after 30+ minutes
High memory consumption
Tab crashes
```

These are common real-world memory leak symptoms.

---

# Architect-Level Checklist

Before shipping a React page, verify:

✅ All listeners cleaned up

✅ All intervals/timeouts cleared

✅ All WebSockets/subscriptions closed

✅ All fetch requests cancellable

✅ No detached DOM nodes

✅ Heap stabilises after repeated navigation

✅ Listener count remains stable

✅ DOM node count remains stable

---

# 60-Second Interview Answer

> For common memory leaks, I first ensure proper cleanup of event listeners, timers, asynchronous requests, WebSockets, and observers. In React, every `useEffect` that creates a side effect should return a cleanup function. To monitor memory over long sessions, I use Chrome or Edge DevTools Performance Monitor, heap snapshots, and detached element analysis. I run repeated navigation tests and verify that heap usage, DOM node count, and listener count stabilise over time. If memory continuously grows after garbage collection cycles, I inspect retained objects and retainer chains to identify the exact source of the leak. [7](https://persistentsystems.sharepoint.com/sites/allcompany/Shared%20Documents/Apps/Yammer/ninad_madhav-PSL%20Format%202.pdf?web=1)

---

## System Design + DOM

### 20.

**Design the front-end architecture for a trading dashboard updating 10,000 DOM elements every second.**

**Expected Discussion**

- Virtualization
- Web Workers
- requestAnimationFrame
- Batching
- Memoization
- Incremental Rendering

---

# Very Hard Architect Question (FAANG Level)

### 21.

**You need to build Google Sheets in the browser with 1 million rows and 100 columns. Explain your DOM architecture, rendering strategy, event model, memory management, accessibility approach, and performance optimization techniques.**

This single question can easily consume **45--60 minutes** in a Staff/Principal Engineer interview because it tests:

- DOM knowledge
- Browser internals
- Performance engineering
- Accessibility
- System design
- React architecture
- Scalability

This is the kind of DOM question commonly asked for **Architect / Staff Frontend Engineer / Principal Engineer** positions.
