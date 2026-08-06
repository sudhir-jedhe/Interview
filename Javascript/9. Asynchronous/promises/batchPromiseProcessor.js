async function processPromisesBatch(items, limit, fn) {
  const results = [];
  for (let start = 0; start < items.length; start += limit) {
    const end = Math.min(start + limit, items.length);
    const batchResults = await Promise.all(items.slice(start, end).map(fn));
    results.push(...batchResults);
    yield batchResults; // Yield each batch result
  }
  return results;
}

// Simulated asynchronous task
const simulateTask = (item) => 
  new Promise(resolve => setTimeout(() => resolve(`Processed ${item}`), Math.random() * 1000));

// Test cases
async function runTests() {
  console.log("Test 1: Basic batch processing");
  const items1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const batchProcessor1 = processPromisesBatch(items1, 3, simulateTask);
  for await (const batch of batchProcessor1) {
    console.log("Batch completed:", batch);
  }

  console.log("\nTest 2: Empty input array");
  const items2 = [];
  const batchProcessor2 = processPromisesBatch(items2, 2, simulateTask);
  for await (const batch of batchProcessor2) {
    console.log("Batch completed:", batch);
  }

  console.log("\nTest 3: Batch size larger than input array");
  const items3 = [1, 2, 3];
  const batchProcessor3 = processPromisesBatch(items3, 5, simulateTask);
  for await (const batch of batchProcessor3) {
    console.log("Batch completed:", batch);
  }

  console.log("\nTest 4: Error handling");
  const errorTask = (item) => 
    new Promise((resolve, reject) => 
      setTimeout(() => item % 3 === 0 ? reject(`Error processing ${item}`) : resolve(`Processed ${item}`), 
      Math.random() * 1000)
    );
  
  const items4 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const batchProcessor4 = processPromisesBatch(items4, 4, errorTask);
  try {
    for await (const batch of batchProcessor4) {
      console.log("Batch completed:", batch);
    }
  } catch (error) {
    console.error("Error caught:", error);
  }

  console.log("\nTest 5: Large dataset");
  const items5 = Array.from({ length: 100 }, (_, i) => i + 1);
  const batchProcessor5 = processPromisesBatch(items5, 10, simulateTask);
  let batchCount = 0;
  for await (const batch of batchProcessor5) {
    console.log(`Batch ${++batchCount} completed, size:`, batch.length);
  }
}

// Run all tests
runTests().catch(console.error);

// Example of practical usage
async function fetchDataInBatches(urls, batchSize) {
  const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (e) {
        if (i === retries - 1) throw e;
      }
    }
  };

  const batchProcessor = processPromisesBatch(urls, batchSize, fetchWithRetry);
  const allData = [];

  for await (const batchData of batchProcessor) {
    console.log(`Fetched batch of ${batchData.length} items`);
    allData.push(...batchData);
  }

  return allData;
}

// Uncomment to test fetchDataInBatches
// const urls = [
//   'https://api.example.com/data/1',
//   'https://api.example.com/data/2',
//   'https://api.example.com/data/3',
//   // ... more URLs
// ];
// fetchDataInBatches(urls, 5)
//   .then(data => console.log('All data fetched:', data))
//   .catch(error => console.error('Error fetching data:', error));