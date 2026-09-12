import { useState } from 'react';

export interface TooltipState {
  x: number;
  y: number;
  title: string;
  value: string;
  sub?: string;
}

/** Shared tooltip state for the chart components. */
export function useChartTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  return { tooltip, show: setTooltip, hide: () => setTooltip(null) };
}
