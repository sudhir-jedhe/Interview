```js
function GFG_click(s) {
  return s.substring(0, s.indexOf("?"));
  // s.split('?')[0]
}

var s = "/path/action?id=11612&value=44944";
GFG_click(s);

/************************************** */
