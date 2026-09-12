/**
 * Vehicle detail — telemetry, GPS trail, trip playback and OTA control.
 *
 * Three tabs, because they answer three different questions: what is this
 * vehicle doing NOW (overview, live off the feed), what did it do TODAY
 * (trip playback), and what can I make it do (commands).
 *
 * The position on the overview map prefers the live frame over the stored
 * one, so the marker and the "Live" pill can never disagree.
 *
 * The ignition toggle is the app's only write, and it is gated on the
 * `vehicle:control` permission: a viewer sees the state but not the switch.
 * It updates optimistically and rolls back on failure — the API rejects
 * control of an offline vehicle, so that path is reachable, not theoretical.
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { getVehicle, setIgnition } from '@/lib/api/client';
import { useAsync, useAsyncAction } from '@/hooks/useAsync';
import { formatDateTime, formatNumber, orDash } from '@/lib/utils/format';
import { downloadCsv, timestampedName } from '@/lib/utils/export';

import { useVehicleTelemetry } from '@/hooks/useRealtime';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { Can } from '@/features/auth/ProtectedRoute';
import { AreaChart } from '@/components/charts/AreaChart';
import { Gauge } from '@/components/charts/Gauge';
import { FleetMap } from '@/components/map/FleetMap';
import { SpeedLegend } from '@/components/map/SpeedLegend';
import { TripPlayback } from './TripPlayback';
import { CommandPanel } from './CommandPanel';

type TabKey = 'overview' | 'playback' | 'commands';

const TABS = [
  { value: 'overview' as const, label: 'Overview' },
  { value: 'playback' as const, label: 'Trip Playback' },
  { value: 'commands' as const, label: 'Commands' },
];

export function VehicleInfoPage() {
  const { id = '' } = useParams();
  const toast = useToast();

  const { data: vehicle, error, isLoading, refetch } = useAsync(
    ({ signal }) => getVehicle(id, signal),
    [id]
  );

  const [tab, setTab] = useState<TabKey>('overview');

  // The live frame, when the feed has one for this vehicle.
  const frame = useVehicleTelemetry(id);

  // Optimistic local view of the ignition state.
  const [optimisticIgnition, setOptimisticIgnition] = useState<boolean | null>(null);
  const ignitionAction = useAsyncAction(setIgnition);

  if (error) {
    return (
      <div className="page">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const ignition = optimisticIgnition ?? vehicle?.ignition ?? false;

  const toggleIgnition = async () => {
    if (!vehicle) return;

    const next = !ignition;
    setOptimisticIgnition(next); // paint immediately

    const result = await ignitionAction.run(vehicle.id, next);

    if (!result) {
      // Roll back and say why — the server refuses offline vehicles.
      setOptimisticIgnition(null);
      toast.error(ignitionAction.error?.message ?? 'Could not change ignition');
      return;
    }

    toast.success(`Ignition turned ${next ? 'on' : 'off'}`);
  };

  const exportTelemetry = () => {
    if (!vehicle) return;

    downloadCsv(
      timestampedName(`vehicle_${vehicle.vehicleNo}_telemetry`, 'csv'),
      vehicle.telemetry as unknown as Record<string, unknown>[],
      [
        { key: 'hour', header: 'Hour' },
        { key: 'velocity', header: 'Velocity (m/s)' },
        { key: 'temperature', header: 'Temperature (degC)' },
        { key: 'soc', header: 'SOC (%)' },
      ]
    );
    toast.success('Telemetry exported');
  };

  return (
    <>
      <Breadcrumbs currentLabel={vehicle?.vehicleNo} />

      <div className="page">
        <div className="row" style={{ marginBottom: 'var(--sp-4)' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            {vehicle?.vehicleNo ?? 'Vehicle'}
          </h1>
          <span className="spacer" />
          <Button variant="secondary" icon="download" onClick={exportTelemetry} disabled={!vehicle}>
            Export
          </Button>
        </div>

        {isLoading || !vehicle ? (
          <div className="auto-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} height={104} />
            ))}
          </div>
        ) : (
          <div className="grid">
            <Tabs value={tab} items={TABS} onChange={setTab} />

            {tab === 'playback' && <TripPlayback vehicleId={vehicle.id} />}

            {tab === 'commands' && (
              <div className="grid" style={{ gap: 'var(--sp-4)' }}>
                <Card title="Over-the-air commands" accent>
                  <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                    Commands do not travel on the telemetry stream — that feed is one-directional.
                    Each one is posted separately and its acknowledgement comes back down the feed,
                    which is why a command reports <em>queued</em> before it reports a result.
                  </p>

                  <Can
                    permission="vehicle:control"
                    fallback={
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                        You don’t have permission to command this vehicle.
                      </p>
                    }
                  >
                    <CommandPanel vehicle={vehicle} />
                  </Can>
                </Card>
              </div>
            )}

            {tab === 'overview' && (
              <>
            {/* ---- identity + stat tiles ---- */}
            <div className="split split--lead">
              <Card>
                <div style={{ textAlign: 'center', marginBottom: 'var(--sp-3)' }}>
                  <Icon name="bike" size={72} style={{ margin: '0 auto', color: 'var(--viz-1)' }} />
                </div>

                <Badge tone={vehicle.status === 'online' ? 'success' : 'neutral'}>
                  {vehicle.status}
                </Badge>

                <dl style={{ marginTop: 'var(--sp-4)', display: 'grid', gap: 'var(--sp-2)' }}>
                  <Row label="IMEI No" value={vehicle.imei} />
                  <Row label="Model" value={vehicle.model} />
                  <Row label="Country" value={vehicle.country} />
                  <Row label="Assigned to" value={vehicle.assignedTo ?? '–'} />
                  <Row label="Last seen" value={formatDateTime(vehicle.lastSeen)} />
                </dl>
              </Card>

              <div
                className="auto-grid"
                style={{ alignContent: 'start' }}
              >
                <Stat label="Battery ID" value={vehicle.batteryId} icon="battery" />
                <Stat label="SOH" value={`${vehicle.soh} %`} icon="charge" />
                <Stat label="SOC" value={`${vehicle.soc} %`} icon="battery" />
                <Stat label="Odometer" value={`${formatNumber(vehicle.odometerKm)} km`} icon="route" />
                <Stat
                  label="Available Range"
                  // A missing reading is a dash, never a zero.
                  value={orDash(vehicle.availableRangeKm, ' km')}
                  icon="pin"
                />
                <Stat
                  label={frame ? 'Velocity (live)' : 'Velocity (avg)'}
                  value={frame ? `${frame.speed} km/h` : `${vehicle.avgVelocity} m/s`}
                  icon="speed"
                />
              </div>
            </div>

            {/* ---- map + telemetry ---- */}
            <div className="split split--wide">
              <Card title="GPS Position" accent flush style={{ position: 'relative' }}>
                <FleetMap
                  track={vehicle.track}
                  markers={[
                    {
                      id: vehicle.id,
                      // Live frame wins; the stored position is the fallback
                      // for a vehicle that has not reported this session.
                      position: frame ? { lat: frame.lat, lng: frame.lng } : vehicle.position,
                      label: vehicle.vehicleNo,
                      sublabel: frame ? `${frame.speed} km/h` : undefined,
                      online: vehicle.status === 'online',
                    },
                  ]}
                  cluster={false}
                  fitToData
                  height={420}
                />
                <SpeedLegend />
              </Card>

              <div className="grid" style={{ alignContent: 'start' }}>
                <Card title="Velocity (m/s)">
                  <AreaChart
                    data={vehicle.telemetry.map((t) => ({ label: t.hour, value: t.velocity }))}
                    xLabel="Time (per hour)"
                    unit=" m/s"
                    height={220}
                  />
                </Card>

                <Card title="Battery temperature">
                  <Gauge
                    value={Math.round(vehicle.avgTemperature)}
                    max={80}
                    unit="°C"
                    caption="Average pack temperature"
                    bands={[
                      { from: 0, to: 45, color: 'var(--status-good)', label: 'Normal' },
                      { from: 45, to: 60, color: 'var(--status-warning)', label: 'Elevated' },
                      { from: 60, to: 80, color: 'var(--status-critical)', label: 'Critical' },
                    ]}
                  />

                  <dl style={{ marginTop: 'var(--sp-4)', display: 'grid', gap: 'var(--sp-2)' }}>
                    <Row label="Latitude" value={String(vehicle.position.lat)} />
                    <Row label="Longitude" value={String(vehicle.position.lng)} />
                    <Row label="Battery" value={`${vehicle.batteryId} · ${vehicle.soc}% SOC`} />
                  </dl>
                </Card>
              </div>
            </div>

            {/* ---- ignition ---- */}
            <Card title="Ignition" accent>
              <div className="row">
                <span
                  style={{
                    fontSize: 'var(--fs-2xl)',
                    fontWeight: 700,
                    color: ignition ? 'var(--status-good)' : 'var(--text-secondary)',
                  }}
                >
                  {/* Written state, so colour is never the only cue. */}
                  {ignition ? 'ON' : 'OFF'}
                </span>

                <span className="spacer" />

                <Can
                  permission="vehicle:control"
                  fallback={
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                      You don't have permission to control this vehicle.
                    </span>
                  }
                >
                  <Button
                    variant={ignition ? 'danger' : 'primary'}
                    icon="power"
                    loading={ignitionAction.isPending}
                    onClick={toggleIgnition}
                  >
                    Turn {ignition ? 'off' : 'on'}
                  </Button>
                </Can>
              </div>
            </Card>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--sp-4)' }}>
      <dt style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>{label}</dt>
      <dd style={{ margin: 0, fontWeight: 500, textAlign: 'right' }}>{value}</dd>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <div className="stat__row">
        <span className="stat__icon">
          <Icon name={icon} size={22} />
        </span>
        <span className="stat__value">{value}</span>
      </div>
    </div>
  );
}
