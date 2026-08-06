// Utility function to create a delay
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Retry function implementation
const retry = async (fn, retries = 3, delay = 500, finalError = 'Retry failed') => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw finalError;
      }
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await wait(delay);
    }
  }
};

// Test function factory
const createTestFunction = (successfulAttempt) => {
  let attempts = 0;
  return async () => {
    attempts++;
    if (attempts < successfulAttempt) {
      throw new Error('Not yet successful');
    }
    return `Success on attempt ${attempts}`;
  };
};

// Test scenarios
const runTests = async () => {
  console.log("Test 1: Success on first attempt");
  try {
    const result = await retry(createTestFunction(1));
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  console.log("\nTest 2: Success on third attempt");
  try {
    const result = await retry(createTestFunction(3));
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  console.log("\nTest 3: Failure (exceeds retry limit)");
  try {
    await retry(createTestFunction(5), 3, 100);
  } catch (error) {
    console.error(error);
  }

  console.log("\nTest 4: Custom final error message");
  try {
    await retry(createTestFunction(5), 3, 100, "Custom error: All attempts exhausted");
  } catch (error) {
    console.error(error);
  }
};

// Run the tests
runTests();