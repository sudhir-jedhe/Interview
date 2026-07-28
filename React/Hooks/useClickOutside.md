```js
import React, { useEffect, useRef } from "react";
import React, { RefObject, useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(callback: () => void): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const click = ({ target }: Event): void => {
      if (target && ref.current && !ref.current.contains(target as Node)) {
        callback()
      }
    }
    document.addEventListener('mousedown', click)

    return () => {
      document.removeEventListener('mousedown', click)
    }
  }, [])
  return ref
}


/************************** */


// This is a React coding question from BFE.dev
export function useClickOutside<T extends HTMLElement>(callback: () => void): RefObject<T> {
  // your code here
  const ref = useRef<T>(null);
  const click = (event: Event) => {
    const target = event.target as Node;
    if (target && ref.current && !ref.current.contains(target)) return callback();
  };
  useEffect(() => {
    document.addEventListener('click', click, false);
    return () => document.removeEventListener('click', click, false);
  }, []);
  return ref;
}
// to try your code on the right panel
// export App() component like below
export function App() {
  const clickRef: RefObject<HTMLDivElement> = useClickOutside(() => {
    alert('clicked outside');
    console.log('clicked outside');
  })
  return <div style= {{border: '1px solid red'}} ref={clickRef} >your app</div>
}



function useOnClickOutside(ref, callback) {

  useEffect(
    () => {
      const listener = (event) => {
        // if the referenece is not present
        // or the target is descendant of the refefence
        // return
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        // invoke the callback
        callback(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    // add ref and callback to effect dependencies
    [ref, callback]
  );
}


Input:
function Example() {
  const ref = useRef();
  useOnClickOutside(ref, () => {
    console.log("Clicked");
  });

  return (
    <div>
      <p>Outside Click me!</p>
      <p ref={ref}>Click me!</p>
    </div>
  );
}

Output:
"Clicked" // when clicked on Outside Click me!
```
