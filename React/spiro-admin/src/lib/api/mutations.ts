/**
 * Writes.
 *
 * These are the only functions that change records. Three rules hold for all
 * of them:
 *
 *   1. Every write goes through `db.commit`, so every screen showing that
 *      data re-renders — no manual refetch, no stale table.
 *   2. Every write is audited, including deletions.
 *   3. Validation lives HERE, not only in the form. A form is a convenience;
 *      the invariant is the platform's. `validateVehicle` is exported so the
 *      form can show the same messages without duplicating the rules.
 */

import type { Battery, Country, Rider, User, Vehicle } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { recordAudit } from '@/lib/audit';
import { ApiError } from './client';

export type Errors<T> = Partial<Record<keyof T, string>>;

const IMEI = /^\d{15}$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

/* ------------------------------------------------------------------ *
 * Vehicles
 * ------------------------------------------------------------------ */

export interface VehicleDraft {
  vehicleNo: string;
  imei: string;
  model: Vehicle['model'];
  country: Country;
  batteryId: string;
  assignedTo: string;
}

export function validateVehicle(draft: VehicleDraft, existingId?: string): Errors<VehicleDraft> {
  const errors: Errors<VehicleDraft> = {};

  if (!draft.vehicleNo.trim()) errors.vehicleNo = 'Registration is required';
  else if (!/^[A-Z]{2}\d{4}$/i.test(draft.vehicleNo.trim()))
    errors.vehicleNo = 'Expected two letters then four digits, e.g. EC2832';
  else if (
    db.vehicles.some(
      (v) => v.id !== existingId && v.vehicleNo.toLowerCase() === draft.vehicleNo.trim().toLowerCase()
    )
  )
    errors.vehicleNo = 'That registration is already in the fleet';

  // An IMEI is the device's identity on the network. A duplicate means two
  // bikes reporting as one, which corrupts every downstream number.
  if (!IMEI.test(draft.imei.trim())) errors.imei = 'An IMEI is exactly 15 digits';
  else if (db.vehicles.some((v) => v.id !== existingId && v.imei === draft.imei.trim()))
    errors.imei = 'That IMEI is already registered to another vehicle';

  if (!draft.batteryId.trim()) errors.batteryId = 'A battery must be assigned';

  return errors;
}

export function createVehicle(draft: VehicleDraft, actor: User | null): Vehicle {
  const errors = validateVehicle(draft);
  if (Object.keys(errors).length > 0) throw new ApiError(Object.values(errors)[0] as string, 422);

  const id = db.nextId('veh', db.vehicles);

  const vehicle: Vehicle = {
    id,
    vehicleNo: draft.vehicleNo.trim().toUpperCase(),
    imei: draft.imei.trim(),
    model: draft.model,
    country: draft.country,
    status: 'offline',
    motion: 'stopped',
    ignition: false,
    batteryId: draft.batteryId.trim(),
    soc: 100,
    soh: 100,
    odometerKm: 0,
    availableRangeKm: null,
    avgVelocity: 0,
    avgTemperature: 26,
    // A brand-new vehicle has not reported yet, so it sits at the country
    // centroid and reads offline until its first packet arrives.
    position: countryCentre(draft.country),
    lastSeen: Date.now(),
    track: [],
    telemetry: [],
    assignedTo: draft.assignedTo.trim() || null,
  };

  db.commit(() => {
    db.vehicles = [vehicle, ...db.vehicles];
  });

  recordAudit({
    actor,
    action: 'Created vehicle',
    targetType: 'vehicle',
    targetId: id,
    targetLabel: vehicle.vehicleNo,
    detail: `${vehicle.model} · ${vehicle.country} · IMEI ${vehicle.imei}`,
  });

  return vehicle;
}

