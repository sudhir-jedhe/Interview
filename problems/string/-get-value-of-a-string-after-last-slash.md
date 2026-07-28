```js
let str = "folder_1/folder_2/file.html";

function GFG_FUN() {
  str = str.split("/");

  console.log(str[str.length - 1]);
}

GFG_FUN();

/********************************** */

let str = "folder_1/folder_2/file.html";

function GFG_FUN() {
  console.log(str.substring(str.lastIndexOf("/") + 1));
}

GFG_FUN();

/*********************************** */
let str = "folder_1/folder_2/file.html";

function GFG_FUN() {
  str = str.split("/").pop();
  console.log(str);
}

GFG_FUN();
