/**
 * Live Feed — the operations wall.
 *
 * Everything on this page is driven by the SSE stream, not by polling. The
 * map, the counters and the packet pane all read the same client (there is
 * exactly one connection for the whole app), and the map repaints on a fixed
 * 2 s cadence rather than on every burst — see `useTelemetryMap` for why.
 *
 * The cluster/heatmap toggle is a real choice, not a skin: clusters answer
 * "how many vehicles are here", a heatmap answers "where is the fleet
 * concentrated". They are mutually exclusive because stacking them produces
 * a picture that answers neither.
 */

import { useMemo, useState } from 'react';

import { useSessionState } from '@/hooks/useStoredState';
import { useNavigate } from 'react-router-dom';

import type { Country } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { useDbSelector } from '@/hooks/useDb';
import { useFeedStats, usePacketLog, useRealtimeState, useTelemetryMap } from '@/hooks/useRealtime';
import { formatNumber } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import { FleetMap, type MapMarker } from '@/components/map/FleetMap';
import { useAlarms } from '@/features/alarms/AlarmProvider';

/**
 * Where the map sits when no country is selected.
 *
 * Roughly the Arabian Sea: the only viewport from which West Africa and Pune
 * are both on screen. Centring on Africa, as this did before India was a
 * market, silently hid a whole region from anyone who left the filter on
 * "All countries".
 */
const ALL_MARKETS_CENTRE = { lat: 12, lng: 42 };

const COUNTRY_OPTIONS = [
  { value: 'ALL' as const, label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

const VIEW_TABS = [
  { value: 'clusters' as const, label: 'Clusters' },
  { value: 'heatmap' as const, label: 'Heatmap' },
];

export function LiveFeedPage() {
  const { t } = useI18n();
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:live:country', 'ALL');
  const [view, setView] = useSessionState<'clusters' | 'heatmap'>('filter:live:view', 'clusters');
  const [showZones, setShowZones] = useState(true);

  const navigate = useNavigate();
  const state = useRealtimeState();
  const stats = useFeedStats();
  const live = useTelemetryMap(2000);
  const packets = usePacketLog(80);
  const { active, criticalCount } = useAlarms();

  const geofences = useDbSelector(() => db.geofences);

  // The vehicles this page is responsible for. Capped: a browser tab cannot
  // hold 14,000 GeoJSON features and stay responsive, and a wall display
  // does not need every one to make the picture true.
  const vehicles = useDbSelector(() =>
    db.vehicles.filter((v) => country === 'ALL' || v.country === country).slice(0, 2400)
  );

  const markers = useMemo<MapMarker[]>(
    () =>
      vehicles.map((v) => {
        const frame = live.get(v.id);
        return {
          id: v.id,
          // The live frame wins when there is one; the stored position is
          // the fallback for a vehicle that has not reported this session.
          position: frame ? { lat: frame.lat, lng: frame.lng } : v.position,
          label: v.vehicleNo,
          sublabel: frame ? `${frame.speed} km/h · ${frame.soc}% SOC` : `${v.soc}% SOC`,
          online: v.status === 'online',
        };
      }),
    [vehicles, live]
  );

  const movingNow = useMemo(() => [...live.values()].filter((f) => f.speed > 0).length, [live]);

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.live')}</h1>
          <ConnectionPill state={state} />
          <span className="spacer" />
          <Tabs value={view} items={VIEW_TABS} onChange={setView} />
        </div>

        <div className="dashboard-filter">
          <Select value={country} options={COUNTRY_OPTIONS} onChange={setCountry} variant="primary" />

          <label className="row" style={{ gap: 'var(--sp-2)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showZones}
              onChange={(e) => setShowZones(e.target.checked)}
              style={{ accentColor: 'var(--spiro-blue)' }}
            />
            Show operating zones
          </label>

          <span className="spacer" />

          <span className="pill">
            <Icon name="speed" size={13} /> {stats.framesPerSecond} frames/s
          </span>
          <span className="pill">{formatNumber(stats.total)} received</span>
          <span className="pill">{formatNumber(movingNow)} moving</span>
          <span
            className="pill"
            style={criticalCount > 0 ? { borderColor: 'var(--status-critical)', color: 'var(--status-critical)' } : undefined}
          >
            <Icon name="alert" size={13} /> {active.length} open alarm{active.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="split">
          <Card flush>
            <FleetMap
              markers={markers}
              geofences={showZones ? geofences : []}
              heatmap={view === 'heatmap'}
              height={620}
              zoom={country === 'ALL' ? 2.6 : 9}
              center={markers[0]?.position ?? ALL_MARKETS_CENTRE}
              onMarkerClick={(id) => navigate(`/tracking/vehicle-tracking/info/${id}`)}
            />
          </Card>

          <div className="grid" style={{ gap: 'var(--sp-4)' }}>
            <Card title="Packet log" action={<span className="pill mono">{packets.length}</span>}>
              <p style={{ marginTop: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                Frames as they arrive. <strong>IN</strong> is uplink telemetry;{' '}
                <strong>OUT</strong> is a command going the other way — those do not travel on this
                stream, they are posted and acknowledged here.
              </p>

              <div className="log">
                {packets.length === 0 ? (
                  <div style={{ padding: 'var(--sp-4)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                    Waiting for the first frame…
                  </div>
                ) : (
                  packets.map((packet) => (
                    <div className="log__row" key={packet.id}>
                      <span className={`log__dir log__dir--${packet.direction}`}>
                        {packet.direction === 'in' ? 'IN' : 'OUT'}
                      </span>
                      <span style={{ width: 62 }}>{new Date(packet.at).toLocaleTimeString()}</span>
                      <span style={{ width: 58 }}>{packet.vehicleNo}</span>
                      <span style={{ width: 52 }}>{packet.kind}</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>{packet.raw}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card title="Recent alarms">
              {active.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  Nothing open. Alarms raised by the feed appear here immediately.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--sp-3)' }}>
                  {active.slice(0, 6).map((alarm) => (
                    <li key={alarm.id} style={{ fontSize: 'var(--fs-sm)' }}>
                      <div className="row" style={{ gap: 'var(--sp-2)' }}>
                        <Icon
                          name="alert"
                          size={14}
                          style={{
                            color:
                              alarm.severity === 'critical'
                                ? 'var(--status-critical)'
                                : alarm.severity === 'serious'
                                  ? 'var(--status-serious)'
                                  : 'var(--status-warning)',
                          }}
                        />
                        <strong>{alarm.subjectLabel}</strong>
                        <span className="spacer" />
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(alarm.at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>{alarm.message}</div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export function ConnectionPill({ state }: { state: 'connecting' | 'open' | 'closed' }) {
  if (state === 'open') {
    return (
      <span className="pill pill--live">
        <span className="pill__pulse" aria-hidden="true" />
        Live
      </span>
    );
  }

  return (
    <span className="pill" style={{ color: 'var(--text-secondary)' }}>
      {state === 'connecting' ? 'Connecting…' : 'Feed closed'}
    </span>
  );
}