export function updateVehicle(id: string, draft: VehicleDraft, actor: User | null): Vehicle {
  const errors = validateVehicle(draft, id);
  if (Object.keys(errors).length > 0) throw new ApiError(Object.values(errors)[0] as string, 422);

  const existing = db.vehicles.find((v) => v.id === id);
  if (!existing) throw new ApiError(`Vehicle ${id} not found`, 404);

  const changes: string[] = [];
  const note = (field: string, before: unknown, after: unknown) => {
    if (String(before) !== String(after)) changes.push(`${field}: ${String(before)} → ${String(after)}`);
  };

  note('registration', existing.vehicleNo, draft.vehicleNo.trim().toUpperCase());
  note('IMEI', existing.imei, draft.imei.trim());
  note('model', existing.model, draft.model);
  note('country', existing.country, draft.country);
  note('battery', existing.batteryId, draft.batteryId.trim());
  note('rider', existing.assignedTo ?? '—', draft.assignedTo.trim() || '—');

  const updated: Vehicle = {
    ...existing,
    vehicleNo: draft.vehicleNo.trim().toUpperCase(),
    imei: draft.imei.trim(),
    model: draft.model,
    country: draft.country,
    batteryId: draft.batteryId.trim(),
    assignedTo: draft.assignedTo.trim() || null,
  };

  db.commit(() => {
    db.vehicles = db.vehicles.map((v) => (v.id === id ? updated : v));
  });

  recordAudit({
    actor,
    action: 'Updated vehicle',
    targetType: 'vehicle',
    targetId: id,
    targetLabel: updated.vehicleNo,
    // The audit records WHAT changed, not just that something did.
    detail: changes.length > 0 ? changes.join('; ') : 'No field changed',
  });

  return updated;
}

export function deleteVehicle(id: string, actor: User | null): void {
  const existing = db.vehicles.find((v) => v.id === id);
  if (!existing) throw new ApiError(`Vehicle ${id} not found`, 404);

  db.commit(() => {
    db.vehicles = db.vehicles.filter((v) => v.id !== id);
    // A rider pointing at a deleted vehicle is a dangling reference; clear it
    // rather than leaving a link that 404s.
    db.riders = db.riders.map((r) =>
      r.vehicleId === id ? { ...r, vehicleId: null, vehicleNo: null } : r
    );
  });

  recordAudit({
    actor,
    action: 'Deleted vehicle',
    targetType: 'vehicle',
    targetId: id,
    targetLabel: existing.vehicleNo,
    detail: `${existing.model} · ${existing.country}`,
  });
}

