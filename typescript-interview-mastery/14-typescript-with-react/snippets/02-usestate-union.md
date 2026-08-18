# useState with an explicit union generic

```tsx
// Snippet: without <Status>, this would infer only the literal "idle"
type Status = "idle" | "loading" | "success" | "error";

function UploadWidget() {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <button onClick={() => setStatus("loading")} disabled={status === "loading"}>
      {status === "loading" ? "Uploading..." : "Upload"}
    </button>
  );
}
```
