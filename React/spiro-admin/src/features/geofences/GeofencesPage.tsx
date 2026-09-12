/**
 * Geofences — the operating zones the alarm engine tests against.
 *
 * Two kinds, and the difference matters:
 *
 *   INCLUSION  a vehicle should stay inside. Leaving every inclusion zone
 *              for its country raises an alarm.
 *   EXCLUSION  a vehicle should stay out. Entering one raises a higher
 *              severity, because it is usually a port, a depot or a
 *              motorway rather than merely "off the map".
 *
 * Toggling a zone off does not delete it — it stops the engine testing it.
 * That distinction is what lets an operator silence a noisy zone at 03:00
 * without losing the boundary someone spent an afternoon drawing.
 */

import { useMemo, useState } from 'react';

import type { Geofence } from '@/types/domain';
import { db } from '@/lib/mock/db';
import { useDbSelector } from '@/hooks/useDb';
import { useAuth } from '@/features/auth/AuthProvider';
import { deleteGeofence, renameGeofence, toggleGeofence } from '@/lib/api/mutations';
import { ringBounds } from '@/lib/geo/polygon';
import { formatDateTime } from '@/lib/utils/format';

import { useI18n } from '@/i18n/I18nProvider';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { DataTable, type Column } from '@/components/ui/Table';
import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { useTable } from '@/hooks/useTable';
import { useToast } from '@/components/ui/Toast';
import { FleetMap } from '@/components/map/FleetMap';
import { Can } from '@/features/auth/ProtectedRoute';

export function GeofencesPage() {
  const { t } = useI18n();
  const geofences = useDbSelector(() => db.geofences);

  // Only eleven rows today, but a zone list grows with the business and a
  // header that sorts on one screen and not another is worse than neither.
  const table = useTable<Geofence>(geofences, {
    tableId: 'geofences',
    searchKeys: ['name', 'country'],
    initialSortBy: 'name',
    pageSize: 25,
  });
  const { user, can } = useAuth();
  const toast = useToast();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<Geofence | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleting, setDeleting] = useState<Geofence | null>(null);

  const selected = geofences.find((f) => f.id === selectedId) ?? geofences[0] ?? null;
  const manage = can('geofence:manage');

  const centre = useMemo(() => {
    if (!selected) return { lat: 6.2, lng: 1.22 };
    const b = ringBounds(selected.ring);
    return { lat: (b.minLat + b.maxLat) / 2, lng: (b.minLng + b.maxLng) / 2 };
  }, [selected]);

  const columns = useMemo<Column<Geofence>[]>(
    () => [
      {
        key: 'name',
        header: 'Zone',
        sortable: true,
        filterable: true,
        render: (f) => (
          <div>
            <strong>{f.name}</strong>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              {f.ring.length} vertices · created {formatDateTime(f.createdAt)}
            </div>
          </div>
        ),
      },
      { key: 'country', header: 'Country', sortable: true, filterable: true },
      {
        key: 'kind',
        header: 'Kind',
        sortable: true,
        filterable: true,
        render: (f) => (
          <Badge tone={f.kind === 'exclusion' ? 'danger' : 'info'}>
            {f.kind === 'exclusion' ? 'Exclusion' : 'Operating'}
          </Badge>
        ),
      },
      {
        key: 'active',
        header: 'Monitoring',
        sortable: true,
        render: (f) => (
          <label className="row" style={{ gap: 'var(--sp-2)' }} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={f.active}
              disabled={!manage}
              style={{ accentColor: 'var(--spiro-blue)' }}
              onChange={() => {
                toggleGeofence(f.id, user);
                toast.success(`${f.name} ${f.active ? 'is no longer monitored' : 'is monitored again'}`);
              }}
            />
            {f.active ? 'On' : 'Off'}
          </label>
        ),
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (f) => (
          <Can permission="geofence:manage">
            <div className="row" style={{ gap: 'var(--sp-2)', justifyContent: 'flex-end' }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setRenaming(f);
                  setRenameValue(f.name);
                }}
              >
                Rename
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleting(f);
                }}
              >
                Delete
              </Button>
            </div>
          </Can>
        ),
      },
    ],
    [manage, user, toast]
  );

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.geofences')}</h1>
          <span className="spacer" />
          <span className="pill">{geofences.filter((f) => f.active).length} monitored</span>

          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
        </div>

        <div className="split">
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
              onRowClick={(f) => setSelectedId(f.id)}
              emptyMessage="No zones defined."
            />
          </Card>

          <Card flush style={{ overflow: 'hidden' }}>
            <FleetMap
              geofences={geofences}
              center={centre}
              zoom={selected ? 10 : 5}
              height={520}
              cluster={false}
            />
          </Card>
        </div>

        {selected && (
          <Card title={selected.name}>
            <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              {selected.kind === 'exclusion'
                ? 'Vehicles entering this sector raise a serious alarm.'
                : 'Vehicles that leave every operating zone in this country raise a warning.'}{' '}
              Boundary testing uses a ray-cast point-in-polygon with a bounding-box pre-check, so a
              concave zone traced around a coastline behaves correctly.
            </p>

            <div className="mono" style={{ color: 'var(--text-secondary)' }}>
              {selected.ring.map((p) => `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`).join('  ·  ')}
            </div>
          </Card>
        )}
      </div>

      <Modal
        open={renaming !== null}
        title="Rename zone"
        onClose={() => setRenaming(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!renaming) return;
                try {
                  renameGeofence(renaming.id, renameValue, user);
                  toast.success('Zone renamed');
                  setRenaming(null);
                } catch (error) {
                  toast.error((error as Error).message);
                }
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Input
          label="Zone name"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          autoFocus
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this zone?"
        description={
          deleting
            ? `“${deleting.name}” will stop being monitored and the boundary will be lost. Turning monitoring off instead keeps the shape.`
            : undefined
        }
        confirmLabel="Delete zone"
        danger
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          deleteGeofence(deleting.id, user);
          toast.success(`${deleting.name} deleted`);
          setDeleting(null);
        }}
      />
    </>
  );
}
