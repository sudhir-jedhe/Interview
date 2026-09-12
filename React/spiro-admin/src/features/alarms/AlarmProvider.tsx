/**
 * The alarm engine.
 *
 * It sits on the live feed and turns telemetry into alarms: cell temperature
 * over the thermal-runaway threshold, cell voltage imbalance over the
 * balancing threshold, and vehicles leaving their operating zone.
 *
 * The hard part is not detection, it is NOT DROWNING THE OPERATOR:
 *
 *   - DEDUPE + COOLDOWN. A hot pack reports every 1.5 s. Without a per
 *     subject-and-kind cooldown the alarm centre gets 40 identical rows a
 *     minute and the operator stops reading it.
 *   - The geofence check runs against precompiled fences with bounding
 *     boxes, because it runs for every frame of every vehicle.
 *   - Sound is opt-in and rate-limited (see chime.ts).
 *
 * Thresholds are operator-configurable and persist per browser, because the
 * number that decides when you get woken up is not something to hard-code.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

import type { Alarm, AlarmSeverity, AlarmThresholds } from '@/types/domain';
import { DEFAULT_THRESHOLDS } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { realtime } from '@/lib/realtime/client';
import { compileFences, evaluateFences } from '@/lib/geo/polygon';
import { recordAudit } from '@/lib/audit';
import { useDbSelector } from '@/hooks/useDb';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/features/auth/AuthProvider';
import { armAudio, disarmAudio, playChime } from './chime';

/** One alarm per subject per kind per five minutes. */
const COOLDOWN_MS = 5 * 60_000;

interface AlarmContextValue {
  alarms: Alarm[];
  active: Alarm[];
  criticalCount: number;
  unacknowledgedCount: number;
  thresholds: AlarmThresholds;
  setThresholds: (next: AlarmThresholds) => void;
  toggleSound: () => void;
  acknowledge: (id: string) => void;
  acknowledgeAll: () => void;
}

const AlarmContext = createContext<AlarmContextValue | null>(null);

