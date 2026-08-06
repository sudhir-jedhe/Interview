// Find the largest rectangular area possible in a given histogram where the largest rectangle can be made of a number of contiguous bars whose heights are given in an array. For simplicity, assume that all bars have the same width and the width is 1 unit.
//: histogram = {6, 2, 5, 4, 5, 1, 6}

Output: 12



Input: histogram = {3, 5, 1, 7, 5, 9}
Output: 15




// JavaScript program to find maximum 
// rectangular area in linear time 

function max_area_histogram(histogram){ 
	
	// This function calculates maximum 
	// rectangular area under given 
	// histogram with n bars 

	// Create an empty stack. The stack 
	// holds indexes of histogram[] list. 
	// The bars stored in the stack are 
	// always in increasing order of 
	// their heights. 
	let stack = [] 

	let max_area = 0 // Initialize max area 

	// Run through all bars of 
	// given histogram 
	let index = 0 
	while(index < histogram.length){ 
		
		// If this bar is higher 
		// than the bar on top 
		// stack, push it to stack 

		if(stack.length == 0 || histogram[stack[stack.length-1]] <= histogram[index]){ 
			stack.push(index) 
			index += 1 
		} 

		// If this bar is lower than top of stack, 
		// then calculate area of rectangle with 
		// stack top as the smallest (or minimum 
		// height) bar.'i' is 'right index' for 
		// the top and element before top in stack 
		// is 'left index' 
		else{ 
			// pop the top 
			let top_of_stack = stack.pop() 

			// Calculate the area with 
			// histogram[top_of_stack] stack 
			// as smallest bar 
			let area = (histogram[top_of_stack] * 
				(stack.length > 0 ? (index - stack[stack.length-1] - 1) : index)) 

			// update max area, if needed 
			max_area = Math.max(max_area, area) 
		} 
	} 
	// Now pop the remaining bars from 
	// stack and calculate area with 
	// every popped bar as the smallest bar 
	while(stack.length > 0){ 
		
		// pop the top 
		let top_of_stack = stack.pop() 

		// Calculate the area with 
		// histogram[top_of_stack] 
		// stack as smallest bar 
		let area = (histogram[top_of_stack] * 
			(stack.length > 0 ? (index - stack[stack.length-1] - 1) : index)) 

		// update max area, if needed 
		max_area = Math.max(max_area, area) 
	} 

	// Return maximum area under 
	// the given histogram 
	return max_area 
} 

// Driver Code 
let hist = [6, 2, 5, 4, 5, 1, 6] 
document.write("Maximum area is", max_area_histogram(hist)) 

// This code is contributed 
// by shinjanpatra 

/************************************************************ */


//Function to find largest rectangular area possible in a given histogram. 
function getMaxArea(arr, n) 
{ 
	// Your code here 
	//we create an empty stack here. 
	let s = []; 
	//we push -1 to the stack because for some elements there will be no previous 
	//smaller element in the array and we can store -1 as the index for previous smaller. 
	s.push(-1); 
	let area = arr[0]; 
	let i = 0; 
	//We declare left_smaller and right_smaller array of size n and initialize them with -1 and n as their default value. 
	//left_smaller[i] will store the index of previous smaller element for ith element of the array. 
	//right_smaller[i] will store the index of next smaller element for ith element of the array. 
	let left_smaller = new Array(n).fill(-1), right_smaller = new Array(n).fill(n); 
	while(i<n){ 
		while(s.length > 0 &&s[s.length-1]!=-1&&arr[s[s.length-1]]>arr[i]){ 
			//if the current element is smaller than element with index stored on the 
			//top of stack then, we pop the top element and store the current element index 
			//as the right_smaller for the popped element. 
			right_smaller[s[s.length-1]] = i; 
			s.pop(); 
		} 
		if(i>0&&arr[i]==arr[i-1]){ 
			//we use this condition to avoid the unnecessary loop to find the left_smaller. 
			//since the previous element is same as current element, the left_smaller will always be the same for both. 
			left_smaller[i] = left_smaller[i-1]; 
		}else{ 
			//Element with the index stored on the top of the stack is always smaller than the current element. 
			//Therefore the left_smaller[i] will always be s[s.length-1]. 
			left_smaller[i] = s[s.length-1]; 
		} 
		s.push(i); 
		i++; 
	} 
	for(let j = 0; j<n; j++){ 
		//here we find area with every element as the smallest element in their range and compare it with the previous area. 
		// in this way we get our max Area form this. 
		area = Math.max(area, arr[j]*(right_smaller[j]-left_smaller[j]-1)); 
	} 
	return area; 
} 

// driver code 

let hist = [6, 2, 5, 4, 5, 1, 6]; 
let n = hist.length; 
document.write("maxArea = " + getMaxArea(hist, n)); 


/********************************************* */

buildHistogram

const HistogramBuilder = {
	// Function to count occurrences of each item in the list
	buildObjectBySeenCount: function(list) {
	  const result = {};
	  // Iterate over each item in the list
	  list.forEach(item => {
		// If the item hasn't been encountered before, initialize its count to 0
		// Then increment the count for this item
		result[item] = (result[item] || 0) + 1;
	  });
	  // Return the object containing counts of each item
	  return result;
	},
  
	// Function to build and display the histogram based on the list provided
	buildHistogram: function(list) {
	  // Generate an object with counts of each unique item in the list
	  const data = this.buildObjectBySeenCount(list);
	  // Select the DOM elements for the histogram's axes and content
	  const leftAxis = document.querySelector('.left-axis');
	  const bottomAxis = document.querySelector('.bottom-axis');
	  const contentAxis = document.querySelector('.content');
	  const leftAxisValues = []; // To keep track of unique frequency values
  
	  // Populate the left axis with frequency values
	  for (const key in data) {
		const val = data[key];
		// If this frequency value hasn't been added to the left axis yet, add it
		if (!leftAxisValues.includes(val)) {
		  leftAxisValues.push(val);
		  const keyElement = document.createElement('div');
		  keyElement.textContent = val; // Set the text to the frequency value
		  leftAxis.appendChild(keyElement); // Append this element to the left axis
		}
	  }
  
	  // Generate bars in the histogram for each unique item
	  for (const key in data) {
		const val = data[key];
		const keyElement = document.createElement('div');
		keyElement.textContent = key; // Label for the bar, representing the item
		const valElement = document.createElement('div');
		// Set the height of the bar proportional to its frequency relative to the highest frequency
		valElement.style.height = ((val / Math.max(...leftAxisValues)) * 100) + '%';
  
		bottomAxis.appendChild(keyElement); // Append the label to the bottom axis
		contentAxis.appendChild(valElement); // Append the bar to the histogram content area
	  }
	}
  };