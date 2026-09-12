/**
 * Trip playback.
 *
 * A scrubber over a day's riding: play, pause, speed up, drag to any moment,
 * and watch the bike move along its own GPS trail with speed and state of
 * charge following the playhead.
 *
 * Two implementation notes worth stating, because both are where playback
 * components usually go wrong:
 *
 *   1. THE CLOCK IS requestAnimationFrame, NOT setInterval. An interval
 *      drifts, keeps firing in a background tab, and ties the animation to a
 *      timer rather than to frames. rAF stops when the tab is hidden and
 *      advances by measured elapsed time, so 4× really is four times.
 *   2. THE PLAYHEAD IS TIME, NOT AN INDEX. Samples are 20 s apart, but a
 *      trip can be paused and resumed at any point; interpolating between
 *      the two samples either side of the current time is what makes the
 *      marker glide instead of hop.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Trip } from '@/types/domain';
import { listTrips } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { formatDecimal, formatNumber } from '@/lib/utils/format';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { LineChart } from '@/components/charts/LineChart';
import { FleetMap } from '@/components/map/FleetMap';
import { SpeedLegend } from '@/components/map/SpeedLegend';

const SPEEDS = [1, 4, 16] as const;

const clockTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function TripPlayback({ vehicleId }: { vehicleId: string }) {
  const trips = useAsync(({ signal }) => listTrips(vehicleId, signal), [vehicleId]);
  const [tripId, setTripId] = useState<string>('');

  const list = trips.data ?? [];
  const trip = list.find((t) => t.id === tripId) ?? list[0] ?? null;

  if (trips.error) return <ErrorState error={trips.error} onRetry={trips.refetch} />;
  if (trips.isLoading) return <Skeleton height={420} />;
  if (!trip) return <EmptyState icon="route" title="No trips recorded for this vehicle today" />;

  return (
    <Player
      // Remounting per trip resets the playhead, which is what a user expects
      // from picking a different trip — no stale scrub position.
      key={trip.id}
      trip={trip}
      trips={list}
      onSelectTrip={setTripId}
    />
  );
}

function Player({
  trip,
  trips,
  onSelectTrip,
}: {
  trip: Trip;
  trips: Trip[];
  onSelectTrip: (id: string) => void;
}) {
  const duration = trip.endedAt - trip.startedAt;
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState<(typeof SPEEDS)[number]>(4);

  const frameRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const rateRef = useRef(rate);
  rateRef.current = rate;

  /* ---- the clock ---- */
  useEffect(() => {
    if (!playing) return;

    lastTickRef.current = performance.now();

    const step = (now: number) => {
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setElapsed((current) => {
        // Real time × the chosen rate. Tying progress to measured elapsed
        // time is what makes 4× exact regardless of frame rate.
        const next = current + delta * rateRef.current;
        if (next >= duration) {
          setPlaying(false);
          return duration;
        }
        return next;
      });

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [playing, duration]);

  const playheadAt = trip.startedAt + elapsed;

  /* ---- interpolate the position at the playhead ---- */
  const current = useMemo(() => {
    const samples = trip.samples;
    if (samples.length === 0) return null;

    // Binary search: a linear scan is fine at 150 samples and wrong at
    // 15,000, and this component is the one that will be handed a long trip.
    let lo = 0;
    let hi = samples.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid]!.t <= playheadAt) lo = mid;
      else hi = mid;
    }

    const a = samples[lo]!;
    const b = samples[Math.min(hi, samples.length - 1)]!;
    const span = Math.max(1, b.t - a.t);
    const f = Math.max(0, Math.min(1, (playheadAt - a.t) / span));

    return {
      index: lo,
      lat: a.lat + (b.lat - a.lat) * f,
      lng: a.lng + (b.lng - a.lng) * f,
      speed: Math.round(a.speed + (b.speed - a.speed) * f),
      soc: a.soc + (b.soc - a.soc) * f,
    };
  }, [trip.samples, playheadAt]);

  /** Only the trail travelled so far — the rest appears as it is ridden. */
  const travelled = useMemo(
    () =>
      trip.samples
        .filter((s) => s.t <= playheadAt)
        .map((s) => ({ lat: s.lat, lng: s.lng, t: s.t, speed: s.speed })),
    [trip.samples, playheadAt]
  );

  const series = useMemo(() => {
    const minutes = (t: number) => (t - trip.startedAt) / 60_000;
    return [
      {
        id: 'speed',
        label: 'Speed (km/h)',
        points: trip.samples.map((s) => ({ x: minutes(s.t), y: s.speed })),
      },
      {
        id: 'soc',
        label: 'SOC (%)',
        points: trip.samples.map((s) => ({ x: minutes(s.t), y: s.soc })),
      },
    ];
  }, [trip]);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      // Restart from the top if we are sitting at the end.
      if (!p && elapsed >= duration) setElapsed(0);
      return !p;
    });
  }, [elapsed, duration]);

  const tripOptions = trips.map((t) => ({
    value: t.id,
    label: `${clockTime(t.startedAt)} → ${clockTime(t.endedAt)} · ${formatDecimal(t.distanceKm, 1)} km`,
  }));

  return (
    <div className="grid" style={{ gap: 'var(--sp-4)' }}>
      <div className="row" style={{ gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
        <Select value={trip.id} options={tripOptions} onChange={onSelectTrip} variant="primary" />
        <span className="pill">{formatDecimal(trip.distanceKm, 1)} km</span>
        <span className="pill">{formatDecimal(trip.kwh, 2)} kWh</span>
        <span className="pill">max {trip.maxSpeed} km/h</span>
        <span className="pill">
          SOC {trip.socStart}% → {trip.socEnd}%
        </span>
      </div>

      <Card flush style={{ position: 'relative', overflow: 'hidden' }}>
        <FleetMap
          track={travelled.length > 1 ? travelled : undefined}
          ghost={current ? { lat: current.lat, lng: current.lng } : null}
          center={current ? { lat: current.lat, lng: current.lng } : undefined}
          zoom={14}
          height={420}
          cluster={false}
        />
        <div style={{ position: 'absolute', bottom: 'var(--sp-4)', left: 'var(--sp-4)', zIndex: 2 }}>
          <SpeedLegend />
        </div>
      </Card>

      <div className="scrubber">
        <Button
          variant="primary"
          iconOnly
          icon={playing ? 'pause' : 'play'}
          onClick={toggle}
          aria-label={playing ? 'Pause playback' : 'Play trip'}
        />

        <span className="scrubber__time">{clockTime(playheadAt)}</span>

        <input
          type="range"
          min={0}
          max={duration}
          step={1000}
          value={elapsed}
          aria-label="Scrub through the trip"
          onChange={(e) => {
            setPlaying(false);
            setElapsed(Number(e.target.value));
          }}
        />

        <span className="scrubber__time">{clockTime(trip.endedAt)}</span>

        <div className="row" style={{ gap: 'var(--sp-1)' }}>
          {SPEEDS.map((s) => (
            <button
              key={s}
              className={s === rate ? 'btn btn--primary btn--sm' : 'btn btn--ghost btn--sm'}
              onClick={() => setRate(s)}
              aria-pressed={s === rate}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* The readout follows the playhead, so the numbers and the marker can
          never disagree about where the bike is. */}
      <div className="auto-grid auto-grid--tight">
        <Readout icon="speed" label="Speed" value={current ? `${current.speed} km/h` : '–'} />
        <Readout icon="battery" label="State of charge" value={current ? `${formatDecimal(current.soc, 1)} %` : '–'} />
        <Readout
          icon="route"
          label="Sample"
          value={current ? `${formatNumber(current.index + 1)} of ${formatNumber(trip.samples.length)}` : '–'}
        />
        <Readout icon="pin" label="Position" value={current ? `${current.lat.toFixed(4)}, ${current.lng.toFixed(4)}` : '–'} />
      </div>

      <Card title="Speed and charge across the trip">
        <LineChart
          series={series}
          height={260}
          xLabel="Minutes into the trip"
          formatX={(x) => `${Math.round(x)}m`}
          zeroBased
        />
      </Card>
    </div>
  );
}

function Readout({ icon, label, value }: { icon: 'speed' | 'battery' | 'route' | 'pin'; label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat__icon" aria-hidden="true">
        <Icon name={icon} size={18} />
      </span>
      <div>
        <div className="stat__label">{label}</div>
        <div className="stat__value" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
