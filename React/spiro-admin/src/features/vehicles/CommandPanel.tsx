/**
 * Over-the-air command controls.
 *
 * Immobilising a motorcycle is not a UI affordance, it is an action with a
 * person on the other end of it, so:
 *
 *   - the destructive commands take a typed confirmation step;
 *   - the confirmation states what will actually happen, including the case
 *     where it will FAIL (an offline vehicle, a moving one);
 *   - the result is reported per vehicle, not as a single "done";
 *   - everything, success or failure, lands in the audit trail.
 *
 * The whole panel is behind `vehicle:control`. A viewer sees the vehicle's
 * state but no switches at all — a disabled button that can never become
 * enabled is just noise.
 */

import { useState } from 'react';

import type { CommandKind, CommandRecord, Vehicle } from '@/types/domain';
import { COMMAND_LABELS, DESTRUCTIVE, sendCommand } from '@/lib/api/commands';
import { useAuth } from '@/features/auth/AuthProvider';

import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';

interface Spec {
  kind: CommandKind;
  label: string;
  icon: 'lock' | 'unlock' | 'refresh' | 'file' | 'clock';
  description: string;
  danger?: boolean;
}

const SINGLE: Spec[] = [
  {
    kind: 'immobilize',
    label: 'Immobilise',
    icon: 'lock',
    description:
      'Cuts drive power and locks the engine. The platform refuses this above 5 km/h — a motorcycle that loses drive mid-junction is a crash, not a recovery.',
    danger: true,
  },
  {
    kind: 'unlock',
    label: 'Remote unlock',
    icon: 'unlock',
    description: 'Restores drive power and releases the immobiliser.',
  },
  {
    kind: 'bms_reboot',
    label: 'BMS reboot',
    icon: 'refresh',
    description:
      'Power-cycles the battery management system. The pack reports nothing for roughly 20 seconds, and any charge session in progress ends.',
    danger: true,
  },
];

export function CommandPanel({ vehicle }: { vehicle: Vehicle }) {
  const { user } = useAuth();
  const toast = useToast();

  const [pending, setPending] = useState<Spec | null>(null);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<CommandRecord | null>(null);

  const run = async (spec: Spec) => {
    setBusy(true);
    const [record] = await sendCommand({ kind: spec.kind, vehicles: [vehicle], actor: user });
    setBusy(false);
    setPending(null);

    if (!record) return;
    setLast(record);

    if (record.status === 'acknowledged') toast.success(`${spec.label}: ${record.detail}`);
    else toast.error(`${spec.label} failed — ${record.detail}`);
  };

  return (
    <div className="grid" style={{ gap: 'var(--sp-3)' }}>
      <div className="row" style={{ gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
        {SINGLE.map((spec) => (
          <Button
            key={spec.kind}
            variant={spec.danger ? 'danger' : 'secondary'}
            icon={spec.icon}
            disabled={busy}
            onClick={() => (DESTRUCTIVE.includes(spec.kind) ? setPending(spec) : void run(spec))}
          >
            {spec.label}
          </Button>
        ))}
      </div>

      {vehicle.status === 'offline' && (
        <p className="row" style={{ gap: 'var(--sp-2)', margin: 0, color: 'var(--status-warning)', fontSize: 'var(--fs-sm)' }}>
          <Icon name="alert" size={14} />
          This vehicle is offline. A command will be queued and will fail on timeout — it is not
          silently dropped, and the attempt is recorded either way.
        </p>
      )}

      {last && (
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
          Last command <strong>{COMMAND_LABELS[last.kind]}</strong> —{' '}
          <span style={{ color: last.status === 'acknowledged' ? 'var(--status-good)' : 'var(--status-critical)' }}>
            {last.status}
          </span>
          . {last.detail}
        </p>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending ? `${pending.label} ${vehicle.vehicleNo}?` : ''}
        description={pending?.description}
        confirmLabel={pending?.label ?? 'Confirm'}
        danger
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && void run(pending)}
      >
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
          Vehicle is currently <strong>{vehicle.status}</strong>, {vehicle.motion}, ignition{' '}
          <strong>{vehicle.ignition ? 'on' : 'off'}</strong>. This action is recorded against your
          account in the audit trail.
        </p>
      </ConfirmDialog>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bulk
 * ------------------------------------------------------------------ */

const BULK: Spec[] = [
  {
    kind: 'firmware_update',
    label: 'Push firmware update',
    icon: 'file',
    description:
      'Queues a firmware image to every selected vehicle. Vehicles apply it on the next key-off; offline vehicles will fail and can be retried.',
    danger: true,
  },
  {
    kind: 'curfew',
    label: 'Push curfew schedule',
    icon: 'clock',
    description:
      'Sets the operating window on every selected vehicle. Outside the window the motor is limited; riders are not stranded, they are slowed.',
  },
  {
    kind: 'immobilize',
    label: 'Immobilise all selected',
    icon: 'lock',
    description:
      'Cuts drive on every selected vehicle. Any that are moving above 5 km/h will refuse the command and are reported separately.',
    danger: true,
  },
];

/** The bar that appears above a table once rows are ticked. */
export function BulkCommandBar({
  vehicles,
  onClear,
}: {
  vehicles: Vehicle[];
  onClear: () => void;
}) {
  const { user } = useAuth();
  const toast = useToast();

  const [pending, setPending] = useState<Spec | null>(null);
  const [busy, setBusy] = useState(false);

  if (vehicles.length === 0) return null;

  const offline = vehicles.filter((v) => v.status === 'offline').length;

  const run = async (spec: Spec) => {
    setBusy(true);
    const records = await sendCommand({ kind: spec.kind, vehicles, actor: user });
    setBusy(false);
    setPending(null);

    const ok = records.filter((r) => r.status === 'acknowledged').length;
    const failed = records.length - ok;

    // Reported as two numbers, never as "done": a bulk action that half
    // worked is the normal case, not the exception.
    if (failed === 0) toast.success(`${spec.label}: all ${ok} acknowledged`);
    else if (ok === 0) toast.error(`${spec.label}: all ${failed} failed`);
    else toast.show(`${spec.label}: ${ok} acknowledged, ${failed} failed`, 'warning');
  };

  return (
    <div className="bulkbar">
      <strong>{vehicles.length} selected</strong>
      {offline > 0 && (
        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
          {offline} offline and will fail
        </span>
      )}

      <span className="spacer" />

      {BULK.map((spec) => (
        <Button
          key={spec.kind}
          size="sm"
          variant={spec.danger ? 'danger' : 'secondary'}
          icon={spec.icon}
          disabled={busy}
          onClick={() => setPending(spec)}
        >
          {spec.label}
        </Button>
      ))}

      <Button size="sm" variant="ghost" onClick={onClear} disabled={busy}>
        Clear
      </Button>

      <ConfirmDialog
        open={pending !== null}
        title={pending ? `${pending.label} — ${vehicles.length} vehicles?` : ''}
        description={pending?.description}
        confirmLabel={`Send to ${vehicles.length}`}
        danger
        pending={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && void run(pending)}
      >
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
          <p style={{ marginTop: 0 }}>
            {vehicles
              .slice(0, 12)
              .map((v) => v.vehicleNo)
              .join(', ')}
            {vehicles.length > 12 && ` and ${vehicles.length - 12} more`}
          </p>
          <p style={{ marginBottom: 0 }}>
            Every attempt is written to the audit trail against your account.
          </p>
        </div>
      </ConfirmDialog>
    </div>
  );
}
