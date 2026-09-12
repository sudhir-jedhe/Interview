/**
 * Operational reports.
 *
 * Two exports, two jobs:
 *   CSV   the numbers, for someone who will do their own arithmetic.
 *   PDF   this page, printed. The report you see IS the report that prints —
 *         there is no second rendering path to drift out of step, and the
 *         output stays selectable text rather than a picture of a table.
 *
 * On the CO2 figure: an EV's own emissions are zero, so "emissions saved" is
 * meaningless without a baseline. This states the offset against the petrol
 * motorcycle each bike replaces (87 g CO2e/km), net of the grid electricity
 * used to charge (25 g CO2e/km), and says so on the page. A carbon number
 * without its assumptions printed beside it is not a number.
 */

import { useMemo } from 'react';

import type { Country, ReportPeriod } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { getFleetReport } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { downloadCsv, timestampedName } from '@/lib/utils/export';
import { formatCompact, formatDateTime, formatNumber } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { Can } from '@/features/auth/ProtectedRoute';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { Icon } from '@/components/ui/Icon';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { AreaChart } from '@/components/charts/AreaChart';
import { DataTable, type Column } from '@/components/ui/Table';
import { useToast } from '@/components/ui/Toast';

const PERIOD_TABS = [
  { value: '7d' as const, label: 'Last 7 days' },
  { value: '30d' as const, label: 'Last 30 days' },
  { value: '90d' as const, label: 'Last 90 days' },
];

const COUNTRY_OPTIONS = [
  { value: 'ALL' as const, label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

type ModelRow = { model: string; vehicles: number; distanceKm: number; kwh: number };

export function ReportsPage() {
  const { t } = useI18n();
  const [period, setPeriod] = useSessionState<ReportPeriod>('filter:reports:period', '30d');
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:reports:country', 'ALL');
  const toast = useToast();

  const report = useAsync(({ signal }) => getFleetReport(period, country, signal), [period, country]);
  const data = report.data;

  const modelColumns = useMemo<Column<ModelRow>[]>(
    () => [
      { key: 'model', header: 'Model', render: (r) => <strong>{r.model}</strong> },
      { key: 'vehicles', header: 'Vehicles', align: 'right', render: (r) => formatNumber(r.vehicles) },
      { key: 'distanceKm', header: 'Distance (km)', align: 'right', render: (r) => formatNumber(r.distanceKm) },
      { key: 'kwh', header: 'Energy (kWh)', align: 'right', render: (r) => formatNumber(r.kwh) },
    ],
    []
  );

  const exportCsv = () => {
    if (!data) return;
    downloadCsv(
      timestampedName(`fleet-report-${period}`, 'csv'),
      data.daily.map((d) => ({
        Day: d.day,
        'Distance (km)': d.distanceKm,
        'Energy (kWh)': d.kwh,
        'CO2 offset (kg)': Math.round((d.distanceKm * (87 - 25)) / 1000),
      }))
    );
    toast.success('Daily figures exported');
  };

  return (
    <>
      <Breadcrumbs />

      <div className="page printable">
        {/* Only appears on paper — a printed page with no title and no date
            is not a report, it is a screenshot. */}
        <div className="print-header">
          <h1 style={{ margin: 0 }}>Spiro IoTHub — fleet operations report</h1>
          <div>
            {country === 'ALL' ? 'All countries' : country} ·{' '}
            {PERIOD_TABS.find((t) => t.value === period)?.label} · generated{' '}
            {formatDateTime(Date.now())}
          </div>
        </div>

        <div className="row no-print">
          <h1 className="page-title">{t('page.reports')}</h1>
          <span className="spacer" />
          <Tabs value={period} items={PERIOD_TABS} onChange={setPeriod} />
        </div>

        <div className="dashboard-filter no-print">
          <Select value={country} options={COUNTRY_OPTIONS} onChange={setCountry} variant="primary" />
          <span className="spacer" />
          {/* Both exports are the same capability: a PDF of the fleet is no
              less sensitive than a CSV of it. */}
          <Can
            permission="data:export"
            fallback={
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                Exporting requires the <code>data:export</code> permission.
              </span>
            }
          >
            <Button variant="secondary" icon="download" onClick={exportCsv} disabled={!data}>
              {t('action.downloadCsv')}
            </Button>
            <Button variant="primary" icon="printer" onClick={() => window.print()} disabled={!data}>
              {t('action.savePdf')}
            </Button>
          </Can>
        </div>

        <p className="no-print" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
          <Icon name="printer" size={14} /> “Save as PDF” opens your browser’s print dialog — choose
          <strong> Save as PDF</strong> as the destination. The printed report is this page with the
          navigation and controls removed.
        </p>

        {report.error ? (
          <ErrorState error={report.error} onRetry={report.refetch} />
        ) : !data ? (
          <Skeleton height={420} />
        ) : (
          <>
            <div className="auto-grid">
              <Kpi label="Distance travelled" value={`${formatCompact(data.distanceKm)} km`} />
              <Kpi label="Energy consumed" value={`${formatCompact(data.kwh)} kWh`} />
              <Kpi label="CO₂ offset" value={`${formatCompact(data.co2OffsetKg)} kg`} />
              <Kpi label="Active vehicles" value={formatNumber(data.activeVehicles)} />
              <Kpi label="Battery swaps" value={formatCompact(data.swaps)} />
            </div>

            <Card title="Daily distance">
              <AreaChart
                data={data.daily.map((d) => ({ label: d.day, value: d.distanceKm }))}
                height={260}
                xLabel="Kilometres per day"
              />
            </Card>

            <Card title="By model" flush>
              <DataTable
                rows={data.byModel.map((m) => ({
                  model: m.model as string,
                  vehicles: m.vehicles,
                  distanceKm: m.distanceKm,
                  kwh: m.kwh,
                }))}
                columns={modelColumns}
                rowKey={(r) => r.model}
              />
            </Card>

            <Card title="Method">
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                <li>
                  Distance is derived from telemetry, counting only vehicles that reported during the
                  period. A vehicle that never came online contributes nothing rather than an average.
                </li>
                <li>Energy uses 55 Wh/km, the measured fleet figure across all three models.</li>
                <li>
                  CO₂ offset is stated against the petrol motorcycle replaced, at 87 g CO₂e/km, net of
                  25 g CO₂e/km for grid charging — a net 62 g CO₂e per kilometre ridden.
                </li>
                <li>
                  Figures are scaled from the live sample by a factor of the fleet size; they are
                  representative rather than audited.
                </li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ padding: 'var(--sp-4)' }}>
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
