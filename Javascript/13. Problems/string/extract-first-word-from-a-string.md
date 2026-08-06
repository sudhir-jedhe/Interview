```js
let str = "Geeks For Geeks"; 
let res = str.split(' ')[0]; 
console.log(res); 

/*********************** */

let str = "Geeks For Geeks"; 
let index = str.indexOf(' '); 
let res = 
	str.substring(0, index !== -1 ? 
		index : str.length); 
console.log(res); 


/********************** */
let str = "Geeks For Geeks"; 
let match = str.match(/^\S+/); 
let res = match ? match[0] : ''; 
console.log(res); 


/**************** */
let str = "Geeks For Geeks"; 
let index = str.indexOf(' '); 
let res = 
	index !== -1 ? 
		str.slice(0, index) : str; 
console.log(res); 
