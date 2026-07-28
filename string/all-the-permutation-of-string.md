```js
let permute = (str, left = 0, right = str.length - 1) => {
  //If left index is equal to right index
  //Print the string permutation
  if (left == right) {
    console.log(str);
  } else {
    for (let i = left; i <= right; i++) {
      //Swap the letters of the string
      str = swap(str, left, i);
      //Generate the permutation with swapped letters
      permute(str, left + 1, right);
      //Restore the letters back to their position
      str = swap(str, left, i);
    }
  }
};

//Function to swap the letters of the string
let swap = (str, left, right) => {
  let arr = str.split("");
  [arr[left], arr[right]] = [arr[right], arr[left]];
  return arr.join("");
};

Input: permute("AB");
permute("ABC");

Output: "AB";
("BA");

("ABC");
("ACB");
("BAC");
("BCA");
("CBA");
("CAB");
```
