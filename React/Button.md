```js
//index.js
import React, { Component } from "react";
import styles from "./index.module.css";
import cx from "classnames";
import PropTypes from "prop-types";

class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node,
    variant: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.string,
    disabledClassName: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: "",
    label: "",
    size: "",
    variant: "basic",
    disabled: false,
    disabledClassName: ""
  };

  handleButtonClick = event => {
    const { onClick, disabled } = this.props;

    if (disabled) return;

    onClick &&
      onClick({
        event
      });
  };

  renderChildren = () => {
    const { label, children } = this.props;

    if (label) {
      return label;
    }

    if (children) {
      return children;
    }

    return "Button";
  };

  render() {
    const {
      className,
      size,
      variant,
      disabled,
      disabledClassName
    } = this.props;

    const _className = cx(
      className,
      styles[size],
      styles.button,
      styles[variant],
      {
        [styles.disabled]: disabled,
        [disabledClassName]: disabled
      }
    );

    return (

        {this.renderChildren()}

    );
  }
}

export default Button;




//index.modules.css
.button {
    position: relative;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    padding: 0.7em 1.2em;
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    min-width: 96px;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid;
    color: #fff;
    -webkit-transition: background 0.2s ease;
    -moz-transition: background 0.2s ease;
    -o-transition: background 0.2s ease;
    transition: background 0.2s ease;
  }

  .medium {
    font-size: 16px;
  }

  .large {
    font-size: 18px;
  }

  .outline {
    background-color: #fff;
    border-color: #3777d1;
    color: #3777d1;
  }

  .outline:hover {
    background-color: #3777d1;
    border-color: #3777d1;
    color: #fff;
  }

  .basic {
    background-color: #3777d1;
    border-color: #3777d1;
    color: #fff;
  }

  .basic:hover {
    background-color: #fff;
    border-color: #fff;
    color: #3777d1;
  }

  .link {
    background-color: transparent;
    color: #4c4c4c;
    box-shadow: none;
  }

  .link:hover {
    color: #40a9ff;
    background-color: transparent;
  }

  .secondary {
    background-color: #fff;
    border-color: rgb(186, 186, 186);
    color: #4c4c4c;
  }

  .secondary:hover {
    background-color: #eee;
    border-color: #eee;
  }

  .primary {
    background-color: #2fcb53;
    border-color: #2fcb53;
    color: #fff;
  }

  .primary:hover {
    background-color: #48dd84;
    border-color: #48dd84;
  }

  .danger {
    color: #fff;
    background-color: rgb(214, 69, 64);
    border-color: rgb(214, 69, 64);
  }

  .danger:hover {
    background-color: rgb(208, 50, 45);
    border-color: rgb(208, 50, 45);
  }

  .disabled {
    background-color: #fff;
    border-color: #bababa;
    color: #bababa;
    box-shadow: none;
    opacity: 0.7;
    cursor: not-allowed;
    border: 1px solid;
  }

  .disabled:hover {
    background-color: #fff;
    color: #bababa;
    border-color: #bababa;
  }


  ReactDOM.render(
    <div className="abc">
      <Button label="Basic" variant="basic" />
      <Button label="Link" variant="link" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Danger" variant="danger" />
      <Button label="Disabled" disabled={true} />
      <Button label="Primary" variant="primary" />
      <Button label="Outline" variant="outline" />
      <Button label="Medium" variant="primary" size="medium" />
      <Button label="Large" variant="outline" size="large" />
    </div>,
    document.getElementById("root")
  );
```
