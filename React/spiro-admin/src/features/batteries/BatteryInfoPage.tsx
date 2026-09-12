/**
 * Battery Info — the detail screen behind a row of Battery Tracking.
 *
 * Layout mirrors the operator's question order: "is it healthy?" (the stat
 * rail, always visible), then one of three deeper questions on tabs —
 * Details (what it is), History (its recorded extremes), Location (where).
 *
 * The tab state lives in the URL hash-free `useState` rather than the route,
 * because it is a view preference, not a resource. Deep links go to the
 * battery; nobody needs to bookmark "the History tab of battery X".
 *
 * Charts here follow the one-axis rule: currents (A) and temperatures (°C)
 * get separate plots rather than a dual axis, and cell voltages — two values
 * whose interesting property is the SPREAD, not the magnitude — are shown as
 * a labelled range, which is what a bar chart would obscure.
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBattery } from '@/lib/api/client';
import { DegradationCurve } from './DegradationCurve';
import { useAsync } from '@/hooks/useAsync';
import { downloadJson, timestampedName } from '@/lib/utils/export';
import { formatDateTime, formatDecimal, formatNumber, orDash } from '@/lib/utils/format';
import type { IconName } from '@/components/ui/Icon';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Badge, StatusDot } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { Gauge } from '@/components/charts/Gauge';
import { BarChart } from '@/components/charts/BarChart';
import { FleetMap } from '@/components/map/FleetMap';
import { Can } from '@/features/auth/ProtectedRoute';
import { useToast } from '@/components/ui/Toast';

type TabKey = 'details' | 'history' | 'degradation' | 'location';

const TABS = [
  { value: 'details' as const, label: 'Battery Details' },
  { value: 'history' as const, label: 'Battery History' },
  { value: 'degradation' as const, label: 'Degradation' },
  { value: 'location' as const, label: 'Location' },
];

/** SOH bands. These are thresholds an operator acts on, not decoration:
 *  below 70 % a pack is scheduled for replacement. */
const SOH_BANDS = [
  { from: 0, to: 70, color: 'var(--status-critical)', label: 'Replace' },
  { from: 70, to: 85, color: 'var(--status-warning)', label: 'Ageing' },
  { from: 85, to: 100, color: 'var(--status-good)', label: 'Healthy' },
];

const SOC_BANDS = [
  { from: 0, to: 20, color: 'var(--status-critical)', label: 'Critical' },
  { from: 20, to: 50, color: 'var(--status-warning)', label: 'Low' },
  { from: 50, to: 100, color: 'var(--status-good)', label: 'Good' },
];

