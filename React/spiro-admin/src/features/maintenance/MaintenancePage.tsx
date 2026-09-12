/**
 * Predictive maintenance.
 *
 * Every flag shows its EVIDENCE, not just a verdict. "Brake pads worn" is a
 * claim a mechanic cannot check; "mean deceleration during braking fell 22 %
 * over the last 500 km" is one they can. A predictive system that will not
 * show its working gets ignored after the second false positive.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { MaintenanceFlag, MaintenanceKind } from '@/types/domain';
import { listMaintenance } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useTable } from '@/hooks/useTable';
import { formatDateTime, formatNumber, formatRelative, orDash } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';

import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { ErrorState } from '@/components/ui/States';
import { Proportion } from '@/components/charts/Proportion';
import { SEVERITY_LABEL } from '@/features/alarms/AlarmProvider';

const KIND_LABEL: Record<MaintenanceKind, string> = {
  brake_pads: 'Brake pads',
  tyre_pressure: 'Tyre pressure',
  capacity_loss: 'Capacity loss',
  motor_temperature: 'Motor temperature',
};

const KIND_OPTIONS = [
  { value: '', label: 'All flag types' },
  ...(Object.keys(KIND_LABEL) as MaintenanceKind[]).map((k) => ({ value: k as string, label: KIND_LABEL[k] })),
];

const SEVERITY_OPTIONS = [
  { value: '', label: 'Any severity' },
  { value: 'critical', label: 'Critical' },
  { value: 'serious', label: 'Serious' },
  { value: 'warning', label: 'Warning' },
];

const SEARCH_KEYS: (keyof MaintenanceFlag)[] = ['vehicleNo', 'evidence'];

export function MaintenancePage() {
  const { t } = useI18n();
  const [kind, setKind] = useSessionState('filter:maintenance:kind', '');
  const [severity, setSeverity] = useSessionState('filter:maintenance:severity', '');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const list = useAsync(({ signal }) => listMaintenance(signal), []);
  const all = useMemo(() => list.data ?? [], [list.data]);

  const rows = useMemo(
    () => all.filter((f) => (kind === '' || f.kind === kind) && (severity === '' || f.severity === severity)),
    [all, kind, severity]
  );

  const table = useTable<MaintenanceFlag>(rows, {
    tableId: 'maintenance',
    searchKeys: SEARCH_KEYS,
    initialSortBy: 'detectedAt',
    initialSortDir: 'desc',
    pageSize: 15,
  });
  if (table.search !== search) table.setSearch(search);

  const counts = useMemo(
    () => ({
      critical: all.filter((f) => f.severity === 'critical').length,
      serious: all.filter((f) => f.severity === 'serious').length,
      warning: all.filter((f) => f.severity === 'warning').length,
    }),
    [all]
  );

  const columns = useMemo<Column<MaintenanceFlag>[]>(
    () => [
      {
        key: 'severity',
        header: 'Severity',
        sortable: true,
        filterable: true,
        render: (f) => (
          <Badge tone={f.severity === 'critical' ? 'danger' : f.severity === 'serious' ? 'warning' : 'neutral'}>
            {SEVERITY_LABEL[f.severity]}
          </Badge>
        ),
      },
      { key: 'vehicleNo', header: 'Vehicle', sortable: true, render: (f) => <strong>{f.vehicleNo}</strong> },
      { key: 'kind', header: 'Flag', sortable: true, render: (f) => KIND_LABEL[f.kind], filterable: true },
      {
        key: 'evidence',
        header: 'Why it was flagged',
        render: (f) => <span style={{ fontSize: 'var(--fs-sm)' }}>{f.evidence}</span>,
      },
      {
        key: 'dueInKm',
        header: 'Service due in',
        sortable: true,
        align: 'right',
        render: (f) => orDash(f.dueInKm === null ? null : formatNumber(f.dueInKm), ' km'),
      },
      { key: 'detectedAt', header: 'Detected', sortable: true, render: (f) => formatRelative(f.detectedAt) },
    ],
    []
  );

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.maintenance')}</h1>
          <span className="spacer" />
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name="maintenance-flags"
            title="Maintenance Flags"
            getRows={() =>
              table.allMatchingRows.map((f) => ({
                Vehicle: f.vehicleNo,
                Flag: KIND_LABEL[f.kind],
                Severity: SEVERITY_LABEL[f.severity],
                Evidence: f.evidence,
                'Due in (km)': f.dueInKm ?? '',
                Detected: formatDateTime(f.detectedAt),
              }))
            }
          />
        </div>

        <div className="auto-grid">
          <Card title="Open flags by severity">
            <Proportion
              parts={[
                { label: 'Critical', value: counts.critical, color: 'var(--status-critical)' },
                { label: 'Serious', value: counts.serious, color: 'var(--status-serious)' },
                { label: 'Warning', value: counts.warning, color: 'var(--status-warning)' },
              ]}
            />
          </Card>

          <Card title="Fleet share flagged">
            <div style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700 }}>{formatNumber(all.length)}</div>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              vehicles with at least one open flag. A healthy fleet sits around 4 % — much above
              that and the thresholds are too sensitive to act on.
            </p>
          </Card>

          <Card title="How these are raised">
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              <Icon name="wrench" size={14} /> Flags come from trends in telemetry, not from a
              service interval: braking deceleration, TPMS drift, capacity loss per cycle, and motor
              controller peaks. Each row states the measurement that tripped it.
            </p>
          </Card>
        </div>

        <div className="dashboard-filter">
          <Select value={kind} options={KIND_OPTIONS} onChange={setKind} />
          <Select value={severity} options={SEVERITY_OPTIONS} onChange={setSeverity} />
          <Input
            icon="search"
            round
            placeholder="Search vehicle or evidence"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            style={{ minWidth: 280 }}
          />
        </div>

        {list.error ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : (
          <Card flush>
            <DataTable
              rows={table.rows}
              columns={table.visibleColumns(columns)}
              rowKey={(f) => f.id}
              sortBy={table.sortBy}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
              filters={table.filters}
              onFilter={table.setFilter}
              distinctValues={table.distinctValues}
              onRowClick={(f) => navigate(`/tracking/vehicle-tracking/info/${f.vehicleId}`)}
              isLoading={list.isLoading}
              emptyMessage="Nothing flagged."
            />
            <Pagination
              page={table.page}
              totalPages={table.totalPages}
              total={table.total}
              pageSize={table.pageSize}
              onPrevious={table.previous}
              onNext={table.next}
              onPageSize={table.setPageSize}
            />
          </Card>
        )}
      </div>
    </>
  );
}
