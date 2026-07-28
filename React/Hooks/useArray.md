```js
import { useCallback, useMemo, useState } from "react";

type UseArrayActions<T> = {
  push: (item: T) => void,
  removeByIndex: (index: number) => void
}
export function useArray<T>(initialValue: T[]): { value: T[] } & UseArrayActions<T> {
  const [value, setValue] = useState<T[]>(initialValue);
  const push = useCallback((item: T) => setValue((prev) => [...prev, item]), []);
  const removeByIndex = useCallback((index: number) => setValue((prev) => {
    const copy = prev.slice();
    copy.splice(index, 1);
    return copy;
  }), []);
  return useMemo(() => ({ value, push, removeByIndex }), [value, push, removeByIndex]);
}
```
