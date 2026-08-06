```js
// Input : K = 7
// Output :
// 1234567 1234568 1234569 1234578 1234579
// 1234589 1234678 1234679 1234689 1234789
// 1235678 1235679 1235689 1235789 1236789
// 1245678 1245679 1245689 1245789 1246789
// 1256789 1345678 1345679 1345689 1345789
// 1346789 1356789 1456789 2345678 2345679
// 2345689 2345789 2346789 2356789 2456789
// 3456789

// Input  : K = 3
// Output :
// 123 124 125 126 127 128 129 134 135 136
// 137 138 139 145 146 147 148 149 156 157
// 158 159 167 168 169 178 179 189 234 235
// 236 237 238 239 245 246 247 248 249 256
// 257 258 259 267 268 269 278 279 289 345
// 346 347 348 349 356 357 358 359 367 368
// 369 378 379 389 456 457 458 459 467 468
// 469 478 479 489 567 568 569 578 579 589
// 678 679 689 789

// Javascript program to generate well
// ordered numbers with k digits.

// number --> Current value of number.
// x --> Current digit to be considered
// k --> Remaining number of digits
function printWellOrdered(number, x, k) {
  if (k == 0) {
    document.write(number + " ");
    return;
  }

  // Try all possible greater digits
  for (let i = x + 1; i < 10; i++) printWellOrdered(number * 10 + i, i, k - 1);
}

// Generates all well ordered
// numbers of length k.
function generateWellOrdered(k) {
  printWellOrdered(0, 0, k);
}

// Driver Code
let k = 3;
generateWellOrdered(k);

// This code is contributed by rag2127
