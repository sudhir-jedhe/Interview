/**
 * SOH against charge cycles, with a projected retirement date.
 *
 * The projection is the point of the screen, and it is the part most easily
 * got wrong. Two decisions:
 *
 *   1. THE FIT USES THE LAST THIRD OF THE CURVE, not all of it. Lithium
 *      packs lose capacity fast, then slow, then fast again at the knee.
 *      Fitting the whole history flatters the pack and pushes retirement
 *      months into the future — which is exactly the error that leaves you
 *      with a hundred dead packs and no replacements ordered.
 *   2. THE PROJECTION IS DRAWN DASHED and labelled "projected" in the
 *      legend, because a solid line implies measurement.
 *
 * The 70 % retirement floor is drawn as a reference line in the reserved
 * critical colour — it is a threshold, not a series.
 */

import { useMemo } from 'react';

import { getBatteryDegradation } from '@/lib/api/client';
import { useAsync } from '@/hooks/useAsync';
import { formatDecimal, formatNumber } from '@/lib/utils/format';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { LineChart, type LineSeries } from '@/components/charts/LineChart';

const RETIREMENT_FLOOR = 70;

export function DegradationCurve({ batteryId }: { batteryId: string }) {
  const query = useAsync(({ signal }) => getBatteryDegradation(batteryId, signal), [batteryId]);
  const series = query.data;

  const lines = useMemo<LineSeries[]>(() => {
    if (!series) return [];

    const measured: LineSeries = {
      id: 'measured',
      label: 'Measured SOH',
      points: series.points.map((p) => ({ x: p.cycle, y: p.soh })),
    };

    if (series.retirementCycle === null) return [measured];

    const last = series.points[series.points.length - 1]!;

    return [
      measured,
      {
        id: 'projected',
        label: 'Trend to retirement',
        dashed: true,
        // Same hue as the measured line: it is the SAME pack, and giving a
        // projection its own colour reads as a second battery.
        color: 'var(--viz-1)',
        points: [
          { x: last.cycle, y: last.soh },
          { x: series.retirementCycle, y: RETIREMENT_FLOOR },
        ],
      },
    ];
  }, [series]);

  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  if (!series) return <Skeleton height={340} />;

  const last = series.points[series.points.length - 1]!;
  const cyclesLeft = series.retirementCycle === null ? null : series.retirementCycle - last.cycle;
  const daysLeft =
    series.retirementDate === null ? null : Math.round((series.retirementDate - Date.now()) / 86_400_000);

  const imminent = daysLeft !== null && daysLeft < 90;

  return (
    <div className="grid" style={{ gap: 'var(--sp-4)' }}>
      <Card title="State of health against charge cycles">
        <LineChart
          series={lines}
          height={300}
          xLabel="Charge cycles"
          yLabel="State of health (%)"
          threshold={{ value: RETIREMENT_FLOOR, label: `${RETIREMENT_FLOOR} % retirement floor` }}
          formatX={(x) => formatNumber(Math.round(x))}
          formatY={(y) => `${Math.round(y)}%`}
        />

        <p style={{ marginBottom: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
          The trend is fitted to the most recent third of the curve only. Fitting the whole history
          would flatter this pack: cells lose capacity quickly, then slowly, then quickly again, and
          an average across all three phases predicts a retirement date that never arrives.
        </p>
      </Card>

      <div className="auto-grid">
        <Stat label="Current SOH" value={`${formatDecimal(last.soh, 1)} %`} />
        <Stat label="Cycles completed" value={formatNumber(last.cycle)} />
        <Stat label="Cycles per day" value={formatDecimal(series.cyclesPerDay, 2)} />
        <Stat
          label="Loss per 100 cycles"
          value={`${formatDecimal(Math.abs(series.slopePerCycle) * 100, 2)} %`}
        />
        <Stat
          label="Cycles to retirement"
          value={cyclesLeft === null ? 'Not degrading' : formatNumber(Math.max(0, cyclesLeft))}
        />
        <Stat
          label="Projected retirement"
          value={
            series.retirementDate === null
              ? '—'
              : new Date(series.retirementDate).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                })
          }
          tone={imminent ? 'var(--status-critical)' : undefined}
        />
      </div>

      {imminent && (
        <p
          className="row"
          style={{ gap: 'var(--sp-2)', margin: 0, color: 'var(--status-critical)', fontSize: 'var(--fs-sm)' }}
        >
          <Icon name="alert" size={15} />
          This pack crosses the retirement floor in under 90 days at its current rate — order a
          replacement now rather than at the point of failure.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="card" style={{ padding: 'var(--sp-4)' }}>
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginTop: 4, color: tone }}>{value}</div>
    </div>
  );
}
