# Modeling a plugin system where plugins satisfy multiple capability contracts

You're building a plugin architecture for a data pipeline tool. Plugins can optionally support being "configurable" (accepting settings), "disposable" (needing cleanup), or both — and the pipeline runner needs to check which capabilities a given plugin has at registration time without a giant if/else on plugin names.

**Approach:** Define small, single-purpose interfaces (`Configurable`, `Disposable`) rather than one large `Plugin` interface with optional members, then have concrete plugin classes implement whichever combination applies. This keeps each contract narrow and makes multi-interface implementation a natural fit — a class implementing several small interfaces is far more common, and much less conflict-prone, than a class implementing several large ones.

```typescript
interface Configurable<TOptions> {
  configure(options: TOptions): void;
}

interface Disposable {
  dispose(): void;
}

interface CsvExportOptions {
  delimiter: string;
  includeHeader: boolean;
}

class CsvExportPlugin implements Configurable<CsvExportOptions>, Disposable {
  private delimiter = ",";
  private includeHeader = true;
  private fileHandle: { close(): void } | null = null;

  configure(options: CsvExportOptions): void {
    this.delimiter = options.delimiter;
    this.includeHeader = options.includeHeader;
  }

  dispose(): void {
    this.fileHandle?.close();
    this.fileHandle = null;
  }
}

function isDisposable(plugin: unknown): plugin is Disposable {
  return typeof plugin === "object" && plugin !== null && "dispose" in plugin;
}

function shutdownPlugin(plugin: unknown): void {
  if (isDisposable(plugin)) {
    plugin.dispose();
  }
}
```

This design sidesteps the interface-conflict problem entirely by keeping each interface's member set small and unlikely to collide — `Configurable<TOptions>` and `Disposable` share no member names, so implementing both is friction-free. The one place a conflict *could* arise is if two capability interfaces both wanted, say, a `close(): void` method with different semantics; the practical fix is always to give each interface a distinctly-named method (`disposePlugin()` vs `closeConnection()`) rather than reusing a generic name like `close` across unrelated contracts, since TypeScript will force a single implementation to satisfy both signatures, and same-name-different-meaning is a design smell independent of whether TypeScript happens to allow it structurally.
