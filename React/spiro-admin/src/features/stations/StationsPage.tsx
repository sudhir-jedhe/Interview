/**
 * Swap station network.
 *
 * The number a rider cares about is CHARGED PACKS AVAILABLE — not slots, not
 * utilisation. A cabinet with twenty slots and nothing charged is closed as
 * far as they are concerned, so that is what the map sizes its dots by and
 * what the status derives from.
 *
 * The stock bar is a proportion bar rather than a donut: three parts of one
 * whole, read by comparing lengths, which a ring makes harder for no gain.
 */

import { useMemo, useState } from 'react';

import type { Country, SwapStation } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { getStationSummary, listStations } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useTable } from '@/hooks/useTable';
import { formatNumber, formatRelative } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { ErrorState } from '@/components/ui/States';
import { Proportion } from '@/components/charts/Proportion';
import { FleetMap } from '@/components/map/FleetMap';

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

const SEARCH_KEYS: (keyof SwapStation)[] = ['name', 'country'];

export function StationsPage() {
  const { t } = useI18n();
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:stations:country', 'ALL');
  const [search, setSearch] = useState('');
  const [focusId, setFocusId] = useState<string | null>(null);

  const scope = country === 'ALL' ? undefined : country;

  const list = useAsync(({ signal }) => listStations(scope, signal), [country]);
  const summary = useAsync(({ signal }) => getStationSummary(scope, signal), [country]);

  const rows = useMemo(() => list.data ?? [], [list.data]);

  const table = useTable<SwapStation>(rows, {
    tableId: 'stations',
    searchKeys: SEARCH_KEYS,
    initialSortBy: 'charged',
    initialSortDir: 'desc',
    pageSize: 10,
  });

  if (table.search !== search) table.setSearch(search);

  const focused = rows.find((s) => s.id === focusId);

  const columns = useMemo<Column<SwapStation>[]>(
    () => [
      { key: 'name', header: 'Station', sortable: true, render: (s) => <strong>{s.name}</strong> },
      { key: 'country', header: 'Country', sortable: true, filterable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        filterable: true,
        render: (s) => (
          <Badge tone={s.status === 'offline' ? 'danger' : s.status === 'degraded' ? 'warning' : 'success'}>
            {s.status === 'offline' ? 'Offline' : s.status === 'degraded' ? 'Low stock' : 'Operational'}
          </Badge>
        ),
      },
      {
        key: 'charged',
        header: 'Charged',
        sortable: true,
        align: 'right',
        render: (s) => <strong>{s.charged}</strong>,
      },
      { key: 'charging', header: 'Charging', sortable: true, align: 'right' },
      { key: 'faulted', header: 'Faulted', sortable: true, align: 'right' },
      { key: 'slots', header: 'Slots', sortable: true, align: 'right' },
      { key: 'swapsToday', header: 'Swaps today', sortable: true, align: 'right' },
      {
        key: 'lastSeen',
        header: 'Last seen',
        sortable: true,
        render: (s) => formatRelative(s.lastSeen),
      },
    ],
    []
  );

  const totals = summary.data;

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.stations')}</h1>
          <span className="spacer" />
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name="swap-stations"
            title="Swap Stations"
            getRows={() =>
              table.allMatchingRows.map((s) => ({
                Station: s.name,
                Country: s.country,
                Status: s.status,
                Charged: s.charged,
                Charging: s.charging,
                Faulted: s.faulted,
                Slots: s.slots,
                'Swaps today': s.swapsToday,
                Latitude: s.position.lat,
                Longitude: s.position.lng,
              }))
            }
          />
        </div>

        <div className="dashboard-filter">
          <Select value={country} options={COUNTRY_OPTIONS} onChange={setCountry} variant="primary" />
          <Input
            icon="search"
            round
            placeholder="Search station"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            style={{ minWidth: 240 }}
          />
        </div>

        {list.error ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : (
          <>
            <div className="auto-grid">
              <Card title="Network stock">
                {totals ? (
                  <Proportion
                    parts={[
                      { label: 'Charged', value: totals.charged, color: 'var(--status-good)' },
                      { label: 'Charging', value: totals.charging, color: 'var(--viz-1)' },
                      { label: 'Faulted', value: totals.faulted, color: 'var(--status-critical)' },
                    ]}
                  />
                ) : (
                  <div className="skeleton" style={{ height: 60 }} />
                )}
              </Card>

              <Card title="Stations">
                <div style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700 }}>
                  {totals ? formatNumber(totals.stations) : '–'}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  {totals?.offline ?? 0} out of service
                </div>
              </Card>

              <Card title="Swaps today">
                <div style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700 }}>
                  {totals ? formatNumber(totals.swapsToday) : '–'}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  Across the whole network
                </div>
              </Card>
            </div>

            <Card flush style={{ overflow: 'hidden' }}>
              <FleetMap
                stations={rows}
                center={focused?.position ?? ALL_MARKETS_CENTRE}
                zoom={focused ? 12 : country === 'ALL' ? 2.6 : 9}
                height={420}
                cluster={false}
                onStationClick={(id) => setFocusId(id)}
              />
            </Card>

            <Card flush>
              <DataTable
                rows={table.rows}
                columns={table.visibleColumns(columns)}
                rowKey={(s) => s.id}
                sortBy={table.sortBy}
                sortDir={table.sortDir}
                onSort={table.toggleSort}
                filters={table.filters}
                onFilter={table.setFilter}
                distinctValues={table.distinctValues}
                onRowClick={(s) => setFocusId(s.id)}
                isLoading={list.isLoading}
                emptyMessage="No stations match."
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
          </>
        )}
      </div>
    </>
  );
}
