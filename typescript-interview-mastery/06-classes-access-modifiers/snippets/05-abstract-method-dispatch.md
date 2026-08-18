# Abstract class enforcing a method every subclass must define

```typescript
// Notifier can't be instantiated; each channel implements send() its own way
abstract class Notifier {
  abstract send(message: string): void;

  notifyAll(messages: string[]): void {
    messages.forEach((m) => this.send(m));
  }
}

class ConsoleNotifier extends Notifier {
  send(message: string): void {
    console.log(`[console] ${message}`);
  }
}

const notifier: Notifier = new ConsoleNotifier();
notifier.notifyAll(["deploy started", "deploy finished"]);
```
