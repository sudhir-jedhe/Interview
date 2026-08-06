Let us first understand how the Array.sort() method works. It takes a callback function as input in which it passes the current string and the next string as parameters on which the comparison will take place.

The sorting is done on the return value of the comparison.

If a negative value is returned it will be sorted in descending order.
If a positive value is returned it will be sorted in ascending order.
If zero is returned it will do nothing and maintain the current order.
JavaScript provides localeCompare methods that we can use for sorting as

It returns either positive value 1 if the next string is less than the first string or it will return a negative value -1 if the next string is greater than the first string and will return zero 0 if they are the same.

It also takes an extra parameter that helps to compare the string with or without being case-insensitive.

Sort an array of strings in JavaScript ignoring the case
To sort the array of strings we will be using the localeCompare method in the callback function of the Array.sort() method.

Sort an array of strings in JavaScript in Ascending order
To sort the strings in ascending order, we will compare the current string with the next string.

```js
const strs = ["de", "ec", "ee", "be", "Ae", "BE", "ae"];
const sortedStrs = [...strs].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" }),
);
console.log(sortedStrs);
```

// ["Ae","ae","be","BE","de","ec","ee"]
Copy
To avoid in-place sorting or mutation of the original array, we have created a copy of the original array of strings by using spread operators.

The localeCompare() method takes locale as input, we have kept its value as undefined so that it can pick the default value from the browser setting.

The third parameter which is the sensitivity: 'base' will do the comparison ignoring the case, If the value of it is set as sensitivity: 'case', it will consider the case in sorting.

```js
const strs = ["de", "ec", "ee", "be", "Ae", "BE", "ae"];
const sortedStrs = [...strs].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "case" }),
);
console.log(sortedStrs);
// ["ae","Ae","be","BE","de","ec","ee"]
```

Copy
Notice that strings starting with lowercase alphabets are prioritized in the case-sensitive comparison.

Sort an array of strings in JavaScript in Descending order
To sort the array of strings in descending order, we will have to reverse the comparison, comparing the next string with the current string in the localeCompare() method.

```js
const strs = ["de", "ec", "ee", "be", "Ae", "BE", "ae"];
const sortedStrs = [...strs].sort((a, b) =>
  b.localeCompare(a, undefined, { sensitivity: "base" }),
);
console.log(sortedStrs);
//["ee","ec","de","be","BE","Ae","ae"]
```
