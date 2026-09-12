/**
 * Add / edit a user.
 *
 * The validation rules live in `lib/api/mutations.ts`, not here. This form
 * CALLS them so the messages match exactly what the write would refuse —
 * a form with its own copy of the rules is a form that drifts.
 *
 * Errors appear on blur and on submit, never on the first keystroke: telling
 * someone their email is invalid after they have typed "a" is noise.
 */

import { useEffect, useId, useState, type FormEvent } from 'react';

import type { Country, Role, User } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { ROLE_LABELS } from '@/features/auth/permissions';
import { createUser, updateUser, validateUser, type Errors, type UserDraft } from '@/lib/api/mutations';
import { useAuth } from '@/features/auth/AuthProvider';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((r) => ({ value: r, label: ROLE_LABELS[r] }));
const SCOPE_OPTIONS = [
  { value: 'ALL' as const, label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

const EMPTY: UserDraft = { name: '', email: '', role: 'viewer', country: 'Togo' };

export function UserFormModal({
  open,
  user,
  onClose,
}: {
  open: boolean;
  /** null = create */
  user: User | null;
  onClose: () => void;
}) {
  const { user: actor } = useAuth();
  const toast = useToast();
  const formId = useId();

  const [draft, setDraft] = useState<UserDraft>(EMPTY);
  const [errors, setErrors] = useState<Errors<UserDraft>>({});
  const [touched, setTouched] = useState<Set<keyof UserDraft>>(new Set());

  // Reset whenever the dialog opens, so it never shows the previous row.
  useEffect(() => {
    if (!open) return;
    setDraft(
      user
        ? { name: user.name, email: user.email, role: user.role, country: user.country }
        : EMPTY
    );
    setErrors({});
    setTouched(new Set());
  }, [open, user]);

  const set = <K extends keyof UserDraft>(key: K, value: UserDraft[K]) => {
    const next = { ...draft, [key]: value };
    // A super admin is always cross-border; fix it rather than refusing it.
    if (key === 'role' && value === 'super_admin') next.country = 'ALL';
    setDraft(next);
    if (touched.has(key)) setErrors(validateUser(next, user?.id));
  };

  const blur = (key: keyof UserDraft) => {
    const next = new Set(touched);
    next.add(key);
    setTouched(next);
    setErrors(validateUser(draft, user?.id));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const found = validateUser(draft, user?.id);
    setErrors(found);
    setTouched(new Set(Object.keys(draft) as (keyof UserDraft)[]));
    if (Object.keys(found).length > 0) return;

    try {
      if (user) {
        updateUser(user.id, draft, actor);
        toast.success(`${draft.name} updated`);
      } else {
        createUser(draft, actor);
        toast.success(`${draft.name} added`);
      }
      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const shown = (key: keyof UserDraft) => (touched.has(key) ? errors[key] ?? null : null);

  return (
    <Modal
      open={open}
      title={user ? `Edit ${user.name}` : 'Add user'}
      description={
        user
          ? 'Changing a role changes what this person can do immediately — no re-login required.'
          : 'The new account inherits every permission its role carries.'
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {/* `form` associates a button outside the <form> with it, so the
              footer submits for real — no synthesised event, and Enter in
              any field does the same thing the button does. */}
          <Button variant="primary" type="submit" form={formId}>
            {user ? 'Save changes' : 'Add user'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="grid" style={{ gap: 'var(--sp-4)' }}>
        <Input
          label="Full name"
          value={draft.name}
          error={shown('name')}
          onChange={(e) => set('name', e.target.value)}
          onBlur={() => blur('name')}
          autoComplete="off"
        />

        <Input
          label="Email"
          type="email"
          value={draft.email}
          error={shown('email')}
          onChange={(e) => set('email', e.target.value)}
          onBlur={() => blur('email')}
          autoComplete="off"
        />

        <div className="field">
          <span className="field__label">Role</span>
          <Select value={draft.role} options={ROLE_OPTIONS} onChange={(v) => set('role', v)} />
        </div>

        <div className="field">
          <span className="field__label">Country scope</span>
          <Select
            value={draft.country}
            options={SCOPE_OPTIONS}
            onChange={(v) => set('country', v as Country | 'ALL')}
          />
          {shown('country') && <span className="field__error">{errors.country}</span>}
        </div>

        {/* Lets Enter submit without a visible duplicate button. */}
      </form>
    </Modal>
  );
}
