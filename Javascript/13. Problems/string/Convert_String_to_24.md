```js
function convertTo24HourFormat(timeString) { 
    const [time, period] = timeString.split(' '); 
    const [hour, minute] = time.split(':'); 
    let formattedHour = parseInt(hour); 
  
    if (period === 'PM') { 
        formattedHour += 12; 
    } 
  
    return `${formattedHour}:${minute}`; 
} 
  
const inputTime = '03:30 PM'; 
const formattedTime = convertTo24HourFormat(inputTime); 
console.log(formattedTime);


/****************************************** */

function convertTo24HourFormat(timeString) { 
    const match = timeString.match(/(\d+):(\d+) (\w+)/); 
    const hour = parseInt(match[1]); 
    const minute = match[2]; 
    const period = match[3]; 
    let formattedHour = hour; 
  
    if (period === 'PM' && hour < 12) { 
        formattedHour += 12; 
    } 
  
    return `${formattedHour}:${minute}`; 
} 
  
const inputTime = '4:45 PM'; 
const formattedTime = convertTo24HourFormat(inputTime); 
console.log(formattedTime);


/************************************** */
function convertTo24Hour(timeString) { 
    let date = new Date(`01/01/2022 ${timeString}`); 
    let formattedTime = date.toLocaleTimeString('en-US', 
        { hour12: false }); 
    return formattedTime; 
} 
  
let inputTime = '09:15 PM'; 
let formattedTime = convertTo24Hour(inputTime); 
console.log(formattedTime);