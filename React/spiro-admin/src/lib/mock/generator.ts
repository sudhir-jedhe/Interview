/**
 * Seeded fleet generator.
 *
 * Produces a stable, realistic dataset so the app runs with `npm run dev` and
 * no backend. Two properties matter:
 *
 *   DETERMINISTIC  a seeded PRNG means the same vehicle always has the same
 *                  data across reloads. Random data makes UI bugs
 *                  irreproducible and screenshots useless.
 *
 *   PLAUSIBLE      GPS tracks follow roads-ish paths near real West African
 *                  cities, SoC correlates with voltage, temperature rises
 *                  with current draw. Uniform noise would hide layout bugs
 *                  that only appear with realistic value distributions.
 */

import type {
  Alarm,
  AlarmSeverity,
  DegradationPoint,
  DegradationSeries,
  Geofence,
  LatLng,
  MaintenanceFlag,
  MaintenanceKind,
  PacketLogEntry,
  Rider,
  Role,
  SwapStation,
  Trip,
  TripSample,
  User,
  Battery,
  Country,
  TelemetryPoint,
  TrackPoint,
  Vehicle,
  VehicleModel,
} from '@/types/domain';
import { COUNTRIES, DIAL_CODE, OPERATING_CITY, VEHICLE_MODELS } from '@/types/domain';

/** mulberry32 — small, fast, and reproducible across engines. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(20240620);

const between = (lo: number, hi: number) => lo + rand() * (hi - lo);
const intBetween = (lo: number, hi: number) => Math.floor(between(lo, hi + 1));
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]!;
const chance = (p: number) => rand() < p;

/** Rough city centres, so markers land on land and near roads. */
const CITY_CENTRES: Record<Country, { lat: number; lng: number; spread: number }> = {
  Togo: { lat: 6.2, lng: 1.22, spread: 0.55 },
  Benin: { lat: 6.5, lng: 2.42, spread: 0.5 },
  Kenya: { lat: -1.29, lng: 36.82, spread: 0.45 },
  Uganda: { lat: 0.35, lng: 32.58, spread: 0.4 },
  Rwanda: { lat: -1.95, lng: 30.06, spread: 0.3 },
  // Pune. A tighter spread than the African markets: the fleet runs in the
  // metropolitan area, not across Maharashtra.
  India: { lat: 18.5204, lng: 73.8567, spread: 0.26 },
};

const PLATE_PREFIXES: Record<Country, string[]> = {
  Togo: ['EC', 'TG'],
  Benin: ['BJ', 'DR'],
  Kenya: ['KE', 'SP'],
  Uganda: ['UG', 'EC'],
  Rwanda: ['RW', 'SP'],
  // Maharashtra series — a Pune bike is registered MH12.
  India: ['MH', 'PN'],
};

const FIRST_NAMES = ['Kofi', 'Ama', 'Yao', 'Afi', 'Kwame', 'Adjoa', 'Sena', 'Elom', 'Mawuli', 'Dela'];
const LAST_NAMES = ['Mensah', 'Doe', 'Agbeko', 'Sossou', 'Aduku', 'Kponton', 'Amegah', 'Tetteh'];

/**
 * Build a GPS track as a random walk with momentum, so the polyline looks
 * like a journey rather than static noise.
 */
function buildTrack(start: { lat: number; lng: number }, points: number): TrackPoint[] {
  const track: TrackPoint[] = [];

  let { lat, lng } = start;
  let heading = between(0, Math.PI * 2);
  let speed = between(15, 45);
  const now = Date.now();

  for (let i = 0; i < points; i++) {
    // Momentum: nudge the heading rather than re-rolling it.
    heading += between(-0.35, 0.35);

    // Speed wanders and occasionally spikes (open road) or drops (traffic).
    speed = Math.max(0, Math.min(135, speed + between(-8, 8) + (chance(0.05) ? between(-30, 40) : 0)));

    const step = (speed / 3600) * 0.02;
    lat += Math.cos(heading) * step;
    lng += Math.sin(heading) * step;

    track.push({
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      speed: Math.round(speed),
      t: now - (points - i) * 60_000,
    });
  }

  return track;
}

