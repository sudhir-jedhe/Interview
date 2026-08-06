```js
let chessboard = (row, column) => {
  for (let i = 0; i < row; i++) {
    //If odd then start with ' '
    //Else start with '#'
    let start = i % 2 === 1 ? " " : "#";

    //Temp str to stor the pattern of the column
    let str = "";
    for (let j = 0; j < column; j++) {
      //Swap current pattern with another one in each iteration
      start = start == "#" ? "_" : "#";
      str += start;
    }

    //Print the pattern for the current row
    console.log(str);
  }
};



Input:
chessboard(3, 5);
chessboard(8, 8);

Output:
" # # "
"# # #"
" # # "

" # # # #"
"# # # # "
" # # # #"
"# # # # "
" # # # #"
"# # # # "
" # # # #"
"# # # # "