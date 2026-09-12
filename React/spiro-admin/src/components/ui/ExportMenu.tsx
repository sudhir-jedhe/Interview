/**
 * The export dropdown.
 *
 * One button, four destinations, one source of truth: every format is
 * generated from the SAME array of display rows, so the CSV, the workbook,
 * the JSON and the printed page can never disagree about what was exported.
 *
 * Why each format exists rather than just CSV:
 *   CSV    universal, opens anywhere, loses types.
 *   Excel  keeps numbers numeric so they can be summed, and ships with a
 *          frozen header row and an autofilter already applied.
 *   JSON   for feeding another system, and it round-trips back through the
 *          import dialog unchanged.
 *   PDF    for the person who is going to print it and write on it.
 *
 * The whole menu is behind `data:export`; a user without it sees no button
 * rather than a disabled one that can never become enabled.
 */

import { useRef, useState } from 'react';

import { downloadBlob, downloadCsv, downloadJson, timestampedName } from '@/lib/utils/export';
import { buildXlsx, sheetFromRecords } from '@/lib/utils/xlsx';
import { printTable } from '@/lib/utils/print';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useI18n } from '@/i18n/I18nProvider';

import { Icon, type IconName } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { Can } from '@/features/auth/ProtectedRoute';

export type ExportRow = Record<string, unknown>;

interface Props {
  /** Base filename, without extension or timestamp. */
  name: string;
  /** Title on the printed page and the worksheet tab. */
  title: string;
  subtitle?: string;
  /** Called only when a format is chosen — so a big table is not built
   *  on every render just in case someone opens the menu. */
  getRows: () => ExportRow[];
  disabled?: boolean;
  size?: 'sm' | 'md';
}

type Format = 'csv' | 'xlsx' | 'json' | 'pdf';

const FORMATS: { id: Format; label: string; icon: IconName; note: string }[] = [
  { id: 'csv', label: 'Save as CSV', icon: 'file', note: 'Opens anywhere' },
  { id: 'xlsx', label: 'Save as Excel', icon: 'grid', note: 'Numbers stay numbers' },
  { id: 'json', label: 'Save as JSON', icon: 'card', note: 'Re-imports unchanged' },
  { id: 'pdf', label: 'Save as PDF', icon: 'printer', note: 'Via your print dialog' },
];

export function ExportMenu({ name, title, subtitle, getRows, disabled, size = 'md' }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { t } = useI18n();

  useOnClickOutside(wrapRef, () => setOpen(false), open);

  const run = (format: Format) => {
    setOpen(false);

    const rows = getRows();
    if (rows.length === 0) {
      toast.error('Nothing to export — no rows match the current filters.');
      return;
    }

    const headers: string[] = [];
    for (const row of rows.slice(0, 50)) {
      for (const key of Object.keys(row)) if (!headers.includes(key)) headers.push(key);
    }

    switch (format) {
      case 'csv':
        downloadCsv(timestampedName(name, 'csv'), rows);
        break;

      case 'xlsx':
        downloadBlob(timestampedName(name, 'xlsx'), buildXlsx(sheetFromRecords(title, rows)));
        break;

      case 'json':
        downloadJson(timestampedName(name, 'json'), rows);
        break;

      case 'pdf':
        printTable({
          title,
          subtitle,
          headers,
          // A column is right-aligned when EVERY value in it is a number —
          // one text cell in a numeric column means it is not numeric.
          numericColumns: headers
            .map((key, i) => (rows.every((row) => typeof row[key] === 'number') ? i : -1))
            .filter((i) => i >= 0),
          rows: rows.map((row) => headers.map((key) => (row[key] ?? '') as string | number)),
        });
        break;
    }

    if (format !== 'pdf') toast.success(`Exported ${rows.length} rows`);
  };

  return (
    <Can permission="data:export">
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <button
          type="button"
          className={size === 'sm' ? 'btn btn--secondary btn--sm' : 'btn btn--secondary'}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <Icon name="download" size={16} />
          {t('action.download')}
          <Icon name="chevron-down" size={13} />
        </button>

        {open && (
          <div className="select__menu export-menu" role="menu">
            {FORMATS.map((format) => (
              <button
                key={format.id}
                type="button"
                role="menuitem"
                className="select__option"
                onClick={() => run(format.id)}
              >
                <Icon name={format.icon} size={15} />
                <span style={{ flex: 1 }}>{format.label}</span>
                <span className="export-menu__note">{format.note}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Can>
  );
}
