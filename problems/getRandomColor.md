```js
export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

getRandomColor(); // Output: "#000000"
getRandomColor(); // Output: "#123422"
getRandomColor(); // Output: "#f132ff"
