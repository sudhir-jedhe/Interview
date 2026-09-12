/**
 * BarChart — magnitude across ordered categories.
 *
 * Design decisions worth stating, because the obvious version is wrong:
 *
 *   ONE COLOUR, not a ramp. My first draft coloured the ten SoC buckets on a
 *   red->amber->green ramp. That is two documented anti-patterns at once: a
 *   rainbow used for magnitude, and ten colour classes carrying meaning (past
 *   ~7, adjacent classes blur). The x-axis already encodes the bucket and bar
 *   length already encodes the count, so hue had no job left to do. Running
 *   the validator confirmed it: a 10-step single-hue ramp cannot clear the
 *   adjacent-lightness gate AND keep its light end above 2:1 on white.
 *
 *   STATUS is the exception. Buckets flagged `critical` get the reserved
 *   status colour — because "this battery is nearly flat" genuinely is a bad
 *   state, not an identity. It ships with a written label, never colour alone.
 */

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import { useChartTooltip } from './useChartTooltip';

export interface BarDatum {
  label: string;
  value: number;
  /** Marks this bar as a bad state — draws it in the status colour + labels it. */
  critical?: boolean;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  criticalNote?: string;
  formatValue?: (n: number) => string;
  className?: string;
}

export function BarChart({
  data,
  height = 260,
  xLabel,
  yLabel,
  criticalNote,
  formatValue = (n) => n.toLocaleString(),
  className,
}: BarChartProps) {
  const { tooltip, show, hide } = useChartTooltip();
  const clipId = useId();

  // Room for the axis band, so labels are never clipped by a fixed height.
  const pad = { top: 12, right: 8, bottom: 42, left: 52 };
  const width = 720;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = niceTicks(max, 4);
  const scaleY = (v: number) => plotH - (v / ticks.max) * plotH;

  const slot = plotW / data.length;
  // 2px surface gap between adjacent bars — a gap, not a border.
  const barW = Math.max(4, slot - 8);

  const hasCritical = data.some((d) => d.critical);

  return (
    <div className={cn('chart', className)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={yLabel ?? 'Bar chart'}>
        <defs>
          {/* 4px rounded data-end, square at the baseline. */}
          <clipPath id={clipId}>
            <rect x={0} y={0} width={width} height={height} />
          </clipPath>
        </defs>

        <g transform={`translate(${pad.left},${pad.top})`}>
          {/* Gridlines: solid hairlines, recessive. */}
          {ticks.values.map((t) => (
            <g key={t}>
              <line className="chart__grid" x1={0} y1={scaleY(t)} x2={plotW} y2={scaleY(t)} />
              <text className="chart__tick" x={-10} y={scaleY(t)} dy="0.32em" textAnchor="end">
                {formatValue(t)}
              </text>
            </g>
          ))}

          <line className="chart__axis" x1={0} y1={plotH} x2={plotW} y2={plotH} />

          {data.map((d, i) => {
            const x = i * slot + (slot - barW) / 2;
            const y = scaleY(d.value);
            const h = plotH - y;

            const fill = d.critical ? 'var(--status-critical)' : 'var(--viz-1)';

            return (
              <g key={d.label}>
                <path
                  className="chart__bar"
                  d={roundedTopBar(x, y, barW, h, 4)}
                  fill={fill}
                  clipPath={`url(#${clipId})`}
                />

                {/* Hit target spans the whole slot, not just the thin bar. */}
                <rect
                  className="chart__hit"
                  x={i * slot}
                  y={0}
                  width={slot}
                  height={plotH}
                  onMouseEnter={() =>
                    show({
                      x: pad.left + i * slot + slot / 2,
                      y: pad.top + y,
                      title: d.label,
                      value: formatValue(d.value),
                      sub: d.critical ? 'Critical range' : undefined,
                    })
                  }
                  onMouseLeave={hide}
                />

                <text
                  className="chart__tick"
                  x={i * slot + slot / 2}
                  y={plotH + 16}
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {xLabel && (
            <text className="chart__axis-label" x={plotW / 2} y={plotH + 36} textAnchor="middle">
              {xLabel}
            </text>
          )}

          {yLabel && (
            <text
              className="chart__axis-label"
              transform={`rotate(-90) translate(${-plotH / 2},${-38})`}
              textAnchor="middle"
            >
              {yLabel}
            </text>
          )}
        </g>
      </svg>

      {tooltip && (
        <div className="chart__tooltip" style={{ left: `${(tooltip.x / width) * 100}%`, top: tooltip.y }}>
          <strong>{tooltip.value}</strong>
          {tooltip.title}
          {tooltip.sub && (
            <div style={{ color: 'var(--status-critical)', fontWeight: 600 }}>{tooltip.sub}</div>
          )}
        </div>
      )}

      {/* Status is never colour-alone: the legend states what red means. */}
      {hasCritical && criticalNote && (
        <div className="chart__legend">
          <span className="chart__legend-item">
            <span className="chart__swatch" style={{ background: 'var(--status-critical)' }} />
            {criticalNote}
          </span>
        </div>
      )}
    </div>
  );
}

/** Bar path with a 4px rounded top and a square base on the axis. */
function roundedTopBar(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.min(r, w / 2, Math.max(0, h));
  if (h <= 0) return '';

  return [
    `M${x},${y + h}`,
    `V${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `H${x + w - radius}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `V${y + h}`,
    'Z',
  ].join(' ');
}

/** Round the axis to human numbers rather than the raw max. */
function niceTicks(max: number, count: number) {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;

  const top = Math.ceil(max / step) * step;
  const values: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) values.push(Math.round(v));

  return { values, max: top };
}
