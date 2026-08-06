To achieve the desired functionality as described in your prompt, the `FileSystem` class needs to handle the operations related to directories, files, and paths efficiently. You've provided most of the logic correctly, but there are some improvements to be made. Specifically:

1. **Handling `createDirectory` correctly**: The `createDirectory` method should handle directory creation inside the current directory, which is already being done well in your code.
2. **Changing directories (`changeDirectory`)**: The path format is separated by a hyphen (`-`), which is being handled by splitting the path string in the `_changeDirectoryHelper` method.
3. **Adding files**: We need to make sure files are added to the current directory as a `files` property (if it doesn't already exist).
4. **Deleting files and directories**: We need to ensure files and directories are properly deleted from the current path.
5. **Root directory access**: The `getRootDirectory` method should return the entire structure, starting from the root directory.

### Improved Solution:

```javascript
const FileSystem = function() {
  // Initialize the root directory structure and set the current directory to root
  this.directory = { "root": {} };
  this.currentDir = this.directory["root"];
  this.currentDirPath = "root";
  
  // Create a new directory in the current directory
  this.createDirectory = function(name) {
    this.currentDir[name] = {};
  };
  
  // Change the current directory to the given path
  this.changeDirectory = function(path) {
    this.currentDir = this._changeDirectoryHelper(path);
    this.currentDirPath = path;
  };
  
  // Helper function to traverse the directory path
  this._changeDirectoryHelper = function(path) {
    const paths = path.split("-");
    let current = this.directory;
    for (let key of paths) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        throw new Error("Invalid directory path.");
      }
    }
    return current;
  };
  
  // Get the current directory path
  this.getCurDirectoryPath = function() {
    return this.currentDirPath;
  };
  
  // Get the contents (files and directories) of the current directory
  this.getCurDirectory = function() {
    return this.currentDir;
  };
  
  // Add a file to the current directory
  this.addFile = function(fileName) {
    if (!this.currentDir.files) {
      this.currentDir.files = [];
    }
    this.currentDir.files.push(fileName);
  };
  
  // Delete a file from the current directory
  this.deleteFile = function(fileName) {
    if (this.currentDir.files) {
      this.currentDir.files = this.currentDir.files.filter(file => file !== fileName);
    }
  };
  
  // Delete a directory from the current directory
  this.deleteDirectory = function(name) {
    delete this.currentDir[name];
  };
  
  // Return the entire root directory structure
  this.getRootDirectory = function() {
    return this.directory;
  };
};

// Input code execution
const dir = new FileSystem();

// Creating 'prashant' directory inside 'root'
dir.createDirectory('prashant');
dir.changeDirectory('root-prashant');
dir.addFile('index.html');
dir.addFile('app.js');

// Changing back to root and creating 'practice' directory
dir.changeDirectory('root');
dir.createDirectory('practice');
dir.changeDirectory('root-practice');
dir.addFile('index.html');
dir.addFile('app.js');

// Creating 'build' directory inside 'practice' and adding files
dir.createDirectory('build');
dir.changeDirectory('root-practice-build');
dir.addFile('a.png');
dir.addFile('b.jpg');

// Deleting file 'a.png'
dir.deleteFile('a.png');

// Going back to 'root' and deleting 'prashant' directory
dir.changeDirectory('root');
dir.deleteDirectory('prashant');

// Output the root directory structure
console.log(JSON.stringify(dir.getRootDirectory(), null, 2));
```

### Explanation:

1. **createDirectory(name)**:
   - Creates a new directory with the given `name` inside the current directory.
   - If the directory already exists, it will simply be overwritten by the new directory.

2. **changeDirectory(path)**:
   - Changes the current directory based on the given `path`. This path is split using `-`, and the function recursively moves through the directories.
   - If the path is invalid (i.e., a directory does not exist), an error is thrown.

3. **addFile(fileName)**:
   - Adds a file to the `files` array in the current directory. If `files` does not exist yet in the current directory, it is created.

4. **deleteFile(fileName)**:
   - Removes the specified file from the `files` array in the current directory.

5. **deleteDirectory(name)**:
   - Deletes a directory from the current directory.

6. **getRootDirectory()**:
   - Returns the entire directory structure starting from the root.

### Output:

```json
{
  "root": {
    "practice": {
      "files": [
        "index.html",
        "app.js"
      ],
      "build": {
        "files": [
          "b.jpg"
        ]
      }
    }
  }
}
```

### Explanation of Output:
1. The root directory contains the `practice` directory.
2. Inside the `practice` directory, there is a `files` array containing `index.html` and `app.js`.
3. The `build` directory inside `practice` contains a `files` array with `b.jpg`, but `a.png` was deleted.
4. The `prashant` directory is removed as per the operations, so it does not appear in the final output.