export function BatteryInfoPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [tab, setTab] = useState<TabKey>('details');
  const toast = useToast();

  const { data: battery, error, isLoading, refetch } = useAsync(
    ({ signal }) => getBattery(id, signal),
    [id],
    { enabled: id !== '' }
  );

  if (error) {
    return (
      <div className="page">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !battery) {
    return (
      <div className="page">
        <Skeleton height={32} width={280} />
        <div className="split split--narrow">
          <Skeleton height={420} />
          <Skeleton height={420} />
        </div>
      </div>
    );
  }

  const history = battery.history;

  const handleExport = () => {
    downloadJson(timestampedName(`battery-${battery.batteryId}`, 'json'), battery);
    toast.success('Battery record exported');
  };

  return (
    <>
      <Breadcrumbs currentLabel={battery.batteryId} />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{battery.batteryId}</h1>
          <StatusDot
            online={battery.status === 'online'}
            label={battery.status === 'online' ? 'Online' : 'Offline'}
          />
          {battery.charging && <Badge tone="info">Charging</Badge>}

          <span className="spacer" />

          <Button variant="ghost" icon="refresh" onClick={refetch}>
            Refresh
          </Button>

          <Can permission="data:export">
            <Button variant="secondary" icon="download" onClick={handleExport}>
              Export
            </Button>
          </Can>
        </div>

        <div
          className="split split--narrow"
        >
          {/* ---- left rail: the six numbers, always on screen ---- */}
          <div className="grid" style={{ gap: 'var(--sp-3)' }}>
            <Stat icon="voltage" label="Pack Voltage" value={`${formatDecimal(battery.packVoltage, 1)} V`} />
            <Stat icon="charge" label="Current" value={`${formatDecimal(battery.current, 1)} A`} />
            <Stat icon="thermometer" label="Temperature 1" value={`${formatDecimal(battery.temp1, 1)} °C`} />
            <Stat icon="thermometer" label="Temperature 2" value={`${formatDecimal(battery.temp2, 1)} °C`} />
            <Stat icon="refresh" label="Cycle Count" value={formatNumber(battery.cycleCount)} />
            <Stat icon="bike" label="Vehicle" value={orDash(battery.vehicleNo)} />
          </div>

          {/* ---- right: gauges, then the tabbed detail ---- */}
          <div className="grid" style={{ gap: 'var(--sp-4)' }}>
            <div className="auto-grid">
              <Card title="State of Charge">
                <Gauge
                  value={battery.soc}
                  unit="%"
                  bands={SOC_BANDS}
                  caption="Charge remaining in the pack"
                />
              </Card>

              <Card title="State of Health">
                <Gauge
                  value={battery.soh}
                  unit="%"
                  bands={SOH_BANDS}
                  caption="Capacity against a new pack. Below 70 % the pack is scheduled for replacement."
                />
              </Card>
            </div>

            <Tabs value={tab} items={TABS} onChange={setTab} />

            {tab === 'details' && (
              <Card title="Battery Details">
                <div className="auto-grid" style={{ gap: 'var(--sp-3)', margin: 0 }}>
                  <Field label="Battery Status" value={battery.status === 'online' ? 'Online' : 'Offline'} />
                  <Field label="Charging" value={battery.charging ? 'Yes' : 'No'} />
                  <Field label="Cycle Count" value={formatNumber(battery.cycleCount)} />
                  <Field label="Battery Software Version" value={battery.softwareVersion} />
                  <Field label="Country" value={battery.country} />
                  <Field label="Assigned Vehicle" value={orDash(battery.vehicleNo)} />
                  <Field label="Latitude" value={formatDecimal(battery.position.lat, 5)} />
                  <Field label="Longitude" value={formatDecimal(battery.position.lng, 5)} />
                  <Field label="Last Updated Time" value={formatDateTime(battery.lastUpdated)} />
                </div>
              </Card>
            )}

            {tab === 'history' && (
              <div className="grid" style={{ gap: 'var(--sp-4)' }}>
                <div className="auto-grid">
                  {/* Amps on one axis. */}
                  <Card title="Recorded Current Extremes">
                    <BarChart
                      data={[
                        { label: 'Max discharge', value: history.maxDischargeCurrent },
                        { label: 'Max charge', value: history.maxChargeCurrent },
                      ]}
                      height={190}
                      yLabel="Amperes"
                      formatValue={(n) => `${formatDecimal(n, 1)} A`}
                    />
                  </Card>

                  {/* Degrees on a separate axis — never sharing with amps. */}
                  <Card title="Recorded Temperature Extremes">
                    <BarChart
                      data={[
                        {
                          label: 'Maximum',
                          value: history.maxTemperature,
                          critical: history.maxTemperature >= 60,
                        },
                        { label: 'Minimum', value: history.minTemperature },
                      ]}
                      height={190}
                      yLabel="Degrees Celsius"
                      formatValue={(n) => `${formatDecimal(n, 1)} °C`}
                      criticalNote="A pack that has crossed 60 °C is flagged for inspection."
                    />
                  </Card>
                </div>

                <Card title="Cell Voltage Range">
                  {/* Two numbers whose story is the SPREAD. A bar chart of
                      3.9 vs 4.1 V looks like a rounding error; the delta is
                      the value that matters, so it is stated outright. */}
                  <CellRange
                    min={history.minCellVoltage}
                    max={history.maxCellVoltage}
                  />
                </Card>
              </div>
            )}

            {tab === 'degradation' && <DegradationCurve batteryId={battery.id} />}

            {tab === 'location' && (
              <Card flush>
                {battery.position ? (
                  <FleetMap
                    markers={[
                      {
                        id: battery.id,
                        position: battery.position,
                        label: battery.batteryId,
                        sublabel: `${battery.soc}% SOC`,
                        online: battery.status === 'online',
                      },
                    ]}
                    center={battery.position}
                    zoom={13}
                    height={420}
                    cluster={false}
                  />
                ) : (
                  <EmptyState icon="pin" title="No last known position" />
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---- small local pieces ---- */

function Stat({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <div className="stat">
      <span className="stat__icon" aria-hidden="true">
        <Icon name={icon} size={18} />
      </span>
      <div>
        <div className="stat__label">{label}</div>
        <div className="stat__value">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--fs-md)', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function CellRange({ min, max }: { min: number; max: number }) {
  // Cells live between roughly 2.8 V (empty) and 4.2 V (full).
  const FLOOR = 2.8;
  const CEIL = 4.2;
  const clamp = (v: number) => Math.min(1, Math.max(0, (v - FLOOR) / (CEIL - FLOOR)));

  const left = clamp(min) * 100;
  const right = clamp(max) * 100;
  const delta = max - min;
  // >100 mV of imbalance across cells is the industry rule of thumb for a
  // pack that needs balancing.
  const imbalanced = delta > 0.1;

  return (
    <div className="grid" style={{ gap: 'var(--sp-3)' }}>
      <div
        role="img"
        aria-label={`Cell voltage range: minimum ${formatDecimal(min, 3)} volts, maximum ${formatDecimal(max, 3)} volts`}
        style={{
          position: 'relative',
          height: 12,
          borderRadius: 'var(--r-full)',
          background: 'var(--bg-sunken)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${left}%`,
            width: `${Math.max(1.5, right - left)}%`,
            borderRadius: 'var(--r-full)',
            background: imbalanced ? 'var(--status-warning)' : 'var(--viz-1)',
          }}
        />
      </div>

      <div className="row" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
        <span>{FLOOR.toFixed(1)} V</span>
        <span className="spacer" />
        <span>{CEIL.toFixed(1)} V</span>
      </div>

      <div className="auto-grid auto-grid--tight">
        <Field label="Minimum Cell" value={`${formatDecimal(min, 3)} V`} />
        <Field label="Maximum Cell" value={`${formatDecimal(max, 3)} V`} />
        <Field label="Spread" value={`${Math.round(delta * 1000)} mV`} />
      </div>

      {/* Status is never colour alone — the warning is written out. */}
      {imbalanced && (
        <div className="row" style={{ gap: 'var(--sp-2)', color: 'var(--status-warning)' }}>
          <Icon name="alert" size={16} />
          <span style={{ fontSize: 'var(--fs-sm)' }}>
            Cell spread above 100 mV — this pack is a candidate for balancing.
          </span>
        </div>
      )}
    </div>
  );
}
