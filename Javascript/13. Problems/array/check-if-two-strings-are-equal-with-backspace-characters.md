```js
Given two strings S and N in a text editor, check if they are equal. Each string contains # which represents backspace characters.

All the characters before backspace character will be deleted.

Example
Input:
"ab#c"
"ad#c"

Output:
trueCopy
Both first and second strings becomes ac and thus equal after characters before backspace # are removed.

As the backspace removes the character before it.

Iterate the string in the reverse order that is from the end.
If backspace character # is encountered then keep its count.
Remove all the characters till the count of backspace characters.
As there can be multiple backspaces and/or they can be present in any order. We just have to count them and remove the count of character before them.

Function to remove the characters from the string.


const getString = (S) => {
    //Split the string into array of characters
    let sArr = S.split('');

    let del = 0;

    for(let i = sArr.length - 1; i >= 0; i--){
        //If backspace increase the count and mark the current as empty
        if(sArr[i] === '#'){
          sArr[i] = '';
          del++;
        }else{
          //Remove the characters by marking them empty
          if(del){
             sArr[i] = '';
             del--;
          }
        }
    }

    //Join to form the string again.
    return sArr.join('');
}

const backspaceCompare = (S, N) => { 
    return getString(S) === getString(N);
};

Input:
console.log(backspaceCompare('ab##', 'c#d#'));
console.log(backspaceCompare('a##c', '#a#c'));
console.log(backspaceCompare('a#c', 'b'));

Output:
true
true
false