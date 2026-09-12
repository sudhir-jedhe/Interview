/**
 * Audit trail.
 *
 * Every action that changes state or touches a vehicle in the field gets an
 * entry — including the ones that FAILED. An audit log that only records
 * successes cannot answer "who tried to immobilise the fleet at 02:00", which
 * is the question audit logs exist to answer.
 */

import type { AuditEntry, Role, User } from '@/types/domain';
import { db } from '@/lib/mock/db';

let seq = 0;

export interface AuditInput {
  actor: User | null;
  action: string;
  targetType: AuditEntry['targetType'];
  targetId: string;
  targetLabel: string;
  detail: string;
  result?: 'success' | 'failure';
}

export function recordAudit({
  actor,
  action,
  targetType,
  targetId,
  targetLabel,
  detail,
  result = 'success',
}: AuditInput): AuditEntry {
  const entry: AuditEntry = {
    id: `aud-${Date.now()}-${++seq}`,
    at: Date.now(),
    actorId: actor?.id ?? 'system',
    actorName: actor?.name ?? 'System',
    actorRole: (actor?.role ?? 'super_admin') as Role,
    action,
    targetType,
    targetId,
    targetLabel,
    detail,
    result,
  };

  db.pushAudit(entry);
  return entry;
}
