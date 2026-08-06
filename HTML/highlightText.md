The code you've written seems to be aimed at implementing a search functionality where, when a user enters a search term and clicks the "Search" button, any matching text in the content is highlighted using `<mark>` tags.

There is a small potential issue with your approach: you're using `.textContent` to extract the text from the `contentElement`, which will not include any HTML tags. If the content has already been highlighted with `<mark>` tags, `.textContent` will return plain text, and the highlighting won't be preserved.

Instead, you should use `.innerHTML` to get the HTML content, and also to inject the updated content with `<mark>` tags.

Let's go through your code with the necessary adjustments:

### Adjusted Code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Highlight Text</title>
  </head>
  <body>
    <div id="content">Some text content with a search word in it.</div>
    <input type="text" id="searchInput" />
    <button id="searchButton">Search</button>

    <script>
      // Function to highlight the search term in the text
      function highlightText(text, searchTerm) {
        // Handle case-insensitive search using regular expression
        const regex = new RegExp(searchTerm, "gi");
        return text.replace(regex, (match) => `<mark>${match}</mark>`);
      }

      // Get elements
      const contentElement = document.getElementById("content");
      const searchInput = document.getElementById("searchInput");
      const searchButton = document.getElementById("searchButton");

      // Event listener for the search button click
      searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim(); // Get the search term
        if (searchTerm) {
          // Get the current HTML content, not just the text
          const currentContent = contentElement.innerHTML;

          // Highlight the search term in the content
          const newContent = highlightText(currentContent, searchTerm);

          // Update the content with highlighted search term
          contentElement.innerHTML = newContent;
        }
      });
    </script>
  </body>
</html>
```

### Explanation:

1. **Highlight Function (`highlightText`)**:
   - This function uses a regular expression (`RegExp`) to find all occurrences of `searchTerm` in the `text` provided.
   - It wraps the matched text inside `<mark>` tags, which are commonly used to highlight text in HTML.

2. **Event Listener on Search Button**:
   - The event listener is triggered when the "Search" button is clicked.
   - It grabs the search term entered by the user (`searchInput.value`), then uses `.innerHTML` to get the HTML content of the `contentElement`, ensuring any previously highlighted text (from earlier searches) is preserved.
   - The `highlightText` function is called to wrap all occurrences of the search term in `<mark>` tags, and the content of the `contentElement` is updated with the new HTML.

### Example Use:

1. The page initially has the content: `Some text content with a search word in it.`
2. If you type `search` in the input field and click "Search", the word "search" will be highlighted.
3. If you type another term like `text`, it will highlight that term, even while keeping the previous highlights intact.

### Key Changes:

- **.innerHTML**: Used instead of `.textContent` to preserve HTML formatting, including `<mark>` tags.
- **Trimming the search term**: `searchTerm.trim()` ensures that leading or trailing spaces are ignored before processing.

Let me know if you need further modifications or improvements to the code!
