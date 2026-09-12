/**
 * RealtimeClient — the live telemetry feed.
 *
 * TRANSPORT: modelled on **EventSource / Server-Sent Events**, not WebSocket.
 * That is a deliberate choice for this shape of data:
 *
 *   - the feed is one-directional (the server pushes telemetry; the browser
 *     never pushes back), which is exactly what SSE is for;
 *   - it is plain HTTP, so it survives proxies and corporate networks that
 *     silently kill `ws://`;
 *   - the browser handles reconnection, and `Last-Event-ID` lets the server
 *     replay what you missed — a gap-free resume you would have to build by
 *     hand over a socket.
 *
 * The cost is that COMMANDS need their own path. They do not travel on this
 * feed; `lib/api/commands.ts` posts them, and their acknowledgements come
 * back down here as `command` events. That split is honest to how a real
 * telematics platform works: the uplink is a firehose, the downlink is a
 * handful of authenticated requests a day.
 *
 * `MockTransport` below stands in for the server. Swapping to a real
 * endpoint means constructing the client with `new EventSourceTransport(url)`
 * — nothing else in the app changes, because everything downstream only
 * knows `addEventListener` / `close` / `state`.
 */

import type { PacketLogEntry, RealtimeState, TelemetryFrame } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { makePacket } from '@/lib/mock/generator';

export interface RealtimeEvents {
  telemetry: TelemetryFrame[];
  packet: PacketLogEntry[];
  state: RealtimeState;
}

type Handler<K extends keyof RealtimeEvents> = (payload: RealtimeEvents[K]) => void;

/** What a transport must provide. Both the mock and a real EventSource fit. */
export interface Transport {
  start(onMessage: (type: 'telemetry' | 'packet', data: unknown) => void, onState: (s: RealtimeState) => void): void;
  stop(): void;
}

/* ------------------------------------------------------------------ *
 * Mock transport — stands in for the SSE endpoint
 * ------------------------------------------------------------------ */

const TICK_MS = 1500;
/** Frames per tick. The real feed would push every vehicle; a browser tab
 *  cannot repaint 14,000 markers 40 times a minute, so the mock samples. */
const FRAMES_PER_TICK = 26;

export class MockTransport implements Transport {
  private timer: ReturnType<typeof setInterval> | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private cursor = 0;
  private packetSeq = 0;

  start(
    onMessage: (type: 'telemetry' | 'packet', data: unknown) => void,
    onState: (s: RealtimeState) => void
  ) {
    onState('connecting');

    // A connection that opens instantly hides every bug in the connecting
    // state, so the mock takes a beat like the real thing does.
    this.openTimer = setTimeout(() => {
      onState('open');

      this.timer = setInterval(() => {
        const vehicles = db.vehicles;
        if (vehicles.length === 0) return;

        const frames: TelemetryFrame[] = [];
        const packets: PacketLogEntry[] = [];
        const now = Date.now();

        for (let i = 0; i < FRAMES_PER_TICK; i++) {
          const vehicle = vehicles[this.cursor % vehicles.length]!;
          this.cursor++;

          if (vehicle.status === 'offline') continue;

          const moving = vehicle.motion === 'running' && vehicle.ignition;
          const speed = moving ? Math.max(0, Math.round(vehicle.avgVelocity + (Math.random() - 0.5) * 16)) : 0;
          const heading = Math.random() * 360;
          const stepDeg = (speed * (TICK_MS / 3_600_000)) / 111;

          const lat = vehicle.position.lat + Math.sin((heading * Math.PI) / 180) * stepDeg;
          const lng =
            vehicle.position.lng +
            (Math.cos((heading * Math.PI) / 180) * stepDeg) /
              Math.cos((vehicle.position.lat * Math.PI) / 180);

          // The mock mutates the fleet in place so the map, the tables and
          // the feed cannot disagree about where a bike is.
          vehicle.position = { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
          vehicle.lastSeen = now;

          // Occasional genuinely alarming values, so the alarm pipeline is
          // exercised rather than merely present.
          const hot = Math.random() < 0.004;
          const imbalanced = Math.random() < 0.006;

          frames.push({
            vehicleId: vehicle.id,
            vehicleNo: vehicle.vehicleNo,
            at: now,
            lat: vehicle.position.lat,
            lng: vehicle.position.lng,
            speed,
            heading: Math.round(heading),
            soc: vehicle.soc,
            temperature: hot
              ? Number((61 + Math.random() * 16).toFixed(1))
              : Number((vehicle.avgTemperature + (Math.random() - 0.5) * 6).toFixed(1)),
            ignition: vehicle.ignition,
            cellImbalanceMv: imbalanced
              ? Math.round(205 + Math.random() * 220)
              : Math.round(12 + Math.random() * 60),
          });

          if (i % 6 === 0) packets.push(makePacket(vehicle.vehicleNo, now, this.packetSeq++));
        }

        if (frames.length > 0) onMessage('telemetry', frames);
        if (packets.length > 0) onMessage('packet', packets);
      }, TICK_MS);
    }, 450);
  }

  stop() {
    if (this.openTimer) clearTimeout(this.openTimer);
    if (this.timer) clearInterval(this.timer);
    this.openTimer = null;
    this.timer = null;
  }
}

/* ------------------------------------------------------------------ *
 * Real transport — kept here so the swap is visibly one line
 * ------------------------------------------------------------------ */

export class EventSourceTransport implements Transport {
  private source: EventSource | null = null;

