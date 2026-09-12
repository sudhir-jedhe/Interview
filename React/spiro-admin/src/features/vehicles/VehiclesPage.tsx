/**
 * Vehicles — the asset register.
 *
 * Same `useTable` pipeline as Battery Tracking, different columns. That is
 * the point of putting search/filter/sort/paginate in a hook rather than in
 * a table component: a second table is a list of columns, not a second
 * implementation of sorting.
 *
 * The model filter is a real column filter (`setFilter`), not a separate
 * request — it composes with the search box instead of replacing it.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Country, Vehicle } from '@/types/domain';
import { COUNTRIES, VEHICLE_MODELS } from '@/types/domain';
import { listVehicles } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useDebounce } from '@/hooks/useDebounce';
import { useTable } from '@/hooks/useTable';
import { formatDateTime, formatNumber, orDash } from '@/lib/utils/format';

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
import { ErrorState } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Can } from '@/features/auth/ProtectedRoute';
import { useAuth } from '@/features/auth/AuthProvider';
import { useDbVersion } from '@/hooks/useDb';
import { deleteVehicle } from '@/lib/api/mutations';
import { ImportDialog } from '@/features/import/ImportDialog';
import { VEHICLE_IMPORT } from '@/lib/api/import';
import { VehicleFormModal } from './VehicleFormModal';
import { BulkCommandBar } from './CommandPanel';

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

const MODEL_OPTIONS = [
  { value: '', label: 'All models' },
  ...VEHICLE_MODELS.map((m) => ({ value: m as string, label: m })),
];

const SEARCH_KEYS: (keyof Vehicle)[] = ['vehicleNo', 'imei', 'batteryId', 'assignedTo'];

export function VehiclesPage() {
  const { t } = useI18n();
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:vehicles:country', 'ALL');
  const [rawSearch, setRawSearch] = useState('');
  const [model, setModel] = useSessionState('filter:vehicles:model', '');

  const search = useDebounce(rawSearch, 300);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  // Creating, editing, deleting or commanding a vehicle bumps the version,
  // which is what makes this list refetch without a manual refresh.
  const version = useDbVersion();

  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const list = useAsync(
    ({ signal }) => listVehicles({ country: country === 'ALL' ? undefined : country, pageSize: 600, signal }),
    [country, version]
  );

  const rows = useMemo(() => list.data?.items ?? [], [list.data]);

  const table = useTable<Vehicle>(rows, {
    tableId: 'vehicles',
    searchKeys: SEARCH_KEYS,
    initialSortBy: 'vehicleNo',
    pageSize: 25,
  });

  const { setSearch, setFilter } = table;

  // Keep the hook's own state in step with the debounced inputs. Assigning
  // during render (rather than in an effect) avoids a wasted paint, and the
  // equality guards stop it looping.
  if (table.search !== search) setSearch(search);

  const activeModel = table.filters.find((f) => f.key === 'model')?.value ?? '';
  if (activeModel !== model) setFilter('model', model);

  const columns = useMemo<Column<Vehicle>[]>(
    () => [
      { key: 'vehicleNo', header: 'Vehicle No', sortable: true, render: (v) => <strong>{v.vehicleNo}</strong> },
      { key: 'model', header: 'Model', sortable: true, filterable: true },
      { key: 'imei', header: 'IMEI', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        filterable: true,
        render: (v) => (
          <StatusDot online={v.status === 'online'} label={v.status === 'online' ? 'Online' : 'Offline'} />
        ),
      },
      {
        key: 'motion',
        header: 'Motion',
        sortable: true,
        filterable: true,
        render: (v) => (v.motion === 'running' ? 'Running' : 'Stopped'),
      },
      { key: 'soc', header: 'SOC', sortable: true, align: 'right', render: (v) => `${v.soc} %` },
      {
        key: 'odometerKm',
        header: 'Odometer',
        sortable: true,
        align: 'right',
        render: (v) => `${formatNumber(Math.round(v.odometerKm))} km`,
      },
      {
        key: 'availableRangeKm',
        header: 'Range',
        sortable: true,
        align: 'right',
        render: (v) => orDash(v.availableRangeKm === null ? null : Math.round(v.availableRangeKm), ' km'),
      },
      { key: 'assignedTo', header: 'Assigned To', sortable: true, render: (v) => orDash(v.assignedTo), filterable: true },
      {
        key: 'lastSeen',
        header: 'Last Seen',
        sortable: true,
        render: (v) => formatDateTime(v.lastSeen),
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (v) => (
          <Can permission="vehicle:manage">
            <div className="row" style={{ gap: 'var(--sp-1)', justifyContent: 'flex-end' }}>
              <Button
                size="sm"
                variant="ghost"
                iconOnly
                icon="edit"
                aria-label={`Edit ${v.vehicleNo}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(v);
                  setFormOpen(true);
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                iconOnly
                icon="trash"
                aria-label={`Delete ${v.vehicleNo}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleting(v);
                }}
              />
            </div>
          </Can>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.vehicles')}</h1>
          <span className="spacer" />
          <Button variant="ghost" icon="refresh" onClick={list.refetch} loading={list.isFetching}>
            Refresh
          </Button>

          <Can permission="vehicle:manage">
            <Button variant="secondary" icon="file" onClick={() => setImportOpen(true)}>
              {t('action.import')}
            </Button>

            <Button
              variant="primary"
              icon="plus"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Add vehicle
            </Button>
          </Can>
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name={`vehicles-${country.toLowerCase()}`}
            title="Vehicles"
            getRows={() =>
              table.allMatchingRows.map((v) => ({
                'Vehicle No': v.vehicleNo,
                Model: v.model,
                IMEI: v.imei,
                Country: v.country,
                Status: v.status,
                Motion: v.motion,
                'SOC (%)': v.soc,
                'SOH (%)': v.soh,
                'Odometer (km)': Math.round(v.odometerKm),
                'Range (km)': v.availableRangeKm === null ? '' : Math.round(v.availableRangeKm),
                'Battery ID': v.batteryId,
                'Assigned To': v.assignedTo ?? '',
                'Last Seen': formatDateTime(v.lastSeen),
              }))
            }
          />
        </div>

        <div className="row" style={{ gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <Select value={country} options={COUNTRY_OPTIONS} onChange={setCountry} variant="primary" />
          <Select value={model} options={MODEL_OPTIONS} onChange={setModel} />
          <Input
            icon="search"
            round
            placeholder="Search vehicle no, IMEI, battery or rider"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            onClear={() => setRawSearch('')}
            style={{ minWidth: 280 }}
          />
          <span className="spacer" />
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            {formatNumber(table.total)} of {formatNumber(rows.length)} vehicles
          </span>
        </div>

        <Can permission="fleet:command">
          <BulkCommandBar vehicles={table.selectedRows} onClear={table.clearSelection} />
        </Can>

        {list.error ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : (
          <Card flush>
            <DataTable
              rows={table.rows}
              columns={table.visibleColumns(columns)}
              rowKey={(v) => v.id}
              selectable
              selected={table.selected}
              onToggleRow={table.toggleRow}
              onToggleAll={table.toggleAllVisible}
              sortBy={table.sortBy}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
              filters={table.filters}
              onFilter={table.setFilter}
              distinctValues={table.distinctValues}
              onRowClick={(v) => navigate(`/tracking/vehicle-tracking/info/${v.id}`)}
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
        )}
      </div>

      <VehicleFormModal open={formOpen} vehicle={editing} onClose={() => setFormOpen(false)} />

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        spec={VEHICLE_IMPORT}
        permission="vehicle:manage"
        title="Import vehicles"
      />

      <ConfirmDialog
        open={deleting !== null}
        title={deleting ? `Remove ${deleting.vehicleNo} from the fleet?` : ''}
        description="The vehicle stops appearing in tracking, reports and dispatch. Any rider assigned to it is unlinked. This is recorded in the audit trail."
        confirmLabel="Remove vehicle"
        danger
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          try {
            deleteVehicle(deleting.id, user);
            toast.success(`${deleting.vehicleNo} removed`);
          } catch (error) {
            toast.error((error as Error).message);
          }
          setDeleting(null);
        }}
      />
    </>
  );
}
