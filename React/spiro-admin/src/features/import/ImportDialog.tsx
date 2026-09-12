/**
 * The import dialog.
 *
 * Its job is to make the DRY RUN visible. Choose a file, and the dialog shows
 * exactly what would happen — how many rows would be created, how many are
 * duplicates of records you already have, how many are duplicates of each
 * other, and which rows were rejected and why, by line number. Only then does
 * the Import button do anything.
 *
 * Rejections are listed with the line number and the reason, because "12 rows
 * rejected" is not actionable and "line 47: an IMEI is exactly 15 digits" is.
 */

import { useCallback, useRef, useState } from 'react';

import type { Permission } from '@/types/domain';
import { parseTabularFile, type Row } from '@/lib/utils/parse';
import { downloadText, timestampedName } from '@/lib/utils/export';
import {
  applyImport,
  planImport,
  templateCsv,
  type DuplicateMode,
  type ImportPlan,
  type ImportSpec,
} from '@/lib/api/import';
import { useAuth } from '@/features/auth/AuthProvider';
import { useI18n } from '@/i18n/I18nProvider';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';

interface Props<TDraft> {
  open: boolean;
  onClose: () => void;
  spec: ImportSpec<TDraft>;
  /** Import is a write; it is gated on the same permission as creating one. */
  permission: Permission;
  title: string;
}

