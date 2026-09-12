/**
 * Route table.
 *
 * Structure worth noting:
 *
 *   - Every feature page is `React.lazy`, so the initial bundle is the shell
 *     plus the dashboard. MapLibre alone is ~200 kB; loading it on the users
 *     screen would be pure waste.
 *   - Authentication guards the LAYOUT, not each page — one check, and every
 *     nested route inherits it.
 *   - Authorization guards individual branches with `RequirePermission`,
 *     which renders a 403 in place rather than redirecting.
 *   - Detail routes nest under their list route (`.../info/:id`), so the
 *     breadcrumb trail falls out of the URL for free.
 */

import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, RequirePermission } from '@/features/auth/ProtectedRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { EmptyState } from '@/components/ui/States';

const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const VehicleTrackingPage = lazy(() =>
  import('@/features/vehicles/VehicleTrackingPage').then((m) => ({ default: m.VehicleTrackingPage }))
);
const VehicleInfoPage = lazy(() =>
  import('@/features/vehicles/VehicleInfoPage').then((m) => ({ default: m.VehicleInfoPage }))
);
const VehiclesPage = lazy(() =>
  import('@/features/vehicles/VehiclesPage').then((m) => ({ default: m.VehiclesPage }))
);
const BatteryTrackingPage = lazy(() =>
  import('@/features/batteries/BatteryTrackingPage').then((m) => ({ default: m.BatteryTrackingPage }))
);
const BatteryInfoPage = lazy(() =>
  import('@/features/batteries/BatteryInfoPage').then((m) => ({ default: m.BatteryInfoPage }))
);
const UsersPage = lazy(() =>
  import('@/features/users/UsersPage').then((m) => ({ default: m.UsersPage }))
);
const LiveFeedPage = lazy(() =>
  import('@/features/telematics/LiveFeedPage').then((m) => ({ default: m.LiveFeedPage }))
);
const GeofencesPage = lazy(() =>
  import('@/features/geofences/GeofencesPage').then((m) => ({ default: m.GeofencesPage }))
);
const StationsPage = lazy(() =>
  import('@/features/stations/StationsPage').then((m) => ({ default: m.StationsPage }))
);
const AlarmsPage = lazy(() =>
  import('@/features/alarms/AlarmsPage').then((m) => ({ default: m.AlarmsPage }))
);
const MaintenancePage = lazy(() =>
  import('@/features/maintenance/MaintenancePage').then((m) => ({ default: m.MaintenancePage }))
);
const RidersPage = lazy(() =>
  import('@/features/riders/RidersPage').then((m) => ({ default: m.RidersPage }))
);
const RiderInfoPage = lazy(() =>
  import('@/features/riders/RiderInfoPage').then((m) => ({ default: m.RiderInfoPage }))
);
const ReportsPage = lazy(() =>
  import('@/features/reports/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const AuditPage = lazy(() =>
  import('@/features/audit/AuditPage').then((m) => ({ default: m.AuditPage }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

function RouteFallback() {
  return (
    <div className="page" role="status" aria-live="polite">
      <div className="skeleton" style={{ height: 32, width: 260 }} />
      <div className="skeleton" style={{ height: 420 }} />
    </div>
  );
}

function NotFound() {
  return (
    <div className="page">
      <EmptyState
        icon="search"
        title="Page not found"
        description="The link may be out of date, or the record may have been removed."
      />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Everything below requires a session. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="dashboard:view">
                  <DashboardPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route path="tracking">
            <Route index element={<Navigate to="/tracking/vehicle-tracking" replace />} />

            <Route
              path="vehicle-tracking"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <RequirePermission permission="vehicle:view">
                    <VehicleTrackingPage />
                  </RequirePermission>
                </Suspense>
              }
            />
            <Route
              path="vehicle-tracking/info/:id"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <RequirePermission permission="vehicle:view">
                    <VehicleInfoPage />
                  </RequirePermission>
                </Suspense>
              }
            />

            <Route
              path="battery-tracking"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <RequirePermission permission="battery:view">
                    <BatteryTrackingPage />
                  </RequirePermission>
                </Suspense>
              }
            />
            <Route
              path="battery-tracking/info/:id"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <RequirePermission permission="battery:view">
                    <BatteryInfoPage />
                  </RequirePermission>
                </Suspense>
              }
            />
          </Route>

          <Route
            path="vehicles"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="vehicle:view">
                  <VehiclesPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route
            path="live"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="vehicle:view">
                  <LiveFeedPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route
            path="alarms"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="battery:view">
                  <AlarmsPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route
            path="geofences"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="vehicle:view">
                  <GeofencesPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route
            path="stations"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="station:view">
                  <StationsPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route
            path="maintenance"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="maintenance:view">
                  <MaintenancePage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route path="riders">
            <Route
              index
              element={
                <Suspense fallback={<RouteFallback />}>
                  <RequirePermission permission="rider:view">
                    <RidersPage />
                  </RequirePermission>
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <RequirePermission permission="rider:view">
                    <RiderInfoPage />
                  </RequirePermission>
                </Suspense>
              }
            />
          </Route>

          <Route
            path="reports"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="report:view">
                  <ReportsPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route
            path="audit"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="audit:view">
                  <AuditPage />
                </RequirePermission>
              </Suspense>
            }
          />

          {/* Settings is reachable by anyone signed in: it is where you set
              your own language, theme and storage, not anyone else's. */}
          <Route
            path="settings"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />

          <Route
            path="users"
            element={
              <Suspense fallback={<RouteFallback />}>
                <RequirePermission permission="user:view">
                  <UsersPage />
                </RequirePermission>
              </Suspense>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
