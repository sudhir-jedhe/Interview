```js
function deleteObjects() {
	// Declaring an associative
	// array of objects
	let arr = new Object();

	// Adding objects in array
	arr['key'] = 'Value';
	arr['geeks'] = 'GeeksforGeeks';
	arr['name'] = 'Rajnish';

	// Checking object exist or not
	console.log(arr['name']);

	// Removing object from
	// associative array
	delete arr['name'];

	// It gives result as undefined
	// as object is deleted
	console.log(arr['name']);
}

// Calling function
deleteObjects();

/***************************************************** */


function deleteObjects() {
	// Declaring an associative
	// array of objects
	let arr = new Object();

	// Adding objects in array
	arr['key'] = 'Value';
	arr['geeks'] = 'GeeksforGeeks';
	arr['name'] = 'Rajnish';

	// Checking object exist or not
	console.log(arr['geeks']);

	// Removing object from
	// associative array
	delete arr.geeks;

	// It gives result as undefined
	// as object is deleted
	console.log(arr['geeks']);
}

// Calling function
deleteObjects();

/************************************ */
function deleteObjects() {
	// Declaring an associative
	// array of objects
	let arr = new Object();

	// Adding objects in array
	arr['key'] = 'Value';
	arr['geeks'] = 'GeeksforGeeks';
	arr['name'] = 'JavaScript';

	// Checking object exist or not
	console.log(arr['name']);

	// Removing object from
	// associative array
	const updatedArray = Object.fromEntries(
	Object.entries(arr).filter(([key]) => key !== 'name')
	);

	// It gives result as undefined
	// as object is deleted
	return updatedArray;
}

// Calling function
console.log(deleteObjects());


/****************************** */
function deleteObjects() {
    const _ = require("lodash"); 
    
        // Declaring an associative
        // array of objects
        let arr = new Object();
    
        // Adding objects in array
        arr['key'] = 'Value';
        arr['geeks'] = 'GeeksforGeeks';
        arr['name'] = 'JavaScript';
    
        // Checking object exist or not
        console.log(arr['key']);
    
        // Removing object from
        // associative array
        const updatedArray = _.omit(arr, 'key');
    
        // It gives result as undefined
        // as object is deleted
        return updatedArray;
    }
    
    // Calling function
    console.log(deleteObjects());
    