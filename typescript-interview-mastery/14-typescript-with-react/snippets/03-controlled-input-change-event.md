# A controlled input with a properly typed change handler

```tsx
// Snippet: React.ChangeEvent<HTMLInputElement> for a controlled text input
function EmailField() {
  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return <input type="email" value={email} onChange={handleChange} />;
}
```
