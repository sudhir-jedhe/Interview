### Explanation of Shuffling Techniques in JavaScript

You provided several implementations of array shuffling. Let's go through each of the methods and break down their behavior and logic. We'll also touch on how they perform shuffling and any potential improvements that could be made.

---

### **1. Fisher-Yates (Knuth) Shuffle (Best Practice)**

The **Fisher-Yates shuffle** (also known as the **Knuth shuffle**) is a widely used and efficient algorithm to randomly shuffle an array.

Here’s your version of it:

```javascript
function shuffleArray(array) {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array.");
  }

  const shuffledArray = [...array];  // Create a copy to avoid mutating the original array.

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));  // Random index from 0 to i.
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];  // Swap elements.
  }

  return shuffledArray;
}
```

#### **How It Works:**
- **Step 1**: A copy of the original array is created to avoid mutating the input array.
- **Step 2**: The loop iterates backward from the last index to the second element.
- **Step 3**: For each index `i`, a random index `j` is chosen from `0` to `i`, and the elements at indices `i` and `j` are swapped.

#### **Why It's Efficient:**
- **Time Complexity**: **O(n)**, where `n` is the length of the array. Each element is swapped exactly once.
- **Space Complexity**: **O(n)** (due to the copied array). If mutating the original array, it would be **O(1)**.

#### **Example:**
```javascript
const originalArray = [1, 2, 3, 4, 5];
const shuffledArray = shuffleArray(originalArray);
console.log(shuffledArray); // Random permutation of [1, 2, 3, 4, 5]
```

---

### **2. Another Fisher-Yates Shuffle (In-place)**

In your second example, you implemented the Fisher-Yates shuffle **in-place** (without copying the array):

```javascript
function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));  // Random index from 0 to i.
    [arr[i], arr[rand]] = [arr[rand], arr[i]];  // Swap elements.
  }
}
```

#### **How It Works:**
- **Step 1**: The loop iterates backward from the last index to the first.
- **Step 2**: A random index `rand` is chosen for each element `i`, and the elements at indices `i` and `rand` are swapped.

#### **Why It's Efficient:**
- **Time Complexity**: **O(n)**, where `n` is the length of the array.
- **Space Complexity**: **O(1)** (since no extra space is used).

#### **Example:**
```javascript
const arr = [1, 2, 3, 4];
shuffle(arr);  // Array is shuffled in-place
console.log(arr);  // Random permutation of [1, 2, 3, 4]
```

---

### **3. Random Index Shuffle**

This is another variation where elements are swapped randomly in the array, but instead of directly using a loop, you generate random indices:

```javascript
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randIdx = Math.floor(Math.random() * (i + 1));
    const storedItem = arr[i];
    arr[i] = arr[randIdx];
    arr[randIdx] = storedItem;
  }

  return arr;
}
```

This method is very similar to the in-place Fisher-Yates shuffle, just with a different style of variable usage for the swap operation.

---

### **4. Shuffle Using Array `splice()`**

Here’s another approach using a temporary array and `splice()` to remove elements as they are shuffled:

```javascript
function shuffle(arr) {
  const op = [...arr];  // Make a copy of the array

  while (op.length) {
    const randomIndex = Math.floor(Math.random() * op.length);
    [arr[op.length - 1], arr[randomIndex]] = [
      arr[randomIndex],
      arr[op.length - 1],
    ];
    op.splice(0, 1);  // Remove the shuffled element
  }

  return arr;
}
```

#### **How It Works:**
- **Step 1**: A copy of the original array is made to avoid mutation.
- **Step 2**: Elements are removed one-by-one from the `op` array, with random swaps performed each time.

#### **Why It’s Less Efficient:**
- **Time Complexity**: **O(n²)** due to the `splice()` operation, which has a time complexity of **O(n)**.
- **Space Complexity**: **O(n)** for the copied array `op`.

---

### **5. Card Shuffle Example**

Here’s an example of how you can use the Fisher-Yates algorithm to shuffle a deck of cards:

```javascript
const cardTypes = ["Spades", "Diamonds", "Club", "Heart"];
const cardValues = [
  "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"
];

// Create a deck of cards (52 cards)
let deck = [];
for (let i = 0; i < cardTypes.length; i++) {
  for (let x = 0; x < cardValues.length; x++) {
    let card = { value: cardValues[x], type: cardTypes[i] };
    deck.push(card);
  }
}

// Shuffle the cards using Fisher-Yates
for (let i = deck.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * i);
  let temp = deck[i];
  deck[i] = deck[j];
  deck[j] = temp;
}

// Display 3 random cards
for (let i = 0; i < 3; i++) {
  console.log(`${deck[i].value} of ${deck[i].type}`);
}
```

#### **Output Example:**
```plaintext
Jack of Spades
3 of Diamonds
4 of Spades
```

This creates a deck of 52 cards, shuffles them using the Fisher-Yates algorithm, and displays 3 shuffled cards.

---

### **Summary of Shuffling Methods:**

1. **Fisher-Yates Shuffle (Knuth Shuffle)**:
   - **Best Practice** for shuffling.
   - **Time Complexity**: O(n).
   - **Space Complexity**: O(1) if done in-place.
   
2. **Shuffle with `splice()`**:
   - Less efficient due to higher time complexity (**O(n²)**).
   - Suitable for small arrays but not recommended for large datasets.

3. **Card Shuffling Example**:
   - A practical example using the Fisher-Yates shuffle for a deck of cards.
   - The deck is shuffled, and a few cards are drawn.

In most cases, you should prefer the **Fisher-Yates shuffle** as it’s efficient, both in time and space, and it’s the industry standard for randomizing arrays.