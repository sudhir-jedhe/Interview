```js
import fs from "node:fs";
import path from "node:path";

// Change this to the target directory path
const TARGET_FOLDER = ".";
const PREFIX_TEXT = "```js\n";

function prependToFiles(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      // Process only files (skip subdirectories)
      if (stats.isFile()) {
        const originalContent = fs.readFileSync(filePath, "utf8");

        // Check if file already starts with ```js to prevent duplicate prepending
        if (!originalContent.startsWith("```js")) {
          const updatedContent = PREFIX_TEXT + originalContent;
          fs.writeFileSync(filePath, updatedContent, "utf8");
          console.log(`Updated: ${file}`);
        } else {
          console.log(`Skipped (already updated): ${file}`);
        }
      }
    });

    console.log("\nAll files processed successfully.");
  } catch (error) {
    console.error("Error processing files:", error.message);
  }
}

// Execute the function
prependToFiles(TARGET_FOLDER);
