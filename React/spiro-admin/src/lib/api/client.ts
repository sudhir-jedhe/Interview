/**
 * API layer.
 *
 * Every screen calls these functions; nothing calls `fetch` directly. Today
 * they resolve against the in-memory mock fleet with a simulated latency;
 * swapping to a real backend means changing only the bodies here, because the
 * return types are the contract.
 */

import type {
  Battery,
  Country,
  FleetSummary,
  Page,
  StatusCounts,
  DegradationSeries,
  FleetReport,
  MaintenanceFlag,
  ReportPeriod,
  Rider,
  SwapStation,
  Trip,
  User,
  Vehicle,
  VehicleModel,
} from '@/types/domain';
import { VEHICLE_MODELS } from '@/types/domain';
import { FLEET_SCALE, getDegradation, getTrips } from '@/lib/mock/generator';
import { db } from '@/lib/mock/db';

/** Simulated network latency, so loading and skeleton states are real. */
const latency = (ms = 220) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms + Math.random() * 180));

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Honour an AbortSignal so cancelled requests behave like the real thing. */
function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    const error = new Error('Request was cancelled');
    error.name = 'AbortError';
    throw error;
  }
}

/* ------------------------------------------------------------------ *
 * Shared query shapes
 * ------------------------------------------------------------------ */

export interface ListQuery {
  country?: Country;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  signal?: AbortSignal;
}

/** Generic sort that copes with strings, numbers and nulls consistently. */
function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  sortBy: string | undefined,
  sortDir: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortBy) return rows;

  const dir = sortDir === 'desc' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];

    // Nulls always sink, regardless of direction — a missing value is not
    // "smallest", it is absent, and users expect it at the bottom.
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;

    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

function paginate<T>(rows: T[], page = 1, pageSize = 25): Page<T> {
  const start = (page - 1) * pageSize;
  return { items: rows.slice(start, start + pageSize), total: rows.length, page, pageSize };
}

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

