# Snippets: useRef & DOM Access

```jsx
// Focusing an input on mount
function AutoFocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <input ref={inputRef} />;
}
```

```jsx
// Mutating a ref does NOT trigger a re-render — the displayed count won't change on click
function ClickCounterBroken() {
  const clicks = useRef(0);
  return (
    <button onClick={() => { clicks.current += 1; console.log(clicks.current); }}>
      Clicked {clicks.current} times (stale in UI)
    </button>
  );
}
```

```jsx
// Tracking a previous prop/state value across renders
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Score({ score }) {
  const prevScore = usePrevious(score);
  return <p>Now: {score}, before: {prevScore ?? 'n/a'}</p>;
}
```

```jsx
// Storing an interval ID in a ref to clear it from a different handler
function StopwatchButton() {
  const intervalRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

```jsx
// forwardRef so a parent can focus a custom input component
const CustomInput = forwardRef(function CustomInput(props, ref) {
  return <input ref={ref} {...props} className="custom-input" />;
});

function Form() {
  const ref = useRef(null);
  return (
    <>
      <CustomInput ref={ref} placeholder="Name" />
      <button onClick={() => ref.current.focus()}>Focus name field</button>
    </>
  );
}
```

```jsx
// useImperativeHandle exposing a restricted API instead of the raw DOM node
const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
  }));
  return <video ref={videoRef} src={props.src} />;
});
```

```jsx
// Reading an element's size after layout, without storing it in re-render-triggering state
function MeasureOnClick() {
  const boxRef = useRef(null);

  const logSize = () => {
    const rect = boxRef.current.getBoundingClientRect();
    console.log(rect.width, rect.height);
  };

  return (
    <div>
      <div ref={boxRef} style={{ width: '50%', height: 100, background: '#eee' }} />
      <button onClick={logSize}>Log size</button>
    </div>
  );
}
```
