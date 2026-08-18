# Basic numeric enum with auto-increment

```typescript
// Values auto-assign starting at 0 unless overridden
enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

function log(level: LogLevel, message: string): void {
  console.log(`[${LogLevel[level]}] ${message}`);
}

log(LogLevel.Warn, "disk space low"); // [Warn] disk space low
```
