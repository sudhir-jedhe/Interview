/**
 * Bulk import, with duplicate detection.
 *
 * The whole point of this module is the DRY RUN. Nothing is written until the
 * file has been parsed, mapped, validated and checked against what is already
 * in the database — and the user has seen the counts. An importer that writes
 * as it reads leaves you half-imported when row 400 turns out to be malformed.
 *
 * Duplicates are caught in two places, and they are different problems:
 *
 *   WITHIN THE FILE     the same IMEI twice in one upload. Someone
 *                       concatenated two exports. The first wins.
 *   AGAINST THE DATABASE the record already exists. Either skip it or update
 *                       it — the caller chooses, and the default is skip,
 *                       because silently overwriting live records from a
 *                       spreadsheet is how a fleet loses its data.
 *
 * Matching is on a NATURAL KEY, not on the row's `id` column: a file exported
 * from another system has its ids, not yours. For a vehicle that key is the
 * IMEI (the device's identity on the network) plus the registration; for a
 * user it is the email.
 */

import type { User } from '@/types/domain';
import { COUNTRIES, VEHICLE_MODELS } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { recordAudit } from '@/lib/audit';
import type { Row } from '@/lib/utils/parse';
import {
  createUser,
  createVehicle,
  updateUser,
  updateVehicle,
  validateUser,
  validateVehicle,
  type UserDraft,
  type VehicleDraft,
} from './mutations';

export type DuplicateMode = 'skip' | 'update';

export interface ImportField {
  /** The heading written into the template and shown in the dialog. */
  header: string;
  /** Other spellings accepted, matched case- and space-insensitively. */
  aliases: string[];
  required: boolean;
  example: string;
  hint?: string;
}

export interface ImportSpec<TDraft> {
  entity: string;
  fields: ImportField[];
  /** Map a parsed row to a draft. Throws a plain Error with the reason. */
  toDraft: (get: (header: string) => string) => TDraft;
  /** What makes two records "the same". */
  naturalKey: (draft: TDraft) => string;
  /**
   * Field errors, exactly as the form would show them. `existingId` excludes
   * a record from its own uniqueness check — without it, every row that
   * matches an existing record fails validation as a duplicate and can never
   * reach the update path.
   */
  validate: (draft: TDraft, existingId?: string) => Record<string, string | undefined>;
  /** The id of an existing record with this key, or null. */
  findExisting: (draft: TDraft) => string | null;
  create: (draft: TDraft, actor: User | null) => void;
  update: (id: string, draft: TDraft, actor: User | null) => void;
}

export interface RejectedRow {
  line: number;
  reason: string;
  preview: string;
}

export interface ImportPlan<TDraft> {
  create: { line: number; draft: TDraft }[];
  update: { line: number; id: string; draft: TDraft }[];
  duplicatesInFile: RejectedRow[];
  existing: { line: number; id: string; draft: TDraft; key: string }[];
  rejected: RejectedRow[];
  totalRows: number;
  unknownColumns: string[];
}

/** Normalise a heading so "Vehicle No", "vehicle_no" and "vehicleNo" match. */
const normalise = (key: string) => key.toLowerCase().replace(/[\s_-]+/g, '');

/**
 * Build a lookup from the parsed row's actual headings to the spec's fields.
 * Doing this once per row keeps the mapping O(fields) rather than O(fields ×
 * headings) for every cell.
 */
function fieldReader(row: Row, fields: ImportField[]) {
  const byNormalised = new Map<string, string>();
  for (const [key, value] of Object.entries(row)) byNormalised.set(normalise(key), value);

  return (header: string): string => {
    const field = fields.find((f) => f.header === header);
    const candidates = [header, ...(field?.aliases ?? [])];

    for (const candidate of candidates) {
      const value = byNormalised.get(normalise(candidate));
      if (value !== undefined) return value;
    }
    return '';
  };
}

