To implement a cricket score functionality as per your requirements, we can create a React component that displays a table with two columns: "Ball Number" and "Number of Runs". There will be a button to update the score, and after six clicks (representing six balls), we will show the total score.

Here’s how you can implement it:

```jsx
import React, { useState } from "react";

const CricketScore = () => {
  const [balls, setBalls] = useState([]); // Holds the ball number and runs
  const [totalScore, setTotalScore] = useState(0); // Holds the total score

  const handleScoreUpdate = () => {
    // Get the number of balls clicked (this is the length of the balls array)
    const ballNumber = balls.length + 1;

    // Simulate a random number of runs between 0 and 6
    const runs = Math.floor(Math.random() * 7);

    // Update the table with the current ball number and runs
    setBalls([...balls, { ballNumber, runs }]);

    // Update the total score
    setTotalScore(totalScore + runs);
  };

  return (
    <div>
      <h2>Cricket Score Tracker</h2>

      {/* Table to display ball number and runs */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Ball Number</th>
            <th>Runs</th>
          </tr>
        </thead>
        <tbody>
          {balls.map((ball, index) => (
            <tr key={index}>
              <td>{ball.ballNumber}</td>
              <td>{ball.runs}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {/* Button to update score */}
      <button onClick={handleScoreUpdate}>Update Score</button>

      {/* Show the total score after 6 balls */}
      {balls.length === 6 && (
        <div>
          <h3>Total Score: {totalScore}</h3>
        </div>
      )}
    </div>
  );
};

export default CricketScore;
```

### **Explanation:**

1. **State Management:**
   - `balls`: Holds an array of objects representing each ball. Each object contains the `ballNumber` and the `runs` for that ball.
   - `totalScore`: Holds the accumulated score across all balls.

2. **handleScoreUpdate Function:**
   - It calculates the ball number (the length of the `balls` array + 1).
   - It generates a random number of runs (between 0 and 6) using `Math.random()`.
   - It updates the `balls` array with the new ball and its corresponding score.
   - It also updates the total score by adding the runs for the current ball.

3. **Rendering the Table:**
   - The table displays the ball number and the runs for each ball clicked.
   - The table is dynamically populated from the `balls` array.

4. **Display Total Score:**
   - After 6 balls (6 clicks), the total score is displayed.

### **Features:**

- Clicking the "Update Score" button adds a row to the table.
- After six clicks, it shows the total score.
- The number of runs per ball is randomly generated.

### **Sample Output:**

| Ball Number | Runs |
| ----------- | ---- |
| 1           | 4    |
| 2           | 6    |
| 3           | 1    |
| 4           | 2    |
| 5           | 3    |
| 6           | 0    |

**Total Score: 16**

You can customize the score generation logic and table styling further according to your needs.
