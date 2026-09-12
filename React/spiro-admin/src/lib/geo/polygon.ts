/**
 * Point-in-polygon, for geofencing.
 *
 * Ray casting: count how many polygon edges a ray from the point crosses.
 * Odd means inside. It handles concave rings, which a bounding-box or
 * centroid-distance test does not — and an operating zone traced around a
 * coastline is always concave.
 *
 * The bounding box first is not a micro-optimisation: this runs for every
 * vehicle on every telemetry frame, and the box rejects the overwhelming
 * majority in two comparisons.
 */

import type { Geofence, LatLng } from '@/types/domain';

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function ringBounds(ring: LatLng[]): Bounds {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const p of ring) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }

  return { minLat, maxLat, minLng, maxLng };
}

export function pointInRing(point: LatLng, ring: LatLng[], bounds?: Bounds): boolean {
  const box = bounds ?? ringBounds(ring);
  if (
    point.lat < box.minLat ||
    point.lat > box.maxLat ||
    point.lng < box.minLng ||
    point.lng > box.maxLng
  ) {
    return false;
  }

  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!;
    const b = ring[j]!;

    // Strict on one end, non-strict on the other: this is what stops a
    // point exactly level with a vertex being counted twice.
    const straddles = a.lat > point.lat !== b.lat > point.lat;
    if (!straddles) continue;

    const x = ((b.lng - a.lng) * (point.lat - a.lat)) / (b.lat - a.lat) + a.lng;
    if (point.lng < x) inside = !inside;
  }

  return inside;
}

/** A fence with its bounds precomputed — build this once, test many. */
export interface CompiledFence {
  fence: Geofence;
  bounds: Bounds;
}

export function compileFences(fences: Geofence[]): CompiledFence[] {
  return fences.filter((f) => f.active).map((fence) => ({ fence, bounds: ringBounds(fence.ring) }));
}

export type BreachKind = 'left_inclusion' | 'entered_exclusion';

/**
 * Decide whether a position is a breach for a given country's fences.
 *
 * Two different failures, deliberately distinguished:
 *   - it is OUTSIDE every inclusion zone for its country;
 *   - it is INSIDE an exclusion zone.
 *
 * A vehicle in a country with no inclusion zone defined is not "outside" —
 * it is unmonitored, and reporting that as a breach would flood the alarm
 * centre the moment someone deletes a fence.
 */
export function evaluateFences(
  position: LatLng,
  country: string,
  compiled: CompiledFence[]
): { kind: BreachKind; fence: Geofence } | null {
  const mine = compiled.filter((c) => c.fence.country === country);
  if (mine.length === 0) return null;

  for (const c of mine) {
    if (c.fence.kind === 'exclusion' && pointInRing(position, c.fence.ring, c.bounds)) {
      return { kind: 'entered_exclusion', fence: c.fence };
    }
  }

  const inclusions = mine.filter((c) => c.fence.kind === 'inclusion');
  if (inclusions.length === 0) return null;

  const insideAny = inclusions.some((c) => pointInRing(position, c.fence.ring, c.bounds));
  if (insideAny) return null;

  return { kind: 'left_inclusion', fence: inclusions[0]!.fence };
}

/** GeoJSON for MapLibre. Rings must repeat the first point to close. */
export function fenceToFeature(fence: Geofence) {
  return {
    type: 'Feature' as const,
    properties: { id: fence.id, name: fence.name, kind: fence.kind },
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[...fence.ring.map((p) => [p.lng, p.lat]), [fence.ring[0]!.lng, fence.ring[0]!.lat]]],
    },
  };
}
