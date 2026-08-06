```js
/*
Input : arr[] = {1, 5, 5, 6, 6, 7}
Output :
Last index: 4
Last duplicate item: 6

Input : arr[] = {1, 2, 3, 4, 5}
Output : No duplicate found
*/

function dupLastIndex(arr, n) 
{
    // if array is null or size is less 
    // than equal to 0 return
    if (arr == null || n <= 0) 
        return;
       
    // compare elements and return last
    // duplicate and its index
    for (let i = n - 1; i > 0; i--) 
    {
        if (arr[i] == arr[i - 1]) 
        {
        document.write("Last index:" + i + "<br/>");
        document.write("Last duplicate item: "
                          + arr[i] + "<br/>");
        return;
        }
    }
       
    // If we reach here, then no duplicate
    // found.
    document.write("no duplicate found");
}

// Driver code

    let arr = [1, 5, 5, 6, 6, 7, 9];
    let n = arr.length;
    dupLastIndex(arr, n);

    /***************************************** */
    var arr = [1, 5, 5, 6, 6, 7];
 
    function dupLastIndex(arr) {
        var unique = arr.reduce((acc, iter,  i)=> 
                    arr.indexOf(iter)!= i ? i : acc, -1);
        return unique;
    }
 
    let temp =     dupLastIndex(arr);
    if( temp != -1){
        console.log('Last index: ',temp);
        console.log('Last duplicate item : ',arr[temp])
    }
    else{
        console.log('no duplicate found')
    }
    