export function AlarmProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const [thresholds, setStoredThresholds] = useLocalStorage<AlarmThresholds>(
    'alarm-thresholds',
    DEFAULT_THRESHOLDS
  );

  const alarms = useDbSelector(() => db.alarms);

  /* ---- the engine ---- */

  // Thresholds and user change often; the subscription must not restart for
  // them, so they live in refs the handler reads.
  const thresholdRef = useRef(thresholds);
  const userRef = useRef(user);
  useEffect(() => {
    thresholdRef.current = thresholds;
    userRef.current = user;
  });

  const lastRaised = useRef(new Map<string, number>());

  useEffect(() => {
    // No feed before sign-in. Subscribing on the login screen would open the
    // stream for an anonymous visitor and raise alarms nobody is watching.
    if (status !== 'authenticated') return;

    // Compiled once per fence-set change, not per frame.
    const fences = compileFences(db.geofences);
    const vehicleCountry = new Map(db.vehicles.map((v) => [v.id, v.country] as const));
    const vehicleBattery = new Map(db.vehicles.map((v) => [v.id, v.batteryId] as const));

    const raise = (
      key: string,
      build: () => Omit<Alarm, 'id' | 'at' | 'acknowledgedAt' | 'acknowledgedBy'>
    ) => {
      const now = Date.now();
      const previous = lastRaised.current.get(key) ?? 0;
      if (now - previous < COOLDOWN_MS) return;
      lastRaised.current.set(key, now);

      const alarm: Alarm = {
        ...build(),
        id: `alm-${now}-${key}`,
        at: now,
        acknowledgedAt: null,
        acknowledgedBy: null,
      };

      db.pushAlarm(alarm);
      if (thresholdRef.current.soundArmed) playChime(alarm.severity);
    };

    const off = realtime.addEventListener('telemetry', (frames) => {
      const t = thresholdRef.current;

      for (const frame of frames) {
        if (frame.temperature > t.cellTempC) {
          raise(`thermal:${frame.vehicleId}`, () => ({
            kind: 'thermal_runaway',
            severity: 'critical',
            subjectType: 'battery',
            subjectId: vehicleBattery.get(frame.vehicleId) ?? frame.vehicleId,
            subjectLabel: vehicleBattery.get(frame.vehicleId) ?? frame.vehicleNo,
            message: `Cell temperature ${frame.temperature} °C exceeds the ${t.cellTempC} °C thermal-runaway threshold on ${frame.vehicleNo}`,
            value: frame.temperature,
            threshold: t.cellTempC,
            unit: '°C',
          }));
        }

        if (frame.cellImbalanceMv > t.cellImbalanceMv) {
          raise(`imbalance:${frame.vehicleId}`, () => ({
            kind: 'cell_imbalance',
            severity: 'serious',
            subjectType: 'battery',
            subjectId: vehicleBattery.get(frame.vehicleId) ?? frame.vehicleId,
            subjectLabel: vehicleBattery.get(frame.vehicleId) ?? frame.vehicleNo,
            message: `Cell imbalance ${frame.cellImbalanceMv} mV exceeds the ${t.cellImbalanceMv} mV balancing threshold on ${frame.vehicleNo}`,
            value: frame.cellImbalanceMv,
            threshold: t.cellImbalanceMv,
            unit: 'mV',
          }));
        }

        const country = vehicleCountry.get(frame.vehicleId);
        if (country) {
          const breach = evaluateFences({ lat: frame.lat, lng: frame.lng }, country, fences);
          if (breach) {
            raise(`geo:${frame.vehicleId}`, () => ({
              kind: 'geofence_exit',
              severity: breach.kind === 'entered_exclusion' ? 'serious' : 'warning',
              subjectType: 'vehicle',
              subjectId: frame.vehicleId,
              subjectLabel: frame.vehicleNo,
              message:
                breach.kind === 'entered_exclusion'
                  ? `${frame.vehicleNo} entered the restricted sector “${breach.fence.name}”`
                  : `${frame.vehicleNo} left its operating zone “${breach.fence.name}”`,
              value: 1,
              threshold: 0,
              unit: '',
            }));
          }
        }
      }
    });

    return off;
    // Re-arm when the fence set changes. `db.geofences` identity changes on
    // every geofence mutation, which is exactly the trigger we want.
  }, [db.geofences, status]);

  /* ---- actions ---- */

  const setThresholds = useCallback(
    (next: AlarmThresholds) => {
      setStoredThresholds(next);
      recordAudit({
        actor: userRef.current,
        action: 'Updated alarm thresholds',
        targetType: 'settings',
        targetId: 'alarm-thresholds',
        targetLabel: 'Alarm thresholds',
        detail: `Cell temperature ${next.cellTempC} °C, imbalance ${next.cellImbalanceMv} mV, SOH floor ${next.sohFloor} %`,
      });
    },
    [setStoredThresholds]
  );

  const toggleSound = useCallback(() => {
    // The side effects run HERE, in the click handler, not inside the state
    // updater: React may call an updater twice, and starting an AudioContext
    // twice per click is exactly the kind of thing that works in dev and
    // leaks in production. Arming inside the click is also what satisfies the
    // browser's user-gesture requirement for audio.
    const arming = !thresholdRef.current.soundArmed;

    if (!arming) {
      disarmAudio();
      setStoredThresholds((current) => ({ ...current, soundArmed: false }));
      return;
    }

    const ok = armAudio();
    if (ok) playChime('warning');
    setStoredThresholds((current) => ({ ...current, soundArmed: ok }));
  }, [setStoredThresholds]);

  const acknowledge = useCallback((id: string) => {
    db.commit(() => {
      db.alarms = db.alarms.map((a) =>
        a.id === id
          ? { ...a, acknowledgedAt: Date.now(), acknowledgedBy: userRef.current?.name ?? 'Operator' }
          : a
      );
    });
  }, []);

  const acknowledgeAll = useCallback(() => {
    const now = Date.now();
    const name = userRef.current?.name ?? 'Operator';
    db.commit(() => {
      db.alarms = db.alarms.map((a) =>
        a.acknowledgedAt ? a : { ...a, acknowledgedAt: now, acknowledgedBy: name }
      );
    });
    recordAudit({
      actor: userRef.current,
      action: 'Acknowledged all alarms',
      targetType: 'settings',
      targetId: 'alarms',
      targetLabel: 'Alarm centre',
      detail: 'Bulk acknowledgement',
    });
  }, []);

  const value = useMemo<AlarmContextValue>(() => {
    const active = alarms.filter((a) => !a.acknowledgedAt);
    return {
      alarms,
      active,
      criticalCount: active.filter((a) => a.severity === 'critical').length,
      unacknowledgedCount: active.length,
      thresholds,
      setThresholds,
      toggleSound,
      acknowledge,
      acknowledgeAll,
    };
  }, [alarms, thresholds, setThresholds, toggleSound, acknowledge, acknowledgeAll]);

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
}

export function useAlarms(): AlarmContextValue {
  const context = useContext(AlarmContext);
  if (!context) throw new Error('useAlarms must be used inside <AlarmProvider>');
  return context;
}

export const SEVERITY_COLOR: Record<AlarmSeverity, string> = {
  critical: 'var(--status-critical)',
  serious: 'var(--status-serious)',
  warning: 'var(--status-warning)',
};

export const SEVERITY_LABEL: Record<AlarmSeverity, string> = {
  critical: 'Critical',
  serious: 'Serious',
  warning: 'Warning',
};
