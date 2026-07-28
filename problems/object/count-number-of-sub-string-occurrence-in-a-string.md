```js
Input:
String:- 'aaa'
Sub-string:- 'aa'

Output:
//Overlapping (Will check at every next character)
2    
//'aa' found at first and second position and 'aa' also found at second and third position

//Non-Overlapping (Will check at an interval of sub-strings length)
1
//'aa' found at first and second position then it will check for 3 and 4 the position, as 4 the elements does not exit so it returns 1 count only.


//For case sensitive
var str = "Checking in regular expressions.";
var count = (str.match(/in/g) || []).length;  // /g checks whole string till end
console.log(count);

//For case - insensitive 
var str = "Checking IN regular expressions In case - iNsensitive.";
var count = (str.match(/in/gi) || []).length; // /gi check whole string and ignores case sensitivity
console.log(count);




function countSubStrings(string, subString) {
    //if string and sub-string is undefined then append it with blank strings as we are going to use string method.
    string += "";  
    subString += "";

    if (subString.length <= 0) return (string.length + 1);

    var count = 0, pos = 0, step = subString.length;

    while (true){
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++count;
            pos += step;
        } else{ 
           break;
        }
    }
    return count;
}



function countSubStrings(string, subString) {
    //if string and sub-string is undefined then append it with blank strings as we are going to use string method.
    string += "";  
    subString += "";

    if (subString.length <= 0) return (string.length + 1);

    var count = 0, pos = 0, step = 1;

    while (true){
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++count;
            pos += step;
        } else{ 
           break;
        }
    }
    return count;
}
