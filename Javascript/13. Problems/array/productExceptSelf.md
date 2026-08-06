```js
function productExceptSelf(nums) {
    const length = nums.length;
    const output = new Array(length).fill(1);

    // Calculate the prefix products
    let prefixProduct = 1;
    for (let i = 0; i < length; i++) {
        output[i] = prefixProduct; // Set the prefix product
        prefixProduct *= nums[i];   // Update the prefix product
    }

    // Calculate the suffix products and multiply with prefix products
    let suffixProduct = 1;
    for (let i = length - 1; i >= 0; i--) {
        output[i] *= suffixProduct; // Multiply with the suffix product
        suffixProduct *= nums[i];    // Update the suffix product
    }

    return output;
}

// Example usage:
const arr = [1, 2, 3, 4];
console.log(productExceptSelf(arr)); // Output: [24, 12, 8, 6]
