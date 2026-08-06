The code you provided outlines some of the basic operations you can perform using the `classList` property in JavaScript to manipulate CSS classes of HTML elements.

Here's a quick summary of each part of the code:

### 1. **Checking if an element has a specific class** (`contains`)
The `contains()` method checks if an element has a specific class:

```javascript
const hasClass = (el, className) => el.classList.contains(className);

// Example usage
hasClass(document.querySelector('p.special'), 'special'); // true
```
- **Explanation**: This checks whether the `p` element with the class `special` contains the class `special`. If it does, the result will be `true`, otherwise `false`.

### 2. **Adding a class to an element** (`add`)
You can use the `add()` method to add one or more classes to an element:

```javascript
const addClass = (el, className) => el.classList.add(className);

// Example usage
addClass(document.querySelector('p'), 'special');
// This will add the 'special' class to the first <p> element in the document
```
- **Explanation**: The class `special` is added to the first `<p>` element in the document.

### 3. **Removing a class from an element** (`remove`)
The `remove()` method removes one or more classes from an element:

```javascript
const removeClass = (el, className) => el.classList.remove(className);

// Example usage
removeClass(document.querySelector('p.special'), 'special');
// The 'special' class will be removed from the first <p> element that has it
```
- **Explanation**: The `removeClass()` function removes the class `special` from the first `<p>` element that contains it.

### 4. **Toggling a class** (`toggle`)
The `toggle()` method is useful for switching a class on or off based on whether the element already has that class:

```javascript
const toggleClass = (el, className) => el.classList.toggle(className);

// Example usage
toggleClass(document.querySelector('p.special'), 'special');
// If the <p> element has the class 'special', it will be removed, 
// if it doesn't have it, the class will be added
```
- **Explanation**: The `toggleClass()` function will either add or remove the `special` class based on its current state.

### Example HTML:

To demonstrate how these functions work, you can use the following HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Class Manipulation</title>
</head>
<body>

  <p class="special">This is a special paragraph.</p>
  <p>This is a normal paragraph.</p>

  <script src="script.js"></script>
</body>
</html>
```

### Summary of Methods:
- **`classList.contains()`**: Checks if the element has the specified class.
- **`classList.add()`**: Adds the specified class to the element.
- **`classList.remove()`**: Removes the specified class from the element.
- **`classList.toggle()`**: Adds the class if it doesn't exist, or removes it if it does.

These operations are very helpful when working with dynamic styling, such as changing themes or applying animations in response to user actions.