```js
// JavaScript code to pick
// a random color from array
function pickColor() {
  // Array containing colors
  var colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ff3333",
    "#ffff00",
    "#ff6600",
  ];

  // selecting random color
  var random_color = colors[Math.floor(Math.random() * colors.length)];

  var x = document.getElementById("pick");
  x.style.color = random_color;
}