/** 24 hourly samples, newest last, with a plausible daily shape. */
function buildTelemetry(baseSoc: number): TelemetryPoint[] {
  const out: TelemetryPoint[] = [];
  let soc = Math.min(100, baseSoc + intBetween(10, 40));

  for (let h = 23; h >= 0; h--) {
    // Two commute humps: morning and evening.
    const hump = Math.exp(-(((h - 8) / 3) ** 2)) + Math.exp(-(((h - 18) / 3) ** 2));
    const velocity = Math.max(0, Math.round(hump * between(45, 80) + between(-6, 10)));

    soc = Math.max(2, soc - velocity * between(0.02, 0.06));

    out.push({
      hour: `${String(h).padStart(2, '0')}:00`,
      velocity,
      temperature: Math.round(26 + hump * between(6, 16) + between(-2, 3)),
      soc: Math.round(soc),
    });
  }

  return out.reverse();
}

function makeVehicle(index: number, model: VehicleModel, country: Country): Vehicle {
  const centre = CITY_CENTRES[country];

  const position = {
    lat: Number((centre.lat + between(-centre.spread, centre.spread)).toFixed(6)),
    lng: Number((centre.lng + between(-centre.spread, centre.spread)).toFixed(6)),
  };

  const online = chance(0.6);
  const soc = intBetween(0, 100);
  const soh = intBetween(82, 100);

  // Range only reads when the pack can actually report it — some units can't,
  // which is why the real dashboard shows a dash. Modelling that keeps the
  // "missing value" UI path exercised.
  const availableRangeKm = chance(0.75) ? Math.round((soc / 100) * between(45, 95)) : null;

  const track = buildTrack(position, intBetween(30, 70));
  const telemetry = buildTelemetry(soc);

  return {
    id: `veh_${index}`,
    vehicleNo: `${pick(PLATE_PREFIXES[country])}${intBetween(1000, 9999)}`,
    imei: String(intBetween(100_000_000, 999_999_999)) + String(intBetween(100, 999)),
    model,
    country,
    status: online ? 'online' : 'offline',
    motion: online && chance(0.36) ? 'running' : 'stopped',
    ignition: online && chance(0.4),
    batteryId: `7227AB1LBP${String.fromCharCode(65 + intBetween(0, 25))}${intBetween(1000, 9999)}`,
    soc,
    soh,
    odometerKm: intBetween(120, 62_000),
    availableRangeKm,
    avgVelocity: Number(between(8, 55).toFixed(2)),
    avgTemperature: Number(between(0, 42).toFixed(2)),
    position,
    lastSeen: Date.now() - intBetween(0, online ? 300 : 90_000) * 1000,
    track,
    telemetry,
    assignedTo: chance(0.7) ? `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}` : null,
  };
}

function makeBattery(index: number, country: Country, vehicleNo: string | null): Battery {
  const centre = CITY_CENTRES[country];
  const soc = intBetween(0, 100);
  const charging = chance(0.22);

  // Pack voltage tracks SoC: ~70 V empty to ~79.5 V full on these packs.
  const packVoltage = Number((70 + (soc / 100) * 9.5 + between(-0.4, 0.4)).toFixed(3));

  // Current is negative when discharging, positive when charging.
  const current = charging
    ? Number(between(3, 11).toFixed(3))
    : Number((chance(0.7) ? between(-0.03, -0.001) : between(-95, -8)).toFixed(3));

  // Heat follows the magnitude of current draw.
  const load = Math.min(1, Math.abs(current) / 90);
  const temp1 = Math.round(29 + load * between(14, 26) + between(-1, 2));

  return {
    id: `bat_${index}`,
    batteryId: `7227AB1LBP${String.fromCharCode(65 + intBetween(0, 25))}${intBetween(1000, 9999)}`,
    country,
    status: chance(0.75) ? 'online' : 'offline',
    soc,
    soh: intBetween(88, 100),
    packVoltage,
    current,
    temp1,
    temp2: temp1 + intBetween(-1, 1),
    cycleCount: intBetween(1, 520),
    charging,
    softwareVersion: `U${intBetween(8000, 8999)}.${intBetween(10, 12)}.${intBetween(1, 5)}`,
    position: {
      lat: Number((centre.lat + between(-centre.spread, centre.spread)).toFixed(6)),
      lng: Number((centre.lng + between(-centre.spread, centre.spread)).toFixed(6)),
    },
    lastUpdated: Date.now() - intBetween(0, 3600) * 1000,
    vehicleNo,
    history: {
      maxDischargeCurrent: Number(between(-120, -60).toFixed(3)),
      maxChargeCurrent: Number(between(8, 14).toFixed(3)),
      maxCellVoltage: Number(between(3.55, 3.7).toFixed(2)),
      minCellVoltage: Number(between(2.1, 2.9).toFixed(3)),
      maxTemperature: intBetween(55, 72),
      minTemperature: intBetween(2, 12),
    },
  };
}

