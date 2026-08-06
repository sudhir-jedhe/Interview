// Implement the pause function
function pause(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

// Helper function to get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString().substr(11, 12);
}

// Test cases
async function runTests() {
  console.log("Test 1: Basic pause functionality");
  console.log(`${getCurrentTimestamp()} Starting...`);
  await pause(2000);
  console.log(`${getCurrentTimestamp()} Resumed after 2 seconds`);

  console.log("\nTest 2: Multiple pauses");
  console.log(`${getCurrentTimestamp()} Starting...`);
  for (let i = 1; i <= 3; i++) {
    await pause(1000);
    console.log(`${getCurrentTimestamp()} Resumed after ${i} second(s)`);
  }

  console.log("\nTest 3: Pause with zero milliseconds");
  console.log(`${getCurrentTimestamp()} Starting...`);
  await pause(0);
  console.log(`${getCurrentTimestamp()} Resumed immediately`);

  console.log("\nTest 4: Pause within a loop");
  console.log(`${getCurrentTimestamp()} Starting loop...`);
  for (let i = 0; i < 5; i++) {
    await pause(500);
    console.log(`${getCurrentTimestamp()} Iteration ${i + 1}`);
  }

  console.log("\nTest 5: Error handling with negative pause duration");
  try {
    console.log(`${getCurrentTimestamp()} Attempting negative pause...`);
    await pause(-1000);
  } catch (error) {
    console.error(`${getCurrentTimestamp()} Error:`, error.message);
  }
}

// Run all tests
runTests().then(() => console.log("All tests completed"));

// Practical example: Simulating API rate limiting
async function fetchWithRateLimit(urls, pauseDuration = 1000) {
  const results = [];
  for (const url of urls) {
    try {
      console.log(`${getCurrentTimestamp()} Fetching ${url}`);
      // Simulated fetch, replace with actual fetch in real-world usage
      const response = await Promise.resolve(`Data from ${url}`);
      results.push(response);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
    await pause(pauseDuration);
  }
  return results;
}

// Demonstrate rate-limited API calls
const urls = [
  'https://api.example.com/data/1',
  'https://api.example.com/data/2',
  'https://api.example.com/data/3',
  'https://api.example.com/data/4',
  'https://api.example.com/data/5'
];

console.log("\nPractical Example: API Rate Limiting");
fetchWithRateLimit(urls)
  .then(results => console.log("Fetched data:", results))
  .catch(error => console.error("Error in rate-limited fetching:", error));