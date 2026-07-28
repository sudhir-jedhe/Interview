```js
import PhoneInput from "./PhoneInput";
import React, { useState } from "react";

// src/App.js

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div>
      <h1>Phone Number Input</h1>
      <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
      <p>Entered Phone Number: {phoneNumber}</p>
    </div>
  );
};

export default App;
```
