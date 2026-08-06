var addTwoPromises = async function(promise1, promise2) {
    const [value1, value2] = await Promise.all([promise1, promise2]);
    return value1 + value2;
};

// Test cases
async function runTests() {
    console.log("Test Case 1:");
    const promise1 = new Promise(resolve => setTimeout(() => resolve(2), 20));
    const promise2 = new Promise(resolve => setTimeout(() => resolve(5), 60));
    const result1 = await addTwoPromises(promise1, promise2);
    console.log("Result:", result1);
    console.log("Expected: 7");

    console.log("\nTest Case 2:");
    const promise3 = Promise.resolve(10);
    const promise4 = Promise.resolve(20);
    const result2 = await addTwoPromises(promise3, promise4);
    console.log("Result:", result2);
    console.log("Expected: 30");

    console.log("\nTest Case 3:");
    const promise5 = new Promise(resolve => setTimeout(() => resolve(-5), 40));
    const promise6 = new Promise(resolve => setTimeout(() => resolve(15), 10));
    const result3 = await addTwoPromises(promise5, promise6);
    console.log("Result:", result3);
    console.log("Expected: 10");
}

runTests();