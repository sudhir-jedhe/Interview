/**
 * Gauge — one reading against a range that has meaning.
 *
 * A gauge is only worth drawing when the question is "is this value OK?" —
 * otherwise it is a decorated number and a stat tile does the job better.
 * So this one draws the THRESHOLD BANDS behind the needle: the arc tells you
 * where safe ends and critical begins, which is information a bare figure
 * cannot carry.
 *
 * The reading itself is text in the centre, in ink — never in the band
 * colour, so it stays legible and never implies the number IS the status.
 */

import { cn } from '@/lib/utils/cn';

export interface GaugeBand {
  from: number;
  to: number;
  color: string;
  label: string;
}

interface GaugeProps {
  value: number | null;
  min?: number;
  max?: number;
  unit?: string;
  bands?: GaugeBand[];
  caption?: string;
  size?: number;
  className?: string;
}

const DEFAULT_BANDS: GaugeBand[] = [
  { from: 0, to: 45, color: 'var(--status-good)', label: 'Normal' },
  { from: 45, to: 60, color: 'var(--status-warning)', label: 'Elevated' },
  { from: 60, to: 100, color: 'var(--status-critical)', label: 'Critical' },
];

export function Gauge({
  value,
  min = 0,
  max = 100,
  unit = '',
  bands = DEFAULT_BANDS,
  caption,
  size = 168,
  className,
}: GaugeProps) {
  const stroke = 12;
  const radius = size / 2 - stroke;
  const centre = size / 2;

  // A 270-degree arc: open at the bottom, so the gap reads as the scale's end
  // rather than as missing data.
  const START = 135;
  const SWEEP = 270;

  const clamped = value === null ? min : Math.min(max, Math.max(min, value));
  const fraction = (clamped - min) / (max - min || 1);

  const activeBand = bands.find((b) => clamped >= b.from && clamped < b.to) ?? bands[bands.length - 1];

  return (
    <div className={cn('chart', className)} style={{ textAlign: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={
          value === null
            ? `${caption ?? 'Reading'}: no data`
            : `${caption ?? 'Reading'}: ${value}${unit}, ${activeBand?.label ?? ''}`
        }
      >
        {/* Track */}
        <path
          d={arcPath(centre, centre, radius, START, START + SWEEP)}
          fill="none"
          stroke="var(--viz-grid)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Threshold bands — thin, behind the reading, with a surface gap. */}
        {bands.map((band) => {
          const a0 = START + ((band.from - min) / (max - min)) * SWEEP;
          const a1 = START + ((band.to - min) / (max - min)) * SWEEP;

          return (
            <path
              key={band.label}
              d={arcPath(centre, centre, radius + stroke / 2 + 5, a0 + 1.5, a1 - 1.5)}
              fill="none"
              stroke={band.color}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.55}
            />
          );
        })}

        {/* The reading */}
        {value !== null && (
          <path
            d={arcPath(centre, centre, radius, START, START + fraction * SWEEP)}
            fill="none"
            stroke={activeBand?.color ?? 'var(--viz-1)'}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        )}

        <text
          x={centre}
          y={centre - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: 'var(--text-primary)',
            fontSize: 22,
            fontWeight: 700,
            fontVariantNumeric: 'proportional-nums',
          }}
        >
          {value === null ? '–' : `${value}${unit}`}
        </text>

        {value !== null && activeBand && (
          <text
            x={centre}
            y={centre + 20}
            textAnchor="middle"
            style={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
          >
            {/* Written status: the band colour never carries meaning alone. */}
            {activeBand.label.toUpperCase()}
          </text>
        )}
      </svg>

      {caption && (
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: 'var(--sp-1)' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

/** SVG arc between two angles, measured clockwise from 3 o'clock. */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

  return `M${start.x},${start.y} A${r},${r} 0 ${largeArc} 1 ${end.x},${end.y}`;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
