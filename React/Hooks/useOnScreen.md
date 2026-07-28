// Lazy loading can drastically boost the performance as we will be loading things as and when required rather than pulling everything in bulk.

// For example, for a component that is not visible yet on the viewport, it makes no sense to load the media files like images, video, audio, or any large data.

// Thus we can use the useOnScreen() hook to determine if the component is visible and is in the viewport then perform the necessary action.

// We can use the Intersection observer API to implement this. Create a reference to the component using useRef() hook and then observe this reference, if it is intersecting, update the state that it is visible.

```js
function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  // monitor the interaction
  const observer = new IntersectionObserver(([entry]) => {
    // update the state on interaction change
    setIntersecting(entry.isIntersecting);
  });

  useEffect(() => {
    // assign the observer
    observer.observe(ref.current);

    // remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
```