function countryCentre(country: Country) {
  const sample = db.vehicles.find((v) => v.country === country);
  return sample ? { ...sample.position } : { lat: 6.2, lng: 1.22 };
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export interface UserDraft {
  name: string;
  email: string;
  role: User['role'];
  country: User['country'];
}

export function validateUser(draft: UserDraft, existingId?: string): Errors<UserDraft> {
  const errors: Errors<UserDraft> = {};

  if (draft.name.trim().length < 2) errors.name = 'Enter the person’s full name';
  if (!EMAIL.test(draft.email.trim())) errors.email = 'Enter a valid email address';
  else if (
    db.users.some((u) => u.id !== existingId && u.email.toLowerCase() === draft.email.trim().toLowerCase())
  )
    errors.email = 'That email already has an account';

  // A super admin is cross-border by definition; scoping one to a country
  // would silently do nothing, which is worse than refusing it.
  if (draft.role === 'super_admin' && draft.country !== 'ALL')
    errors.country = 'A super admin is always scoped to all countries';

  return errors;
}

export function createUser(draft: UserDraft, actor: User | null): User {
  const errors = validateUser(draft);
  if (Object.keys(errors).length > 0) throw new ApiError(Object.values(errors)[0] as string, 422);

  const id = db.nextId('usr', db.users);
  const user: User = {
    id,
    name: draft.name.trim(),
    email: draft.email.trim().toLowerCase(),
    role: draft.role,
    country: draft.country,
    avatarUrl: null,
  };

  db.commit(() => {
    db.users = [user, ...db.users];
  });

  recordAudit({
    actor,
    action: 'Created user',
    targetType: 'user',
    targetId: id,
    targetLabel: user.name,
    detail: `${user.email} · ${user.role} · ${user.country}`,
  });

  return user;
}

export function updateUser(id: string, draft: UserDraft, actor: User | null): User {
  const errors = validateUser(draft, id);
  if (Object.keys(errors).length > 0) throw new ApiError(Object.values(errors)[0] as string, 422);

  const existing = db.users.find((u) => u.id === id);
  if (!existing) throw new ApiError(`User ${id} not found`, 404);

  const updated: User = {
    ...existing,
    name: draft.name.trim(),
    email: draft.email.trim().toLowerCase(),
    role: draft.role,
    country: draft.country,
  };

  db.commit(() => {
    db.users = db.users.map((u) => (u.id === id ? updated : u));
  });

  recordAudit({
    actor,
    action: 'Updated user',
    targetType: 'user',
    targetId: id,
    targetLabel: updated.name,
    detail:
      existing.role === updated.role
        ? `${updated.email} · ${updated.country}`
        : `Role changed ${existing.role} → ${updated.role}`,
  });

  return updated;
}

export function deleteUser(id: string, actor: User | null): void {
  const existing = db.users.find((u) => u.id === id);
  if (!existing) throw new ApiError(`User ${id} not found`, 404);

  if (existing.id === actor?.id) throw new ApiError('You cannot delete your own account', 409);

  db.commit(() => {
    db.users = db.users.filter((u) => u.id !== id);
  });

  recordAudit({
    actor,
    action: 'Deleted user',
    targetType: 'user',
    targetId: id,
    targetLabel: existing.name,
    detail: `${existing.email} · ${existing.role}`,
  });
}

/* ------------------------------------------------------------------ *
 * Geofences
 * ------------------------------------------------------------------ */

export function toggleGeofence(id: string, actor: User | null): void {
  const fence = db.geofences.find((f) => f.id === id);
  if (!fence) throw new ApiError(`Geofence ${id} not found`, 404);

  const next = { ...fence, active: !fence.active };

  db.commit(() => {
    // A NEW array identity is what re-arms the alarm engine's fence set.
    db.geofences = db.geofences.map((f) => (f.id === id ? next : f));
  });

  recordAudit({
    actor,
    action: next.active ? 'Enabled geofence' : 'Disabled geofence',
    targetType: 'geofence',
    targetId: id,
    targetLabel: fence.name,
    detail: `${fence.kind} zone in ${fence.country}`,
  });
}

export function renameGeofence(id: string, name: string, actor: User | null): void {
  const fence = db.geofences.find((f) => f.id === id);
  if (!fence) throw new ApiError(`Geofence ${id} not found`, 404);
  if (!name.trim()) throw new ApiError('A zone needs a name', 422);

  db.commit(() => {
    db.geofences = db.geofences.map((f) => (f.id === id ? { ...f, name: name.trim() } : f));
  });

  recordAudit({
    actor,
    action: 'Renamed geofence',
    targetType: 'geofence',
    targetId: id,
    targetLabel: name.trim(),
    detail: `${fence.name} → ${name.trim()}`,
  });
}

export function deleteGeofence(id: string, actor: User | null): void {
  const fence = db.geofences.find((f) => f.id === id);
  if (!fence) throw new ApiError(`Geofence ${id} not found`, 404);

  db.commit(() => {
    db.geofences = db.geofences.filter((f) => f.id !== id);
  });

  recordAudit({
    actor,
    action: 'Deleted geofence',
    targetType: 'geofence',
    targetId: id,
    targetLabel: fence.name,
    detail: `${fence.kind} zone in ${fence.country}, ${fence.ring.length} vertices`,
  });
}

/* ------------------------------------------------------------------ *
 * Riders
 * ------------------------------------------------------------------ */

export function setRiderKyc(id: string, status: Rider['kycStatus'], actor: User | null): void {
  const rider = db.riders.find((r) => r.id === id);
  if (!rider) throw new ApiError(`Rider ${id} not found`, 404);

  db.commit(() => {
    db.riders = db.riders.map((r) => (r.id === id ? { ...r, kycStatus: status } : r));
  });

  recordAudit({
    actor,
    action: `KYC marked ${status}`,
    targetType: 'rider',
    targetId: id,
    targetLabel: rider.name,
    detail: `${rider.kycStatus} → ${status}`,
  });
}

/** Unused today, but the type keeps the battery reference honest. */
export type BatteryRef = Pick<Battery, 'id' | 'batteryId'>;
