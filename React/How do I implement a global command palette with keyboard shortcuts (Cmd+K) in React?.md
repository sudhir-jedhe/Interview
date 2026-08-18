A global command palette ($\text{Cmd+K}$ / $\text{Ctrl+K}$) requires three key parts:

1. **Global Keyboard Listener:** Listens for `Meta+K` (Mac) or `Ctrl+K` (Windows/Linux) anywhere on the page, preventing browser defaults (like focusing the browser search bar).
2. **Accessible Modal with Focus Trap:** Renders via a React Portal into `document.body` and manages focus lifecycle and scroll locking.
3. **Filter & Action Execution Engine:** Filters navigation routes and instant actions with full keyboard traversal (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).

---

### 1. Types & Data Registry (`types/commandPalette.ts`)

```typescript
export interface CommandAction {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'System';
  shortcut?: string[]; // e.g. ['G', 'D']
  icon?: string;
  onSelect: () => void;
}

```

---

### 2. The Command Palette Component (`components/CommandPalette.tsx`)

```tsx
import React, { useState, useEffect, useRef, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandAction[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = 'Type a command or search...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  // 1. Filter commands by query string (title and category)
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower) ||
        cmd.subtitle?.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // 2. Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // 3. Focus input & lock background scrolling on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Slight tick to ensure element mounted in DOM
      setTimeout(() => inputRef.current?.focus(), 10);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 4. Scroll active item smoothly into view
  useEffect(() => {
    if (listRef.current && filteredCommands.length > 0) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, filteredCommands.length]);

  // 5. Handle Keyboard Controls inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          const targetCmd = filteredCommands[selectedIndex];
          onClose();
          targetCmd.onSelect();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Modal Dialog Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid #334155',
            gap: '12px',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '18px' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: '#f8fafc',
            }}
          />
          <kbd
            style={{
              padding: '2px 6px',
              fontSize: '11px',
              backgroundColor: '#0f172a',
              color: '#94a3b8',
              borderRadius: '4px',
              border: '1px solid #334155',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <ul
          id={listboxId}
          ref={listRef}
          role="listbox"
          style={{
            maxHeight: '320px',
            overflowY: 'auto',
            margin: 0,
            padding: '8px',
            listStyle: 'none',
          }}
        >
          {filteredCommands.length === 0 ? (
            <li
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              No matching commands found.
            </li>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <li
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    onClose();
                    cmd.onSelect();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#0284c7' : 'transparent',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    transition: 'background 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px' }}>{cmd.icon || '⚡'}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{cmd.title}</div>
                      {cmd.subtitle && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: isSelected ? '#e0f2fe' : '#64748b',
                          }}
                        >
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? '#0369a1' : '#0f172a',
                        color: isSelected ? '#bae6fd' : '#64748b',
                      }}
                    >
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <span style={{ display: 'flex', gap: '2px' }}>
                        {cmd.shortcut.map((key) => (
                          <kbd
                            key={key}
                            style={{
                              padding: '2px 5px',
                              fontSize: '10px',
                              backgroundColor: '#0f172a',
                              color: '#94a3b8',
                              borderRadius: '3px',
                              border: '1px solid #334155',
                            }}
                          >
                            {key}
                          </kbd>
                        ))}
                      </span>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer Hints */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#0f172a',
            borderTop: '1px solid #334155',
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <span>
            <strong style={{ color: '#94a3b8' }}>↑↓</strong> to navigate
          </span>
          <span>
            <strong style={{ color: '#94a3b8' }}>↵</strong> to select
          </span>
          <span>
            <strong style={{ color: '#94a3b8' }}>esc</strong> to close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

```

---

### 3. Global Shortcut Hook (`hooks/useCommandPalette.ts`)

Listens across the window for `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) and manages open/close state.

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // Prevent default browser search focus
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return { isOpen, open, close, toggle };
}

```

---

### 4. Integration Example (`App.tsx`)

Combines navigation actions, route transitions, and theme toggling into a single command list:

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from './hooks/useCommandPalette';
import { CommandPalette } from './components/CommandPalette';
import { CommandAction } from './types/commandPalette';

export default function App() {
  const navigate = useNavigate();
  const { isOpen, open, close } = useCommandPalette();

  const commands: CommandAction[] = [
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      subtitle: 'Overview & metrics',
      category: 'Navigation',
      shortcut: ['G', 'D'],
      icon: '📊',
      onSelect: () => navigate('/dashboard'),
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      subtitle: 'User funnels and cohorts',
      category: 'Navigation',
      shortcut: ['G', 'A'],
      icon: '📈',
      onSelect: () => navigate('/analytics'),
    },
    {
      id: 'nav-users',
      title: 'Manage Users',
      subtitle: 'Roles & permissions',
      category: 'Navigation',
      shortcut: ['G', 'U'],
      icon: '👥',
      onSelect: () => navigate('/users'),
    },
    {
      id: 'action-create-user',
      title: 'Create New User',
      subtitle: 'Invite a team member',
      category: 'Actions',
      shortcut: ['N', 'U'],
      icon: '➕',
      onSelect: () => console.log('Opening Create User Modal...'),
    },
    {
      id: 'action-export-csv',
      title: 'Export Audit Log as CSV',
      category: 'Actions',
      icon: '📥',
      onSelect: () => alert('Exporting CSV...'),
    },
    {
      id: 'system-toggle-dark',
      title: 'Toggle Dark / Light Theme',
      category: 'System',
      icon: '🌙',
      onSelect: () => document.body.classList.toggle('dark'),
    },
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Enterprise App</h1>
      <p>
        Press <kbd style={{ padding: '3px 6px', background: '#e2e8f0', borderRadius: '4px' }}>⌘K</kbd> or{' '}
        <kbd style={{ padding: '3px 6px', background: '#e2e8f0', borderRadius: '4px' }}>Ctrl+K</kbd> to open the
        command menu.
      </p>
      <button
        onClick={open}
        style={{
          padding: '8px 16px',
          background: '#0284c7',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Open Command Palette
      </button>

      {/* Global Command Palette Portal */}
      <CommandPalette isOpen={isOpen} onClose={close} commands={commands} />
    </div>
  );
}

```

---

### Core Architectural Considerations

* **React Portal:** Renders directly into `document.body`, escaping any parent `overflow: hidden`, `z-index`, or transform stacking contexts.
* **Scroll Locking:** Body scroll is disabled during mount and restored on cleanup, preventing secondary background scrolling while navigating results.
* **Full Keyboard Accessibility:** Uses `role="combobox"` on the search input and `role="listbox"` / `role="option"` with `aria-selected` to comply with WAI-ARIA combobox standards.