/** Everything the importer decided, before anything is written. */
export function planImport<TDraft>(rows: Row[], spec: ImportSpec<TDraft>): ImportPlan<TDraft> {
  const plan: ImportPlan<TDraft> = {
    create: [],
    update: [],
    duplicatesInFile: [],
    existing: [],
    rejected: [],
    totalRows: rows.length,
    unknownColumns: [],
  };

  if (rows.length === 0) return plan;

  const known = new Set<string>();
  for (const field of spec.fields) {
    known.add(normalise(field.header));
    for (const alias of field.aliases) known.add(normalise(alias));
  }
  plan.unknownColumns = Object.keys(rows[0]!).filter((key) => key && !known.has(normalise(key)));

  const seenInFile = new Map<string, number>();

  rows.forEach((row, index) => {
    // +2: one for the header line, one because humans count from 1.
    const line = index + 2;
    const read = fieldReader(row, spec.fields);
    const preview = Object.values(row).filter(Boolean).slice(0, 3).join(' · ');

    let draft: TDraft;
    try {
      draft = spec.toDraft(read);
    } catch (error) {
      plan.rejected.push({ line, reason: (error as Error).message, preview });
      return;
    }

    const missing = spec.fields.filter((f) => f.required && !read(f.header).trim());
    if (missing.length > 0) {
      plan.rejected.push({
        line,
        reason: `Missing required ${missing.length === 1 ? 'column' : 'columns'}: ${missing
          .map((f) => f.header)
          .join(', ')}`,
        preview,
      });
      return;
    }

    // ORDER MATTERS. Duplicate detection runs BEFORE validation, because
    // uniqueness is part of validation: a row that matches an existing
    // record would otherwise be rejected as "IMEI already registered" and
    // could never be recognised as the update it actually is.
    const key = spec.naturalKey(draft);

    const earlier = seenInFile.get(key);
    if (earlier !== undefined) {
      plan.duplicatesInFile.push({
        line,
        reason: `Same record as line ${earlier} (${key})`,
        preview,
      });
      return;
    }
    seenInFile.set(key, line);

    const existingId = spec.findExisting(draft);

    // Validate against the record it would replace, so its own IMEI and
    // registration do not count against it.
    const errors = spec.validate(draft, existingId ?? undefined);
    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      plan.rejected.push({ line, reason: firstError, preview });
      return;
    }

    if (existingId) {
      plan.existing.push({ line, id: existingId, draft, key });
      return;
    }

    plan.create.push({ line, draft });
  });

  return plan;
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  rejected: number;
}

/** Apply a plan. Only called after the user has seen the counts. */
export function applyImport<TDraft>(
  plan: ImportPlan<TDraft>,
  spec: ImportSpec<TDraft>,
  mode: DuplicateMode,
  actor: User | null
): ImportResult {
  let created = 0;
  let updated = 0;

  for (const entry of plan.create) {
    try {
      spec.create(entry.draft, actor);
      created++;
    } catch {
      // Validation already passed; a throw here means a race with another
      // write. Counting it as rejected is more honest than crashing.
      plan.rejected.push({ line: entry.line, reason: 'Rejected on write', preview: '' });
    }
  }

  if (mode === 'update') {
    for (const entry of plan.existing) {
      try {
        spec.update(entry.id, entry.draft, actor);
        updated++;
      } catch {
        plan.rejected.push({ line: entry.line, reason: 'Rejected on write', preview: '' });
      }
    }
  }

  const skipped =
    plan.duplicatesInFile.length + (mode === 'skip' ? plan.existing.length : 0);

  const result: ImportResult = { created, updated, skipped, rejected: plan.rejected.length };

  // ONE audit entry for the whole import, not one per row: an import of 400
  // vehicles must not bury every other action in the trail.
  recordAudit({
    actor,
    action: `Imported ${spec.entity}`,
    targetType: spec.entity === 'users' ? 'user' : 'vehicle',
    targetId: 'bulk-import',
    targetLabel: `${plan.totalRows} rows`,
    detail: `${created} created, ${updated} updated, ${skipped} duplicates skipped, ${result.rejected} rejected (duplicate mode: ${mode})`,
    result: result.rejected > 0 && created + updated === 0 ? 'failure' : 'success',
  });

  return result;
}

/**
 * A CSV of just the headings plus one example row.
 *
 * It takes the FIELDS rather than the whole spec deliberately: `ImportSpec<T>`
 * has T in contravariant position (`naturalKey`, `validate`), so it cannot be
 * widened to `ImportSpec<unknown>` — and a cast to get around that would be
 * unsound. Passing what the function actually needs sidesteps the problem
 * entirely.
 */
export function templateCsv(fields: ImportField[]): string {
  const header = fields.map((f) => f.header).join(',');
  const example = fields.map((f) => f.example).join(',');
  return `${header}\r\n${example}`;
}

/* ================================================================== *
 * The two specs
 * ================================================================== */

