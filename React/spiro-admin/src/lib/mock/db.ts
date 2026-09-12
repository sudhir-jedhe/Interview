/**
 * The in-memory database.
 *
 * The generator produces a fleet once; this owns it afterwards. Everything
 * that can CHANGE — vehicles and users you add or edit, alarms raised by the
 * live feed, commands you send, the audit trail — lives here, behind a
 * version counter.
 *
 * Why a version counter and not a state library: React 18's
 * `useSyncExternalStore` is built for exactly this shape (subscribe +
 * getSnapshot), it tears correctly under concurrent rendering, and it means
 * a mutation from ANY screen re-renders every list showing that data without
 * a single prop being threaded through.
 *
 * `getSnapshot` must return a value that is `Object.is`-stable between
 * mutations or React re-renders forever — which is why it returns the
 * version NUMBER, not the arrays.
 */

import type {
  Alarm,
  AuditEntry,
  Battery,
  CommandRecord,
  Geofence,
  MaintenanceFlag,
  PacketLogEntry,
  Rider,
  SwapStation,
  User,
  Vehicle,
} from '@/types/domain';

import {
  getFleet,
  getGeofences,
  getMaintenanceFlags,
  getRiders,
  getStations,
  getUsers,
  seedAlarms,
} from './generator';

/** Newest first, capped — an unbounded log is a memory leak with a UI. */
const PACKET_LOG_LIMIT = 400;
const ALARM_LIMIT = 300;

class MockDb {
  private listeners = new Set<() => void>();
  private version = 0;

  vehicles: Vehicle[];
  batteries: Battery[];
  users: User[];
  riders: Rider[];
  geofences: Geofence[];
  stations: SwapStation[];
  maintenance: MaintenanceFlag[];
  alarms: Alarm[];
  commands: CommandRecord[] = [];
  audit: AuditEntry[] = [];
  packets: PacketLogEntry[] = [];

  constructor() {
    const fleet = getFleet();
    this.vehicles = [...fleet.vehicles];
    this.batteries = [...fleet.batteries];
    this.users = [...getUsers()];
    this.riders = [...getRiders()];
    this.geofences = [...getGeofences()];
    this.stations = [...getStations()];
    this.maintenance = [...getMaintenanceFlags()];
    this.alarms = seedAlarms();
  }

  /* ---- the useSyncExternalStore contract ---- */

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = (): number => this.version;

  /** Every write goes through here, so no mutation can forget to notify. */
  commit<T>(fn: () => T): T {
    const result = fn();
    this.version++;
    // Copy first: a listener that unsubscribes during notification would
    // otherwise mutate the set we are iterating.
    for (const listener of [...this.listeners]) listener();
    return result;
  }

  /* ---- helpers ---- */

  nextId(prefix: string, existing: { id: string }[]): string {
    let n = existing.length + 1;
    const taken = new Set(existing.map((e) => e.id));
    let candidate = `${prefix}-${String(n).padStart(4, '0')}`;
    while (taken.has(candidate)) candidate = `${prefix}-${String(++n).padStart(4, '0')}`;
    return candidate;
  }

  pushAlarm(alarm: Alarm) {
    this.commit(() => {
      this.alarms = [alarm, ...this.alarms].slice(0, ALARM_LIMIT);
    });
  }

  /**
   * Packets deliberately do NOT go through `commit`.
   *
   * They arrive every 1.5 seconds. Bumping the version that often would
   * re-render every list in the app forty times a minute to update a log
   * pane nobody else is looking at. The packet pane subscribes to the
   * realtime client's own `packet` event instead and reads this array — so
   * the log stays live and the rest of the app stays still.
   */
  pushPackets(entries: PacketLogEntry[]) {
    if (entries.length === 0) return;
    this.packets = [...entries, ...this.packets].slice(0, PACKET_LOG_LIMIT);
  }

  pushAudit(entry: AuditEntry) {
    this.commit(() => {
      this.audit = [entry, ...this.audit];
    });
  }
}

export const db = new MockDb();
