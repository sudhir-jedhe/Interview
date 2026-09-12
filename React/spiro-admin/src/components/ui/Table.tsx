/**
 * DataTable — sortable, keyboard-navigable, generic over the row type.
 *
 * The generic is what makes it worth building: `columns` is checked against
 * `T`, so a typo in a column key is a compile error rather than a column of
 * blanks discovered in production.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { useI18n } from '@/i18n/I18nProvider';

const EMPTY_SELECTION: ReadonlySet<string> = new Set();

export interface Column<T> {
  key: string;
  header: string;
  /** Omit to render `row[key]` directly. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  /** Show a filter control under this heading. */
  filterable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: string;
  /** Exclude from the column picker — an actions column has nothing to hide. */
  alwaysVisible?: boolean;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Turn on the leading checkbox column. */
  selectable?: boolean;
  selected?: ReadonlySet<string>;
  onToggleRow?: (id: string) => void;
  /** Select/clear every row currently visible. */
  onToggleAll?: () => void;
  /** Active column filters, and how to change them. */
  filters?: { key: string; value: string }[];
  onFilter?: (key: string, value: string) => void;
  /** Distinct values for a column, used to build its filter dropdown. */
  distinctValues?: (key: string) => string[];
  sortBy?: string | null;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
}

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  rowKey,
  selectable = false,
  selected,
  onToggleRow,
  onToggleAll,
  filters = [],
  onFilter,
  distinctValues,
  sortBy,
  sortDir = 'asc',
  onSort,
  onRowClick,
  isLoading = false,
  emptyMessage,
  skeletonRows = 8,
}: DataTableProps<T>) {
  const { t } = useI18n();
  const selectedSet = selected ?? EMPTY_SELECTION;
  const visibleIds = rows.map(rowKey);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
  // "Some but not all" is a THIRD state, and a checkbox that shows only two
  // of three lies about what clicking it will do.
  const someVisibleSelected = !allVisibleSelected && visibleIds.some((id) => selectedSet.has(id));
  const columnCount = columns.length + (selectable ? 1 : 0);
  if (isLoading) {
    return (
      <div className="table-wrap">
        <table className="table">
          <Head
            columns={columns}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={onSort}
            selectable={selectable}
            selectAllLabel={t('table.selectAll')}
          />
          <tbody>
            {Array.from({ length: skeletonRows }, (_, i) => (
              <tr key={i}>
                {selectable && <td />}
                {columns.map((c) => (
                  <td key={c.key}>
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <Head
          columns={columns}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
          selectable={selectable}
          allSelected={allVisibleSelected}
          someSelected={someVisibleSelected}
          onToggleAll={onToggleAll}
          selectAllLabel={t('table.selectAll')}
          filters={filters}
          onFilter={onFilter}
          distinctValues={distinctValues}
        />

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount}>
                <div className="table__empty">{emptyMessage ?? t('table.noResults')}</div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                data-clickable={onRowClick ? 'true' : undefined}
                data-selected={selectedSet.has(rowKey(row)) ? 'true' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                // A clickable row must be reachable by keyboard too.
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
              >
                {selectable && (
                  <td
                    className="table__check"
                    // The checkbox must not also trigger the row's own click.
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSet.has(rowKey(row))}
                      onChange={() => onToggleRow?.(rowKey(row))}
                      aria-label={`Select row ${rowKey(row)}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} style={{ textAlign: column.align }}>
                    {column.render ? column.render(row) : String(row[column.key] ?? '–')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Head<T>({
  columns,
  sortBy,
  sortDir,
  onSort,
  selectable,
  allSelected = false,
  someSelected = false,
  onToggleAll,
  selectAllLabel,
  filters = [],
  onFilter,
  distinctValues,
}: Pick<
  DataTableProps<T>,
  | 'columns'
  | 'sortBy'
  | 'sortDir'
  | 'onSort'
  | 'selectable'
  | 'onToggleAll'
  | 'filters'
  | 'onFilter'
  | 'distinctValues'
> & {
  allSelected?: boolean;
  someSelected?: boolean;
  selectAllLabel: string;
}) {
  // The filter row appears only when the caller can actually handle a filter
  // AND at least one column asked for one — otherwise it is an empty strip of
  // padding under every heading.
  const filterable = Boolean(onFilter) && columns.some((c) => c.filterable);

  return (
    <thead>
      <tr>
        {selectable && (
          <th className="table__check" style={{ width: 40 }}>
            <input
              type="checkbox"
              checked={allSelected}
              // `indeterminate` is a DOM property, not an attribute — React
              // cannot set it from JSX, so it goes through a ref callback.
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={() => onToggleAll?.()}
              aria-label={selectAllLabel}
            />
          </th>
        )}
        {columns.map((column) => {
          const sortable = column.sortable !== false && Boolean(onSort);
          const isActive = sortBy === column.key;

          return (
            <th
              key={column.key}
              style={{ width: column.width, textAlign: column.align }}
              data-sortable={sortable || undefined}
              // Announces the current sort to assistive tech.
              aria-sort={isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              onClick={sortable ? () => onSort?.(column.key) : undefined}
            >
              <span className="table__sort">
                {column.header}
                {sortable && (
                  <Icon
                    name={isActive ? (sortDir === 'asc' ? 'sort-asc' : 'sort-desc') : 'sort'}
                    size={13}
                    className={cn('table__sort-icon', isActive && 'table__sort-icon--active')}
                  />
                )}
              </span>
            </th>
          );
        })}
      </tr>

      {/* A second header row rather than a popover per column: it is always
          visible, it is reachable by keyboard in the natural order, and the
          active filters are readable at a glance instead of hidden behind
          funnel icons you have to open one by one. */}
      {filterable && (
        <tr className="table__filters">
          {selectable && <th />}

          {columns.map((column) => {
            if (!column.filterable) return <th key={column.key} />;

            const value = filters.find((f) => f.key === column.key)?.value ?? '';
            const options = distinctValues?.(column.key) ?? [];

            return (
              <th key={column.key}>
                {/* Past ~30 distinct values a dropdown is worse than typing,
                    so the control changes shape with the data. */}
                {options.length > 0 && options.length <= 30 ? (
                  <select
                    className="table__filter"
                    value={value}
                    aria-label={`Filter by ${column.header}`}
                    onChange={(e) => onFilter?.(column.key, e.target.value)}
                  >
                    <option value="">All</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="table__filter"
                    type="search"
                    value={value}
                    placeholder="Filter…"
                    aria-label={`Filter by ${column.header}`}
                    onChange={(e) => onFilter?.(column.key, e.target.value)}
                  />
                )}
              </th>
            );
          })}
        </tr>
      )}
    </thead>
  );
}

/** Pagination bar, designed to sit directly under a DataTable. */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPrevious,
  onNext,
  onPageSize,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageSize?: (size: number) => void;
}) {
  const { t, locale } = useI18n();
  const n = (v: number) => new Intl.NumberFormat(locale).format(v);
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <span>
        {t('table.showing')} <strong>{n(first)}</strong>–<strong>{n(last)}</strong> {t('table.of')}{' '}
        <strong>{n(total)}</strong>
      </span>

      <span className="spacer" />

      {onPageSize && (
        <label className="row" style={{ gap: 'var(--sp-2)' }}>
          {t('table.rows')}
          <select
            className="input"
            style={{ width: 72, height: 30 }}
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="row" style={{ gap: 'var(--sp-2)' }}>
        <button className="btn btn--secondary btn--sm" onClick={onPrevious} disabled={page <= 1}>
          <Icon name="chevron-left" size={14} /> {t('table.previous')}
        </button>
        <span>
          {t('table.page')} {page} {t('table.of')} {totalPages}
        </span>
        <button className="btn btn--secondary btn--sm" onClick={onNext} disabled={page >= totalPages}>
          {t('table.next')} <Icon name="chevron-right" size={14} />
        </button>
      </div>
    </div>
  );
}
