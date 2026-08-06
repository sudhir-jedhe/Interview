The problem statement reads as:

Create an **Auto Suggestion Box** in Vanilla JS
Create a suggestion area bottom to the input box that shows the suggestion list
The list is visible when the input box is in focus or when user types, it hides when the input box is blurred
getSuggestions(text); method will act as mock server and will return random text based on the inputs with 0 – 200 millisceond latency and may fail
If a suggestion is clicked, populate the input box with its value and bring input box in focus
**They had also provided this mock-server code that mimics the network with a latency.**

```javascript
// Mock Server
const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  var pre = 'pre';
  var post = 'post';
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}
```

**getSuggestions(text)** will randomly throw an error (fail) or resolve with any array of strings, the list can also be empty, so I had to handle it effectively.

This is my implementation of how I solved this question.

Reading the problem statement, the first thing I did was create the HTML layout with a search input field where the values can be typed and then a suggestion area below that.


```javascript

<main>
  <input type="search" id="search" placeholder="Enter your query"/>
  <div id="suggestion-area"></div>
</main>

```


```javascript

main{
  width: 500px;
  margin: 10px auto 0 auto;
}

#search{
  padding: 10px;
  width: 100%;
}

#suggestion-area{
  border: 1px solid red;
  margin-top: 10px;
  min-height: 100px;
  padding: 5px;
  position: relative;
  display: none;
}

```

If you notice, by default, #suggestion-area is displayed as none and will be changed dynamically through the JavaScript, as we have to show this only when the input field is in focus.

The next thing is writing the script to handle all the logic. I have wrapped everything under the IIFE (immediately invoked function expression), as I wanted the variables and methods to be private and should not conflict with each other.


```javascript
(function(){
  ... rest of the code will go here
}());
```


```javascript


(function(){
  const input = document.getElementById("search");
  const suggestionArea = document.getElementById("suggestion-area");
  
  const onFocus = () => {
    suggestionArea.style.display = "block";
  }
  
  const onBlur = (e) => {
    if(e.target === input || e.target === suggestionArea){
      return;
    }
    
    suggestionArea.style.display = "none";
  }
  
  const onChange = (e) => {
    const {value} = e.target;
    processData(value);
  }
  
  const processData = async (value) => {
    suggestionArea.style.display = "block";
    suggestionArea.innerHTML = "";
    
    if(!value){
      return;
    }
    
    try{
      const resp = await getSuggestions(value);
      if(resp.length > 0){
        const list = document.createElement('ul');
        resp.forEach((e) => {
          const listItems = document.createElement('li');
          listItems.style.cursor = "pointer";
          listItems.innerText = e;
          list.appendChild(listItems);
        });
        
        suggestionArea.innerHTML = "";
        suggestionArea.appendChild(list);
      }
    }catch(e){
      console.error("Error while making network call", e);
    }
  } 
  
  const onClick = (e) => {
    if(e.target === suggestionArea){
      return;
    }
    
    const text = e.target.innerText;
    input.value = text;
    input.focus();
  }
  
  input.addEventListener('focus', onFocus);
  window.addEventListener('click', onBlur);
  input.addEventListener('keyup', onChange);
  suggestionArea.addEventListener('click', onClick, true);
}());
```


/******************************/

const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  let pre = 'pre';
  let post = 'post';
  let results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}


getSuggestions("text").then((val) => {console.log(val)});
// Array(3) [ "pretext", "textpost", "pretextpost" ]