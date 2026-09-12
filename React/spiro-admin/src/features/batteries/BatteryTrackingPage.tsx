/**
 * Battery Tracking — the app's one full table screen.
 *
 * This is where `useTable` earns its keep: free-text search, a country
 * filter, tri-state column sorting and pagination all run over the same
 * rows, and the Download button exports `allMatchingRows` — everything the
 * filters matched, NOT just the visible page. Exporting only page 1 is the
 * single most common table-export bug, so the hook exposes both lists and
 * the caller has to pick deliberately.
 *
 * Export is permission-gated: a viewer can read the fleet but not walk out
 * with a CSV of it.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Battery, Country } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { getBatteryCounts, listBatteries } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useDebounce } from '@/hooks/useDebounce';
import { useTable } from '@/hooks/useTable';
import { formatDateTime, formatDecimal, formatNumber } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusDot } from '@/components/ui/Badge';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { ErrorState, Skeleton } from '@/components/ui/States';

/**
 * Every filter dropdown carries an "All" option.
 *
 * A filter you cannot turn OFF is not a filter, it is a mode — and a country
 * picker with no "All" quietly hides the rest of the fleet from anyone who
 * does not think to look.
 */
const COUNTRY_OPTIONS = [
  { value: 'ALL' as const, label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

/** Declared once, outside the component: a new array every render would
 *  invalidate every memo inside `useTable`. */
const SEARCH_KEYS: (keyof Battery)[] = ['batteryId', 'vehicleNo', 'country'];

export function BatteryTrackingPage() {
  const { t } = useI18n();
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:batteries:country', 'ALL');
  const [rawSearch, setRawSearch] = useState('');
  const navigate = useNavigate();

  const search = useDebounce(rawSearch, 300);

  const scope = country === 'ALL' ? undefined : country;

  const counts = useAsync(({ signal }) => getBatteryCounts(scope, signal), [country]);

  const list = useAsync(
    ({ signal }) => listBatteries({ country: scope, pageSize: 500, signal }),
    [country]
  );

  const rows = useMemo(() => list.data?.items ?? [], [list.data]);

  const table = useTable<Battery>(rows, {
    tableId: 'batteries',
    searchKeys: SEARCH_KEYS,
    initialSortBy: 'batteryId',
    pageSize: 25,
  });

  // `useTable` owns the search state; the debounced input feeds it.
  const searchValue = table.search;
  if (searchValue !== search) {
    // Deliberately not an effect: syncing during render is the documented
    // React pattern for "derive state from a prop", and it avoids the extra
    // paint an effect would cause.
    table.setSearch(search);
  }

  const columns = useMemo<Column<Battery>[]>(
    () => [
      {
        key: 'batteryId',
        header: 'Battery ID',
        sortable: true,
        filterable: true,
        render: (b) => <strong>{b.batteryId}</strong>,
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        filterable: true,
        render: (b) => (
          <StatusDot online={b.status === 'online'} label={b.status === 'online' ? 'Online' : 'Offline'} />
        ),
      },
      {
        key: 'soc',
        header: 'SOC',
        sortable: true,
        align: 'right',
        render: (b) => `${b.soc} %`,
      },
      {
        key: 'packVoltage',
        header: 'Pack Voltage',
        sortable: true,
        align: 'right',
        render: (b) => `${formatDecimal(b.packVoltage, 1)} V`,
      },
      {
        key: 'current',
        header: 'Current',
        sortable: true,
        align: 'right',
        render: (b) => `${formatDecimal(b.current, 1)} A`,
      },
      {
        key: 'temp1',
        header: 'Battery Temp 1',
        sortable: true,
        align: 'right',
        render: (b) => `${formatDecimal(b.temp1, 1)} °C`,
      },
      {
        key: 'temp2',
        header: 'Battery Temp 2',
        sortable: true,
        align: 'right',
        render: (b) => `${formatDecimal(b.temp2, 1)} °C`,
      },
      {
        key: 'cycleCount',
        header: 'Cycle Count',
        sortable: true,
        align: 'right',
        render: (b) => formatNumber(b.cycleCount),
      },
      {
        key: 'soh',
        header: 'SOH',
        sortable: true,
        align: 'right',
        render: (b) => `${b.soh} %`,
      },
    ],
    []
  );

  /**
   * The rows the export sees. Built lazily — `ExportMenu` only calls this
   * when a format is chosen, so a 500-row table is not re-mapped on every
   * render on the off-chance someone opens the menu.
   *
   * Note it maps `allMatchingRows`, not `rows`: everything the filters
   * matched, not just the visible page.
   */
  const exportRows = () =>
    table.allMatchingRows.map((b) => ({
      'Battery ID': b.batteryId,
      Country: b.country,
      Status: b.status,
      // Numbers stay numbers so the Excel export can sum them.
      'SOC (%)': b.soc,
      'SOH (%)': b.soh,
      'Pack Voltage (V)': Number(formatDecimal(b.packVoltage, 1)),
      'Current (A)': Number(formatDecimal(b.current, 1)),
      'Battery Temperature 1 (C)': Number(formatDecimal(b.temp1, 1)),
      'Battery Temperature 2 (C)': Number(formatDecimal(b.temp2, 1)),
      'Cycle Count': b.cycleCount,
      Charging: b.charging ? 'Yes' : 'No',
      'Software Version': b.softwareVersion,
      Vehicle: b.vehicleNo ?? '',
      'Last Updated': formatDateTime(b.lastUpdated),
    }));

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.batteryTracking')}</h1>
          <span className="spacer" />

          <Button
            variant="ghost"
            icon="refresh"
            onClick={() => {
              counts.refetch();
              list.refetch();
            }}
            loading={list.isFetching}
          >
            Refresh
          </Button>

          {/* Export is a capability, not a button everyone gets. */}
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name={`batteries-${country.toLowerCase()}`}
            title="Batteries"
            subtitle={country}
            getRows={exportRows}
          />
        </div>

        {/* One filter row above the table — never scattered beside each column. */}
        <div className="row" style={{ gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <Select
            value={country}
            options={COUNTRY_OPTIONS}
            onChange={setCountry}
            variant="primary"
          />

          <Input
            icon="search"
            round
            placeholder="Search battery ID or vehicle"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            onClear={() => setRawSearch('')}
            style={{ minWidth: 260 }}
          />

          {table.isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRawSearch('');
                table.clearFilters();
              }}
            >
              Clear filters
            </Button>
          )}

          <span className="spacer" />

          <div className="row" style={{ gap: 'var(--sp-2)' }}>
            <CountPill label="Online" value={counts.data?.online} loading={counts.isLoading} />
            <CountPill label="Offline" value={counts.data?.offline} loading={counts.isLoading} />
            <CountPill label="Total" value={counts.data?.total} loading={counts.isLoading} strong />
          </div>
        </div>

        {list.error ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : (
          <Card flush>
            <DataTable
              rows={table.rows}
              columns={table.visibleColumns(columns)}
              rowKey={(b) => b.id}
              sortBy={table.sortBy}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
              filters={table.filters}
              onFilter={table.setFilter}
              distinctValues={table.distinctValues}
              onRowClick={(b) => navigate(`/tracking/battery-tracking/info/${b.id}`)}
              isLoading={list.isLoading}
              emptyMessage={
                table.isFiltered
                  ? 'No batteries match the current filters.'
                  : 'No batteries in this country.'
              }
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

function CountPill({
  label,
  value,
  loading,
  strong,
}: {
  label: string;
  value?: number;
  loading: boolean;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--sp-2)',
        padding: 'var(--sp-2) var(--sp-3)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-full)',
      }}
    >
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>{label}</span>
      {loading ? (
        <Skeleton height={14} width={32} />
      ) : (
        <strong style={{ fontSize: 'var(--fs-md)', fontWeight: strong ? 700 : 600 }}>
          {value !== undefined ? formatNumber(value) : '–'}
        </strong>
      )}
    </div>
  );
}
