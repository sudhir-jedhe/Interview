```js
let arr = [
    'geeks', 2, 'geeks', 2, 'Javascript', 4,
    'Javascript', 5, 'for', 6, 'Javascript', 1,
    'for', 5, 7, 8, 'for'
];
 
const counter = {};
 
arr.forEach(ele => {
    if (counter[ele]) {
        counter[ele] += 1;
    } else {
        counter[ele] = 1;
    }
});
 
console.log(counter)

/************************************* */

const arr = [
    'geeks', 2, 'geeks', 2, 'Javascript', 4,
    'Javascript', 5, 'for', 6, 'Javascript', 1,
    'for', 5, 7, 8, 'for'
];
 
let count = arr.reduce(function (value, value2) {
    return (
        value[value2] ? ++value[value2] :(value[value2] = 1),
        value
    );
}, {});
 
console.log(count);

/****************************************** */



const arr = [
    'geeks', 2, 'geeks', 2, 'Javascript', 4,
    'Javascript', 5, 'for', 6, 'Javascript', 1,
    'for', 5, 7, 8, 'for'
];
 
const itemCounter = (value, index) => {
    return value.filter((x) => x == index).length;
};
 
console.log(itemCounter(arr, 'geeks'))

/*************************** */
const arr = [
    'geeks', 2, 'geeks', 2, 'Javascript', 4,
    'Javascript', 5, 'for', 6, 'Javascript', 1,
    'for', 5, 7, 8, 'for'
];
 
const count = {};
 
for (let ele of arr) {
    if (count[ele]) {
        count[ele] += 1;
    } else {
        count[ele] = 1;
    }
}
 
console.log(count);