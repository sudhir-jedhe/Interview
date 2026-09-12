/**
 * Vehicle tracking — live map, quick list, and a full table.
 *
 * The map, the list and the table all read the SAME filtered result, so they
 * can never disagree. Selecting anywhere flies the map to that vehicle rather
 * than navigating away, which is what an operator watching a fleet wants.
 *
 * The table below the map is the one that had been missing here: sortable,
 * with a filter control under every heading it makes sense on, column
 * preferences, and the same export menu as every other table. A tracking
 * screen without one forces an operator to leave for the Vehicles page the
 * moment they want to sort by charge.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Country, VehicleModel } from '@/types/domain';
import { COUNTRIES, VEHICLE_MODELS } from '@/types/domain';
import { getVehicleCounts, listVehicles } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateTime, formatNumber } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { Icon } from '@/components/ui/Icon';
import { StatusDot } from '@/components/ui/Badge';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { FleetMap, type MapMarker } from '@/components/map/FleetMap';
import { useTable } from '@/hooks/useTable';
import { orDash, speedBand } from '@/lib/utils/format';
import type { Vehicle } from '@/types/domain';

/** Fields the table's own search box looks at. Declared once, outside the
 *  component: a new array every render invalidates every memo in `useTable`. */
const TABLE_SEARCH_KEYS: (keyof Vehicle)[] = ['vehicleNo', 'imei', 'batteryId', 'assignedTo'];

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

const MODEL_TABS = [
  { value: 'ALL' as const, label: 'All models' },
  ...VEHICLE_MODELS.map((m) => ({ value: m, label: m })),
];