/**
 * Model mix is deliberately uneven — COMMANDO dominates the real fleet — so
 * the dashboard cards and tab counts look like production, not a demo.
 */
const MODEL_WEIGHTS: Record<VehicleModel, number> = {
  COMMANDO: 0.62,
  'CHAP CHAP': 0.31,
  VEO: 0.07,
};

function weightedModel(): VehicleModel {
  const r = rand();
  let acc = 0;
  for (const model of VEHICLE_MODELS) {
    acc += MODEL_WEIGHTS[model];
    if (r < acc) return model;
  }
  return 'COMMANDO';
}

export interface Fleet {
  vehicles: Vehicle[];
  batteries: Battery[];
}

/**
 * Generate the whole fleet once, lazily, and memoise it. 14k vehicles each
 * carrying a 70-point track is ~40 MB, so this must never run twice.
 */
let cached: Fleet | null = null;

export function getFleet(vehicleCount = 3000, batteryCount = 2400): Fleet {
  if (cached) return cached;

  const vehicles: Vehicle[] = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(makeVehicle(i, weightedModel(), pick(COUNTRIES)));
  }

  const batteries: Battery[] = [];
  for (let i = 0; i < batteryCount; i++) {
    const host = chance(0.8) ? vehicles[intBetween(0, vehicles.length - 1)]! : null;
    batteries.push(makeBattery(i, host?.country ?? pick(COUNTRIES), host?.vehicleNo ?? null));
  }

  cached = { vehicles, batteries };
  return cached;
}

/**
 * Headline counts are scaled up from the sampled fleet so the dashboard shows
 * production-sized numbers without generating 14k tracks in the browser.
 */
export const FLEET_SCALE = 4.6;

/* ------------------------------------------------------------------ *
 * Team directory
 * ------------------------------------------------------------------ */

const ROLE_WEIGHTS: { role: Role; weight: number }[] = [
  { role: 'viewer', weight: 0.44 },
  { role: 'operator', weight: 0.36 },
  { role: 'admin', weight: 0.16 },
  { role: 'super_admin', weight: 0.04 },
];

function weightedRole(): Role {
  let roll = rand();
  for (const entry of ROLE_WEIGHTS) {
    if (roll < entry.weight) return entry.role;
    roll -= entry.weight;
  }
  return 'viewer';
}

let usersCache: User[] | null = null;

/**
 * The team directory. Seeded from the same PRNG, so it is stable across
 * reloads — a user list that reshuffles every refresh makes the sort and
 * filter controls impossible to demo.
 */
export function getUsers(count = 42): User[] {
  if (usersCache && usersCache.length === count) return usersCache;

  const users: User[] = Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const role = weightedRole();

    return {
      id: `usr-${String(i + 1).padStart(4, '0')}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@spiro.com`,
      role,
      // Super admins are cross-border; everyone else is scoped to a country.
      country: role === 'super_admin' ? 'ALL' : pick(COUNTRIES as readonly Country[]),
      avatarUrl: null,
    };
  });

  usersCache = users;
  return users;
}

/* ================================================================== *
 * Geofences
 *
 * A regular polygon jittered per vertex reads as a hand-drawn operating
 * zone rather than a shape primitive, and it exercises the point-in-polygon
 * test with a genuinely non-convex ring.
 * ================================================================== */

