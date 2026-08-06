Here is a complete, production-grade **Live Search Box** built in Vanilla JavaScript. It includes debounced API calls, full keyboard navigation (Up/Down arrow keys, Enter, Escape), ARIA accessibility, and click-outside-to-close functionality.

---

### 1. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Search Component</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <div class="search-container" id="search-container">
    <label for="search-input" class="sr-only">Search products</label>
    
    <div class="input-wrapper">
      <input
        type="text"
        id="search-input"
        class="search-input"
        placeholder="Search products..."
        autocomplete="off"
        role="combobox"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-controls="search-results"
      />
      <span id="search-spinner" class="spinner hidden" aria-hidden="true"></span>
    </div>

    <!-- Dropdown Results Box -->
    <ul
      id="search-results"
      class="search-results hidden"
      role="listbox"
      aria-label="Search Results"
    ></ul>
  </div>

  <script src="app.js"></script>
</body>
</html>

```

---

### 2. CSS Styles (`style.css`)

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body {
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 16px;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Loading Spinner */
.spinner {
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Results Dropdown */
.search-results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  z-index: 50;
}

.search-results.hidden,
.spinner.hidden {
  display: none;
}

.result-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 15px;
  color: #334155;
  transition: background-color 0.15s ease;
}

/* Highlighted state via Hover OR Keyboard Navigation */
.result-item:hover,
.result-item.selected {
  background-color: #f1f5f9;
  color: #1e293b;
}

.result-item.selected {
  outline: none;
  border-left: 4px solid #3b82f6;
}

.no-results, .error-message {
  padding: 12px 16px;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

```

---

### 3. JavaScript Logic (`app.js`)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('search-container');
  const input = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results');
  const spinner = document.getElementById('search-spinner');

  let activeIndex = -1;
  let abortController = null;

  // 1. Debounce Utility Helper
  function debounce(func, delay = 350) {
    let timerId;
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // 2. Simulated Async API Call (Replaces real endpoint for demo)
  async function fetchSearchResults(query, signal) {
    // Simulated remote API latency
    await new Promise((res) => setTimeout(res, 300));

    // Throw abort error if cancelled
    if (signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const mockDatabase = [
      'Apple iPhone 15',
      'Apple MacBook Pro M3',
      'Apple AirPods Pro',
      'Samsung Galaxy S24',
      'Samsung Ultra Monitor',
      'Sony WH-1000XM5 Headphones',
      'Sony PlayStation 5',
      'Google Pixel 8 Pro',
      'Logitech MX Master 3S',
      'Dell XPS 15 Laptop',
    ];

    return mockDatabase.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }

  // 3. Core Search Functionality
  async function handleSearch() {
    const query = input.value.trim();

    if (!query) {
      closeDropdown();
      return;
    }

    // Abort previous pending API request if user typed again
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    showSpinner();

    try {
      const results = await fetchSearchResults(query, abortController.signal);
      renderResults(results);
    } catch (error) {
      if (error.name !== 'AbortError') {
        renderError('Failed to fetch search results.');
      }
    } finally {
      hideSpinner();
    }
  }

  // 4. Render Dropdown Results
  function renderResults(results) {
    resultsList.innerHTML = '';
    activeIndex = -1;

    if (results.length === 0) {
      resultsList.innerHTML = `<li class="no-results">No results found</li>`;
      openDropdown();
      return;
    }

    results.forEach((itemText, index) => {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.setAttribute('role', 'option');
      li.setAttribute('id', `result-option-${index}`);
      li.textContent = itemText;

      // Mouse Selection
      li.addEventListener('click', () => selectItem(itemText));

      resultsList.appendChild(li);
    });

    openDropdown();
  }

  function renderError(message) {
    resultsList.innerHTML = `<li class="error-message">${message}</li>`;
    openDropdown();
  }

  // 5. Select Item Handler
  function selectItem(text) {
    input.value = text;
    closeDropdown();
    input.focus();
  }

  // 6. Keyboard Navigation Handler (Up, Down, Enter, Escape)
  function handleKeyDown(event) {
    const items = resultsList.querySelectorAll('.result-item');
    if (!items.length || resultsList.classList.contains('hidden')) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        updateItemSelection(items);
        break;

      case 'ArrowUp':
        event.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateItemSelection(items);
        break;

      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          selectItem(items[activeIndex].textContent);
        }
        break;

      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
    }
  }

  // Update Visual & ARIA Selection Highlight
  function updateItemSelection(items) {
    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', item.id);
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // 7. Dropdown Visibility & State Controls
  function openDropdown() {
    resultsList.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    resultsList.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  }

  function showSpinner() {
    spinner.classList.remove('hidden');
  }

  function hideSpinner() {
    spinner.classList.add('hidden');
  }

  // 8. Event Listeners

  // Debounced input handler (350ms delay)
  input.addEventListener('input', debounce(handleSearch, 350));

  // Keyboard Navigation
  input.addEventListener('keydown', handleKeyDown);

  // Open dropdown if focused and input contains query
  input.addEventListener('focus', () => {
    if (input.value.trim() && resultsList.children.length > 0) {
      openDropdown();
    }
  });

  // Click Outside Handler: Close dropdown if user clicks anywhere outside container
  document.addEventListener('click', (event) => {
    if (!container.contains(event.target)) {
      closeDropdown();
    }
  });
});

```
