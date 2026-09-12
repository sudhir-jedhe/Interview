/**
 * Dashboard overview.
 *
 * Form choices, made deliberately:
 *
 *   KPI row     four numbers -> stat tiles, not four charts. "Eight
 *               categorical hues when the story is one number" is the single
 *               most common way a dashboard misses its point.
 *
 *   Fleet state Running vs Stopped is TWO values. The reference product draws
 *               a two-slice donut; that is an anti-pattern (the reader judges
 *               the numbers, not the angle). A proportion bar plus two hero
 *               figures says the same thing honestly.
 *
 *   Model mix   THREE segments, part-to-whole -> a donut is legitimate here,
 *               with every slice direct-labelled.
 *
 *   SoC buckets ordered categories, one measure -> bars in ONE colour. The
 *               low buckets carry the reserved status colour because a flat
 *               battery is a bad state, and they are labelled in words.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Country } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { getFleetSummary } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { formatNumber } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { BarChart } from '@/components/charts/BarChart';
import { Donut } from '@/components/charts/Donut';
import { Proportion } from '@/components/charts/Proportion';

const COUNTRY_OPTIONS = [
  { value: 'ALL' as const, label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

export function DashboardPage() {
  const { t } = useI18n();
  // ONE filter row above everything it scopes — never per-card filters.
  const [country, setCountry] = useState<Country | 'ALL'>('ALL');

  const { data, error, isLoading, refetch } = useAsync(
    ({ signal }) => getFleetSummary(country === 'ALL' ? undefined : country, signal),
    [country]
  );

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row" style={{ marginBottom: 'var(--sp-4)' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            {t('page.dashboard')}
          </h1>
          <span className="spacer" />
          <Select
            value={country}
            options={COUNTRY_OPTIONS}
            onChange={setCountry}
            className="dashboard-filter"
          />
        </div>

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <div className="grid" style={{ gap: 'var(--sp-4)' }}>
            {/* ---- KPI row ---- */}
            <div className="auto-grid">
              <KpiCard
                label="CHAP-CHAP"
                value={data?.byModel['CHAP CHAP'].total}
                delta={data?.byModel['CHAP CHAP'].deployedToday}
                icon="scooter"
                tint="var(--viz-1)"
                loading={isLoading}
              />
              <KpiCard
                label="COMMANDO"
                value={data?.byModel.COMMANDO.total}
                delta={data?.byModel.COMMANDO.deployedToday}
                icon="bike"
                tint="var(--viz-3)"
                loading={isLoading}
              />
              <KpiCard
                label="SPIRO VEO"
                value={data?.byModel.VEO.total}
                delta={data?.byModel.VEO.deployedToday}
                icon="charge"
                tint="var(--viz-2)"
                loading={isLoading}
              />
              <KpiCard
                label="TOTAL VEHICLES"
                value={data?.totalVehicles}
                icon="grid"
                tint="var(--viz-4)"
                loading={isLoading}
              />
            </div>

            {/* ---- fleet state + model mix ---- */}
            <div className="split split--lead">
              <Card title="Vehicle Status">
                {isLoading || !data ? (
                  <Skeleton height={140} />
                ) : (
                  <Proportion
                    formatValue={formatNumber}
                    parts={[
                      { label: 'Running', value: data.running, color: 'var(--viz-running)' },
                      { label: 'Stopped', value: data.stopped, color: 'var(--viz-stopped)' },
                    ]}
                  />
                )}
              </Card>

              <Card title="Fleet by model">
                {isLoading || !data ? (
                  <Skeleton height={200} />
                ) : (
                  <Donut
                    centerLabel="Vehicles"
                    formatValue={formatNumber}
                    data={[
                      { label: 'COMMANDO', value: data.byModel.COMMANDO.total },
                      { label: 'CHAP CHAP', value: data.byModel['CHAP CHAP'].total },
                      { label: 'SPIRO VEO', value: data.byModel.VEO.total },
                    ]}
                  />
                )}
              </Card>
            </div>

            {/* ---- SoC distribution ---- */}
            <Card
              title="Battery Book: SoC Range"
              action={
                <Link to="/tracking/battery-tracking" className="row" style={{ gap: 'var(--sp-1)' }}>
                  View batteries <Icon name="chevron-right" size={14} />
                </Link>
              }
            >
              {isLoading || !data ? (
                <Skeleton height={260} />
              ) : (
                <>
                  <BarChart
                    height={280}
                    xLabel="SoC Range"
                    yLabel="Battery Count"
                    criticalNote="Critical — below 20% charge"
                    formatValue={formatNumber}
                    data={data.socBuckets.map((bucket, i) => ({
                      label: bucket.range,
                      value: bucket.count,
                      critical: i < 2,
                    }))}
                  />

                  {/* Table-view twin: every chart has one. */}
                  <details style={{ marginTop: 'var(--sp-3)' }}>
                    <summary className="chart__toggle">View as table</summary>
                    <table className="chart__table" style={{ marginTop: 'var(--sp-2)' }}>
                      <thead>
                        <tr>
                          <th>SoC range</th>
                          <th>Batteries</th>
                          <th>Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.socBuckets.map((bucket) => {
                          const total = data.socBuckets.reduce((s, b) => s + b.count, 0) || 1;
                          return (
                            <tr key={bucket.range}>
                              <td>{bucket.range}</td>
                              <td>{formatNumber(bucket.count)}</td>
                              <td>{Math.round((bucket.count / total) * 100)}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </details>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  delta,
  icon,
  tint,
  loading,
}: {
  label: string;
  value?: number;
  delta?: number;
  icon: IconName;
  tint: string;
  loading: boolean;
}) {
  return (
    <Card>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}
          >
            {label}
          </div>

          {loading ? (
            <Skeleton height={34} width={110} />
          ) : (
            <div className="hero-figure">{value !== undefined ? formatNumber(value) : '–'}</div>
          )}

          {delta !== undefined && !loading && (
            <div style={{ marginTop: 'var(--sp-2)' }}>
              <span className="badge badge--success">+{delta}</span>
              <span style={{ marginLeft: 'var(--sp-2)', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                Deployed today
              </span>
            </div>
          )}
        </div>

        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 46,
            height: 46,
            borderRadius: 'var(--r-full)',
            background: tint,
            color: '#fff',
            flex: 'none',
          }}
        >
          <Icon name={icon} size={22} />
        </span>
      </div>
    </Card>
  );
}
