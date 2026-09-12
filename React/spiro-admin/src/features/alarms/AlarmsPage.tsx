/**
 * Alarm centre.
 *
 * Thresholds are editable here rather than hard-coded, because the number
 * that decides when someone gets woken at 02:00 belongs to the operator.
 * Changing one is audited.
 *
 * Sound is armed by a button, never on load: browsers block audio without a
 * gesture, and a console that beeps unbidden gets muted at the OS — after
 * which no alarm is ever heard again.
 */

import { useMemo, useState } from 'react';

import { useSessionState } from '@/hooks/useStoredState';

import type { Alarm, AlarmKind } from '@/types/domain';
import { useTable } from '@/hooks/useTable';
import { formatDateTime, formatRelative } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { useToast } from '@/components/ui/Toast';
import { Can } from '@/features/auth/ProtectedRoute';
import { useAlarms, SEVERITY_LABEL } from './AlarmProvider';

const KIND_LABEL: Record<AlarmKind, string> = {
  thermal_runaway: 'Thermal runaway',
  cell_imbalance: 'Cell imbalance',
  geofence_exit: 'Geofence breach',
  rapid_capacity_loss: 'Rapid capacity loss',
};

const KIND_OPTIONS = [
  { value: '', label: 'All alarm types' },
  ...(Object.keys(KIND_LABEL) as AlarmKind[]).map((k) => ({ value: k as string, label: KIND_LABEL[k] })),
];

const STATE_OPTIONS = [
  { value: 'open', label: 'Open only' },
  { value: 'all', label: 'Open and acknowledged' },
];

const SEARCH_KEYS: (keyof Alarm)[] = ['subjectLabel', 'message'];

