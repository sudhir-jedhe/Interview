/**
 * Domain model.
 *
 * These types are the contract between the mock generator, the API layer and
 * every component. Getting them right up front is what stops `any` leaking
 * through the app.
 */

export type Country = 'Togo' | 'Benin' | 'Kenya' | 'Uganda' | 'Rwanda' | 'India';

export const COUNTRIES: readonly Country[] = ['Togo', 'Benin', 'Kenya', 'Uganda', 'Rwanda', 'India'];

/**
 * The city each market is operated from. Spiro's African markets run from
 * their capitals; the Indian operation runs out of Pune, so "India" on a
 * filter means the Pune metropolitan region rather than the whole country.
 */
export const OPERATING_CITY: Record<Country, string> = {
  Togo: 'Lomé',
  Benin: 'Cotonou',
  Kenya: 'Nairobi',
  Uganda: 'Kampala',
  Rwanda: 'Kigali',
  India: 'Pune',
};

/** Dial codes, so a generated phone number is plausible for its market. */
export const DIAL_CODE: Record<Country, string> = {
  Togo: '+228',
  Benin: '+229',
  Kenya: '+254',
  Uganda: '+256',
  Rwanda: '+250',
  India: '+91',
};

/** The three Spiro vehicle lines. */
export type VehicleModel = 'COMMANDO' | 'CHAP CHAP' | 'VEO';

export const VEHICLE_MODELS: readonly VehicleModel[] = ['COMMANDO', 'CHAP CHAP', 'VEO'];

export type ConnectionStatus = 'online' | 'offline';
export type MotionStatus = 'running' | 'stopped';

export type LatLng = {
  lat: number;
  lng: number;
}

/** One GPS sample. `speed` is km/h, which is what the map legend bands on. */
export type TrackPoint = LatLng & {
  t: number;
  speed: number;
}

/** One point on an hourly telemetry series. */
export type TelemetryPoint = {
  /** Hour label, e.g. '13:00'. */
  hour: string;
  velocity: number;
  temperature: number;
  soc: number;
}

export type Vehicle = {
  id: string;
  /** Display registration, e.g. 'EC2832'. */
  vehicleNo: string;
  imei: string;
  model: VehicleModel;
  country: Country;
  status: ConnectionStatus;
  motion: MotionStatus;
  ignition: boolean;
  batteryId: string;
  /** State of charge, 0-100. */
  soc: number;
  /** State of health, 0-100. */
  soh: number;
  odometerKm: number;
  availableRangeKm: number | null;
  avgVelocity: number;
  avgTemperature: number;
  position: LatLng;
  lastSeen: number;
  track: TrackPoint[];
  telemetry: TelemetryPoint[];
  assignedTo: string | null;
}

export type Battery = {
  id: string;
  batteryId: string;
  country: Country;
  status: ConnectionStatus;
  soc: number;
  soh: number;
  packVoltage: number;
  current: number;
  temp1: number;
  temp2: number;
  cycleCount: number;
  charging: boolean;
  softwareVersion: string;
  position: LatLng;
  lastUpdated: number;
  vehicleNo: string | null;
  history: BatteryHistory;
}

export type BatteryHistory = {
  maxDischargeCurrent: number;
  maxChargeCurrent: number;
  maxCellVoltage: number;
  minCellVoltage: number;
  maxTemperature: number;
  minTemperature: number;
}

export interface FleetSummary {
  byModel: Record<VehicleModel, { total: number; deployedToday: number }>;
  totalVehicles: number;
  running: number;
  stopped: number;
  /** Ten buckets, 0-10% .. 90-100%. */
  socBuckets: { range: string; count: number }[];
}

export interface StatusCounts {
  online: number;
  offline: number;
  total: number;
}

/** A page of results, normalised across every list endpoint. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/* ---- auth ---- */

export type Role = 'super_admin' | 'admin' | 'operator' | 'viewer';

/** Fine-grained capabilities. Roles map onto these; components check these. */
export type Permission =
  | 'dashboard:view'
  | 'vehicle:view'
  | 'vehicle:control'
  | 'battery:view'
  | 'data:export'
  | 'user:view'
  | 'user:manage'
  | 'settings:manage'
  /* --- added with the telematics build --- */
  | 'vehicle:manage'
  | 'fleet:command'
  | 'geofence:manage'
  | 'alarm:manage'
  | 'station:view'
  | 'rider:view'
  | 'rider:manage'
  | 'maintenance:view'
  | 'report:view'
  | 'audit:view';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  country: Country | 'ALL';
  avatarUrl: string | null;
}

/* ================================================================== *
 * IoT & real-time telematics
 * ================================================================== */

/** One frame off the live feed. Deliberately small — this arrives many
 *  times a second across the fleet, so it carries deltas, not whole vehicles. */
export type TelemetryFrame = {
  vehicleId: string;
  vehicleNo: string;
  at: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  soc: number;
  temperature: number;
  ignition: boolean;
  cellImbalanceMv: number;
};

/** A raw packet as it appears in the engineer's log pane. */
export type PacketLogEntry = {
  id: string;
  at: number;
  vehicleNo: string;
  direction: 'in' | 'out';
  /** Protocol frame type, e.g. 'LOC', 'HBT', 'CMD_ACK'. */
  kind: string;
  bytes: number;
  raw: string;
};

