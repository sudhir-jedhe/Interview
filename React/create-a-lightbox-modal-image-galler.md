```js
import { useState } from "react";
import Modal from "./Modal";

export default function App() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);

  const images = [
    {
      image_url:
        "https://img.freepik.com/free-photo/young-female-jacket-shorts-presenting-comparing-something-looking-confident-front-view_176474-37521.jpg?w=1800&t=st=1693037944~exp=1693038544~hmac=97e967909706f9b73b4b47d521acf54806f4b9b3efab6196bc8a69f07efff554",
      caption: "Image 1"
    },
    {
      image_url:
        "https://img.freepik.com/free-photo/girl-grey-shirt-showing-something-her-hand_144627-51099.jpg?t=st=1693037931~exp=1693038531~hmac=63713e5a5cf2d23f53ca82b9996ad224ac6e92d0275a53b6debbe6523d7df020",
      caption: "Image 2"
    },
    {
      image_url:
        "https://img.freepik.com/free-photo/young-lady-shirt-jacket-making-scales-gesture-looking-cheerful-front-view_176474-85195.jpg?t=st=1693037931~exp=1693038531~hmac=2f83b6689538e4056912c96f448163e9ef10998f48f671b7e50279f81611fbe6",
      caption: "Image 3"
    },
    {
      image_url:
        "https://img.freepik.com/free-photo/girl-wide-opening-hands-giving-explanation-high-quality-photo_144627-60466.jpg?w=1800&t=st=1693038021~exp=1693038621~hmac=d4520cd86b2aea3e5dda765ede05bb53d70e18a574756d0f41a6806fe325d26d",
      caption: "Image 4"
    },
    {
      image_url:
        "https://img.freepik.com/free-photo/young-lady-shirt-jacket-making-scales-gesture-looking-cheerful-front-view_176474-85195.jpg?t=st=1693037931~exp=1693038531~hmac=2f83b6689538e4056912c96f448163e9ef10998f48f671b7e50279f81611fbe6",
      caption: "Image 5"
    },
    {
      image_url:
        "https://img.freepik.com/free-photo/girl-wide-opening-hands-giving-explanation-high-quality-photo_144627-60466.jpg?w=1800&t=st=1693038021~exp=1693038621~hmac=d4520cd86b2aea3e5dda765ede05bb53d70e18a574756d0f41a6806fe325d26d",
      caption: "Image 6"
    }
  ];

  const handleClick = (index) => {
    setActive(index);
    setShow(true);
  };

  const onClose = () => {
    setShow(false);
  };

  return (
    <div className="App">
      <Modal show={show} title="Lightbox" onClose={onClose}>
        <Slider images={images} active={active} setActive={setActive} />
      </Modal>
      <div className="image-list">
        {images.map((e, i) => (
          <div
            className={i === active ? "active" : ""}
            onClick={() => handleClick(i)}
            key={e.caption}
          >
            <img src={e.image_url} alt={e.caption} />
          </div>
        ))}
      </div>
    </div>
  );
};


import "./modal.css";

const Modal = ({ children, show, onClose, title }) => {
  return (
    show && (
      <>
        <div className="modal-backdrop" onClick={onClose} />
        <div className="modal-wrapper">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">{title}</div>
              <div onClick={onClose} className="modal-close">
                X
              </div>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </>
    )
  );
};

export default Modal;

.modal-backdrop {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    top: 0;
    left: 0;
  }

  .modal-wrapper {
    padding: 10px;
    margin: 10px auto;
    box-shadow: 0px 2px 6px #000;
    position: fixed;
    width: 100%;
    max-width: 500px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 11111;
    background-color: #fff;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .modal-close {
    text-align: center;
    font-size: 1.2em;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: gray;
    line-height: 1.7em;
    color: #fff;
  }

  onst Slider = ({ images, active, setActive }) => {
    const onNext = () => {
      if (active < images.length - 1) {
        setActive(active + 1);
      }
    };

    const onPrev = () => {
      if (active > 0) {
        setActive(active - 1);
      }
    };

    return (
      <div className="slider">
        <div className="slides">
          {images.map((e, i) => (
            <Slide key={e.caption} {...e} active={i === active} />
          ))}
        </div>
        <div className="navigation">
          <div className="navigation-next-prev">
            <div class="next-prev prev" onClick={onPrev}>
              {" "}
              &lt;{" "}
            </div>
            <div class="next-prev next" onClick={onNext}>
              {" "}
              &gt;{" "}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Slide = ({ image_url, caption, active }) => {
    return (
      <div className={`slide ${active ? "active" : ""}`}>
        <img src={image_url} alt={caption} />
        <span>{caption}</span>
      </div>
    );
  };



  * {
  box-sizing: border-box;
}

.App {
  font-family: sans-serif;
  text-align: center;
}

.slider {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.slide {
  position: relative;
  display: none;
}

@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

.slide.active {
  display: block;
  animation-name: fade;
  animation-duration: 1.5s;
}

.slide span {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
}

.slide img {
  width: 100%;
}

.navigation-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview {
  margin: 0 2px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 3px solid gray;
}

.preview.active {
  border-color: skyblue;
}

.navigation-next-prev .next-prev {
  position: absolute;
  top: 50%;
  font-size: 1.5em;
  cursor: pointer;
  transform: translateY(-100%);
  z-index: 10000;
}

.next {
  right: 10px;
}

.prev {
  left: 10px;
}

.image-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.image-list > div {
  flex: 1 33%;
  padding: 5px;
  cursor: pointer;
}

.image-list > div img {
  width: 100%;
  border: 3px solid gray;
}

.image-list > div.active img {
  border-color: skyblue;
}
```
