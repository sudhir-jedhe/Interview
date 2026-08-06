To implement a traffic light system that switches between red, yellow, and green with the specified intervals, we can use a combination of HTML, CSS, and JavaScript.

### HTML

We'll create a basic structure for the traffic light, where each light (red, yellow, green) will be represented by a `div`. We'll style these `div` elements to visually represent the traffic light and use JavaScript to toggle the colors on and off.

### CSS

We'll use basic styling to display the traffic lights in a vertical stack, and then use JavaScript to toggle the colors on the appropriate light. We will also include transitions to make the color change smooth.

### JavaScript

We'll use `setInterval` to switch between the colors every specified interval.

Here's how to implement this:

### 1. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Traffic Light</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="traffic-light">
      <div id="red" class="light red"></div>
      <div id="yellow" class="light yellow"></div>
      <div id="green" class="light green"></div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

### 2. CSS Styles

```css
/* styles.css */

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  margin: 0;
}

.traffic-light {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 4px solid #333;
  padding: 20px;
  border-radius: 10px;
  background-color: #222;
}

.light {
  width: 50px;
  height: 50px;
  margin: 10px 0;
  border-radius: 50%;
  opacity: 0.2;
  transition: opacity 0.5s ease;
}

.red {
  background-color: red;
}

.yellow {
  background-color: yellow;
}

.green {
  background-color: green;
}

.active {
  opacity: 1;
}
```

### 3. JavaScript Logic

```javascript
// script.js

function trafficLight() {
  let redLight = document.getElementById("red");
  let yellowLight = document.getElementById("yellow");
  let greenLight = document.getElementById("green");

  // Initial state: Red light is on
  redLight.classList.add("active");

  let currentLight = "red";

  setInterval(() => {
    switch (currentLight) {
      case "red":
        // Switch to green after red
        redLight.classList.remove("active");
        greenLight.classList.add("active");
        currentLight = "green";
        break;
      case "green":
        // Switch to yellow after green
        greenLight.classList.remove("active");
        yellowLight.classList.add("active");
        currentLight = "yellow";
        break;
      case "yellow":
        // Switch to red after yellow
        yellowLight.classList.remove("active");
        redLight.classList.add("active");
        currentLight = "red";
        break;
    }
  }, 1000); // Change the light every 1 second (for demonstration purposes)
}

trafficLight(); // Initialize the traffic light cycle
```

### Explanation:

1. **HTML**:
   - We created three `div` elements inside a container `div` to represent the red, yellow, and green lights.
   - Each light has a class corresponding to its color.

2. **CSS**:
   - We styled each light to be a circle with a width and height of `50px`.
   - The `opacity` property is used to turn the lights on and off, and a transition is added for smooth changes.

3. **JavaScript**:
   - The `trafficLight` function toggles between the different light states (red, green, yellow) using a `setInterval` function.
   - Initially, the red light is turned on, and the `setInterval` function switches the lights every second.

4. **Switching Logic**:
   - Each time the interval runs, the light switches based on the current state. The classes `active` and `opacity` are toggled to turn the lights on and off.

### Example Output (Cycle):

1. **Red light** on for 4 seconds.
2. **Green light** on for 3 seconds.
3. **Yellow light** on for 0.5 seconds.
4. The cycle repeats indefinitely.

### Adjusting Timings:

In the current implementation, the `setInterval` is set to 1000ms (1 second) for demo purposes. You can change it like this to match the required durations:

```javascript
// Red light duration: 4000ms
// Yellow light duration: 500ms
// Green light duration: 3000ms

function trafficLight() {
  let redLight = document.getElementById("red");
  let yellowLight = document.getElementById("yellow");
  let greenLight = document.getElementById("green");

  // Initial state: Red light is on
  redLight.classList.add("active");

  let currentLight = "red";

  setInterval(() => {
    switch (currentLight) {
      case "red":
        redLight.classList.remove("active");
        greenLight.classList.add("active");
        currentLight = "green";
        break;
      case "green":
        greenLight.classList.remove("active");
        yellowLight.classList.add("active");
        currentLight = "yellow";
        break;
      case "yellow":
        yellowLight.classList.remove("active");
        redLight.classList.add("active");
        currentLight = "red";
        break;
    }
  }, 4000); // Change the light after the red duration (4000ms for this example)
}

trafficLight();
```