function buildRing(centre: LatLng, radiusDeg: number, vertices: number): LatLng[] {
  const ring: LatLng[] = [];
  for (let i = 0; i < vertices; i++) {
    const angle = (i / vertices) * Math.PI * 2;
    const r = radiusDeg * between(0.72, 1.18);
    ring.push({
      lat: Number((centre.lat + Math.sin(angle) * r).toFixed(5)),
      // Longitude degrees shrink with latitude; without this the zone is an
      // ellipse on screen instead of a circle.
      lng: Number((centre.lng + (Math.cos(angle) * r) / Math.cos((centre.lat * Math.PI) / 180)).toFixed(5)),
    });
  }
  return ring;
}

const ZONE_NAMES: Record<Country, string[]> = {
  Togo: ['Lomé Operating Zone', 'Agoè Restricted Sector'],
  Benin: ['Cotonou Operating Zone', 'Port Exclusion Sector'],
  Kenya: ['Nairobi CBD Zone', 'Industrial Area Exclusion'],
  Uganda: ['Kampala Operating Zone'],
  Rwanda: ['Kigali Operating Zone'],
  India: ['Pune Operating Zone', 'Hinjawadi Restricted Sector'],
};

let geofenceCache: Geofence[] | null = null;

export function getGeofences(): Geofence[] {
  if (geofenceCache) return geofenceCache;

  const fences: Geofence[] = [];
  let n = 0;

  for (const country of COUNTRIES) {
    const centre = CITY_CENTRES[country];
    const names = ZONE_NAMES[country];

    names.forEach((name) => {
      const exclusion = name.toLowerCase().includes('exclusion') || name.toLowerCase().includes('restricted');
      fences.push({
        id: `gf-${String(++n).padStart(3, '0')}`,
        name,
        country,
        kind: exclusion ? 'exclusion' : 'inclusion',
        ring: buildRing(
          exclusion
            ? { lat: centre.lat + centre.spread * 0.45, lng: centre.lng + centre.spread * 0.35 }
            : centre,
          exclusion ? centre.spread * 0.22 : centre.spread * 0.9,
          exclusion ? 6 : 9
        ),
        active: true,
        createdAt: Date.now() - intBetween(20, 300) * 86_400_000,
      });
    });
  }

  geofenceCache = fences;
  return fences;
}

/* ================================================================== *
 * Swap stations
 * ================================================================== */

const STATION_SUFFIX = ['Central', 'Market', 'North', 'Ring Road', 'University', 'Port', 'Station', 'Junction'];

let stationCache: SwapStation[] | null = null;

export function getStations(): SwapStation[] {
  if (stationCache) return stationCache;

  const stations: SwapStation[] = [];
  let n = 0;

  for (const country of COUNTRIES) {
    const centre = CITY_CENTRES[country];
    const count = intBetween(4, 8);

    for (let i = 0; i < count; i++) {
      const slots = pick([8, 12, 16, 20]);
      const faulted = chance(0.18) ? intBetween(1, 2) : 0;
      const charging = intBetween(1, Math.max(1, slots - faulted - 1));
      const charged = Math.max(0, slots - faulted - charging - intBetween(0, 2));

      // A cabinet with nothing charged is out of service to a rider even if
      // it reports "operational", so the status reflects usable stock.
      const status: SwapStation['status'] =
        faulted > 1 || charged === 0 ? 'offline' : charged <= 2 || faulted > 0 ? 'degraded' : 'operational';

      stations.push({
        id: `st-${String(++n).padStart(3, '0')}`,
        // One lookup rather than a chain of ternaries — adding a market
        // should not mean editing an expression.
        name: `${OPERATING_CITY[country]} ${pick(STATION_SUFFIX)}`,
        country,
        position: {
          lat: Number((centre.lat + between(-1, 1) * centre.spread * 0.7).toFixed(5)),
          lng: Number((centre.lng + between(-1, 1) * centre.spread * 0.7).toFixed(5)),
        },
        slots,
        charged,
        charging,
        faulted,
        status,
        swapsToday: intBetween(6, 90),
        lastSeen: Date.now() - intBetween(0, 40) * 60_000,
      });
    }
  }

  stationCache = stations;
  return stations;
}

/* ================================================================== *
 * Riders
 * ================================================================== */

const DAY_LABELS = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

let riderCache: Rider[] | null = null;

