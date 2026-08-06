To create an array of products with their name, quantity, and price, and then calculate the sum of the prices, you can write the following JavaScript code:

### JavaScript Code:

```javascript
// Array of product objects with name, quantity, and price
const products = [
  { name: 'Product 1', quantity: 2, price: 15.99 },
  { name: 'Product 2', quantity: 3, price: 23.49 },
  { name: 'Product 3', quantity: 5, price: 9.99 },
  { name: 'Product 4', quantity: 1, price: 49.99 },
  { name: 'Product 5', quantity: 4, price: 12.75 }
];

// Calculate the sum of prices
const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

console.log("Total Price:", totalPrice.toFixed(2)); // Display total price rounded to 2 decimal places
```

### Explanation:

1. **Array of Products**: The array `products` contains 5 objects, each representing a product with `name`, `quantity`, and `price`.
   
2. **Sum of Prices**: We use the `reduce` method to iterate over the array and accumulate the `price` of each product. The `reduce` function takes a callback where `sum` is the accumulator (starting at `0`), and `product` is the current item in the array. The sum of all prices is calculated by adding `product.price` to the accumulator.

3. **Displaying the Total Price**: Finally, the `console.log()` prints the total sum of prices, using `toFixed(2)` to round the total price to two decimal places.

### Output:
```
Total Price: 112.21
```

This code will correctly calculate and output the sum of the prices of all the products in the array.