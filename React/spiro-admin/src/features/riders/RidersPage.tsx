/**
 * Rider directory.
 *
 * The link that matters is rider → vehicle → battery. When a pack goes into
 * thermal runaway, the question is not "which battery" but "who is sitting
 * on it", and this is the table that answers it in one hop.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Country, Rider } from '@/types/domain';
import { COUNTRIES } from '@/types/domain';
import { listRiders } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useDebounce } from '@/hooks/useDebounce';
import { useDbVersion } from '@/hooks/useDb';
import { useTable } from '@/hooks/useTable';
import { formatNumber, orDash } from '@/lib/utils/format';

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

const COUNTRY_OPTIONS = [
  { value: 'ALL' as const, label: 'All countries' },
  ...COUNTRIES.map((c) => ({ value: c, label: c })),
];

const KYC_OPTIONS = [
  { value: '', label: 'Any KYC status' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
];

const SEARCH_KEYS: (keyof Rider)[] = ['name', 'phone', 'vehicleNo', 'licenceNo'];

export function RidersPage() {
  const { t } = useI18n();
  const [country, setCountry] = useSessionState<Country | 'ALL'>('filter:riders:country', 'ALL');
  const [kyc, setKyc] = useSessionState('filter:riders:kyc', '');
  const [rawSearch, setRawSearch] = useState('');

  const search = useDebounce(rawSearch, 250);
  const navigate = useNavigate();
  const version = useDbVersion();

  const list = useAsync(
    ({ signal }) =>
      listRiders({
        country: country === 'ALL' ? undefined : country,
        kycStatus: kyc || undefined,
        pageSize: 500,
        signal,
      }),
    // `version` is a real dependency: approving a rider's KYC must refetch.
    [country, kyc, version]
  );

  const rows = useMemo(() => list.data?.items ?? [], [list.data]);
  const table = useTable<Rider>(rows, { tableId: 'riders', searchKeys: SEARCH_KEYS, initialSortBy: 'name', pageSize: 15 });
  if (table.search !== search) table.setSearch(search);

  const columns = useMemo<Column<Rider>[]>(
    () => [
      {
        key: 'name',
        header: 'Rider',
        sortable: true,
        filterable: true,
        render: (r) => (
          <div>
            <strong>{r.name}</strong>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{r.phone}</div>
          </div>
        ),
      },
      {
        key: 'kycStatus',
        header: 'KYC',
        sortable: true,
        filterable: true,
        render: (r) => (
          <Badge tone={r.kycStatus === 'verified' ? 'success' : r.kycStatus === 'pending' ? 'warning' : 'danger'}>
            {r.kycStatus === 'verified' ? 'Verified' : r.kycStatus === 'pending' ? 'Pending' : 'Rejected'}
          </Badge>
        ),
      },
      { key: 'country', header: 'Country', sortable: true, filterable: true },
      { key: 'vehicleNo', header: 'Vehicle', sortable: true, render: (r) => orDash(r.vehicleNo), filterable: true },
      { key: 'batteryId', header: 'Battery', sortable: true, render: (r) => orDash(r.batteryId) },
      { key: 'licenceNo', header: 'Licence', sortable: true },
      {
        key: 'earnings',
        header: 'Last 14 days',
        align: 'right',
        render: (r) => formatNumber(r.earnings.reduce((sum, e) => sum + e.amount, 0)),
      },
    ],
    []
  );

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.riders')}</h1>
          <span className="spacer" />
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name="riders"
            title="Riders"
            getRows={() =>
              table.allMatchingRows.map((r) => ({
                Name: r.name,
                Phone: r.phone,
                Country: r.country,
                KYC: r.kycStatus,
                'KYC document': r.kycDocument,
                Licence: r.licenceNo,
                Vehicle: r.vehicleNo ?? '',
                Battery: r.batteryId ?? '',
                'Emergency contact': `${r.emergencyName} ${r.emergencyPhone}`,
                'Earnings (14 days)': r.earnings.reduce((s, e) => s + e.amount, 0),
              }))
            }
          />
        </div>

        <div className="dashboard-filter">
          <Select value={country} options={COUNTRY_OPTIONS} onChange={setCountry} variant="primary" />
          <Select value={kyc} options={KYC_OPTIONS} onChange={setKyc} />
          <Input
            icon="search"
            round
            placeholder="Search name, phone, vehicle or licence"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            onClear={() => setRawSearch('')}
            style={{ minWidth: 300 }}
          />
          <span className="spacer" />
          <span className="pill">{formatNumber(table.total)} riders</span>
        </div>

        {list.error ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : (
          <Card flush>
            <DataTable
              rows={table.rows}
              columns={table.visibleColumns(columns)}
              rowKey={(r) => r.id}
              sortBy={table.sortBy}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
              filters={table.filters}
              onFilter={table.setFilter}
              distinctValues={table.distinctValues}
              onRowClick={(r) => navigate(`/riders/${r.id}`)}
              isLoading={list.isLoading}
              emptyMessage="No riders match."
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
