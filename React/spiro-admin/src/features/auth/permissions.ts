/**
 * Authorization model.
 *
 * Roles are for humans; PERMISSIONS are what code checks. The indirection
 * matters: when someone asks for "operators can export batteries too", you
 * edit one line in this table rather than hunting for `role === 'admin'`
 * scattered across forty components.
 */

import type { Permission, Role } from '@/types/domain';

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: [
    'dashboard:view',
    'vehicle:view',
    'vehicle:control',
    'vehicle:manage',
    'fleet:command',
    'battery:view',
    'data:export',
    'geofence:manage',
    'alarm:manage',
    'station:view',
    'rider:view',
    'rider:manage',
    'maintenance:view',
    'report:view',
    'audit:view',
    'user:view',
    'user:manage',
    'settings:manage',
  ],
  admin: [
    'dashboard:view',
    'vehicle:view',
    'vehicle:control',
    'vehicle:manage',
    'battery:view',
    'data:export',
    'geofence:manage',
    'alarm:manage',
    'station:view',
    'rider:view',
    'rider:manage',
    'maintenance:view',
    'report:view',
    'audit:view',
    'user:view',
  ],
  // An operator runs the fleet day to day: they can command ONE vehicle but
  // not the whole fleet, and they cannot move a threshold that decides when
  // an alarm fires.
  operator: [
    'dashboard:view',
    'vehicle:view',
    'vehicle:control',
    'battery:view',
    'station:view',
    'rider:view',
    'maintenance:view',
    'report:view',
  ],
  viewer: ['dashboard:view', 'vehicle:view', 'battery:view', 'station:view'],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  operator: 'Operator',
  viewer: 'Viewer',
};

export function roleHas(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