export function VehicleTrackingPage() {
  const { t } = useI18n();
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:tracking:country', 'ALL');
  const [model, setModel] = useSessionState<VehicleModel | 'ALL'>('filter:tracking:model', 'ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 300);

  // `undefined` rather than 'ALL' at the API boundary: the client's contract
  // is "no country means every country", and translating the UI's sentinel
  // here keeps that sentinel out of the data layer entirely.
  const scope = country === 'ALL' ? undefined : country;
  const modelScope = model === 'ALL' ? undefined : model;

  const counts = useAsync(
    ({ signal }) => getVehicleCounts(scope, modelScope, signal),
    [country, model]
  );

  const list = useAsync(
    ({ signal }) =>
      listVehicles({ country: scope, model: modelScope, search: debouncedSearch, pageSize: 300, signal }),
    [country, model, debouncedSearch]
  );

  const vehicles = useMemo(() => list.data?.items ?? [], [list.data]);

  /**
   * The table runs over the SAME rows the map is drawing — its filters
   * narrow the table only. Making a column filter also move the map would
   * mean the "247 vehicles" tile and the pins stopped agreeing, which is the
   * kind of inconsistency an operator notices and then stops trusting.
   */
  const table = useTable<Vehicle>(vehicles, {
    tableId: 'vehicle-tracking',
    searchKeys: TABLE_SEARCH_KEYS,
    initialSortBy: 'vehicleNo',
    pageSize: 10,
  });

  // ONE search box on this page, not two. The box above already queries the
  // API; feeding the same term into the table keeps `distinctValues` honest
  // (the filter dropdowns narrow with the search) without asking the operator
  // to work out why there are two places to type a registration.
  if (table.search !== debouncedSearch) table.setSearch(debouncedSearch);

  const columns = useMemo<Column<Vehicle>[]>(
    () => [
      {
        key: 'vehicleNo',
        header: 'Vehicle No',
        sortable: true,
        filterable: true,
        render: (v) => <strong>{v.vehicleNo}</strong>,
      },
      { key: 'model', header: 'Model', sortable: true, filterable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        filterable: true,
        render: (v) => (
          <StatusDot
            online={v.status === 'online'}
            label={v.status === 'online' ? t('state.online') : t('state.offline')}
          />
        ),
      },
      {
        key: 'motion',
        header: 'Motion',
        sortable: true,
        filterable: true,
        render: (v) => (v.motion === 'running' ? 'Running' : 'Stopped'),
      },
      {
        key: 'ignition',
        header: 'Ignition',
        sortable: true,
        filterable: true,
        render: (v) => (v.ignition ? 'On' : 'Off'),
      },
      { key: 'soc', header: 'SOC', sortable: true, align: 'right', render: (v) => `${v.soc} %` },
      {
        key: 'avgVelocity',
        header: 'Velocity',
        sortable: true,
        align: 'right',
        // The band label is what the map legend uses, so the table and the
        // trail colours describe speed the same way.
        render: (v) => `${v.avgVelocity} km/h · ${speedBand(v.avgVelocity)?.label ?? '—'}`,
      },
      { key: 'country', header: 'Country', sortable: true, filterable: true },
      {
        key: 'assignedTo',
        header: 'Rider',
        sortable: true,
        filterable: true,
        render: (v) => orDash(v.assignedTo),
      },
      { key: 'batteryId', header: 'Battery', sortable: true, filterable: true },
      { key: 'lastSeen', header: 'Last Seen', sortable: true, render: (v) => formatDateTime(v.lastSeen) },
    ],
    [t]
  );

  const markers = useMemo<MapMarker[]>(
    () =>
      vehicles.map((v) => ({
        id: v.id,
        position: v.position,
        label: v.vehicleNo,
        sublabel: `${v.model} · ${v.soc}% SOC`,
        online: v.status === 'online',
      })),
    [vehicles]
  );

  const selected = vehicles.find((v) => v.id === selectedId);

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <h1 className="page-title">{t('page.vehicleTracking')}</h1>

        <div
          className="split split--lead"
        >
          {/* ---- left: filters + list ---- */}
          <div className="grid" style={{ gap: 'var(--sp-3)' }}>
            <Select value={country} options={COUNTRY_OPTIONS} onChange={setCountry} variant="primary" />

            <Input
              icon="search"
              placeholder="Search by vehicle no or IMEI"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />

            <Tabs value={model} items={MODEL_TABS} onChange={setModel} />

            <div className="auto-grid auto-grid--tight">
              <CountTile
                label="Online"
                value={counts.data?.online}
                loading={counts.isLoading}
                tone="var(--status-good)"
              />
              <CountTile
                label="Offline"
                value={counts.data?.offline}
                loading={counts.isLoading}
                tone="var(--text-secondary)"
              />
              <CountTile
                label="Total"
                value={counts.data?.total}
                loading={counts.isLoading}
                tone="var(--text-primary)"
              />
            </div>

            <Card flush style={{ maxHeight: 520, overflowY: 'auto' }}>
              {list.error ? (
                <ErrorState error={list.error} onRetry={list.refetch} />
              ) : list.isLoading ? (
                <div style={{ padding: 'var(--sp-4)', display: 'grid', gap: 'var(--sp-3)' }}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} height={54} />
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <EmptyState
                  title="No vehicles match"
                  description={search ? `Nothing for “${search}”.` : 'Try another model or country.'}
                />
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {vehicles.slice(0, 120).map((vehicle) => (
                    <li key={vehicle.id}>
                      <button
                        onClick={() => setSelectedId(vehicle.id)}
                        onDoubleClick={() => navigate(`/tracking/vehicle-tracking/info/${vehicle.id}`)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: 'var(--sp-3) var(--sp-4)',
                          borderBottom: '1px solid var(--border)',
                          background: vehicle.id === selectedId ? 'var(--bg-selected)' : undefined,
                        }}
                      >
                        <div className="row">
                          <strong>{vehicle.vehicleNo}</strong>
                          <span className="spacer" />
                          {/* Status is text + dot, never colour alone. */}
                          <StatusDot
                            online={vehicle.status === 'online'}
                            label={vehicle.status === 'online' ? 'Online' : 'Offline'}
                          />
                        </div>

                        <div
                          className="row"
                          style={{
                            marginTop: 'var(--sp-2)',
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <Icon
                            name="power"
                            size={14}
                            style={{ color: vehicle.ignition ? 'var(--status-good)' : 'var(--text-tertiary)' }}
                          />
                          <span>{vehicle.soc}% SOC</span>
                          <span className="spacer" />
                          <span>{formatDateTime(vehicle.lastSeen)}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* ---- right: map ---- */}
          <Card flush style={{ position: 'relative', overflow: 'hidden' }}>
            <FleetMap
              markers={markers}
              height={640}
              center={selected?.position ?? { lat: 6.2, lng: 1.22 }}
              zoom={selected ? 12 : country === 'ALL' ? 3 : 6}
              onMarkerClick={(id) => setSelectedId(id)}
            />

            {selected && (
              <div
                style={{
                  position: 'absolute',
                  top: 'var(--sp-4)',
                  left: 'var(--sp-4)',
                  zIndex: 2,
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <strong>{selected.vehicleNo}</strong>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                  Lat {selected.position.lat} · Lng {selected.position.lng}
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  style={{ marginTop: 'var(--sp-2)' }}
                  onClick={() => navigate(`/tracking/vehicle-tracking/info/${selected.id}`)}
                >
                  Open details <Icon name="chevron-right" size={14} />
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* ---- the full table ---- */}
        <Card
          flush
          title={`All matching vehicles (${formatNumber(table.total)})`}
          action={
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              <ColumnPicker
                columns={columns}
                hidden={table.hiddenColumns}
                onToggle={table.toggleColumn}
                onShowAll={table.showAllColumns}
              />

              <ExportMenu
                name={`vehicle-tracking-${country.toLowerCase()}`}
                title="Vehicle Tracking"
                subtitle={`${country === 'ALL' ? 'All countries' : country} · ${
                  model === 'ALL' ? 'all models' : model
                }`}
                size="sm"
                getRows={() =>
                  table.allMatchingRows.map((v) => ({
                    'Vehicle No': v.vehicleNo,
                    Model: v.model,
                    IMEI: v.imei,
                    Country: v.country,
                    Status: v.status,
                    Motion: v.motion,
                    Ignition: v.ignition ? 'On' : 'Off',
                    // Numeric so the Excel export can sum and chart them.
                    'SOC (%)': v.soc,
                    'SOH (%)': v.soh,
                    'Velocity (km/h)': v.avgVelocity,
                    'Odometer (km)': Math.round(v.odometerKm),
                    Battery: v.batteryId,
                    Rider: v.assignedTo ?? '',
                    Latitude: v.position.lat,
                    Longitude: v.position.lng,
                    'Last Seen': formatDateTime(v.lastSeen),
                  }))
                }
              />
            </div>
          }
        >
          <DataTable
            rows={table.rows}
            columns={table.visibleColumns(columns)}
            rowKey={(v) => v.id}
            sortBy={table.sortBy}
            sortDir={table.sortDir}
            onSort={table.toggleSort}
            filters={table.filters}
            onFilter={table.setFilter}
            distinctValues={table.distinctValues}
            // A single click selects (and flies the map there); the Info page
            // is a double click, matching the quick list above.
            onRowClick={(v) => setSelectedId(v.id)}
            isLoading={list.isLoading}
            emptyMessage="No vehicles match the current filters."
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
      </div>
    </>
  );
}

function CountTile({
  label,
  value,
  loading,
  tone,
}: {
  label: string;
  value?: number;
  loading: boolean;
  tone: string;
}) {
  return (
    <div
      style={{
        padding: 'var(--sp-3)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
      {loading ? (
        <Skeleton height={22} width={56} />
      ) : (
        <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, color: tone }}>
          {value !== undefined ? formatNumber(value) : '–'}
        </div>
      )}
    </div>
  );
}
