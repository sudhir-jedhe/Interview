```js
document
  .getElementById("countButton")
  .addEventListener("click", async function () {
    const inputText = document.getElementById("inputText").value;
    const chunkSize = Math.ceil(inputText.length / 4); // Split text into 4 chunks

    const promises = [];
    for (let i = 0; i < inputText.length; i += chunkSize) {
      const chunk = inputText.substring(i, i + chunkSize);
      const worker = new Worker("worker.js");
      const promise = new Promise((resolve) => {
        worker.onmessage = function (event) {
          resolve(event.data);
          worker.terminate();
        };
      });
      worker.postMessage({ text: chunk });
      promises.push(promise);
    }

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Aggregate results
    const frequency = results.reduce((acc, cur) => {
      for (let char in cur) {
        acc[char] = (acc[char] || 0) + cur[char];
      }
      return acc;
    }, {});

    // Display the frequency count
    document.getElementById("result").innerText = JSON.stringify(
      frequency,
      null,
      2,
    );
  });
```