  constructor(private readonly url: string) {}

  start(
    onMessage: (type: 'telemetry' | 'packet', data: unknown) => void,
    onState: (s: RealtimeState) => void
  ) {
    onState('connecting');
    const source = new EventSource(this.url, { withCredentials: true });
    this.source = source;

    source.onopen = () => onState('open');
    // EventSource reconnects on its own; `readyState` says which it is doing.
    source.onerror = () => onState(source.readyState === source.CLOSED ? 'closed' : 'connecting');

    source.addEventListener('telemetry', (e) => onMessage('telemetry', JSON.parse((e as MessageEvent).data)));
    source.addEventListener('packet', (e) => onMessage('packet', JSON.parse((e as MessageEvent).data)));
  }

  stop() {
    this.source?.close();
    this.source = null;
  }
}

/* ------------------------------------------------------------------ *
 * The client
 * ------------------------------------------------------------------ */

export class RealtimeClient {
  private handlers: { [K in keyof RealtimeEvents]: Set<Handler<K>> } = {
    telemetry: new Set(),
    packet: new Set(),
    state: new Set(),
  };

  private started = false;
  private _state: RealtimeState = 'closed';

  /** Newest frame per vehicle, so a screen that mounts late still has data. */
  readonly latest = new Map<string, TelemetryFrame>();

  constructor(private readonly transport: Transport = new MockTransport()) {}

  get state(): RealtimeState {
    return this._state;
  }

  addEventListener<K extends keyof RealtimeEvents>(type: K, handler: Handler<K>): () => void {
    (this.handlers[type] as Set<Handler<K>>).add(handler);

    // Reference-counted: the first DATA listener opens the feed, the last
    // closes it, so a tab left on a static page does not stream forever.
    // A 'state' listener only observes — the topbar's connection pill must
    // not be the thing that holds a connection open.
    if (type !== 'state' && !this.started) this.open();

    return () => this.removeEventListener(type, handler);
  }

  removeEventListener<K extends keyof RealtimeEvents>(type: K, handler: Handler<K>) {
    (this.handlers[type] as Set<Handler<K>>).delete(handler);
    if (this.listenerCount() === 0) this.close();
  }

  private listenerCount() {
    return this.handlers.telemetry.size + this.handlers.packet.size;
  }

  private emit<K extends keyof RealtimeEvents>(type: K, payload: RealtimeEvents[K]) {
    for (const handler of [...(this.handlers[type] as Set<Handler<K>>)]) {
      try {
        handler(payload);
      } catch (error) {
        // One broken subscriber must not stop the feed for the others.
        console.error('Realtime subscriber threw', error);
      }
    }
  }

  open() {
    if (this.started) return;
    this.started = true;

    this.transport.start(
      (type, data) => {
        if (type === 'telemetry') {
          const frames = data as TelemetryFrame[];
          for (const frame of frames) this.latest.set(frame.vehicleId, frame);
          this.emit('telemetry', frames);
        } else {
          const packets = data as PacketLogEntry[];
          db.pushPackets(packets);
          this.emit('packet', packets);
        }
      },
      (state) => {
        this._state = state;
        this.emit('state', state);
      }
    );
  }

  close() {
    if (!this.started) return;
    this.started = false;
    this.transport.stop();
    this._state = 'closed';
    this.emit('state', 'closed');
  }
}

/**
 * One client for the whole app. Ten components subscribing must not mean ten
 * connections — that is the single most common mistake with live feeds.
 *
 * To point at a real server:
 *   export const realtime = new RealtimeClient(new EventSourceTransport('/api/stream'));
 */
export const realtime = new RealtimeClient();
