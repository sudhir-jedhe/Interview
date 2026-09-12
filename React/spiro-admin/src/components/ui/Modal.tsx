/**
 * Modal dialog.
 *
 * The three things a hand-rolled modal almost always gets wrong, all fixed
 * here because they are what separate a dialog from a floating div:
 *
 *   1. FOCUS TRAP. Tab must cycle inside the dialog. Without it a keyboard
 *      user tabs straight out into the page behind and cannot get back.
 *   2. FOCUS RESTORE. On close, focus returns to whatever opened it —
 *      otherwise it lands on <body> and the next Tab starts from the top.
 *   3. SCROLL LOCK. The page behind must not scroll under the overlay.
 *
 * Plus Escape to dismiss, a backdrop click, `aria-modal`, and a labelled
 * title. It renders in place rather than through a portal: the app has no
 * nested stacking contexts that would clip it, and a portal would add a
 * mount/unmount race for no benefit here.
 */

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export function Modal({ open, title, description, onClose, children, footer, width = 520 }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first control, not the dialog itself — a screen reader then
    // announces the field rather than an empty container.
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialogRef.current)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const firstNode = nodes[0]!;
      const lastNode = nodes[nodes.length - 1]!;

      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        style={{ width: `min(${width}px, calc(100vw - 32px))` }}
        // Stops a click that started inside the dialog from closing it.
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>

        {description && (
          <p id={descId} className="modal__desc">
            {description}
          </p>
        )}

        <div className="modal__body">{children}</div>

        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

/** A confirm dialog with a named action. Used for anything destructive. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = false,
  pending = false,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      width={460}
      footer={
        <>
          <button className="btn btn--secondary" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
          <button
            className={danger ? 'btn btn--danger' : 'btn btn--primary'}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