export async function getFleetSummary(country?: Country, signal?: AbortSignal): Promise<FleetSummary> {
  await latency();
  throwIfAborted(signal);

  const vehicles = db.vehicles;
  const scoped = country ? vehicles.filter((v) => v.country === country) : vehicles;

  const byModel = {} as FleetSummary['byModel'];
  for (const model of VEHICLE_MODELS) {
    const count = scoped.filter((v) => v.model === model).length;
    byModel[model] = {
      total: Math.round(count * FLEET_SCALE),
      deployedToday: Math.max(1, Math.round(count * 0.011)),
    };
  }

  // Ten fixed buckets so the axis is stable even when a bucket is empty.
  const socBuckets = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${i * 10 + 10}%`,
    count: 0,
  }));

  for (const v of scoped) {
    // 100% must land in the last bucket, not an 11th.
    const index = Math.min(9, Math.floor(v.soc / 10));
    socBuckets[index]!.count += Math.round(FLEET_SCALE);
  }

  return {
    byModel,
    totalVehicles: Math.round(scoped.length * FLEET_SCALE),
    running: Math.round(scoped.filter((v) => v.motion === 'running').length * FLEET_SCALE),
    stopped: Math.round(scoped.filter((v) => v.motion === 'stopped').length * FLEET_SCALE),
    socBuckets,
  };
}

/* ------------------------------------------------------------------ *
 * Vehicles
 * ------------------------------------------------------------------ */

export interface VehicleQuery extends ListQuery {
  model?: VehicleModel;
  status?: 'online' | 'offline';
}

export async function getVehicleCounts(
  country: Country | undefined,
  model: VehicleModel | undefined,
  signal?: AbortSignal
): Promise<StatusCounts> {
  await latency(120);
  throwIfAborted(signal);

  const scoped = db.vehicles.filter(
    (v) => (!country || v.country === country) && (!model || v.model === model)
  );
  const online = scoped.filter((v) => v.status === 'online').length;

  return {
    online: Math.round(online * FLEET_SCALE),
    offline: Math.round((scoped.length - online) * FLEET_SCALE),
    total: Math.round(scoped.length * FLEET_SCALE),
  };
}

export async function listVehicles(query: VehicleQuery = {}): Promise<Page<Vehicle>> {
  await latency();
  throwIfAborted(query.signal);

  const { country, model, status, search, page, pageSize, sortBy, sortDir } = query;
  let rows = db.vehicles;

  if (country) rows = rows.filter((v) => v.country === country);
  if (model) rows = rows.filter((v) => v.model === model);
  if (status) rows = rows.filter((v) => v.status === status);

  if (search?.trim()) {
    const needle = search.trim().toLowerCase();
    rows = rows.filter(
      (v) =>
        v.vehicleNo.toLowerCase().includes(needle) ||
        v.imei.includes(needle) ||
        v.batteryId.toLowerCase().includes(needle)
    );
  }

  rows = sortRows(rows as unknown as Record<string, unknown>[], sortBy, sortDir) as unknown as Vehicle[];
  return paginate(rows, page, pageSize ?? 50);
}

export async function getVehicle(id: string, signal?: AbortSignal): Promise<Vehicle> {
  await latency(160);
  throwIfAborted(signal);

  const found = db.vehicles.find((v) => v.id === id || v.vehicleNo === id);
  if (!found) throw new ApiError(`Vehicle ${id} not found`, 404);

  return found;
}

/** Ignition control — the one write in the app, and it is permission-gated. */
export async function setIgnition(id: string, on: boolean): Promise<Vehicle> {
  await latency(400);

  const vehicle = db.vehicles.find((v) => v.id === id);
  if (!vehicle) throw new ApiError(`Vehicle ${id} not found`, 404);

  // Rejecting offline vehicles here keeps the optimistic-update rollback path
  // reachable in the UI rather than theoretical.
  if (vehicle.status === 'offline') {
    throw new ApiError('Cannot control an offline vehicle', 409);
  }

  vehicle.ignition = on;
  return vehicle;
}

/* ------------------------------------------------------------------ *
 * Batteries
 * ------------------------------------------------------------------ */

export async function getBatteryCounts(
  country: Country | undefined,
  signal?: AbortSignal
): Promise<StatusCounts> {
  await latency(120);
  throwIfAborted(signal);

  const scoped = db.batteries.filter((b) => !country || b.country === country);
  const online = scoped.filter((b) => b.status === 'online').length;

  return {
    online: Math.round(online * FLEET_SCALE),
    offline: Math.round((scoped.length - online) * FLEET_SCALE),
    total: Math.round(scoped.length * FLEET_SCALE),
  };
}

export async function listBatteries(query: ListQuery = {}): Promise<Page<Battery>> {
  await latency();
  throwIfAborted(query.signal);

  const { country, search, page, pageSize, sortBy, sortDir } = query;
  let rows = db.batteries;

  if (country) rows = rows.filter((b) => b.country === country);

  if (search?.trim()) {
    const needle = search.trim().toLowerCase();
    rows = rows.filter(
      (b) => b.batteryId.toLowerCase().includes(needle) || b.vehicleNo?.toLowerCase().includes(needle)
    );
  }

  rows = sortRows(rows as unknown as Record<string, unknown>[], sortBy, sortDir) as unknown as Battery[];
  return paginate(rows, page, pageSize ?? 25);
}

export async function getBattery(id: string, signal?: AbortSignal): Promise<Battery> {
  await latency(160);
  throwIfAborted(signal);

  const found = db.batteries.find((b) => b.id === id || b.batteryId === id);
  if (!found) throw new ApiError(`Battery ${id} not found`, 404);

  return found;
}

/* ------------------------------------------------------------------ *
 * Global search — one endpoint across every entity type
 * ------------------------------------------------------------------ */

export interface SearchHit {
  type: 'vehicle' | 'battery';
  id: string;
  label: string;
  sublabel: string;
  href: string;
}

export async function globalSearch(term: string, signal?: AbortSignal): Promise<SearchHit[]> {
  await latency(140);
  throwIfAborted(signal);

  const needle = term.trim().toLowerCase();
  if (needle.length < 2) return [];

  const { vehicles, batteries } = db;

  const vehicleHits: SearchHit[] = vehicles
    .filter((v) => v.vehicleNo.toLowerCase().includes(needle) || v.imei.includes(needle))
    .slice(0, 6)
    .map((v) => ({
      type: 'vehicle',
      id: v.id,
      label: v.vehicleNo,
      sublabel: `${v.model} · ${v.country} · IMEI ${v.imei}`,
      href: `/tracking/vehicle-tracking/info/${v.id}`,
    }));

  const batteryHits: SearchHit[] = batteries
    .filter((b) => b.batteryId.toLowerCase().includes(needle))
    .slice(0, 6)
    .map((b) => ({
      type: 'battery',
      id: b.id,
      label: b.batteryId,
      sublabel: `${b.soc}% SOC · ${b.country}`,
      href: `/tracking/battery-tracking/info/${b.id}`,
    }));

  return [...vehicleHits, ...batteryHits];
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export interface UserQuery extends ListQuery {
  role?: string;
}

export async function listUsers(query: UserQuery = {}): Promise<Page<User>> {
  const { search, role, page = 1, pageSize = 25, sortBy, sortDir, signal } = query;

  await latency(180);
  throwIfAborted(signal);

  let rows = db.users;

  if (role) rows = rows.filter((u) => u.role === role);

  if (search?.trim()) {
    const needle = search.trim().toLowerCase();
    rows = rows.filter(
      (u) => u.name.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle)
    );
  }

  return paginate(sortRows(rows, sortBy, sortDir), page, pageSize);
}

/* ------------------------------------------------------------------ *
 * Swap stations
 * ------------------------------------------------------------------ */

export async function listStations(country?: Country, signal?: AbortSignal): Promise<SwapStation[]> {
  await latency(200);
  throwIfAborted(signal);
  const rows = db.stations;
  return country ? rows.filter((s) => s.country === country) : rows;
}

export interface StationSummary {
  stations: number;
  charged: number;
  charging: number;
  faulted: number;
  slots: number;
  swapsToday: number;
  offline: number;
}

export async function getStationSummary(country?: Country, signal?: AbortSignal): Promise<StationSummary> {
  const rows = await listStations(country, signal);

  return rows.reduce<StationSummary>(
    (acc, s) => ({
      stations: acc.stations + 1,
      charged: acc.charged + s.charged,
      charging: acc.charging + s.charging,
      faulted: acc.faulted + s.faulted,
      slots: acc.slots + s.slots,
      swapsToday: acc.swapsToday + s.swapsToday,
      offline: acc.offline + (s.status === 'offline' ? 1 : 0),
    }),
    { stations: 0, charged: 0, charging: 0, faulted: 0, slots: 0, swapsToday: 0, offline: 0 }
  );
}

/* ------------------------------------------------------------------ *
 * Riders
 * ------------------------------------------------------------------ */

export interface RiderQuery extends ListQuery {
  kycStatus?: string;
}

export async function listRiders(query: RiderQuery = {}): Promise<Page<Rider>> {
  const { country, search, kycStatus, page = 1, pageSize = 25, sortBy, sortDir, signal } = query;

  await latency(220);
  throwIfAborted(signal);

  let rows = db.riders;
  if (country) rows = rows.filter((r) => r.country === country);
  if (kycStatus) rows = rows.filter((r) => r.kycStatus === kycStatus);

  if (search?.trim()) {
    const needle = search.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.phone.includes(needle) ||
        (r.vehicleNo ?? '').toLowerCase().includes(needle)
    );
  }

  return paginate(sortRows(rows, sortBy, sortDir), page, pageSize);
}

export async function getRider(id: string, signal?: AbortSignal): Promise<Rider> {
  await latency(180);
  throwIfAborted(signal);

  const rider = db.riders.find((r) => r.id === id);
  if (!rider) throw new ApiError(`Rider ${id} not found`, 404);
  return rider;
}

/* ------------------------------------------------------------------ *
 * Trips & degradation
 * ------------------------------------------------------------------ */

export async function listTrips(vehicleId: string, signal?: AbortSignal): Promise<Trip[]> {
  await latency(260);
  throwIfAborted(signal);
  return getTrips(vehicleId);
}

export async function getBatteryDegradation(
  batteryId: string,
  signal?: AbortSignal
): Promise<DegradationSeries> {
  await latency(200);
  throwIfAborted(signal);

  const battery = db.batteries.find((b) => b.id === batteryId || b.batteryId === batteryId);
  if (!battery) throw new ApiError(`Battery ${batteryId} not found`, 404);

  return getDegradation(battery.batteryId, battery.soh, battery.cycleCount);
}

/** The packs closest to retirement — what a fleet planner actually asks for. */
export async function getRetirementQueue(limit = 8, signal?: AbortSignal): Promise<DegradationSeries[]> {
  await latency(320);
  throwIfAborted(signal);

  return db.batteries
    .filter((b) => b.soh < 86)
    .sort((a, b) => a.soh - b.soh)
    .slice(0, limit)
    .map((b) => getDegradation(b.batteryId, b.soh, b.cycleCount));
}

/* ------------------------------------------------------------------ *
 * Maintenance
 * ------------------------------------------------------------------ */

export async function listMaintenance(signal?: AbortSignal): Promise<MaintenanceFlag[]> {
  await latency(240);
  throwIfAborted(signal);
  return db.maintenance.filter((f) => !f.resolvedAt);
}

/* ------------------------------------------------------------------ *
 * Reports
 * ------------------------------------------------------------------ */

const PERIOD_DAYS: Record<ReportPeriod, number> = { '7d': 7, '30d': 30, '90d': 90 };

/**
 * A fleet report.
 *
 * The CO2 figure is stated as an OFFSET against the petrol motorcycle each
 * bike replaces, because that is the only comparison that means anything —
 * an EV's own tailpipe emissions are zero, so "emissions saved" needs a
 * baseline or it is a number with no denominator. 87 g CO2e/km is the
 * commonly used figure for a small petrol motorcycle; the grid electricity
 * used to charge is netted off at 25 g CO2e/km.
 */
export async function getFleetReport(
  period: ReportPeriod,
  country: Country | 'ALL',
  signal?: AbortSignal
): Promise<FleetReport> {
  await latency(420);
  throwIfAborted(signal);

  const days = PERIOD_DAYS[period];
  const vehicles = country === 'ALL' ? db.vehicles : db.vehicles.filter((v) => v.country === country);
  const scale = country === 'ALL' ? FLEET_SCALE : FLEET_SCALE / 5;

  const active = vehicles.filter((v) => v.status === 'online');
  const kmPerVehiclePerDay = 41;

  const daily: FleetReport['daily'] = [];
  let distanceKm = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86_400_000);
    const weekend = date.getDay() === 0;
    // Deterministic per day so the report does not change while you read it.
    const wobble = 0.86 + ((date.getDate() * 37) % 29) / 100;
    const km = Math.round(active.length * scale * kmPerVehiclePerDay * wobble * (weekend ? 0.55 : 1));

    distanceKm += km;
    daily.push({
      day: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      distanceKm: km,
      kwh: Math.round(km * 0.055),
    });
  }

  const byModel = VEHICLE_MODELS.map((model) => {
    const count = vehicles.filter((v) => v.model === model).length;
    const share = vehicles.length === 0 ? 0 : count / vehicles.length;
    return {
      model,
      vehicles: Math.round(count * scale),
      distanceKm: Math.round(distanceKm * share),
      kwh: Math.round(distanceKm * share * 0.055),
    };
  });

  return {
    period,
    from: Date.now() - days * 86_400_000,
    to: Date.now(),
    country,
    distanceKm,
    kwh: Math.round(distanceKm * 0.055),
    co2OffsetKg: Math.round((distanceKm * (87 - 25)) / 1000),
    trips: Math.round((distanceKm / 9.4) | 0),
    activeVehicles: Math.round(active.length * scale),
    swaps: db.stations.reduce((sum, s) => sum + s.swapsToday, 0) * days,
    daily,
    byModel,
  };
}
