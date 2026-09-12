/**
 * Icon set — hand-drawn SVG paths, no icon library.
 *
 * All icons share a 24x24 viewBox and `currentColor`, so they inherit text
 * colour and size from their container. That is the whole trick to icons
 * that never look out of place.
 */

import type { SVGProps } from 'react';

export type IconName =
  | 'dashboard' | 'grid' | 'analytics' | 'battery' | 'scooter' | 'bike'
  | 'charge' | 'card' | 'contact' | 'logout' | 'menu' | 'search' | 'bell'
  | 'user' | 'chevron-down' | 'chevron-right' | 'chevron-left' | 'close'
  | 'download' | 'refresh' | 'power' | 'speed' | 'route' | 'pin' | 'sun'
  | 'moon' | 'sort' | 'sort-asc' | 'sort-desc' | 'filter' | 'check'
  | 'alert' | 'external' | 'thermometer' | 'voltage'
  /* added with the telematics build */
  | 'play' | 'pause' | 'plus' | 'edit' | 'trash' | 'lock' | 'unlock'
  | 'shield' | 'printer' | 'clock' | 'wrench' | 'radio' | 'layers' | 'file';

const PATHS: Record<IconName, string> = {
  dashboard: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  analytics: 'M3 17l5-6 4 4 5-7 4 5M3 21h18',
  battery: 'M4 8h13v8H4zM17 11h2v2h-2M6 10v4M9 10v4',
  scooter: 'M6 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.5 15.5h7M15 6h3l1.5 7M7 9h5l3 6',
  bike: 'M5 18a3 3 0 100-6 3 3 0 000 6zM19 18a3 3 0 100-6 3 3 0 000 6zM8 15l3-6h5M11 9L9 6H6M14 9l2 6',
  charge: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
  card: 'M2 6h20v12H2zM2 10h20M5 14h4',
  contact: 'M4 4h16v16H4zM9 9a2 2 0 104 0 2 2 0 10-4 0M7 17c0-2 2-3 5-3s5 1 5 3',
  logout: 'M9 4H5v16h4M14 8l4 4-4 4M18 12H9',
  menu: 'M3 6h18M3 12h18M3 18h18',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  bell: 'M18 16V11a6 6 0 10-12 0v5l-2 3h16zM10 22h4',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-left': 'M15 18l-6-6 6-6',
  close: 'M18 6L6 18M6 6l12 12',
  download: 'M12 3v12M7 11l5 5 5-5M4 21h16',
  refresh: 'M21 12a9 9 0 11-3-6.7M21 3v6h-6',
  power: 'M12 3v9M18.4 6.6a9 9 0 11-12.8 0',
  speed: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 12l4-4',
  route: 'M6 20a2 2 0 100-4 2 2 0 000 4zM18 8a2 2 0 100-4 2 2 0 000 4zM8 18h6a4 4 0 000-8H10a4 4 0 010-8h6',
  pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  sun: 'M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  sort: 'M8 6l4-3 4 3M8 18l4 3 4-3',
  'sort-asc': 'M12 20V4M6 10l6-6 6 6',
  'sort-desc': 'M12 4v16M6 14l6 6 6-6',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  check: 'M20 6L9 17l-5-5',
  alert: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z',
  external: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
  play: 'M7 4l12 8-12 8V4z',
  pause: 'M8 4h4v16H8zM14 4h4v16h-4z',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  lock: 'M6 11h12v10H6zM9 11V7a3 3 0 016 0v4',
  unlock: 'M6 11h12v10H6zM9 11V7a3 3 0 015.9-.8',
  shield: 'M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6l8-3z',
  printer: 'M7 9V3h10v6M7 19H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 15h10v6H7z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  wrench: 'M15.5 3a5.5 5.5 0 00-5 7.7L3 18.2 5.8 21l7.5-7.5A5.5 5.5 0 1015.5 3z',
  radio: 'M12 14a2 2 0 100-4 2 2 0 000 4M8.5 15.5a5 5 0 010-7M15.5 8.5a5 5 0 010 7M5.6 18.4a9 9 0 010-12.8M18.4 5.6a9 9 0 010 12.8',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  file: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6',
  thermometer: 'M14 14.8V4a2 2 0 10-4 0v10.8a4 4 0 104 0z',
  voltage: 'M12 2v6M12 16v6M5 12h14M8.5 8.5L12 12l3.5-3.5',
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /** Solid icons (dashboard tiles) read better filled than stroked. */
  filled?: boolean;
}

export function Icon({ name, size = 20, filled = false, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