export function AlarmsPage() {
  const { t } = useI18n();
  const { alarms, thresholds, setThresholds, toggleSound, acknowledge, acknowledgeAll, unacknowledgedCount } =
    useAlarms();
  const toast = useToast();

  const [kind, setKind] = useSessionState('filter:alarms:kind', '');
  const [stateFilter, setStateFilter] = useSessionState('filter:alarms:state', 'open');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(thresholds);

  const rows = useMemo(
    () =>
      alarms.filter(
        (a) => (kind === '' || a.kind === kind) && (stateFilter === 'all' || !a.acknowledgedAt)
      ),
    [alarms, kind, stateFilter]
  );

  const table = useTable<Alarm>(rows, { tableId: 'alarms', searchKeys: SEARCH_KEYS, initialSortBy: 'at', initialSortDir: 'desc', pageSize: 15 });
  if (table.search !== search) table.setSearch(search);

  const columns = useMemo<Column<Alarm>[]>(
    () => [
      {
        key: 'severity',
        header: 'Severity',
        sortable: true,
        filterable: true,
        render: (a) => (
          <Badge tone={a.severity === 'critical' ? 'danger' : a.severity === 'serious' ? 'warning' : 'neutral'}>
            {SEVERITY_LABEL[a.severity]}
          </Badge>
        ),
      },
      { key: 'kind', header: 'Type', sortable: true, render: (a) => KIND_LABEL[a.kind], filterable: true },
      {
        key: 'subjectLabel',
        header: 'Subject',
        sortable: true,
        filterable: true,
        render: (a) => <strong>{a.subjectLabel}</strong>,
      },
      {
        key: 'value',
        header: 'Reading',
        sortable: true,
        align: 'right',
        // The threshold sits beside the value: "78 °C" alone does not say
        // whether that is bad.
        render: (a) => (a.unit ? `${a.value} ${a.unit} / ${a.threshold} ${a.unit}` : '—'),
      },
      { key: 'message', header: 'Detail' },
      { key: 'at', header: 'Raised', sortable: true, render: (a) => formatRelative(a.at) },
      {
        key: 'ack',
        header: '',
        align: 'right',
        render: (a) =>
          a.acknowledgedAt ? (
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Acked by {a.acknowledgedBy}
            </span>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => acknowledge(a.id)}>
              Acknowledge
            </Button>
          ),
      },
    ],
    [acknowledge]
  );

  const dirty =
    draft.cellTempC !== thresholds.cellTempC ||
    draft.cellImbalanceMv !== thresholds.cellImbalanceMv ||
    draft.sohFloor !== thresholds.sohFloor;

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.alarms')}</h1>
          <span className="pill" style={unacknowledgedCount > 0 ? { borderColor: 'var(--status-critical)' } : undefined}>
            {unacknowledgedCount} open
          </span>
          <span className="spacer" />

          <Button variant={thresholds.soundArmed ? 'primary' : 'secondary'} icon="bell" onClick={toggleSound}>
            {thresholds.soundArmed ? 'Chime armed' : 'Arm chime'}
          </Button>

          <Button variant="ghost" onClick={acknowledgeAll} disabled={unacknowledgedCount === 0}>
            Acknowledge all
          </Button>

          <ColumnPicker

            columns={columns}

            hidden={table.hiddenColumns}

            onToggle={table.toggleColumn}

            onShowAll={table.showAllColumns}

          />

          <ExportMenu
            name="alarms"
            title="Alarms"
            getRows={() =>
              table.allMatchingRows.map((a) => ({
                Severity: SEVERITY_LABEL[a.severity],
                Type: KIND_LABEL[a.kind],
                Subject: a.subjectLabel,
                Reading: a.unit ? `${a.value} ${a.unit}` : '',
                Threshold: a.unit ? `${a.threshold} ${a.unit}` : '',
                Message: a.message,
                Raised: formatDateTime(a.at),
                Acknowledged: a.acknowledgedAt ? formatDateTime(a.acknowledgedAt) : '',
                'Acknowledged by': a.acknowledgedBy ?? '',
              }))
            }
          />
        </div>

        <Card title="Thresholds">
          <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            These are the trip points the live feed is tested against. They are stored per browser and
            every change is written to the audit trail. An alarm repeats at most once every five
            minutes per pack — without that cooldown a single hot cell reporting every 1.5 s would
            fill this page in a minute.
          </p>

          <div className="kv">
            <Input
              label="Cell temperature (°C)"
              type="number"
              value={draft.cellTempC}
              onChange={(e) => setDraft({ ...draft, cellTempC: Number(e.target.value) })}
            />
            <Input
              label="Cell imbalance (mV)"
              type="number"
              value={draft.cellImbalanceMv}
              onChange={(e) => setDraft({ ...draft, cellImbalanceMv: Number(e.target.value) })}
            />
            <Input
              label="SOH retirement floor (%)"
              type="number"
              value={draft.sohFloor}
              onChange={(e) => setDraft({ ...draft, sohFloor: Number(e.target.value) })}
            />
          </div>

          <div className="row" style={{ marginTop: 'var(--sp-4)', gap: 'var(--sp-3)' }}>
            <Can
              permission="alarm:manage"
              fallback={
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                  <Icon name="alert" size={14} /> Changing a threshold requires the{' '}
                  <code>alarm:manage</code> permission.
                </span>
              }
            >
              <Button
                variant="primary"
                disabled={!dirty}
                onClick={() => {
                  setThresholds({ ...thresholds, ...draft });
                  toast.success('Thresholds updated');
                }}
              >
                Save thresholds
              </Button>
              <Button variant="ghost" disabled={!dirty} onClick={() => setDraft(thresholds)}>
                Reset
              </Button>
            </Can>
          </div>
        </Card>

        <div className="dashboard-filter">
          <Select value={kind} options={KIND_OPTIONS} onChange={setKind} />
          <Select value={stateFilter} options={STATE_OPTIONS} onChange={setStateFilter} />
          <Input
            icon="search"
            round
            placeholder="Search subject or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            style={{ minWidth: 260 }}
          />
        </div>

        <Card flush>
          <DataTable
            rows={table.rows}
            columns={table.visibleColumns(columns)}
            rowKey={(a) => a.id}
            sortBy={table.sortBy}
            sortDir={table.sortDir}
            onSort={table.toggleSort}
            filters={table.filters}
            onFilter={table.setFilter}
            distinctValues={table.distinctValues}
            emptyMessage={
              stateFilter === 'open' ? 'Nothing open — the fleet is quiet.' : 'No alarms match.'
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
      </div>
    </>
  );
}
