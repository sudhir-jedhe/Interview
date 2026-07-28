```js
const arr = ['Geeks', 'GFG', 'Geek', 'GeeksForGeeks'];
function GFG_Fun() {
	const remove = [0, 2];

	for (let i = remove.length - 1; i >= 0; i--)
		arr.splice(remove[i], 1);

	console.log(arr);
}

GFG_Fun();

/*********************************** */

let arr = ['Geeks', 'GFG', 'Geek', 'GeeksForGeeks'];

function GFG_Fun() {
	const indexes = [0, 1];

	arr = arr.filter((value, index) => !indexes.includes(index));

	console.log(arr);
}
GFG_Fun();


/************************************************* */

let arr = ['Geeks', 'GFG', 'Geek', 'GeeksForGeeks'];

function GFG_Fun() {
	const indexes = [0, 1];

	arr = arr.reduce((acc, value, index) => {
		if (!indexes.includes(index)) {
			acc.push(value);
		}
		return acc;
	}, []);

	console.log(arr);
}
GFG_Fun();


