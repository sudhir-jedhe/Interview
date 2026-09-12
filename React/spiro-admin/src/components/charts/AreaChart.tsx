/**
 * AreaChart — one measure over time, with a crosshair tooltip.
 *
 * Single series, so there is no legend box: the card title names it. The
 * hover layer is not optional — an SVG chart IS interactive, and a value the
 * user can only get by squinting at the axis is a value they will not read.
 */

import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface AreaPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: AreaPoint[];
  height?: number;
  xLabel?: string;
  unit?: string;
  color?: string;
  className?: string;
}

export function AreaChart({
  data,
  height = 240,
  xLabel,
  unit = '',
  color = 'var(--viz-1)',
  className,
}: AreaChartProps) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const pad = { top: 12, right: 12, bottom: 40, left: 44 };
  const width = 720;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  if (data.length === 0) return null;

  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = niceTicks(max, 3);

  const x = (i: number) => (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => plotH - (v / ticks.max) * plotH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.value)}`).join(' ');
  const area = `${line} L${x(data.length - 1)},${plotH} L${x(0)},${plotH} Z`;

  /** Nearest-point hover: the pointer never has to land on the line itself. */
  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = ((event.clientX - rect.left) / rect.width) * width - pad.left;
    const index = Math.round((relX / plotW) * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, index)));
  };

  const active = hoverIndex !== null ? data[hoverIndex] : null;

  // Label every 4th tick — a label on every point is chaos.
  const tickEvery = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div className={cn('chart', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={xLabel ?? 'Area chart'}
        onPointerMove={onMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <g transform={`translate(${pad.left},${pad.top})`}>
          {ticks.values.map((t) => (
            <g key={t}>
              <line className="chart__grid" x1={0} y1={y(t)} x2={plotW} y2={y(t)} />
              <text className="chart__tick" x={-8} y={y(t)} dy="0.32em" textAnchor="end">
                {t}
              </text>
            </g>
          ))}

          <path d={area} fill={`url(#${gradientId})`} />
          {/* 2px line — thin marks, per the mark spec. */}
          <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />

          {active && hoverIndex !== null && (
            <>
              <line
                className="chart__crosshair"
                x1={x(hoverIndex)}
                y1={0}
                x2={x(hoverIndex)}
                y2={plotH}
              />
              {/* >=8px marker with a 2px surface ring so it reads on the fill. */}
              <circle
                cx={x(hoverIndex)}
                cy={y(active.value)}
                r={5}
                fill={color}
                stroke="var(--viz-surface)"
                strokeWidth={2}
              />
            </>
          )}

          <line className="chart__axis" x1={0} y1={plotH} x2={plotW} y2={plotH} />

          {data.map((d, i) =>
            i % tickEvery === 0 ? (
              <text
                key={d.label}
                className="chart__tick"
                x={x(i)}
                y={plotH + 16}
                textAnchor="middle"
              >
                {d.label}
              </text>
            ) : null
          )}

          {xLabel && (
            <text className="chart__axis-label" x={plotW / 2} y={plotH + 34} textAnchor="middle">
              {xLabel}
            </text>
          )}
        </g>
      </svg>

      {active && hoverIndex !== null && (
        <div
          className="chart__tooltip"
          style={{ left: `${((pad.left + x(hoverIndex)) / width) * 100}%`, top: pad.top + y(active.value) }}
        >
          <strong>
            {active.value}
            {unit}
          </strong>
          {active.label}
        </div>
      )}
    </div>
  );
}

function niceTicks(max: number, count: number) {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(Math.max(raw, 1)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;

  const top = Math.ceil(max / step) * step;
  const values: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) values.push(Math.round(v));

  return { values, max: top };
}
