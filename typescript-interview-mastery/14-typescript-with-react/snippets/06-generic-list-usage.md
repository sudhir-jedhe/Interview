# Using a generic List component with inferred item type

```tsx
// Snippet: T is inferred from `items`, propagating into renderItem/keyExtractor
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

interface Tag {
  id: string;
  label: string;
}

const tags: Tag[] = [{ id: "t1", label: "urgent" }];

<List items={tags} keyExtractor={(t) => t.id} renderItem={(t) => <b>{t.label}</b>} />;
```
