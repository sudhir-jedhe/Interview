Implement a function that pauses for a specified duration before resuming execution
```js

function pause(milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }
  
  async function demoWithPause() {
    console.log('Starting...');
    await pause(2000); // Pause for 2 seconds
    console.log('Resuming...');
  }
  
  demoWithPause();