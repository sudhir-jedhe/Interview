```js
import React from "react";
import React, { useEffect, useRef, useState } from "react";
import React, { useEffect, useRef, useState } from "react";

// phone number input

// Create a PhoneNumberInput component.

// only accepts numerical digits
// format the number automatically as (123)456-7890 by
// adding the parenthesis when the 4th digit is entered
// also adding - before 7th digit
// You can use the default text input without any styling.

// Follow-up
// What if user removes some digits in the middle, does caret jumps to the end in your approach?


export function PhoneNumberInput() {
  let [value,setValue] = React.useState<string>("");
  let formatNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    let curr = event.currentTarget.value.replace(/\D/g,'');
    if(curr.length > 10) curr = curr.slice(0,10)
    if(curr.length > 6) curr = `${curr.slice(0,6)}-${curr.slice(6)}`
    if(curr.length > 3) curr = `(${curr.slice(0,3)})${curr.slice(3)}`
    setValue(curr);
  }
  return <input data-testid="phone-number-input" value={value} onChange={formatNumber}/>
}



/******************************* */



export function PhoneNumberInput({ maxLength = 10 }) {
  const [input, changeInput] = useState('');
  const inputRef = useRef(null);
  const carretPositionRef = useRef(0);

  const inputChange = (e) => {
    const target = e.target;
    const currentValue = target.value;
    const selectionStart = target.selectionStart;
    const numbers = currentValue.replace(/[^0-9]/g, '');
    const size = numbers.length;

    if (size > maxLength) return;

    const formatedValue = [];
    for (let i = 0; i < size; i++) {
      if (size > 3 && i === 0) {
        formatedValue.push('(');
      }

      formatedValue.push(numbers[i]);

      if (size > 6 && i === 5) {
        formatedValue.push('-');
      }

      if (size > 3 && i === 2) {
        formatedValue.push(')');
      }
    }

    const diff = formatedValue.length - currentValue.length;
    if (selectionStart) {
        carretPositionRef.current = selectionStart + diff;
    }

    changeInput(formatedValue.join(''));
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(carretPositionRef.current, carretPositionRef.current);
    }
  }, [input])

  return <input
    value={input}
    onChange={inputChange}
    ref={inputRef}
    data-testid="phone-number-input"
   />
}

export function App() {
  return <PhoneNumberInput maxLength={10} />;
}


/******************************** */


function formatPhone(str: string) {
    const onlyNumbers = str.replace(/\D/g, '');
    let res = '';
    if(onlyNumbers.length === 0) {
        res = '';
    }
    if(onlyNumbers.length > 0) {
        res+= onlyNumbers.slice(0, 3);
    }
    if(onlyNumbers.length > 3) {
        res= '(' + res + ')'+onlyNumbers.slice(3,6);
    }
    if(onlyNumbers.length > 6) {
        res+= '-'+onlyNumbers.slice(6,10);
    }
    return res;
}
export function PhoneNumberInput() {
    const [value, setValue] = useState('');
    const cursorPositionRef = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = ev.target.value;
        const selectionStart = ev.target.selectionStart;
        const nextValue = formatPhone(currentValue);
        setValue(formatPhone(ev.target.value));
        const diff = nextValue.length - currentValue.length;
        if(selectionStart) {
            cursorPositionRef.current = selectionStart + diff;
        }
    }
    useEffect(() => {
        if(inputRef.current) {
            inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
        }
    }, [value])
    return <input data-testid="phone-number-input" onChange={onChange} value={value} ref={inputRef}/>
}
export default PhoneNumberInput;
```
