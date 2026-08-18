# Static field shared across all instances

```typescript
// static belongs to the class, not to any one instance
class Widget {
  private static count = 0;

  constructor(public name: string) {
    Widget.count++;
  }

  static getCount(): number {
    return Widget.count;
  }
}

new Widget("Button");
new Widget("Slider");
console.log(Widget.getCount()); // 2
```
