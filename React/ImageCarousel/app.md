```js
import ImageCarousel from "./ImageCarousel";
import React from "react";

// src/App.js

const App = () => {
  const images = [
    "https://via.placeholder.com/600x300?text=Image+1",
    "https://via.placeholder.com/600x300?text=Image+2",
    "https://via.placeholder.com/600x300?text=Image+3",
  ];

  return (
    <div>
      <h1>Image Carousel Example</h1>
      <ImageCarousel images={images} />
    </div>
  );
};

export default App;
```
