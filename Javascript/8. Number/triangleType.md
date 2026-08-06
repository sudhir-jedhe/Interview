To extend your `triangleType` function to account for other shapes, such as rectangles and squares, you can add additional checks for the properties of these shapes. A square has four equal sides, and a rectangle has opposite sides of equal length. We can combine this with your existing triangle check logic.

Let's expand the logic to:
- Return `"square"` if all four sides are equal.
- Return `"rectangle"` if opposite sides are equal but not all four sides are the same.
- Keep the existing triangle checks for `equilateral`, `isosceles`, and `scalene`.

Here’s the extended code that includes shapes like squares, rectangles, and triangles:

```typescript
function shapeType(nums: number[]): string {
    // Handle triangle cases
    nums.sort((a, b) => a - b);
    if (nums[0] + nums[1] <= nums[2]) {
        return 'none';
    }
    if (nums[0] === nums[2]) {
        return 'equilateral'; // All sides are equal
    }
    if (nums[0] === nums[1] || nums[1] === nums[2]) {
        return 'isosceles'; // Two sides are equal
    }
    return 'scalene'; // All sides are different
}

// Check for a square or rectangle
function rectangleOrSquare(sides: number[]): string {
    // For rectangle/square, we need four sides
    if (sides.length === 4) {
        // Check if all sides are equal
        if (sides[0] === sides[1] && sides[1] === sides[2] && sides[2] === sides[3]) {
            return 'square';
        }
        // Check if opposite sides are equal
        if (sides[0] === sides[2] && sides[1] === sides[3]) {
            return 'rectangle';
        }
    }
    return 'not a valid shape for rectangle/square';
}

// Example usage for triangle
console.log(shapeType([3, 3, 3]));  // "equilateral"
console.log(shapeType([3, 4, 5]));  // "scalene"
console.log(shapeType([1, 2, 3]));  // "none"

// Example usage for rectangle/square
console.log(rectangleOrSquare([4, 4, 4, 4]));  // "square"
console.log(rectangleOrSquare([4, 6, 4, 6]));  // "rectangle"
console.log(rectangleOrSquare([3, 5, 3, 5]));  // "rectangle"
console.log(rectangleOrSquare([2, 3, 4]));     // "not a valid shape for rectangle/square"
```

### Explanation:
1. **Triangle Checks**: 
   - We first sort the array to ensure the smallest two sides are checked against the largest. If the sum of the two smallest sides is not greater than the largest side, we return `"none"`.
   - If all three sides are equal, it’s an `"equilateral"`.
   - If two sides are equal, it’s an `"isosceles"`.
   - Otherwise, the triangle is `"scalene"`.

2. **Rectangle or Square Checks**:
   - If you provide four sides, the function will check if all four sides are the same. If they are, it’s a `"square"`.
   - If opposite sides are equal (but not all four), it’s a `"rectangle"`.
   - If neither condition is met, the result will be `"not a valid shape for rectangle/square"`.

### Example Outputs:
```js
shapeType([3, 3, 3]);       // "equilateral"
shapeType([3, 4, 5]);       // "scalene"
shapeType([1, 2, 3]);       // "none"

rectangleOrSquare([4, 4, 4, 4]); // "square"
rectangleOrSquare([4, 6, 4, 6]); // "rectangle"
rectangleOrSquare([3, 5, 3, 5]); // "rectangle"
rectangleOrSquare([2, 3, 4]);    // "not a valid shape for rectangle/square"
```

This solution handles various types of shapes and can be easily extended further if needed for additional shapes.