export function getRiders(): Rider[] {
  if (riderCache) return riderCache;

  const { vehicles } = getFleet();
  const days = DAY_LABELS(14);

  const riders: Rider[] = vehicles.slice(0, 260).map((vehicle, i) => {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const base = between(2200, 7800);

    return {
      id: `rdr-${String(i + 1).padStart(4, '0')}`,
      name: `${first} ${last}`,
      phone: `${DIAL_CODE[vehicle.country]} ${intBetween(70, 99)} ${intBetween(1000, 9999)} ${intBetween(1000, 9999)}`,
      country: vehicle.country,
      kycStatus: chance(0.78) ? 'verified' : chance(0.7) ? 'pending' : 'rejected',
      kycDocument: `ID-${intBetween(100000, 999999)}`,
      licenceNo: `DL-${pick(PLATE_PREFIXES[vehicle.country])}-${intBetween(10000, 99999)}`,
      emergencyName: `${pick(FIRST_NAMES)} ${last}`,
      emergencyPhone: `${DIAL_CODE[vehicle.country]} ${intBetween(70, 99)} ${intBetween(1000, 9999)} ${intBetween(1000, 9999)}`,
      vehicleId: vehicle.id,
      vehicleNo: vehicle.vehicleNo,
      batteryId: vehicle.batteryId,
      joinedAt: Date.now() - intBetween(30, 900) * 86_400_000,
      earnings: days.map((day, d) => ({
        day,
        // Sundays are visibly thinner — a flat random series looks fake.
        amount: Math.round(base * (d % 7 === 6 ? between(0.25, 0.5) : between(0.72, 1.28))),
      })),
    };
  });

  riderCache = riders;
  return riders;
}

/* ================================================================== *
 * Trips — a day of riding per vehicle, built on demand
 * ================================================================== */

const tripCache = new Map<string, Trip[]>();

/** Haversine, in kilometres. Good enough at city scale and exact enough
 *  that the distance column agrees with the drawn line. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getTrips(vehicleId: string): Trip[] {
  const cached = tripCache.get(vehicleId);
  if (cached) return cached;

  const { vehicles } = getFleet();
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return [];

  // Deterministic per vehicle: the same bike always replays the same day.
  const local = seeded(
    vehicleId.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
  );
  const r = (lo: number, hi: number) => lo + local() * (hi - lo);

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const tripCount = 2 + Math.floor(local() * 3);
  const trips: Trip[] = [];

  let soc = Math.min(100, vehicle.soc + 25);
  let cursor = midnight.getTime() + 7 * 3_600_000 + Math.floor(r(0, 45)) * 60_000;
  let position: LatLng = { ...vehicle.position };

  for (let t = 0; t < tripCount; t++) {
    const minutes = Math.floor(r(14, 52));
    const samples: TripSample[] = [];
    // One sample every 20 s: dense enough for a smooth scrub, small enough
    // that a full day stays under a few thousand points.
    const steps = Math.max(8, Math.floor((minutes * 60) / 20));

    let heading = r(0, Math.PI * 2);
    let distanceKm = 0;
    let maxSpeed = 0;
    let speedSum = 0;
    const socStart = soc;

    for (let i = 0; i < steps; i++) {
      // Speed follows a trapezoid: accelerate, cruise, decelerate.
      const phase = i / steps;
      const envelope = phase < 0.15 ? phase / 0.15 : phase > 0.85 ? (1 - phase) / 0.15 : 1;
      const speed = Math.max(0, Math.round(envelope * r(24, 46) + r(-4, 6)));

      heading += r(-0.28, 0.28);
      const stepKm = (speed * 20) / 3600;
      distanceKm += stepKm;
      maxSpeed = Math.max(maxSpeed, speed);
      speedSum += speed;

      const degPerKm = 1 / 111;
      position = {
        lat: position.lat + Math.sin(heading) * stepKm * degPerKm,
        lng:
          position.lng +
          (Math.cos(heading) * stepKm * degPerKm) / Math.cos((position.lat * Math.PI) / 180),
      };

      // ~55 Wh/km on a 2.3 kWh pack ≈ 2.4 % of charge per km.
      soc = Math.max(2, soc - stepKm * 2.4);

      samples.push({
        t: cursor + i * 20_000,
        lat: Number(position.lat.toFixed(5)),
        lng: Number(position.lng.toFixed(5)),
        speed,
        soc: Number(soc.toFixed(1)),
      });
    }

    const startedAt = cursor;
    const endedAt = cursor + steps * 20_000;

    trips.push({
      id: `${vehicleId}-trip-${t + 1}`,
      vehicleId,
      vehicleNo: vehicle.vehicleNo,
      startedAt,
      endedAt,
      distanceKm: Number(distanceKm.toFixed(2)),
      kwh: Number((distanceKm * 0.055).toFixed(3)),
      maxSpeed,
      avgSpeed: Math.round(speedSum / steps),
      socStart: Math.round(socStart),
      socEnd: Math.round(soc),
      samples,
    });

    // Idle between trips — a swap, a fare, a break.
    cursor = endedAt + Math.floor(r(18, 120)) * 60_000;
    if (soc < 18) soc = Math.round(r(88, 100)); // battery swap
  }

  tripCache.set(vehicleId, trips);
  return trips;
}

/* ================================================================== *
 * Degradation curves
 * ================================================================== */

