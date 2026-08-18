// Typeahead / autocomplete search box, debounced, against a mock local dataset,
// with full keyboard navigation (ArrowUp/ArrowDown/Enter/Escape).

// ---------------------------------------------------------------------------
// 1. Mock "backend" dataset + a fake-latency search function
// ---------------------------------------------------------------------------

const COUNTRIES = [
  "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil",
  "Canada", "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland",
  "France", "Germany", "Greece", "India", "Indonesia", "Ireland", "Italy",
  "Japan", "Kenya", "Malaysia", "Mexico", "Netherlands", "New Zealand",
  "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland",
  "Portugal", "Singapore", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam",
];

/**
 * Simulates an async API call: resolves with matching countries after a
 * small random delay, so the debounce/race-condition handling below has
 * something real to guard against.
 */
function fakeSearchApi(query) {
  const delay = 80 + Math.random() * 220; // 80-300ms, like a real network call
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const matches = q
        ? COUNTRIES.filter((name) => name.toLowerCase().includes(q))
        : [];
      resolve(matches.slice(0, 8)); // cap results, like a real API would paginate
    }, delay);
  });
}

// ---------------------------------------------------------------------------
// 2. debounce, from scratch (see ../../problems/02-debounce-and-throttle.md)
// ---------------------------------------------------------------------------

function debounce(fn, delay) {
  let timerId;
  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ---------------------------------------------------------------------------
// 3. Wiring: DOM refs + state
// ---------------------------------------------------------------------------

const input = document.getElementById("search-input");
const resultsList = document.getElementById("search-results");
const statusEl = document.getElementById("status");
const chosenEl = document.getElementById("chosen");

let currentResults = [];
let activeIndex = -1; // -1 means no keyboard selection yet
let requestToken = 0; // guards against out-of-order responses (see note below)

function highlightMatch(name, query) {
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return name;
  const before = name.slice(0, idx);
  const match = name.slice(idx, idx + query.length);
  const after = name.slice(idx + query.length);
  // textContent-based building (no innerHTML with raw user input) --
  // see ../../20-security-basics/ for why this matters even for a "safe" local dataset.
  return { before, match, after };
}

function renderResults(names, query) {
  resultsList.innerHTML = ""; // safe here: we only ever insert nodes we build below, never raw query text
  currentResults = names;
  activeIndex = -1;

  names.forEach((name, index) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.dataset.index = String(index);
    li.setAttribute("aria-selected", "false");

    const parts = highlightMatch(name, query);
    if (typeof parts === "string") {
      li.textContent = parts;
    } else {
      li.append(
        document.createTextNode(parts.before),
        Object.assign(document.createElement("mark"), { textContent: parts.match }),
        document.createTextNode(parts.after),
      );
    }
    resultsList.append(li);
  });

  const isOpen = names.length > 0;
  resultsList.classList.toggle("open", isOpen);
  input.setAttribute("aria-expanded", String(isOpen));
  statusEl.textContent = query
    ? `${names.length} result${names.length === 1 ? "" : "s"} for "${query}"`
    : "";
}

function closeResults() {
  resultsList.classList.remove("open");
  resultsList.innerHTML = "";
  input.setAttribute("aria-expanded", "false");
  currentResults = [];
  activeIndex = -1;
}

function setActiveIndex(newIndex) {
  const items = resultsList.querySelectorAll("li");
  if (items.length === 0) return;

  activeIndex = (newIndex + items.length) % items.length; // wraps both directions
  items.forEach((li, i) => {
    li.setAttribute("aria-selected", String(i === activeIndex));
  });
  items[activeIndex].scrollIntoView({ block: "nearest" });
}

function chooseResult(name) {
  chosenEl.textContent = `You selected: ${name}`;
  input.value = name;
  closeResults();
}

// ---------------------------------------------------------------------------
// 4. Debounced search, with stale-response protection
// ---------------------------------------------------------------------------

const runSearch = debounce(async (query) => {
  if (!query.trim()) {
    closeResults();
    return;
  }

  const myToken = ++requestToken; // snapshot "my" request's identity
  statusEl.textContent = "Searching…";

  const results = await fakeSearchApi(query);

  // If a newer search has started since this one was issued, drop this
  // response -- this is the debounce/AbortController pattern from
  // ../../scenarios/04-search-as-you-type-debounce-abort.md, using a token
  // instead of AbortController since fakeSearchApi has no real request to cancel.
  if (myToken !== requestToken) return;

  renderResults(results, query);
}, 250);

// ---------------------------------------------------------------------------
// 5. Event delegation: one click listener handles clicking any result
// ---------------------------------------------------------------------------

resultsList.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const index = Number(li.dataset.index);
  chooseResult(currentResults[index]);
});

// ---------------------------------------------------------------------------
// 6. Input + keyboard navigation
// ---------------------------------------------------------------------------

input.addEventListener("input", (event) => {
  runSearch(event.target.value);
});

input.addEventListener("keydown", (event) => {
  const isOpen = resultsList.classList.contains("open");

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (isOpen) setActiveIndex(activeIndex + 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      if (isOpen) setActiveIndex(activeIndex - 1);
      break;
    case "Enter":
      if (isOpen && activeIndex >= 0) {
        event.preventDefault();
        chooseResult(currentResults[activeIndex]);
      }
      break;
    case "Escape":
      if (isOpen) {
        event.preventDefault();
        closeResults();
      }
      break;
  }
});

// Close the dropdown when clicking anywhere outside the widget.
document.addEventListener("click", (event) => {
  const widget = document.querySelector(".typeahead");
  if (!widget.contains(event.target)) closeResults();
});
