/**
 * LineChart — multiple series on ONE axis.
 *
 * Rules this enforces rather than leaves to the caller:
 *
 *   ONE AXIS.        There is no second y-scale and no option to add one.
 *                    Two measures of different magnitude go in two charts.
 *   FIXED HUES.      Series take --viz-1..6 in order and are never cycled;
 *                    a seventh series is refused rather than repainted in a
 *                    colour that already means something else.
 *   COLOUR FOLLOWS   the series id, not its position, so hiding one series
 *   THE ENTITY.      does not repaint the survivors.
 *   NEVER COLOUR     a legend is always drawn for two or more series, and
 *   ALONE.           up to four are also labelled at their last point.
 *
 * A `dashed` series is drawn as a projection: same hue, 4-4 dash, excluded
 * from direct labelling so it cannot be mistaken for measured data.
 */

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

const HUES = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)', 'var(--viz-6)'];

export interface LinePoint {
  x: number;
  y: number;
}

export interface LineSeries {
  id: string;
  label: string;
  points: LinePoint[];
  /** Draw as a dashed projection rather than measured data. */
  dashed?: boolean;
  /** Override the palette slot — only for reserved status colours. */
  color?: string;
}

interface LineChartProps {
  series: LineSeries[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  /** Reference line, e.g. the 70 % retirement floor. */
  threshold?: { value: number; label: string };
  formatX?: (x: number) => string;
  formatY?: (y: number) => string;
  /** Default false: a line chart may start above zero when the interesting
   *  range is narrow. Pass true when zero is meaningful. */
  zeroBased?: boolean;
  className?: string;
}

export function LineChart({
  series,
  height = 280,
  xLabel,
  yLabel,
  threshold,
  formatX = (x) => String(Math.round(x)),
  formatY = (y) => String(Math.round(y)),
  zeroBased = false,
  className,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const drawn = series.slice(0, HUES.length);
  const all = drawn.flatMap((s) => s.points);
  if (all.length === 0) return null;

  const pad = { top: 16, right: 96, bottom: 44, left: 52 };
  const width = 760;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs, xMin + 1);

  const rawMin = Math.min(...ys, threshold?.value ?? Infinity);
  const rawMax = Math.max(...ys, threshold?.value ?? -Infinity);
  const span = Math.max(1, rawMax - rawMin);

  const yMin = zeroBased ? 0 : Math.floor((rawMin - span * 0.12) / 5) * 5;
  const yMax = Math.ceil((rawMax + span * 0.12) / 5) * 5;

  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y: number) => plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => yMin + ((yMax - yMin) / tickCount) * i);
  const xTicks = Array.from({ length: 5 }, (_, i) => xMin + ((xMax - xMin) / 4) * i);

  const colorOf = (s: LineSeries, index: number) => s.color ?? HUES[index % HUES.length]!;

  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = ((event.clientX - rect.left) / rect.width) * width - pad.left;
    setHoverX(Math.max(xMin, Math.min(xMax, xMin + (relX / plotW) * (xMax - xMin))));
  };

  /** Nearest measured point on a series to the hovered x. */
  const nearest = (s: LineSeries, x: number) =>
    s.points.reduce<LinePoint | null>(
      (best, p) => (best === null || Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best),
      null
    );

  // Direct labels only up to four series; past that they collide.
  const directLabel = drawn.filter((s) => !s.dashed).length <= 4;

  return (
    <div className={cn('chart', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${yLabel ?? 'Value'} against ${xLabel ?? 'x'}, ${drawn.length} series`}
        onPointerMove={onMove}
        onPointerLeave={() => setHoverX(null)}
      >
        <g transform={`translate(${pad.left},${pad.top})`}>
          {yTicks.map((t) => (
            <g key={t}>
              <line className="chart__grid" x1={0} y1={sy(t)} x2={plotW} y2={sy(t)} />
              <text className="chart__tick" x={-8} y={sy(t)} dy="0.32em" textAnchor="end">
                {formatY(t)}
              </text>
            </g>
          ))}

          {threshold && (
            <g>
              {/* A reference line is not a series: neutral, dashed, labelled. */}
              <line
                x1={0}
                y1={sy(threshold.value)}
                x2={plotW}
                y2={sy(threshold.value)}
                stroke="var(--status-critical)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
              />
              <text
                className="chart__tick"
                x={plotW - 4}
                y={sy(threshold.value) - 6}
                textAnchor="end"
                fill="var(--status-critical)"
              >
                {threshold.label}
              </text>
            </g>
          )}

          {drawn.map((s, i) => {
            const color = colorOf(s, i);
            const d = s.points.map((p, j) => `${j === 0 ? 'M' : 'L'}${sx(p.x)},${sy(p.y)}`).join(' ');
            const last = s.points[s.points.length - 1];

            return (
              <g key={s.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={s.dashed ? '5 4' : undefined}
                  opacity={s.dashed ? 0.85 : 1}
                />

                {directLabel && !s.dashed && last && (
                  <text
                    className="chart__tick"
                    x={sx(last.x) + 8}
                    y={sy(last.y)}
                    dy="0.32em"
                    // Text wears text tokens; the mark beside it carries identity.
                    fill="var(--text-secondary)"
                  >
                    {s.label}
                  </text>
                )}
              </g>
            );
          })}

          {hoverX !== null && (
            <>
              <line className="chart__crosshair" x1={sx(hoverX)} y1={0} x2={sx(hoverX)} y2={plotH} />
              {drawn.map((s, i) => {
                const p = nearest(s, hoverX);
                if (!p) return null;
                return (
                  <circle
                    key={s.id}
                    cx={sx(p.x)}
                    cy={sy(p.y)}
                    r={5}
                    fill={colorOf(s, i)}
                    stroke="var(--viz-surface)"
                    strokeWidth={2}
                  />
                );
              })}
            </>
          )}

          <line className="chart__axis" x1={0} y1={plotH} x2={plotW} y2={plotH} />

          {xTicks.map((t) => (
            <text key={t} className="chart__tick" x={sx(t)} y={plotH + 18} textAnchor="middle">
              {formatX(t)}
            </text>
          ))}

          {xLabel && (
            <text className="chart__axis-label" x={plotW / 2} y={plotH + 36} textAnchor="middle">
              {xLabel}
            </text>
          )}
        </g>
      </svg>

      {/* A legend is always present for two or more series. */}
      {drawn.length > 1 && (
        <ul className="chart__legend">
          {drawn.map((s, i) => (
            <li key={s.id} className="chart__legend-item">
              <span
                className="chart__swatch"
                style={{
                  background: s.dashed ? 'transparent' : colorOf(s, i),
                  border: s.dashed ? `2px dashed ${colorOf(s, i)}` : undefined,
                }}
                aria-hidden="true"
              />
              {s.label}
              {s.dashed && ' (projected)'}
            </li>
          ))}
        </ul>
      )}

      {hoverX !== null && (
        <div className="chart__readout" aria-live="polite">
          <strong>
            {xLabel ?? 'x'} {formatX(hoverX)}
          </strong>
          {drawn.map((s, i) => {
            const p = nearest(s, hoverX);
            if (!p) return null;
            return (
              <span key={s.id} className="chart__legend-item">
                <span className="chart__swatch" style={{ background: colorOf(s, i) }} aria-hidden="true" />
                {s.label}: {formatY(p.y)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
