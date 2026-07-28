```js
Given a matrix if there is any value which is zero then set all the values in that column and row as zeroes.

Input:
[
  [1,1,1],
  [1,0,1],
  [1,1,1]
]

Output:
[
  [1,0,1],
  [0,0,0],
  [1,0,1]
]


Using HashSet to set matrix zeroes.
We are going to use two different sets to for the columns and the rows which contain zeroes in the matrix.
Then iterate the matrix and check if the current element is zero or not, if it is then store its row and column value in the set.
Then get all the rows and columns from the set and update all the values of them to zero in matrix.

const setZeroes = (matrix) => {
    const zeroRow = new Set();
    const zeroCol = new Set();
    
    //Iterate matrix
    for(let i = 0; i < matrix.length; i++) {
        
        for(let j = 0; j < matrix[0].length; j++) {
            //if zero found then store its row and column
            if(matrix[i][j] === 0) {
                zeroRow.add(i);
                zeroCol.add(j);
            }
        }
    }
    
    //Update all the values of rows to 0
    for(let r of zeroRow) {
        for(let j = 0; j < matrix[0].length; j++) {
            matrix[r][j] = 0;
        }
    }
    
    //Update all the values of columns to 0
    for(let c of zeroCol) {
        for(let i = 0; i < matrix.length; i++) {
            matrix[i][c] = 0;
        }
    }
};


/************************** */

const setZeroes = function(matrix) {
    let col0 = 1, row = matrix.length, col = matrix[0].length;
    
    for(let i = 0; i < row; i++) {
        if(matrix[i][0] === 0) col0 = 0;
        for(let j = 1; j < col; j++) {
            if(matrix[i][j] === 0) {
                matrix[i][0] =  matrix[0][j] = 0;
            }
        }
    }
    
    for(let i = row-1; i >= 0; i--) {
        for(let j = col-1; j > 0; j--) {
            if(matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
        }
        if(col0 === 0) matrix[i][0] = 0;
    }
};