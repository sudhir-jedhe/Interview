```js
import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { useTransition, animated } from "@react-spring/web";

const list = [
    "https://cdn.pixabay.com/photo/2019/12/30/13/10/lost-places-4729640_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/09/16/15/31/boy-3681679_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/09/11/00/47/trunks-3668420_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/11/14/12/13/young-3815082_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/11/14/12/12/young-3815077_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/09/15/11/19/male-3679138_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/11/14/12/10/young-3815069_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/11/16/00/20/young-3818476_1280.jpg"
  ];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(true);

  const autoStart = useRef(null);
  const resume = useRef(null);

  //AutoSlide
  const autoSlide = () => {
    autoStart.current = setInterval(() => {
      setCurrent(current + 1 >= list.length ? 0 : current + 1);
      setNext(true);
    }, 3500);
  };

  useEffect(() => {
    autoSlide();

    if (!resume.current && !autoStart.current) {
      resume.current = setTimeout(() => {
        autoSlide();
      }, 1500);
    }

    return () => { clear(); };
  }, [current, next]);

  //Clear autoslide and resume
  const clear = () => {
    clearInterval(autoStart.current);
    clearTimeout(resume.current);
    autoStart.current = null;
    resume.current = null;
  };

  //Next slide
  const handleNext = () => {
    //Stop and Clear the auto slides
    clear();

    //Update the current index of slide
    setCurrent(current + 1 >= list.length ? 0 : current + 1);
    setNext(true);
  };

  const handlePrev = () => {
    //Stop and Clear the auto slides
    clear();

    //Update the current index of slide
    setCurrent(current - 1 < 0 ? list.length - 1 : current - 1);
    setNext(false);
  };

  // Generate slides
  const animationDirection = next
    ? {
        from: { opacity: 0, transform: "translate3d(100%,0,0)" },
        enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
        leave: { opacity: 0, transform: "translate3d(-50%,0,0)" }
      }
    : {
        from: { opacity: 0, transform: "translate3d(-50%,0,0)" },
        enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
        leave: { opacity: 0, transform: "translate3d(100%,0,0)" }
      };

  const transitions = useTransition(current, {
    key: current,
    from: animationDirection.from,
    enter: animationDirection.enter,
    leave: animationDirection.leave,
  });

  const item = transitions((style, i) => (
    <animated.div
      className={"slide"}
      style={{
        ...style,
        backgroundImage: `url(${list[i]}`,
      }}
    />
  ));

  return (
    <>
      {/* Slides */}
      <div className={"wrapper"}>{item}</div>

      {/* Controls */}
      <div className={"controls"}>
        <span onClick={handlePrev}>Prev</span>
        <span onClick={handleNext}>Next</span>
      </div>
    </>
  );
}

export default Carousel;



.wrapper {
    display: flex;
    justify-content: center;
    align-self: center;
    width: 80%;
    margin: 0 auto;
    border: 2px solid;
    position: relative;
    height: 80vh;
    overflow: hidden;
  }

  .slide {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    will-change: transform, opacity;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    margin: 25px auto 0 auto;
  }

  .controls > span {
    font-size: 2em;
    cursor: pointer;
  }

  import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Carousel from "./Components/Carousel";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <div className="abc">
    <Carousel />
  </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```
