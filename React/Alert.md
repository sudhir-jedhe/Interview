````js
import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

class AlertBox extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    autoClose: PropTypes.bool.isRequired,
    time: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(["danger", "primary", "basic"]).isRequired,
    placement: PropTypes.oneOf(["top", "bottom"]).isRequired
  };

  static defaultProps = {
    message: "",
    show: false,
    autoClose: false,
    time: 3000,
    variant: "primary",
    placement: "top"
  };

  state = {
    show: this.props.show
  };

  startTimer = () => {
    const { autoClose, time, show, onClose } = this.props;
    if (autoClose && show) {
      this.timer = setTimeout(() => {
        this.setState({
          show: false
        });

        onClose && onClose(false);
      }, time);
    }
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    if (show !== prevProps.show) {
      this.setState({
        show
      });

      if (show) {
        this.startTimer();
      } else {
        clearTimeout(this.timer);
      }
    }
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({
      show: false
    });
    onClose && onClose(false);
    clearTimeout(this.timer);
  };

  render() {
    const { message, variant, placement } = this.props;
    const { show } = this.state;
    return (
      show && (
        <div
          className={cx(styles.alertBox, styles[variant], styles[placement])}
        >
          <div>{message}</div>
          <span onClick={this.onClose} className={styles.close}>
            x
          </span>
        </div>
      )
    );
  }
}

export default AlertBox;


/********************* */
//index.module.css
.alertBox {
    position: fixed;
    width: 80%;
    left: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    background: #eee;
    border: 1px solid #aba3a3;
  }

  .bottom {
    bottom: 5%;
  }

  .top {
    top: 5%;
  }

  .danger {
    background: #ff5722;
    border: 1px solid #bf360c;
  }

  .primary {
    background: #8bc34a;
    border: 1px solid #33691e;
  }

  .basic {
    background: #00bcd4;
    border: 1px solid #006064;
  }

  .close {
    font-size: 20px;
    cursor: pointer;
    font-weight: 600;
  }


  /*********************** */

  import React, { Component } from "react";
import AlertBox from "./index";

class AlertBoxTest extends Component {
  state = {
    isActive: true
  };

  onChange = isActive => {
    this.setState({
      isActive
    });
  };

  onClick = () => {
    this.setState({
      isActive: !this.state.isActive
    });
  };

  render() {
    const { isActive } = this.state;
    return (
      <>
        <AlertBox
          show={isActive}
          onClose={this.onChange}
          message={"Primary!: AlertBox"}
          autoClose={false}
        />

        <AlertBox
          show={isActive}
          onClose={this.onChange}
          message={"Danger!: AlertBox"}
          autoClose={false}
          variant={"danger"}
        />

        <AlertBox
          show={isActive}
          onClose={this.onChange}
          message={"Basic!: AlertBox"}
          autoClose={false}
          variant={"basic"}
        />
      </>
    );
  }
}

export default AlertBoxTest;



Perfect — let’s finish this off by making the **progress bar color match the alert variant**. That way, the countdown feels visually tied to the type of alert (green for success, red for danger, blue for info, etc.).

---

## 📄 Full Merged Code (with Variant-Colored Progress Bar)

```jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./index.css";

/* ------------------ AlertBox ------------------ */
const AlertBox = ({
  show,
  autoClose,
  time,
  message,
  onClose,
  variant,
  placement,
  darkMode
}) => {
  const [visible, setVisible] = useState(show);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setVisible(show);
    let timer;
    let interval;

    if (autoClose && show) {
      const start = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.max(0, 100 - (elapsed / time) * 100);
        setProgress(percent);
      }, 100);

      timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose(false);
      }, time);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [show, autoClose, time, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose && onClose(false);
  };

  const getIcon = (variant) => {
    switch (variant) {
      case "danger":
        return "❌";
      case "primary":
        return "✅";
      case "basic":
        return "ℹ️";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={cx(
        "alertBox",
        variant,
        placement,
        { show: visible },
        { dark: darkMode }
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="content">
        <span className="icon">{getIcon(variant)}</span>
        {message}
      </div>
      <span onClick={handleClose} className="close">
        ×
      </span>
      {autoClose && (
        <div className="progressBar">
          <div
            className={cx("progressFill", variant)}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

AlertBox.propTypes = {
  show: PropTypes.bool.isRequired,
  autoClose: PropTypes.bool,
  time: PropTypes.number,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["danger", "primary", "basic"]),
  placement: PropTypes.oneOf(["top", "bottom"]),
  darkMode: PropTypes.bool
};

AlertBox.defaultProps = {
  message: "",
  show: false,
  autoClose: false,
  time: 3000,
  variant: "primary",
  placement: "top",
  darkMode: false
};

/* ------------------ AlertStack ------------------ */
const AlertStack = ({ placement = "top", darkMode = false }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, variant = "primary", autoClose = true, time = 3000) => {
    const newAlert = { id: Date.now(), message, variant, autoClose, time, show: true };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const handleClose = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, show: false } : alert
      )
    );
  };

  return (
    <div className={`alertStack ${placement}`}>
      {alerts.map((alert) => (
        <AlertBox
          key={alert.id}
          show={alert.show}
          message={alert.message}
          variant={alert.variant}
          autoClose={alert.autoClose}
          time={alert.time}
          placement={placement}
          darkMode={darkMode}
          onClose={() => handleClose(alert.id)}
        />
      ))}

      {/* Demo buttons */}
      <div className="buttons">
        <button onClick={() => addAlert("Primary Alert!", "primary")}>Add Primary</button>
        <button onClick={() => addAlert("Danger Alert!", "danger")}>Add Danger</button>
        <button onClick={() => addAlert("Basic Alert!", "basic")}>Add Basic</button>
      </div>
    </div>
  );
};

export default AlertStack;
````

---

## 🎨 CSS (`index.css`)

```css
.alertBox {
  position: relative;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background: #eee;
  border: 1px solid #aba3a3;
  opacity: 0;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.alertBox.show {
  opacity: 1;
  transform: translateY(0);
}

.top {
  transform: translateY(-20px);
}

.bottom {
  transform: translateY(20px);
}

.primary {
  background: #8bc34a;
  border: 1px solid #33691e;
}

.danger {
  background: #ff5722;
  border: 1px solid #bf360c;
}

.basic {
  background: #00bcd4;
  border: 1px solid #006064;
}

.dark {
  background: #333;
  color: #fff;
  border: 1px solid #555;
}

.icon {
  margin-right: 10px;
  font-size: 20px;
}

.close {
  font-size: 20px;
  cursor: pointer;
  font-weight: 600;
}

.progressBar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.progressFill {
  height: 100%;
  transition: width 0.1s linear;
}

/* Variant-colored progress bars */
.progressFill.primary {
  background: #33691e;
}

.progressFill.danger {
  background: #bf360c;
}

.progressFill.basic {
  background: #006064;
}

.alertStack {
  position: fixed;
  width: 80%;
  left: 10%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

.alertStack.top {
  top: 5%;
}

.alertStack.bottom {
  bottom: 5%;
}

.buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
```

---

## 🪄 Result

- Alerts **fade in/out** with placement-aware animation.
- **Stack dynamically** without overlap.
- **Icons per variant** (✅, ❌, ℹ️).
- **Progress bar** shrinks as auto-close counts down.
- Progress bar **color matches variant** (green, red, blue).
- **Dark mode support** with `darkMode` prop.

---

Would you like me to also show how to make the alerts **slide horizontally** (like toast notifications from the side) instead of vertical fade, for a more modern AlertBox style?