const degradationCache = new Map<string, DegradationSeries>();

export function getDegradation(batteryId: string, currentSoh: number, cycleCount: number): DegradationSeries {
  const cached = degradationCache.get(batteryId);
  if (cached) return cached;

  const local = seeded(batteryId.split('').reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 11));
  const cyclesPerDay = 0.6 + local() * 1.1;

  const points: DegradationPoint[] = [];
  const buckets = 12;

  for (let i = 0; i <= buckets; i++) {
    const cycle = Math.round((cycleCount / buckets) * i);
    // Real cells lose fast, then slow, then fast again. A straight line is
    // the lie that makes retirement dates wrong.
    const fraction = cycle / Math.max(1, cycleCount);
    const knee = fraction > 0.8 ? (fraction - 0.8) * 40 : 0;
    const soh = Math.max(
      55,
      100 - (100 - currentSoh) * (0.35 * fraction + 0.65 * fraction ** 1.6) - knee + (local() - 0.5) * 0.8
    );

    points.push({
      cycle,
      soh: Number(soh.toFixed(1)),
      at: Date.now() - Math.round((cycleCount - cycle) / cyclesPerDay) * 86_400_000,
    });
  }

  // Fit the LAST third only: the early curve flatters the pack and pushes
  // the retirement date months into the future.
  const tail = points.slice(Math.floor(points.length * 0.66));
  const first = tail[0]!;
  const last = tail[tail.length - 1]!;
  const span = Math.max(1, last.cycle - first.cycle);
  const slopePerCycle = (last.soh - first.soh) / span;

  let retirementCycle: number | null = null;
  let retirementDate: number | null = null;

  if (slopePerCycle < -0.0001) {
    retirementCycle = Math.round(last.cycle + (70 - last.soh) / slopePerCycle);
    retirementDate = Date.now() + Math.round((retirementCycle - cycleCount) / cyclesPerDay) * 86_400_000;
  }

  const series: DegradationSeries = {
    batteryId,
    points,
    cyclesPerDay: Number(cyclesPerDay.toFixed(2)),
    slopePerCycle,
    retirementCycle,
    retirementDate,
  };

  degradationCache.set(batteryId, series);
  return series;
}

/* ================================================================== *
 * Predictive maintenance
 * ================================================================== */

const MAINT: { kind: MaintenanceKind; evidence: (v: { vehicleNo: string; odo: number }) => string }[] = [
  {
    kind: 'brake_pads',
    evidence: (v) =>
      `Mean deceleration during braking events fell 22 % over the last 500 km (odometer ${Math.round(v.odo)} km).`,
  },
  {
    kind: 'tyre_pressure',
    evidence: () => 'Rear TPMS reading 1.7 bar against a 2.2 bar setpoint for 3 consecutive days.',
  },
  {
    kind: 'capacity_loss',
    evidence: () => 'Usable capacity fell 4.1 % in 30 cycles — more than 3× the fleet median rate.',
  },
  {
    kind: 'motor_temperature',
    evidence: () => 'Motor controller peaked at 96 °C on 4 of the last 10 trips, against a 85 °C normal ceiling.',
  },
];