export function ImportDialog<TDraft>({ open, onClose, spec, permission, title }: Props<TDraft>) {
  const { user, can } = useAuth();
  const { t } = useI18n();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<ImportPlan<TDraft> | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [mode, setMode] = useState<DuplicateMode>('skip');
  const [dragging, setDragging] = useState(false);

  const allowed = can(permission);

  const reset = useCallback(() => {
    setFileName('');
    setPlan(null);
    setRows([]);
    setError(null);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);
      setPlan(null);
      setFileName(file.name);

      try {
        const parsed = await parseTabularFile(file);
        setRows(parsed);
        setPlan(planImport(parsed, spec));
      } catch (err) {
        setError((err as Error).message);
        setRows([]);
      } finally {
        setBusy(false);
      }
    },
    [spec]
  );

  const commit = () => {
    if (!plan) return;

    const result = applyImport(plan, spec, mode, user);

    const parts = [`${result.created} created`];
    if (result.updated > 0) parts.push(`${result.updated} updated`);
    if (result.skipped > 0) parts.push(`${result.skipped} duplicates skipped`);
    if (result.rejected > 0) parts.push(`${result.rejected} rejected`);

    if (result.created + result.updated === 0) toast.show(parts.join(', '), 'warning');
    else toast.success(parts.join(', '));

    reset();
    onClose();
  };

  const close = () => {
    reset();
    onClose();
  };

  const willWrite = plan ? plan.create.length + (mode === 'update' ? plan.existing.length : 0) : 0;

  return (
    <Modal
      open={open}
      title={title}
      onClose={close}
      width={720}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" icon="download" disabled={!allowed || willWrite === 0} onClick={commit}>
            {t('import.confirm')}
            {willWrite > 0 ? ` (${willWrite})` : ''}
          </Button>
        </>
      }
    >
      {!allowed ? (
        <p className="row" style={{ gap: 'var(--sp-2)', margin: 0, color: 'var(--status-warning)' }}>
          <Icon name="lock" size={16} />
          {t('import.noPermission')}
        </p>
      ) : (
        <>
          {/* ---- the expected shape, before anything is chosen ---- */}
          <div>
            <div className="row" style={{ marginBottom: 'var(--sp-2)' }}>
              <strong>Expected columns</strong>
              <span className="spacer" />
              <Button
                size="sm"
                variant="ghost"
                icon="file"
                onClick={() =>
                  downloadText(
                    timestampedName(`${spec.entity}-template`, 'csv'),
                    templateCsv(spec.fields)
                  )
                }
              >
                {t('import.template')}
              </Button>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Required</th>
                    <th>Example</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {spec.fields.map((field) => (
                    <tr key={field.header}>
                      <td>
                        <strong>{field.header}</strong>
                      </td>
                      <td>{field.required ? 'Yes' : 'Optional'}</td>
                      <td className="mono">{field.example}</td>
                      <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                        {field.hint ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ margin: 'var(--sp-2) 0 0', fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              Headings are matched loosely — “Vehicle No”, “vehicle_no” and “vehicleNo” all work — so a
              file exported with the Download button imports straight back in.
            </p>
          </div>

          {/* ---- file picker ---- */}
          <div
            className={dragging ? 'dropzone dropzone--over' : 'dropzone'}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) void handleFile(file);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.tsv,.txt,.json,.xlsx"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />

            <Icon name="file" size={26} />
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              {t('import.choose')}
            </Button>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              {fileName || t('import.hint')}
            </span>
          </div>

          {busy && <p style={{ margin: 0 }}>{t('import.parsing')}</p>}

          {error && (
            <p className="row" style={{ gap: 'var(--sp-2)', margin: 0, color: 'var(--status-critical)' }}>
              <Icon name="alert" size={16} />
              {error}
            </p>
          )}

          {plan && <PlanSummary plan={plan} rows={rows} mode={mode} onMode={setMode} />}
        </>
      )}
    </Modal>
  );
}

function PlanSummary<TDraft>({
  plan,
  rows,
  mode,
  onMode,
}: {
  plan: ImportPlan<TDraft>;
  rows: Row[];
  mode: DuplicateMode;
  onMode: (mode: DuplicateMode) => void;
}) {
  const rejected = [...plan.duplicatesInFile, ...plan.rejected].sort((a, b) => a.line - b.line);

  return (
    <div className="grid" style={{ gap: 'var(--sp-4)' }}>
      <div className="auto-grid auto-grid--tight">
        <Tally label="Rows read" value={plan.totalRows} />
        <Tally label="New" value={plan.create.length} tone="var(--status-good)" />
        <Tally label="Already exist" value={plan.existing.length} tone="var(--status-warning)" />
        <Tally label="Duplicated in file" value={plan.duplicatesInFile.length} tone="var(--status-warning)" />
        <Tally label="Rejected" value={plan.rejected.length} tone="var(--status-critical)" />
      </div>

      {plan.unknownColumns.length > 0 && (
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
          Ignored columns: <span className="mono">{plan.unknownColumns.join(', ')}</span>
        </p>
      )}

      {plan.existing.length > 0 && (
        <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 'var(--sp-3)' }}>
          <legend style={{ padding: '0 var(--sp-2)', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
            {plan.existing.length} record{plan.existing.length === 1 ? '' : 's'} already exist
          </legend>

          <label className="row" style={{ gap: 'var(--sp-2)', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={mode === 'skip'}
              onChange={() => onMode('skip')}
              style={{ accentColor: 'var(--spiro-blue)' }}
            />
            <span>
              <strong>Skip them</strong> — import only the new rows. Nothing you already have is touched.
            </span>
          </label>

          <label className="row" style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={mode === 'update'}
              onChange={() => onMode('update')}
              style={{ accentColor: 'var(--spiro-blue)' }}
            />
            <span>
              <strong>Update them</strong> — overwrite the existing records with the file’s values. Every
              change is written to the audit trail field by field.
            </span>
          </label>
        </fieldset>
      )}

      {rejected.length > 0 && (
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            {rejected.length} row{rejected.length === 1 ? '' : 's'} not imported — see why
          </summary>
          <div className="log" style={{ marginTop: 'var(--sp-2)', maxHeight: 200 }}>
            {rejected.slice(0, 100).map((entry) => (
              <div className="log__row" key={`${entry.line}-${entry.reason}`} style={{ whiteSpace: 'normal' }}>
                <span style={{ width: 58, flex: 'none' }}>Line {entry.line}</span>
                <span>{entry.reason}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {plan.create.length > 0 && (
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Preview the first rows</summary>
          <div className="table-wrap" style={{ marginTop: 'var(--sp-2)' }}>
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(rows[0] ?? {}).slice(0, 6).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.keys(rows[0] ?? {}).slice(0, 6).map((key) => (
                      <td key={key}>{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

function Tally({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div style={{ padding: 'var(--sp-3)', background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)' }}>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, color: tone }}>{value}</div>
    </div>
  );
}