export const VEHICLE_IMPORT: ImportSpec<VehicleDraft> = {
  entity: 'vehicles',
  fields: [
    {
      header: 'Vehicle No',
      aliases: ['vehicleNo', 'registration', 'plate'],
      required: true,
      example: 'EC4821',
      hint: 'Two letters then four digits',
    },
    {
      header: 'IMEI',
      aliases: ['imei', 'device'],
      required: true,
      example: '356938035643809',
      hint: 'Exactly 15 digits — must be unique',
    },
    {
      header: 'Model',
      aliases: ['model', 'variant'],
      required: true,
      example: 'COMMANDO',
      hint: VEHICLE_MODELS.join(' / '),
    },
    {
      header: 'Country',
      aliases: ['country', 'market'],
      required: true,
      example: 'Togo',
      hint: COUNTRIES.join(' / '),
    },
    { header: 'Battery ID', aliases: ['batteryId', 'battery'], required: true, example: 'BAT-004821' },
    {
      header: 'Assigned To',
      aliases: ['assignedTo', 'rider', 'driver'],
      required: false,
      example: 'Kofi Mensah',
    },
  ],

  toDraft: (get) => {
    const model = get('Model').trim().toUpperCase();
    if (model && !VEHICLE_MODELS.includes(model as (typeof VEHICLE_MODELS)[number])) {
      throw new Error(`Unknown model “${get('Model')}” — expected one of ${VEHICLE_MODELS.join(', ')}`);
    }

    // Match country case-insensitively: a spreadsheet will say "togo".
    const rawCountry = get('Country').trim();
    const country = COUNTRIES.find((c) => c.toLowerCase() === rawCountry.toLowerCase());
    if (rawCountry && !country) {
      throw new Error(`Unknown country “${rawCountry}” — expected one of ${COUNTRIES.join(', ')}`);
    }

    return {
      vehicleNo: get('Vehicle No').trim().toUpperCase(),
      // Spreadsheets love to reformat long numbers; strip anything non-digit
      // rather than rejecting "356938035643809.0".
      imei: get('IMEI').replace(/\D/g, ''),
      model: (model || 'COMMANDO') as VehicleDraft['model'],
      country: (country ?? 'Togo') as VehicleDraft['country'],
      batteryId: get('Battery ID').trim(),
      assignedTo: get('Assigned To').trim(),
    };
  },

  naturalKey: (draft) => `imei:${draft.imei}`,
  validate: (draft, existingId) =>
    validateVehicle(draft, existingId) as Record<string, string | undefined>,
  findExisting: (draft) =>
    db.vehicles.find((v) => v.imei === draft.imei || v.vehicleNo === draft.vehicleNo)?.id ?? null,
  create: (draft, actor) => {
    createVehicle(draft, actor);
  },
  update: (id, draft, actor) => {
    updateVehicle(id, draft, actor);
  },
};

export const USER_IMPORT: ImportSpec<UserDraft> = {
  entity: 'users',
  fields: [
    { header: 'Name', aliases: ['fullName', 'name'], required: true, example: 'Ama Doe' },
    { header: 'Email', aliases: ['email', 'mail'], required: true, example: 'ama.doe@spiro.com' },
    {
      header: 'Role',
      aliases: ['role'],
      required: true,
      example: 'operator',
      hint: 'super_admin / admin / operator / viewer',
    },
    {
      header: 'Scope',
      aliases: ['country', 'scope'],
      required: true,
      example: 'Togo',
      hint: `ALL or ${COUNTRIES.join(' / ')}`,
    },
  ],

  toDraft: (get) => {
    const raw = get('Role').trim().toLowerCase().replace(/[\s-]+/g, '_');
    const roles = ['super_admin', 'admin', 'operator', 'viewer'] as const;
    if (raw && !roles.includes(raw as (typeof roles)[number])) {
      throw new Error(`Unknown role “${get('Role')}” — expected one of ${roles.join(', ')}`);
    }

    const rawScope = get('Scope').trim();
    const country =
      rawScope.toUpperCase() === 'ALL'
        ? 'ALL'
        : COUNTRIES.find((c) => c.toLowerCase() === rawScope.toLowerCase());

    if (rawScope && !country) {
      throw new Error(`Unknown scope “${rawScope}” — expected ALL or one of ${COUNTRIES.join(', ')}`);
    }

    return {
      name: get('Name').trim(),
      email: get('Email').trim().toLowerCase(),
      role: (raw || 'viewer') as UserDraft['role'],
      country: (country ?? 'Togo') as UserDraft['country'],
    };
  },

  naturalKey: (draft) => `email:${draft.email}`,
  validate: (draft, existingId) =>
    validateUser(draft, existingId) as Record<string, string | undefined>,
  findExisting: (draft) => db.users.find((u) => u.email === draft.email)?.id ?? null,
  create: (draft, actor) => {
    createUser(draft, actor);
  },
  update: (id, draft, actor) => {
    updateUser(id, draft, actor);
  },
};