let maintenanceCache: MaintenanceFlag[] | null = null;

export function getMaintenanceFlags(): MaintenanceFlag[] {
  if (maintenanceCache) return maintenanceCache;

  const { vehicles } = getFleet();
  const flags: MaintenanceFlag[] = [];
  let n = 0;

  for (const vehicle of vehicles) {
    // Roughly 4 % of a fleet has something wrong at any moment. More than
    // that and the screen becomes noise nobody reads.
    if (!chance(0.04)) continue;

    const spec = pick(MAINT);
    const severity: AlarmSeverity = chance(0.15) ? 'critical' : chance(0.45) ? 'serious' : 'warning';

    flags.push({
      id: `mnt-${String(++n).padStart(4, '0')}`,
      vehicleId: vehicle.id,
      vehicleNo: vehicle.vehicleNo,
      kind: spec.kind,
      severity,
      evidence: spec.evidence({ vehicleNo: vehicle.vehicleNo, odo: vehicle.odometerKm }),
      detectedAt: Date.now() - intBetween(1, 400) * 3_600_000,
      dueInKm: spec.kind === 'brake_pads' ? intBetween(120, 900) : null,
      resolvedAt: null,
    });
  }

  maintenanceCache = flags;
  return flags;
}

/* ================================================================== *
 * Packet log seeds
 * ================================================================== */

const PACKET_KINDS = ['LOC', 'HBT', 'BMS', 'CMD_ACK', 'ALM', 'OTA'];

export function makePacket(vehicleNo: string, at: number, index: number): PacketLogEntry {
  const kind = PACKET_KINDS[index % PACKET_KINDS.length]!;
  const direction: 'in' | 'out' = kind === 'OTA' ? 'out' : 'in';
  const payload = Array.from({ length: 8 }, () =>
    Math.floor(rand() * 256)
      .toString(16)
      .padStart(2, '0')
  ).join(' ');

  return {
    id: `pkt-${at}-${index}`,
    at,
    vehicleNo,
    direction,
    kind,
    bytes: 12 + Math.floor(rand() * 40),
    raw: `7E ${kind === 'LOC' ? '01' : '02'} ${payload} 7E`,
  };
}

/** Seeded alarm history, so the alarm centre is not empty on first load. */
export function seedAlarms(): Alarm[] {
  const { vehicles, batteries } = getFleet();
  const alarms: Alarm[] = [];

  for (let i = 0; i < 6; i++) {
    const battery = batteries[intBetween(0, batteries.length - 1)]!;
    const hot = chance(0.5);

    alarms.push({
      id: `alm-seed-${i}`,
      kind: hot ? 'thermal_runaway' : 'cell_imbalance',
      severity: hot ? 'critical' : 'serious',
      subjectType: 'battery',
      subjectId: battery.id,
      subjectLabel: battery.batteryId,
      message: hot
        ? 'Cell temperature above the thermal-runaway threshold'
        : 'Cell voltage imbalance above the balancing threshold',
      value: hot ? Number(between(61, 78).toFixed(1)) : Math.round(between(210, 420)),
      threshold: hot ? 60 : 200,
      unit: hot ? '°C' : 'mV',
      at: Date.now() - intBetween(5, 600) * 60_000,
      acknowledgedAt: i > 3 ? Date.now() - intBetween(1, 4) * 60_000 : null,
      acknowledgedBy: i > 3 ? 'Operator' : null,
    });
  }

  const vehicle = vehicles[intBetween(0, vehicles.length - 1)]!;
  alarms.push({
    id: 'alm-seed-geo',
    kind: 'geofence_exit',
    severity: 'warning',
    subjectType: 'vehicle',
    subjectId: vehicle.id,
    subjectLabel: vehicle.vehicleNo,
    message: 'Vehicle left its designated operating zone',
    value: 1,
    threshold: 0,
    unit: '',
    at: Date.now() - intBetween(2, 90) * 60_000,
    acknowledgedAt: null,
    acknowledgedBy: null,
  });

  return alarms.sort((a, b) => b.at - a.at);
}