export type RealtimeState = 'connecting' | 'open' | 'closed';

/* ---- geofencing ---- */

export type GeofenceKind = 'inclusion' | 'exclusion';

export type Geofence = {
  id: string;
  name: string;
  country: Country;
  kind: GeofenceKind;
  /** Closed ring, first point NOT repeated. */
  ring: LatLng[];
  active: boolean;
  createdAt: number;
};

/* ---- trips ---- */

export type TripSample = {
  t: number;
  lat: number;
  lng: number;
  speed: number;
  soc: number;
};

export type Trip = {
  id: string;
  vehicleId: string;
  vehicleNo: string;
  startedAt: number;
  endedAt: number;
  distanceKm: number;
  kwh: number;
  maxSpeed: number;
  avgSpeed: number;
  socStart: number;
  socEnd: number;
  samples: TripSample[];
};

/* ---- OTA commands ---- */

export type CommandKind =
  | 'immobilize'
  | 'unlock'
  | 'bms_reboot'
  | 'firmware_update'
  | 'curfew';

export type CommandStatus = 'queued' | 'sent' | 'acknowledged' | 'failed';

export type CommandRecord = {
  id: string;
  kind: CommandKind;
  vehicleId: string;
  vehicleNo: string;
  status: CommandStatus;
  issuedAt: number;
  settledAt: number | null;
  issuedBy: string;
  detail: string;
};

/* ================================================================== *
 * Swapping & stations
 * ================================================================== */

export type StationStatus = 'operational' | 'degraded' | 'offline';

export type SwapStation = {
  id: string;
  name: string;
  country: Country;
  position: LatLng;
  slots: number;
  charged: number;
  charging: number;
  faulted: number;
  status: StationStatus;
  swapsToday: number;
  lastSeen: number;
};

/** One measurement on a pack's degradation curve. */
export type DegradationPoint = {
  cycle: number;
  soh: number;
  at: number;
};

export type DegradationSeries = {
  batteryId: string;
  points: DegradationPoint[];
  /** Cycles/day, fitted from the recorded points. */
  cyclesPerDay: number;
  /** Linear fit: soh = intercept + slope * cycle. */
  slopePerCycle: number;
  /** Projected cycle index at which SOH crosses the retirement floor. */
  retirementCycle: number | null;
  retirementDate: number | null;
};

/* ---- alarms ---- */

export type AlarmKind =
  | 'thermal_runaway'
  | 'cell_imbalance'
  | 'geofence_exit'
  | 'rapid_capacity_loss';

export type AlarmSeverity = 'warning' | 'serious' | 'critical';

export type Alarm = {
  id: string;
  kind: AlarmKind;
  severity: AlarmSeverity;
  subjectType: 'vehicle' | 'battery';
  subjectId: string;
  subjectLabel: string;
  message: string;
  value: number;
  threshold: number;
  unit: string;
  at: number;
  acknowledgedAt: number | null;
  acknowledgedBy: string | null;
};

/** Operator-configurable trip points. Stored per browser. */
export type AlarmThresholds = {
  cellTempC: number;
  cellImbalanceMv: number;
  sohFloor: number;
  soundArmed: boolean;
};

export const DEFAULT_THRESHOLDS: AlarmThresholds = {
  cellTempC: 60,
  cellImbalanceMv: 200,
  sohFloor: 70,
  soundArmed: false,
};

/* ================================================================== *
 * Fleet operations
 * ================================================================== */

export type KycStatus = 'verified' | 'pending' | 'rejected';

export type Rider = {
  id: string;
  name: string;
  phone: string;
  country: Country;
  kycStatus: KycStatus;
  kycDocument: string;
  licenceNo: string;
  emergencyName: string;
  emergencyPhone: string;
  vehicleId: string | null;
  vehicleNo: string | null;
  batteryId: string | null;
  joinedAt: number;
  /** Last 14 days, oldest first. Local currency units. */
  earnings: { day: string; amount: number }[];
};

export type MaintenanceKind =
  | 'brake_pads'
  | 'tyre_pressure'
  | 'capacity_loss'
  | 'motor_temperature';

export type MaintenanceFlag = {
  id: string;
  vehicleId: string;
  vehicleNo: string;
  kind: MaintenanceKind;
  severity: AlarmSeverity;
  /** What in the telemetry triggered it — the evidence, not just a verdict. */
  evidence: string;
  detectedAt: number;
  dueInKm: number | null;
  resolvedAt: number | null;
};

/* ================================================================== *
 * Reporting & audit
 * ================================================================== */

export type ReportPeriod = '7d' | '30d' | '90d';

export type FleetReport = {
  period: ReportPeriod;
  from: number;
  to: number;
  country: Country | 'ALL';
  distanceKm: number;
  kwh: number;
  co2OffsetKg: number;
  trips: number;
  activeVehicles: number;
  swaps: number;
  daily: { day: string; distanceKm: number; kwh: number }[];
  byModel: { model: VehicleModel; distanceKm: number; kwh: number; vehicles: number }[];
};

export type AuditEntry = {
  id: string;
  at: number;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  targetType: 'vehicle' | 'battery' | 'user' | 'rider' | 'geofence' | 'settings' | 'fleet';
  targetId: string;
  targetLabel: string;
  detail: string;
  result: 'success' | 'failure';
};