This example would work for any of the time settings you need.

It seems like you're asking for a traffic light system where each light (Red, Yellow, Green) is represented by a series of binary values. This approach uses `1` to indicate that a light is on and `0` to indicate that it is off. You might want to visualize the traffic light's state in a way that shows the status of the lights using the binary representation.

Here’s how to implement a traffic light using `1` and `0` to represent the state of each light:

### Traffic Light States Using 1s and 0s

We will map each traffic light state as follows:

- **Red Light (1 0 0)**: Red light is on, others are off.
- **Yellow Light (0 1 0)**: Yellow light is on, others are off.
- **Green Light (0 0 1)**: Green light is on, others are off.

We will simulate this behavior in JavaScript, where we display the state of the traffic light in binary format (`1` for on and `0` for off). Here's how you can implement it:

### HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Traffic Light Simulation</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="traffic-light">
      <div id="light" class="light"></div>
      <div id="status" class="status">Current State: 1 0 0</div>
    </div>

    <script src="script.js"></script>
  </body>
</html>
```

### CSS

```css
/* styles.css */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  margin: 0;
  font-family: Arial, sans-serif;
}

.traffic-light {
  text-align: center;
}

.light {
  width: 100px;
  height: 100px;
  margin: 10px auto;
  border-radius: 50%;
  background-color: #ccc;
}

.status {
  font-size: 20px;
  margin-top: 10px;
}
```

### JavaScript

```javascript
// script.js

let lightElement = document.getElementById("light");
let statusElement = document.getElementById("status");

// Function to change the light color and status in binary
function updateTrafficLight(state) {
  switch (state) {
    case "red":
      lightElement.style.backgroundColor = "red";
      statusElement.textContent = "Current State: 1 0 0";
      break;
    case "yellow":
      lightElement.style.backgroundColor = "yellow";
      statusElement.textContent = "Current State: 0 1 0";
      break;
    case "green":
      lightElement.style.backgroundColor = "green";
      statusElement.textContent = "Current State: 0 0 1";
      break;
  }
}

// Function to simulate the traffic light cycle
function trafficLightCycle() {
  setInterval(() => {
    updateTrafficLight("red");
    setTimeout(() => {
      updateTrafficLight("green");
    }, 4000); // Red for 4000ms (4 seconds)

    setTimeout(() => {
      updateTrafficLight("yellow");
    }, 7000); // Green for 3000ms (3 seconds), Yellow for 500ms (0.5 seconds)
  }, 7500); // Full cycle duration (Red + Green + Yellow)
}

// Start the traffic light cycle
trafficLightCycle();
```

### Explanation:

1. **HTML**:
   - We have a `div` with the id `light` that represents the traffic light and changes color (Red, Yellow, Green).
   - The `status` element will display the binary state (`1 0 0`, `0 1 0`, or `0 0 1`).

2. **CSS**:
   - We style the `light` element to make it circular and give it default color (`#ccc`), and adjust the background color dynamically with JavaScript.
   - The `status` element displays the current binary state of the traffic light.

3. **JavaScript**:
   - We define a function `updateTrafficLight(state)` to update both the background color and the binary status of the traffic light based on the input `state`.
   - The `trafficLightCycle()` function handles the timing of the light changes. It uses `setInterval` to repeatedly cycle through the lights, and `setTimeout` to handle the timing of each light.
   - The cycle is as follows:
     - **Red** for 4000ms (`1 0 0`).
     - **Green** for 3000ms (`0 0 1`).
     - **Yellow** for 500ms (`0 1 0`).
     - The cycle then repeats indefinitely.

### Result:

The traffic light will follow a cycle like this:

1. **Red Light (1 0 0)** is on for 4000ms (4 seconds).
2. **Green Light (0 0 1)** is on for 3000ms (3 seconds).
3. **Yellow Light (0 1 0)** is on for 500ms (0.5 seconds).

Each light will be displayed for the respective time duration, and the state will be shown in the binary format (`1 0 0`, `0 0 1`, `0 1 0`).
