import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AlarmBanner } from '@/features/alarms/AlarmBanner';

export function AppLayout() {
  const isMobile = useIsMobile();
  // The rail's expanded state is a preference, so it survives a reload.
  const [expanded, setExpanded] = useLocalStorage('nav-expanded', false);

  // On mobile the rail is an overlay that covers the content, so a stored
  // "expanded" preference from the desktop must not make it open on top of
  // the page the moment the app loads on a phone.
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = isMobile ? mobileOpen : expanded;

  const toggle = () => (isMobile ? setMobileOpen((o) => !o) : setExpanded((e) => !e));

  return (
    <div className="shell">
      <Sidebar
        expanded={open}
        onNavigate={isMobile ? () => setMobileOpen(false) : undefined}
      />

      {/* Tapping beside an overlay closes it. Without this the only way out
          of the mobile rail is the burger you can no longer see. */}
      {isMobile && mobileOpen && (
        <div
          className="rail-scrim"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="main">
        <Topbar onToggleSidebar={toggle} />
        {/* Critical alarms sit above the page content, never inside it —
            a page that scrolls must not scroll the alarm away. */}
        <AlarmBanner />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
