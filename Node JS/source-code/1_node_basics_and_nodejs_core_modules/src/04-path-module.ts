// build and read file paths

import path from "node:path";

// const filePath = projectRoot + "/uploads" + filename

// path.join : uses the correct separator for the current os
// /users/sangam/project/file.txt

// c:\users\sangam\project\file.txt

// process.cwd: the folder from where the node js process was started

const projectRoot = process.cwd();

console.log(projectRoot);

// /uploads/users/42/profile.photo.png

const userId = "42";
const originalName = "profile.photo.png";

// imp -> path.join -> creates a path string
// it will not create the folder
// it does not check whether the file exists or not
const uploadFilePath = path.join(
  projectRoot,
  "uploads",
  "users",
  userId,
  originalName,
);

console.log(uploadFilePath);

// final part of a path
const fileName = path.basename(uploadFilePath);
const fileExt = path.extname(uploadFilePath);
const parentFolder = path.dirname(uploadFilePath);

console.log(parentFolder);
