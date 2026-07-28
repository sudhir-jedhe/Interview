// DOM parsing and painting is a very expensive operation and should be avoided as much as possible for faster loading of application.

// Generating the DOM and hiding it with the CSS for different screen sizes is still costly, rather than using CSS with React you can dynamically render the components.

// Using useResponsive() hook we can determine the device screen size and accordingly render the components.

// For this, we are listening to the window resize event using a debounce call and updating the state if the size changes.

```js
const useResponsive = () => {
    // screen resolutions
    const [state, setState] = useState({
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    });

    useEffect(() => {
      // update the state on the initial load
      onResizeHandler();

      // assign the event
      Setup();

      return () => {
        // remove the event
        Cleanup();
      };
    }, []);

    // update the state on window resize
    const onResizeHandler = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth <= 990;
      const isDesktop = window.innerWidth > 990;

      setState({ isMobile, isTablet, isDesktop });
    };

    // debounce the resize call
    const debouncedCall = useDebounce(onResizeHandler, 500);

    // add event listener
    const Setup = () => {
      window.addEventListener("resize", debouncedCall, false);
    };

    // remove the listener
    const Cleanup = () => {
      window.removeEventListener("resize", debouncedCall, false);
    };

    return state;
  };



  Input:
const Example = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  console.log(isMobile, isTablet, isDesktop);

  return <></>;
};

Output:
false, false, true
```
