```js
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const FileUploader = props => {
  const handleOnChange = event => {
    const { value } = event.target;
    const { onChange, name } = props;
    onChange && onChange({ value, name, event });
  };

  const {
    className,
    inputClassName,
    labelClassName,
    label,
    readOnly,
    error,
    helperText
  } = props;

  const _className = cx(styles.uploadBtnWrapper, className);

  const _inputClassName = cx(styles.input, inputClassName);

  const _labelClassName = cx(styles.label, labelClassName, {
    [styles.error]: error,
    [styles.readonly]: readOnly
  });

  const _helperTextClassName = cx(styles.helperText, { [styles.error]: error });

  let _props = {
    disabled: readOnly,
    className: _inputClassName,
    onChange: handleOnChange
  };

  return (
    <div className={_className}>
      {label ? <label className={_labelClassName}>{label}</label> : null}

      <input {..._props} type="file" />

      {helperText && helperText.length ? (
        <span className={_helperTextClassName}>{helperText}</span>
      ) : null}
    </div>
  );
};

FileUploader.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  /* Will be applied to container */
  className: PropTypes.string,
  /* Will be applied to underlying input tag */
  inputClassName: PropTypes.string,
  /* Will be applied to label */
  labelClassName: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

FileUploader.defaultProps = {
  className: "",
  inputClassName: "",
  labelClassName: "",
  label: "Choose File",
  readOnly: false
};

export default FileUploader;


//index.module.css
.uploadBtnWrapper {
    display: inline-flex;
    margin: 5px 0px;
    overflow: hidden;
    position: relative;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }

  label {
    border: 1px solid;
    color: #8bc34a;
    background-color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
  }

  input[type="file"] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    margin: 0;
  }

  .readonly {
    color: #eee !important;
  }

  .helperText {
    margin-left: 10px;
    font-weight: 600;
    font-size: 14px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
    position: relative;
    color: #7cb342;
  }

  .error {
    color: #eb5055;
  }


  ReactDOM.render(
    <div className="abc">
      <FileUploader name="file" />
      <FileUploader
        name="error"
        label="Upload"
        helperText="There is some error"
        error={true}
      />
      <FileUploader name="disabled" label="Disabled" readOnly={true} />
    </div>,
    document.getElementById("root")
  );
```
