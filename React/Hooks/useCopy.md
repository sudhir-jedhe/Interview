// mplement an useCopy() hook in React that copies the given text to the clipboard.

// The useCopy() method returns a method copy(text) which accepts the text as input and copies that text and the copied text.

```js
import { useState } from "react";

const useCopy = () => {
  const [copiedText, setCopiedText] = useState();

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.error(`Failed copying the text ${text}`, error);
      setCopiedText(null);
    }
  };

  return [copiedText, copy];
};




Input:
function Example() {
  // call the hook which returns, copied text and the copy function
  const [copiedText, copy] = useCopy();
  return <button onClick={() => copy("Hello World!")}> "copiedText" : {copiedText}</button>;
}

export default Example;

Output:
copiedText:  // initially
copiedText: Hello World! // after click
```
