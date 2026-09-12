/**
 * Audit trail.
 *
 * Read-only by construction — there is no edit, no delete, and no bulk
 * clear, because an audit log you can tidy is not an audit log.
 *
 * Failures are shown by default alongside successes. "Who tried to
 * immobilise the fleet at 02:00 and was refused" is exactly the question
 * this exists to answer, and filtering failures out by default would hide it.
 */

import { useMemo, useState } from 'react';

import { useSessionState } from '@/hooks/useStoredState';

import type { AuditEntry } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { useDbSelector } from '@/hooks/useDb';
import { useTable } from '@/hooks/useTable';
import { formatDateTime, formatNumber } from '@/lib/utils/format';
import { ROLE_LABELS } from '@/features/auth/permissions';

import { useI18n } from '@/i18n/I18nProvider';

import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/States';

const TARGET_OPTIONS = [
  { value: '', label: 'All targets' },
  { value: 'vehicle', label: 'Vehicles' },
  { value: 'battery', label: 'Batteries' },
  { value: 'user', label: 'Users' },
  { value: 'rider', label: 'Riders' },
  { value: 'geofence', label: 'Geofences' },
  { value: 'settings', label: 'Settings' },
];

const RESULT_OPTIONS = [
  { value: '', label: 'Success and failure' },
  { value: 'success', label: 'Success only' },
  { value: 'failure', label: 'Failure only' },
];

const SEARCH_KEYS: (keyof AuditEntry)[] = ['actorName', 'action', 'targetLabel', 'detail'];

export function AuditPage() {
  const { t } = useI18n();
  const entries = useDbSelector(() => db.audit);

  const [target, setTarget] = useSessionState('filter:audit:target', '');
  const [result, setResult] = useSessionState('filter:audit:result', '');
  const [search, setSearch] = useState('');

  const rows = useMemo(
    () =>
      entries.filter(
        (e) => (target === '' || e.targetType === target) && (result === '' || e.result === result)
      ),
    [entries, target, result]
  );

  const table = useTable<AuditEntry>(rows, {
    tableId: 'audit',
    searchKeys: SEARCH_KEYS,
    initialSortBy: 'at',
    initialSortDir: 'desc',
    pageSize: 20,
  });
  if (table.search !== search) table.setSearch(search);

  const columns = useMemo<Column<AuditEntry>[]>(
    () => [
      { key: 'at', header: 'When', sortable: true, render: (e) => formatDateTime(e.at) },
      {
        key: 'actorName',
        header: 'Who',
        sortable: true,
        filterable: true,
        render: (e) => (
          <div>
            <strong>{e.actorName}</strong>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              {ROLE_LABELS[e.actorRole]}
            </div>
          </div>
        ),
      },
      { key: 'action', header: 'Action', sortable: true, filterable: true },
      {
        key: 'targetLabel',
        header: 'Target',
        sortable: true,
        filterable: true,
        render: (e) => (
          <div>
            <strong>{e.targetLabel}</strong>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{e.targetType}</div>
          </div>
        ),
      },
      {
        key: 'detail',
        header: 'Detail',
        render: (e) => <span style={{ fontSize: 'var(--fs-sm)' }}>{e.detail}</span>,
      },
      {
        key: 'result',
        header: 'Result',
        sortable: true,
        filterable: true,
        render: (e) => (
          <Badge tone={e.result === 'success' ? 'success' : 'danger'}>
            {e.result === 'success' ? 'Success' : 'Failed'}
          </Badge>
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
          <h1 className="page-title">{t('page.audit')}</h1>
          <span className="spacer" />
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name="audit-trail"
            title="Audit Trail"
            getRows={() =>
              table.allMatchingRows.map((e) => ({
                When: formatDateTime(e.at),
                Who: e.actorName,
                Role: ROLE_LABELS[e.actorRole],
                Action: e.action,
                'Target type': e.targetType,
                Target: e.targetLabel,
                Detail: e.detail,
                Result: e.result,
              }))
            }
          />
        </div>

        <div className="dashboard-filter">
          <Select value={target} options={TARGET_OPTIONS} onChange={setTarget} />
          <Select value={result} options={RESULT_OPTIONS} onChange={setResult} />
          <Input
            icon="search"
            round
            placeholder="Search who, what or which record"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            style={{ minWidth: 300 }}
          />
          <span className="spacer" />
          <span className="pill">{formatNumber(entries.length)} entries this session</span>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon="shield"
            title="Nothing recorded yet"
            description="Commands, edits, deletions and threshold changes all land here — including the ones that fail."
          />
        ) : (
          <Card flush>
            <DataTable
              rows={table.rows}
              columns={table.visibleColumns(columns)}
              rowKey={(e) => e.id}
              sortBy={table.sortBy}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
              filters={table.filters}
              onFilter={table.setFilter}
              distinctValues={table.distinctValues}
              emptyMessage="No entries match."
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
