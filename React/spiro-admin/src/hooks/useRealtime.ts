/**
 * Hooks over the live feed.
 *
 * The rule that shapes all of these: the feed pushes ~26 frames every 1.5 s,
 * and React must not re-render 26 times for that. Every hook here coalesces
 * a burst into ONE state update, and the ones that only need the latest
 * value per vehicle keep a mutable map and flush on an interval instead of
 * on every message.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { PacketLogEntry, RealtimeState, TelemetryFrame } from '@/types/domain';
import { realtime } from '@/lib/realtime/client';
import { db } from '@/lib/mock/db';

/** Connection state, for the status pill in the topbar. */
export function useRealtimeState(): RealtimeState {
  const subscribe = useCallback((listener: () => void) => {
    const handler = () => listener();
    realtime.addEventListener('state', handler);
    return () => realtime.removeEventListener('state', handler);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => realtime.state,
    () => 'closed' as const
  );
}

/**
 * Latest frame for ONE vehicle. Cheap: it ignores every frame that is not
 * about this vehicle, so a detail page does not re-render for the fleet.
 */
export function useVehicleTelemetry(vehicleId: string | undefined): TelemetryFrame | null {
  const [frame, setFrame] = useState<TelemetryFrame | null>(() =>
    vehicleId ? realtime.latest.get(vehicleId) ?? null : null
  );

  useEffect(() => {
    if (!vehicleId) return;
    setFrame(realtime.latest.get(vehicleId) ?? null);

    const off = realtime.addEventListener('telemetry', (frames) => {
      // Search backwards: the freshest frame for this vehicle wins, and
      // most bursts contain it at most once.
      for (let i = frames.length - 1; i >= 0; i--) {
        const f = frames[i]!;
        if (f.vehicleId === vehicleId) {
          setFrame(f);
          return;
        }
      }
    });

    return off;
  }, [vehicleId]);

  return frame;
}

/**
 * The whole live map: one frame per vehicle, flushed on a fixed cadence.
 *
 * Rendering on every burst would repaint the map 40 times a minute for a
 * handful of moved pixels. Accumulating into a ref and flushing on an
 * interval decouples paint rate from feed rate — the standard fix.
 */
export function useTelemetryMap(flushMs = 2000): Map<string, TelemetryFrame> {
  const pending = useRef(new Map<string, TelemetryFrame>());
  const [snapshot, setSnapshot] = useState<Map<string, TelemetryFrame>>(() => new Map(realtime.latest));

  useEffect(() => {
    const off = realtime.addEventListener('telemetry', (frames) => {
      for (const frame of frames) pending.current.set(frame.vehicleId, frame);
    });

    const timer = setInterval(() => {
      if (pending.current.size === 0) return;
      // A NEW Map each flush: mutating the existing one would not change
      // identity, and React would skip the render.
      setSnapshot((current) => {
        const next = new Map(current);
        for (const [id, frame] of pending.current) next.set(id, frame);
        return next;
      });
      pending.current.clear();
    }, flushMs);

    return () => {
      off();
      clearInterval(timer);
    };
  }, [flushMs]);

  return snapshot;
}

/** The engineer's packet pane. The db already caps the log; this just reads it. */
export function usePacketLog(limit = 60): PacketLogEntry[] {
  const [packets, setPackets] = useState<PacketLogEntry[]>(() => db.packets.slice(0, limit));

  useEffect(() => {
    const off = realtime.addEventListener('packet', () => {
      setPackets(db.packets.slice(0, limit));
    });
    return off;
  }, [limit]);

  return packets;
}

/** Frames per second and total received — the feed's own health. */
export function useFeedStats() {
  const [stats, setStats] = useState({ framesPerSecond: 0, total: 0 });
  const counter = useRef({ window: 0, total: 0 });

  useEffect(() => {
    const off = realtime.addEventListener('telemetry', (frames) => {
      counter.current.window += frames.length;
      counter.current.total += frames.length;
    });

    const timer = setInterval(() => {
      setStats({
        framesPerSecond: Math.round(counter.current.window / 3),
        total: counter.current.total,
      });
      counter.current.window = 0;
    }, 3000);

    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  return stats;
}
