<https://react.dev/reference/react-dom/components/progress>

Here is the recreated and cleanly formatted reference guide for the built-in React `<progress>` component, based on the official documentation.

# The `<progress>` Component

The built-in browser `<progress>` component lets you render a progress indicator (like a loading bar) to show the completion status of a task.

```jsx
<progress value={0.5} />

```

---

## Props Reference

The `<progress>` component supports all standard HTML element props. Additionally, it supports these specific props:

* **`max`** *(number)*: Specifies the maximum value of the progress bar. If not provided, it defaults to `1`.
* **`value`** *(number | null)*: Specifies how much of the task has been completed. This must be a number between `0` and `max`. If you pass `null`, the progress bar enters an **indeterminate** state (useful when a task is ongoing but the exact completion percentage is unknown).

---

## Usage Guide

### Controlling a Progress Indicator

To display a progress indicator, render the `<progress>` component and pass a `value` representing the current progress.

* If your progress is represented as a percentage (0 to 100), make sure to pass `max={100}`.
* If the operation is ongoing but you do not yet know the progress, pass `value={null}` to show an indeterminate loading animation.

```jsx
export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 0% complete (defaults to max 1) */}
      <progress value={0} />
      
      {/* 50% complete */}
      <progress value={0.5} />
      
      {/* 70% complete */}
      <progress value={0.7} />
      
      {/* 75% complete on a 0-100 scale */}
      <progress value={75} max={100} />
      
      {/* 100% complete */}
      <progress value={1} />
      
      {/* Indeterminate state (unknown progress) */}
      <progress value={null} />
    </div>
  );
}

```
