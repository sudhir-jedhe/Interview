// Removing the load from the main processing thread and lazy loading the scripts dynamically is an important way of boosting performance.

// Keeping the initial script as small as possible results in faster processing. Thus all other unimportant scripts can be loaded separately as and when required.

// For example, the Google Adsense script is not required to be part of the main bundle, it can be loaded separately using the useScript() hook.

// useScript() hook loads any given script if it is not already loaded.

// We use the src and traverse the DOM and check if it exists, if it is not then we can create a new script and inject it into the body.

// Also, assign the load and error listener on the script to monitor if it is properly loaded or not. Depending upon the response from the listeners, update the status.

```js
function useScript(src) {
  // keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(() => {
    // if not url provided, set the state to be idle
    if (!src) {
      setStatus("idle");
      return;
    }

    // get the script to check if it is already sourced or not
    let script = document.querySelector(`script[src="${src}"]`);

    if (!script) {
      // create script
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      // inject the script at the end of the body
      document.body.appendChild(script);

      // set the script status in a custom attribute
      const setAttributeFromEvent = (event) => {
        script.setAttribute(
          "data-status",
          event.type === "load" ? "ready" : "error",
        );
      };

      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    } else {
      // if the script is already loaded, get its status and update.
      setStatus(script.getAttribute("data-status"));
    }

    // update the script status
    const setStateFromEvent = (event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    // setup
    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    // clean up
    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    };
  }, [src]);

  return status;
}
```
