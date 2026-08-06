const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const app = express();
const PORT = 3000;

// Serve static files (like images, css, etc.)
app.use(express.static('public'));

// Helper function to get directory structure recursively
function getFilesInDirectory(directory) {
    const files = fs.readdirSync(directory);
    let result = [];
    files.forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            result.push({
                name: file,
                type: 'folder',
                files: getFilesInDirectory(filePath)
            });
        } else if (file.endsWith('.md')) {
            result.push({
                name: file,
                type: 'file',
                path: filePath
            });
        }
    });
    return result;
}

// Endpoint to get folder structure
app.get('/files', (req, res) => {
    const rootDir = path.join(__dirname, 'content');  // Assuming markdown files are in the 'content' folder
    console.log('Checking if directory exists:', rootDir); // Debugging log
    if (!fs.existsSync(rootDir)) {
        return res.status(404).send('Content folder not found');
    }

    try {
        const files = getFilesInDirectory(rootDir);
        res.json(files);
    } catch (err) {
        console.error('Error reading directory:', err);
        res.status(500).send('Error reading directory');
    }
});

// Endpoint to serve markdown file content
app.get('/file/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'content', req.params.filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.send(marked(fileContent));
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
