```js
const pad = (inp) => {
    return String(inp).length == 1 ? '0' + inp : inp;
  }

  const clock = () => {
      const time = new Date(),
      hours = time.getHours(),
      minutes = time.getMinutes(),
      seconds = time.getSeconds(),
      milliseconds = time.getMilliseconds();
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) + ':' + pad(milliseconds) ;
  }

  setInterval(function() {
     console.log(clock());
  }, 1);


  //10:59:23:235
  //10:59:24:236
  //10:59:25:237
  //10:59:26:238
  .
  .
  .


  const pad = (inp) => {
    return String(inp).length == 1 ? '0' + inp : inp;
  }

  const clock = () => {
      const time = new Date(),
      hours = time.getHours(),
      minutes = time.getMinutes(),
      seconds = time.getSeconds(),
      milliseconds = time.getMilliseconds();
    return pad(hours % 12) + ':' + pad(minutes) + ':' + pad(seconds) + ':' + pad(milliseconds) ;
  }

  setInterval(function() {
     console.log(clock());
  }, 1);

  //02:59:23:235
  //02:59:24:236
  //02:59:25:237
  //02:59:26:238
  .
  .
  .
```
