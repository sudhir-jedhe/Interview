/**
 * User Management.
 *
 * The point of this screen is the authorization model made visible: each row
 * shows a role, and expanding it lists the exact permissions that role
 * carries — read straight from `ROLE_PERMISSIONS`, so the table can never
 * drift from what the app actually enforces.
 *
 * Editing is gated on `user:manage`; an admin can SEE the directory but only
 * a super admin can change it. The disabled button carries a title
 * explaining why, rather than silently doing nothing.
 */

import { useMemo, useState } from 'react';

import type { Role, User } from '@/types/domain';
import { listUsers } from '@/lib/api/client';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/features/auth/permissions';
import { useAuth } from '@/features/auth/AuthProvider';
import { useAsync } from '@/hooks/useAsync';
import { useSessionState } from '@/hooks/useStoredState';
import { useDebounce } from '@/hooks/useDebounce';
import { useTable } from '@/hooks/useTable';

import { useI18n } from '@/i18n/I18nProvider';
import { ColumnPicker } from '@/components/ui/ColumnPicker';
import { ExportMenu } from '@/components/ui/ExportMenu';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Pagination, type Column } from '@/components/ui/Table';
import { ErrorState } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Can } from '@/features/auth/ProtectedRoute';
import { useDbVersion } from '@/hooks/useDb';
import { deleteUser } from '@/lib/api/mutations';
import { ImportDialog } from '@/features/import/ImportDialog';
import { USER_IMPORT } from '@/lib/api/import';
import { UserFormModal } from './UserFormModal';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  ...(Object.keys(ROLE_LABELS) as Role[]).map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
  })),
];

const ROLE_TONE: Record<Role, 'solid' | 'info' | 'success' | 'neutral'> = {
  super_admin: 'solid',
  admin: 'info',
  operator: 'success',
  viewer: 'neutral',
};

const SEARCH_KEYS: (keyof User)[] = ['name', 'email', 'country'];

export function UsersPage() {
  const { t } = useI18n();
  const [rawSearch, setRawSearch] = useState('');
  const [role, setRole] = useSessionState('filter:users:role', '');
  const [expanded, setExpanded] = useState<string | null>(null);

  const search = useDebounce(rawSearch, 250);
  const { user: actor, can } = useAuth();
  const toast = useToast();
  const version = useDbVersion();

  const [editing, setEditing] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const list = useAsync(
    ({ signal }) => listUsers({ search, role: role || undefined, pageSize: 500, signal }),
    // Adding, editing or deleting a user must refetch this list.
    [search, role, version]
  );

  const rows = useMemo(() => list.data?.items ?? [], [list.data]);

  const table = useTable<User>(rows, {
    tableId: 'users',
    searchKeys: SEARCH_KEYS,
    initialSortBy: 'name',
    pageSize: 10,
  });

  const canManage = can('user:manage');

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: 'name',
        header: 'Name',
        sortable: true,
        filterable: true,
        render: (u) => (
          <div>
            <strong>{u.name}</strong>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{u.email}</div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        sortable: true,
        filterable: true,
        render: (u) => <Badge tone={ROLE_TONE[u.role]}>{ROLE_LABELS[u.role]}</Badge>,
      },
      {
        key: 'country',
        header: 'Scope',
        sortable: true,
        filterable: true,
        render: (u) => (u.country === 'ALL' ? 'All countries' : u.country),
      },
      {
        key: 'permissions',
        header: 'Permissions',
        render: (u) => (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            aria-expanded={expanded === u.id}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((current) => (current === u.id ? null : u.id));
            }}
          >
            {ROLE_PERMISSIONS[u.role].length} granted
          </button>
        ),
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (u) => (
          <div className="row" style={{ gap: 'var(--sp-1)', justifyContent: 'flex-end' }}>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              icon="edit"
              aria-label={`Edit ${u.name}`}
              disabled={!canManage}
              title={canManage ? undefined : 'Requires the user:manage permission'}
              onClick={(event) => {
                event.stopPropagation();
                setEditing(u);
                setFormOpen(true);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              icon="trash"
              aria-label={`Delete ${u.name}`}
              // You cannot delete yourself — the mutation refuses it too,
              // but disabling the control is kinder than an error toast.
              disabled={!canManage || u.id === actor?.id}
              title={
                u.id === actor?.id
                  ? 'You cannot delete your own account'
                  : canManage
                    ? undefined
                    : 'Requires the user:manage permission'
              }
              onClick={(event) => {
                event.stopPropagation();
                setDeleting(u);
              }}
            />
          </div>
        ),
      },
    ],
    [expanded, canManage, actor]
  );

  const expandedUser = rows.find((u) => u.id === expanded);

  return (
    <>
      <Breadcrumbs />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{t('page.users')}</h1>
          <span className="spacer" />

          <Can permission="user:manage">
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
              {t('action.addUser')}
            </Button>
          </Can>

          {/* Exporting the directory is its own capability: a CSV of every
              account and its permissions is exactly what you do not want a
              read-only viewer walking out with. */}
          <ColumnPicker
            columns={columns}
            hidden={table.hiddenColumns}
            onToggle={table.toggleColumn}
            onShowAll={table.showAllColumns}
          />
          <ExportMenu
            name="users"
            title="Users"
            getRows={() =>
              table.allMatchingRows.map((u) => ({
                Name: u.name,
                Email: u.email,
                Role: ROLE_LABELS[u.role],
                Scope: u.country,
                Permissions: ROLE_PERMISSIONS[u.role].join(' | '),
              }))
            }
          />
        </div>

        <div className="row" style={{ gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <Input
            icon="search"
            round
            placeholder="Search name or email"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            onClear={() => setRawSearch('')}
            style={{ minWidth: 260 }}
          />
          <Select value={role} options={ROLE_OPTIONS} onChange={setRole} />
        </div>

        {list.error ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : (
          <Card flush>
            <DataTable
              rows={table.rows}
              columns={table.visibleColumns(columns)}
              rowKey={(u) => u.id}
              sortBy={table.sortBy}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
              filters={table.filters}
              onFilter={table.setFilter}
              distinctValues={table.distinctValues}
              isLoading={list.isLoading}
              emptyMessage="No users match."
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

        {expandedUser && (
          <Card title={`Permissions — ${ROLE_LABELS[expandedUser.role]}`}>
            <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              These are the exact strings components check with <code>can(...)</code>. Roles are a
              label on top of this list, not a second source of truth.
            </p>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', listStyle: 'none', padding: 0, margin: 0 }}>
              {ROLE_PERMISSIONS[expandedUser.role].map((permission) => (
                <li key={permission}>
                  <code
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--bg-sunken)',
                      border: '1px solid var(--border)',
                      fontSize: 'var(--fs-sm)',
                    }}
                  >
                    {permission}
                  </code>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <UserFormModal open={formOpen} user={editing} onClose={() => setFormOpen(false)} />

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        spec={USER_IMPORT}
        permission="user:manage"
        title="Import users"
      />

      <ConfirmDialog
        open={deleting !== null}
        title={deleting ? `Delete ${deleting.name}?` : ''}
        description="They lose access immediately. The deletion is recorded in the audit trail with your name against it."
        confirmLabel="Delete user"
        danger
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          try {
            deleteUser(deleting.id, actor);
            toast.success(`${deleting.name} deleted`);
          } catch (error) {
            toast.error((error as Error).message);
          }
          setDeleting(null);
        }}
      />
    </>
  );
}
