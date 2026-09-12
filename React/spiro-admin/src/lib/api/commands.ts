/**
 * Over-the-air commands.
 *
 * These do NOT travel on the telemetry feed — that stream is one-directional
 * by design (see lib/realtime/client.ts). A command is a request; its
 * acknowledgement comes back asynchronously, which is why every command
 * returns a record that starts `queued` and settles later rather than a
 * boolean.
 *
 * Three properties this models honestly:
 *
 *   1. A command to an OFFLINE vehicle cannot succeed. It is accepted and
 *      then fails on timeout — which is what the field does. Pretending it
 *      worked is how a dispatcher ends up believing a stolen bike is locked.
 *   2. Immobilisation is refused above 5 km/h. Cutting drive to a moving
 *      motorcycle is dangerous, and the check belongs in the platform, not
 *      in an operator's head.
 *   3. Every attempt is audited, successes and failures alike.
 */

import type { CommandKind, CommandRecord, User, Vehicle } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { recordAudit } from '@/lib/audit';

export const COMMAND_LABELS: Record<CommandKind, string> = {
  immobilize: 'Immobilise / lock engine',
  unlock: 'Remote unlock',
  bms_reboot: 'BMS reboot',
  firmware_update: 'Firmware update',
  curfew: 'Push curfew schedule',
};

/** Commands that stop a vehicle moving need a second confirmation. */
export const DESTRUCTIVE: CommandKind[] = ['immobilize', 'bms_reboot', 'firmware_update'];

const settleDelay = () => 900 + Math.random() * 1600;

export interface SendCommandOptions {
  kind: CommandKind;
  vehicles: Vehicle[];
  actor: User | null;
  detail?: string;
}

/**
 * Issue a command to one or many vehicles.
 *
 * Resolves when every command has settled, so a bulk operation can report
 * "18 acknowledged, 4 failed" rather than leaving the operator guessing.
 */
export async function sendCommand({
  kind,
  vehicles,
  actor,
  detail = '',
}: SendCommandOptions): Promise<CommandRecord[]> {
  const issuedAt = Date.now();

  const records: CommandRecord[] = vehicles.map((vehicle, i) => ({
    id: `cmd-${issuedAt}-${i}`,
    kind,
    vehicleId: vehicle.id,
    vehicleNo: vehicle.vehicleNo,
    status: 'queued',
    issuedAt,
    settledAt: null,
    issuedBy: actor?.name ?? 'System',
    detail,
  }));

  db.commit(() => {
    db.commands = [...records, ...db.commands].slice(0, 500);
  });

  const settled = await Promise.all(
    records.map(
      (record, i) =>
        new Promise<CommandRecord>((resolve) => {
          const vehicle = vehicles[i]!;

          setTimeout(() => {
            let status: CommandRecord['status'] = 'acknowledged';
            let outcome = 'Acknowledged by the vehicle';

            if (vehicle.status === 'offline') {
              status = 'failed';
              outcome = 'No response — vehicle is offline';
            } else if (kind === 'immobilize' && vehicle.motion === 'running' && vehicle.avgVelocity > 5) {
              status = 'failed';
              outcome = 'Refused — vehicle is in motion above 5 km/h';
            } else if (Math.random() < 0.05) {
              status = 'failed';
              outcome = 'Timed out waiting for acknowledgement';
            }

            if (status === 'acknowledged') {
              // The command actually changes the fleet, so every screen
              // showing this vehicle updates.
              db.commit(() => {
                if (kind === 'immobilize') {
                  vehicle.ignition = false;
                  vehicle.motion = 'stopped';
                } else if (kind === 'unlock') {
                  vehicle.ignition = true;
                }
              });
            }

            db.commit(() => {
              record.status = status;
              record.settledAt = Date.now();
              record.detail = outcome;
              db.commands = [...db.commands];
            });

            recordAudit({
              actor,
              action: COMMAND_LABELS[kind],
              targetType: 'vehicle',
              targetId: vehicle.id,
              targetLabel: vehicle.vehicleNo,
              detail: outcome,
              result: status === 'acknowledged' ? 'success' : 'failure',
            });

            resolve(record);
          }, settleDelay());
        })
    )
  );

  return settled;
}
