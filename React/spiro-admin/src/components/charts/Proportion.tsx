/**
 * Proportion — a two-part split.
 *
 * This replaces what the reference product draws as a two-slice donut. A
 * 2-slice pie is a documented anti-pattern: the reader cannot judge the
 * angle, so the numbers do all the work anyway. A stacked bar plus two hero
 * figures shows the same split honestly and reads at a glance.
 *
 * Running/Stopped is a STATE, so it uses the reserved status colours — and
 * carries written labels, because the good/critical pair is exactly the
 * red/green combination that colour-blind readers cannot separate.
 */

import { cn } from '@/lib/utils/cn';

export interface ProportionPart {
  label: string;
  value: number;
  color: string;
}

export function Proportion({
  parts,
  className,
  formatValue = (n: number) => n.toLocaleString(),
}: {
  parts: ProportionPart[];
  className?: string;
  formatValue?: (n: number) => string;
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;

  return (
    <div className={cn(className)}>
      <div
        className="proportion"
        role="img"
        aria-label={parts.map((p) => `${p.label}: ${p.value}`).join(', ')}
      >
        {parts.map((part) => (
          <div
            key={part.label}
            className="proportion__part"
            style={{ width: `${(part.value / total) * 100}%`, background: part.color }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${parts.length}, 1fr)`,
          gap: 'var(--sp-4)',
          marginTop: 'var(--sp-4)',
        }}
      >
        {parts.map((part) => (
          <div key={part.label}>
            <div className="chart__legend-item" style={{ marginBottom: 'var(--sp-1)' }}>
              <span className="chart__swatch" style={{ background: part.color }} />
              {/* The written label is the mitigation for the red/green pair. */}
              <span>{part.label}</span>
            </div>
            <div className="hero-figure" style={{ color: part.color }}>
              {formatValue(part.value)}
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
              {Math.round((part.value / total) * 100)}% of fleet
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
