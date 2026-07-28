```js
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const Checkbox = (props, ref) => {
  const handleChange = e => {
    const { name, onChange, option } = props;
    const { checked } = e.target;
    const {value } = option;

    if (onChange) {
      onChange({
        name,
        value,
        checked
     });
    }
  };

  const {
    className,
    labelClassName,
    name,
    option,
    value,
    defaultChecked,
    inputClassName,
    checkedItemLabelClassName,
    customLabelClassName
  } = props;

  const _className = cx(className, styles.item, {
    [styles.disabled]: option.disabled
  });

  const _inputClassName = cx(styles.checkbox, inputClassName);

  const _labelClassName = cx(labelClassName, styles.label, {
    [checkedItemLabelClassName]: value
  });

  const _customLabelClassName = cx(customLabelClassName, styles.customLabel);

  return (
    <div className={_className}>
      <input
        disabled={option.disabled}
        type="checkbox"
        name={name}
        id={`${name}-${option.value}`}
        value={option.value}
        defaultChecked={defaultChecked}
        checked={value}
        onChange={handleChange}
        className={_inputClassName}
        ref={ref}
      />

      <label
        className={_customLabelClassName}
        htmlFor={`${name}-${option.value}`}
      ></label>

      <label htmlFor={`${name}-${option.value}`} className={_labelClassName}>
        {option.label}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  option: PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.node,
    disabled: PropTypes.bool
  }),

  name: PropTypes.string.isRequired,

  onChange: PropTypes.func,

  className: PropTypes.string,

  inputClassName: PropTypes.string,

  /* Applies to the label of each item in this group */
  labelClassName: PropTypes.string,

  checkedItemLabelClassName: PropTypes.string,

  /* Applies to custom label for checkbox */
  customLabelClassName: PropTypes.string,

  value: PropTypes.bool,

  defaultChecked: PropTypes.bool,

  innerRef: PropTypes.any
};

Checkbox.defaultProps = {
  checkedItemLabelClassName: ""
};

export default React.forwardRef((props, ref) => Checkbox(props, ref));



.checkbox {
    display: none;
  }

  .checkbox:checked + .customLabel {
    background: #68c721;
    border-color: #68c721;
  }

  .checkbox:checked + .customLabel:after {
    content: "";
  }

  .customLabel {
    border: 1px solid #a8acb1;
    background-color: #fff;
    border-radius: 3px;
    min-width: 20px;
    min-height: 20px;
    cursor: pointer;
  }

  .customLabel::after {
    width: 12px;
    height: 5px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    display: block;
    transform: rotate(-45deg) translateY(4px) translateX(-1px);
  }

  .white .checkbox:checked + .customLabel {
    background: transparent;
    border-color: #a8acb1;
  }

  .white .checkbox:checked + .customLabel::after {
    border-color: #2d2d2d;
  }

  .item {
    display: flex;
    align-items: center;
    margin: 0 10px 10px 10px;
  }

  .item.disabled {
    opacity: 0.3;
  }

  .item.disabled .label,
  .item.disabled .customLabel {
    cursor: default;
  }

  .inlineItem {
    display: inline-flex;
  }

  .label {
    cursor: pointer;
    margin-left: 15px;
    font-size: 14px;
  }




  ReactDOM.render(
    <div className="abc">
      <Checkbox
        option={{ label: "I am checked", value: "abc", disabled: false }}
        name="ck"
      />
      <Checkbox
        option={{ label: "I am not checked", value: "abc", disabled: false }}
        name="ck"
        defaultChecked={true}
      />
    </div>,
    document.getElementById("root")
  );
```
