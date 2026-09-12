import { SPEED_BANDS } from '@/lib/utils/format';

/**
 * The map's speed legend.
 *
 * Reads its bands from the same SPEED_BANDS constant the polyline colouring
 * uses, so the legend and the map can never drift apart — the usual bug is
 * two hard-coded lists that disagree after one is edited.
 */
export function SpeedLegend() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--sp-4)',
        left: 'var(--sp-4)',
        zIndex: 2,
        padding: 'var(--sp-3)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        boxShadow: 'var(--shadow-md)',
        fontSize: 'var(--fs-xs)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 'var(--sp-2)', fontSize: 'var(--fs-sm)' }}>
        Speed range (km/h)
      </strong>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 4 }}>
        {SPEED_BANDS.map((band) => (
          <li key={band.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span
              style={{
                width: 16,
                height: 10,
                borderRadius: 2,
                background: `var(${band.varName})`,
                flex: 'none',
              }}
            />
            {band.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
