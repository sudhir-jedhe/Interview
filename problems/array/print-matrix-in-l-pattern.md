```js
Input:
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16
17 18 19 20

Output:
1
5
9
13
17
18
19
20
2
6
10
14
15
16
3
7
11
12
4
8

/* How it works
First
1 
5 
9 
13 
17 18 19 20

Second
2 
6 
10 
14 15 16

Third
3 
7 
11 12

Fourth
4
8
*/





let printMatrixInLShape = (arr, m = arr.length, n = arr[0].length) => {  
    //Initialize the current row and column to zero
    let row = 0;
    let col = 0;
  
    //Loop until m and n are greater than 0
    while(row < m && col < n){
    
    //print the cols
    for(let a = row; a < m; a++){
      console.log(arr[a][col]);
    }
    col++;  //increment the col
    
    //print the rows
    for(let a = col; a < n; a++){
       console.log(arr[m-1][a]);
    }
    m--;    //reduce the row
       
   }
  }         


  Input:
printMatrixInLShape([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]]);

Output:
1
5
9
13
17
18
19
20
2
6
10
14
15
16
3
7
11
12
4
8


/************************* */
