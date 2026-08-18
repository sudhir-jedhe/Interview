```tsx
function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const playImmediately = () => {
    videoRef.current.play();
  };

  playImmediately(); // called directly in the component body, not an event handler

  return <video ref={videoRef} src={src} />;
}
```

Does this compile? Would it work correctly at runtime even if it did?

**Answer:** It does not compile: `videoRef.current.play()` fails with `Object is possibly 'null'`, because `useRef<HTMLVideoElement>(null)` types `.current` as `HTMLVideoElement | null`. Even setting that aside, calling `playImmediately()` synchronously during the component's render/body would fail at runtime regardless, since the `<video>` element hasn't been mounted yet at that point — `videoRef.current` is genuinely `null` during the render phase.

**Why:** This demonstrates two separate but related problems the ref's type correctly warns about. First, `HTMLVideoElement | null` forces a null check (`videoRef.current?.play()` or an `if` guard) before use — that's the type system doing its job, since `.current` really can be `null`. Second, even with the null check added, calling it unconditionally during render (rather than inside an event handler or a `useEffect` that runs after mount) means it would always be `null` at that exact call time, since refs are only populated by React after the DOM has actually been committed. The type error here is a genuine signal pointing at a real logic bug — imperative DOM access belongs in an event handler or `useEffect`, never directly in the render body.
