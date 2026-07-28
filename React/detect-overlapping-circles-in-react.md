```js
import { useEffect, useState } from "react";

// helper function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// helper function to detect if two elements are overlapping
const elementsOverlap = (rect1, rect2) => {
  const collide = !(
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right
  );

  return collide;
};

const Example = () => {
  // store the configuration of each circle
  const [elementsCoordinates, setElementsCoordinates] = useState([]);

  // helper function to gather configuration when user clicks
  const draw = (e) => {
    // get the co-ordinates where user has clicked
    const { clientX, clientY } = e;

    // decide the position where circle will be created and placed
    // as the circle is of 100 radius (200 diameter), we are subtracting the values
    // so that circle is placed in the center
    // set the initial background color to red
    setElementsCoordinates((prevState) => {
      const current = {
        top: clientY - 100,
        left: clientX - 100,
        right: clientX - 100 + 200,
        bottom: clientY - 100 + 200,
        background: "red",
      };

      // before making the new entry
      // check with the exisitng circles
      for (let i = 0; i < prevState.length; i++) {
        // if the current circle is colliding with any existing
        // update the background color of the current
        if (elementsOverlap(current, prevState[i])) {
          current.background = getRandomColor();
          break;
        }
      }

      return [...prevState, current];
    });
  };

  // assign the click event
  useEffect(() => {
    document.addEventListener("click", draw);
    return () => {
      document.removeEventListener("click", draw);
    };
  }, []);

  // circle element
  const Circle = ({ top, left, background }) => {
    return (
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          opacity: "0.5",
          background,
          top,
          left,
        }}
      ></div>
    );
  };

  return (
    <div>
      {/* render each circle */}
      {elementsCoordinates.map((e) => (
        <Circle {...e} key={e.top + e.left + e.right} />
      ))}
    </div>
  );
};

export default Example;
```
