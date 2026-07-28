```js
function findElementsByStyle(property, value) {
    const allElements = document.querySelectorAll('*'); // Select all elements
    const matchingElements = [];

    allElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.getPropertyValue(property) === value) {
            matchingElements.push(element);
        }
    });

    return matchingElements;
}

// Example usage:
const redElements = findElementsByStyle('color', 'red');
console.log(redElements);
