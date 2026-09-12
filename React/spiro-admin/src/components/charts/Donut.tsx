/**
 * Donut — part-to-whole, 3 to 6 segments.
 *
 * Guardrails baked in, because this is the most misused chart there is:
 *   - fewer than 3 segments renders a Proportion bar instead (a 2-slice pie
 *     is an anti-pattern — the reader judges the numbers, not the angle)
 *   - more than 6 segments folds the tail into "Other", never a 7th hue
 *   - every segment is direct-labelled, so identity is never colour-alone
 */

import { useId, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Proportion } from './Proportion';

export interface DonutSlice {
  label: string;
  value: number;
}

const SERIES = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)', 'var(--viz-6)'];

export function Donut({
  data,
  size = 200,
  centerLabel,
  className,
  formatValue = (n: number) => n.toLocaleString(),
}: {
  data: DonutSlice[];
  size?: number;
  centerLabel?: string;
  className?: string;
  formatValue?: (n: number) => string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();

  // Fold anything past six into "Other" rather than generating a hue.
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const slices =
    sorted.length > 6
      ? [
          ...sorted.slice(0, 5),
          { label: 'Other', value: sorted.slice(5).reduce((s, d) => s + d.value, 0) },
        ]
      : sorted;

  const total = slices.reduce((s, d) => s + d.value, 0) || 1;

  // Two segments is not a donut. Hand it to the honest form.
  if (slices.length < 3) {
    return (
      <Proportion
        className={className}
        formatValue={formatValue}
        parts={slices.map((s, i) => ({ ...s, color: SERIES[i]! }))}
      />
    );
  }

  const stroke = 26;
  const radius = size / 2 - stroke / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className={cn('chart', className)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)', flexWrap: 'wrap' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-labelledby={titleId}>
          <title id={titleId}>{slices.map((s) => `${s.label}: ${s.value}`).join(', ')}</title>

          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {slices.map((slice, i) => {
              const fraction = slice.value / total;
              // 2px surface gap between segments, expressed in arc length.
              const gap = 2;
              const length = Math.max(0, fraction * circumference - gap);
              const dash = `${length} ${circumference - length}`;
              const thisOffset = offset;
              offset += fraction * circumference;

              return (
                <circle
                  key={slice.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={SERIES[i]}
                  strokeWidth={active === i ? stroke + 3 : stroke}
                  strokeDasharray={dash}
                  strokeDashoffset={-thisOffset}
                  style={{ transition: 'stroke-width 120ms' }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                />
              );
            })}
          </g>

          <text
            x={size / 2}
            y={size / 2 - 4}
            textAnchor="middle"
            style={{ fill: 'var(--text-primary)', fontSize: 20, fontWeight: 700 }}
          >
            {active !== null ? formatValue(slices[active]!.value) : formatValue(total)}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 16}
            textAnchor="middle"
            style={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          >
            {active !== null ? slices[active]!.label : (centerLabel ?? 'Total')}
          </text>
        </svg>

        {/* Direct labels: identity never depends on hue alone. */}
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--sp-2)' }}>
          {slices.map((slice, i) => (
            <li
              key={slice.label}
              className="chart__legend-item"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="chart__swatch" style={{ background: SERIES[i] }} />
              <span style={{ color: 'var(--text-primary)' }}>{slice.label}</span>
              <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{formatValue(slice.value)}</strong>
              <span style={{ color: 'var(--text-tertiary)' }}>
                {Math.round((slice.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
