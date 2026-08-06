The `EventListener` options object in modern JavaScript offers flexibility for handling events. Here’s a breakdown of how to create event listeners that execute only once and how to implement similar functionality in older browsers or with jQuery.

---

### **Modern Implementation: Using `{ once: true }`**

The `once` option in the `addEventListener` method ensures that the event handler is invoked at most once for a given event on an element. After the first call, the listener is automatically removed.

#### Example:
```html
<button id="my-btn">Click me!</button>
<script>
  const listenOnce = (el, evt, fn) =>
    el.addEventListener(evt, fn, { once: true });

  listenOnce(
    document.getElementById('my-btn'),
    'click',
    () => console.log('Hello!')
  );
  // 'Hello!' will only be logged on the first click
</script>
```

#### **Browser Support**:
- Supported in most modern browsers.
- **Not supported** in older browsers like Internet Explorer.

---

### **Legacy Implementation: Flag-Based Approach**

To ensure compatibility with older browsers, you can implement similar functionality using a flag. The flag tracks whether the event has been handled, and subsequent calls to the handler are ignored.

#### Example:
```html
<button id="my-btn">Click me!</button>
<script>
  const listenOnce = (el, evt, fn) => {
    let fired = false;
    el.addEventListener(evt, (e) => {
      if (!fired) fn(e); // Execute the handler only once
      fired = true;
    });
  };

  listenOnce(
    document.getElementById('my-btn'),
    'click',
    () => console.log('Hello!')
  );
  // 'Hello!' will only be logged on the first click
</script>
```

#### **Compatibility**:
- Works across all browsers, including Internet Explorer.
- May require transpilation for modern JavaScript features like arrow functions (`=>`).

---

### **Using jQuery**

In earlier web development, jQuery provided an elegant API for event handling, including the `.one()` method to execute an event handler at most once for a specific event.

#### Example:
```html
<button id="my-btn">Click me!</button>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
  $('#my-btn').one('click', () => {
    console.log('Hello!'); // 'Hello!' will only be logged on the first click
  });
</script>
```

#### **Modern Relevance**:
- Although still functional, jQuery is less commonly used today due to improved native browser APIs.
- Use this approach only if your project already relies on jQuery.

---

### **Key Points to Remember**
1. **Modern Preference**: Use `{ once: true }` for simplicity and performance if targeting modern browsers.
2. **Backward Compatibility**: Use a flag-based solution for older browsers like Internet Explorer.
3. **jQuery**: Still valid but not recommended for new projects unless already part of the tech stack.

Would you like further examples or a deeper dive into the trade-offs between these methods?