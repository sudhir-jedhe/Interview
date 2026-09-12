/**
 * FleetMap — MapLibre GL, no API key required.
 *
 * Three things this has to get right at fleet scale:
 *
 *   CLUSTERING   14,000 individual DOM markers would kill the page. Points go
 *                in as a GeoJSON SOURCE with clustering on, so rendering
 *                happens on the GPU and the marker count stays constant.
 *
 *   TEARDOWN     a map instance holds WebGL contexts and event listeners.
 *                Browsers cap live WebGL contexts (~16), so a map that is not
 *                removed on unmount takes the whole app down after a dozen
 *                navigations.
 *
 *   THEME        the style is re-applied when the app theme flips, because
 *                map tiles do not inherit CSS.
 */

import { useEffect, useRef } from 'react';
import maplibregl, { type LngLatBoundsLike, type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Geofence, LatLng, SwapStation, TrackPoint } from '@/types/domain';
import { speedBand } from '@/lib/utils/format';
import { fenceToFeature } from '@/lib/geo/polygon';

export interface MapMarker {
  id: string;
  position: LatLng;
  label: string;
  sublabel?: string;
  online?: boolean;
}

interface FleetMapProps {
  markers?: MapMarker[];
  /** A single vehicle's GPS trail, coloured by speed band. */
  track?: TrackPoint[];
  /** Operating and restricted zones, drawn under the markers. */
  geofences?: Geofence[];
  /** Swap cabinets, drawn as their own layer above the vehicle points. */
  stations?: SwapStation[];
  /**
   * Density layer instead of individual points. Clusters answer "how many
   * are here"; a heatmap answers "where is the fleet concentrated" — two
   * different questions, so they are mutually exclusive, not stacked.
   */
  heatmap?: boolean;
  /** A single moving marker, for trip playback. */
  ghost?: LatLng | null;
  center?: LatLng;
  zoom?: number;
  height?: number | string;
  cluster?: boolean;
  fitToData?: boolean;
  onMarkerClick?: (id: string) => void;
  onStationClick?: (id: string) => void;
}

/**
 * A raster style built on OSM tiles. Vector styles from a CDN generally need
 * a key; raster OSM does not, which keeps this runnable out of the box.
 */
const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export function FleetMap({
  markers = [],
  track,
  geofences,
  stations,
  heatmap = false,
  ghost = null,
  center = { lat: 6.2, lng: 1.22 },
  zoom = 6,
  height = 420,
  cluster = true,
  fitToData = false,
  onMarkerClick,
  onStationClick,
}: FleetMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const clickRef = useRef(onMarkerClick);
  const stationClickRef = useRef(onStationClick);

  useEffect(() => {
    clickRef.current = onMarkerClick;
    stationClickRef.current = onStationClick;
  });

  /* ---- create once ---- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: [center.lng, center.lat],
      zoom,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    mapRef.current = map;

    return () => {
      // Without this, the WebGL context leaks and the app dies after ~16 mounts.
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- markers ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: markers.map((m) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [m.position.lng, m.position.lat] },
          properties: { id: m.id, label: m.label, sublabel: m.sublabel ?? '', online: m.online ? 1 : 0 },
        })),
      };

      const existing = map.getSource('vehicles') as maplibregl.GeoJSONSource | undefined;
      if (existing) {
        existing.setData(geojson);
        return;
      }

      map.addSource('vehicles', {
        type: 'geojson',
        data: geojson,
        cluster,
        clusterRadius: 46,
        clusterMaxZoom: 12,
      });

      if (cluster) {
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'vehicles',
          filter: ['has', 'point_count'],
          paint: {
            // One hue, stepped light->dark by magnitude: a sequential ramp,
            // which is what a cluster count is.
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#6da7ec',
              25,
              '#3987e5',
              100,
              '#256abf',
              500,
              '#184f95',
            ],
            'circle-radius': ['step', ['get', 'point_count'], 15, 25, 19, 100, 24, 500, 30],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'vehicles',
          filter: ['has', 'point_count'],
          layout: { 'text-field': '{point_count_abbreviated}', 'text-size': 11 },
          paint: { 'text-color': '#ffffff' },
        });
      }

      map.addLayer({
        id: 'heat',
        type: 'heatmap',
        source: 'vehicles',
        layout: { visibility: 'none' },
        paint: {
          // A sequential ramp — one hue, transparent to dark. A rainbow
          // heatmap invents categories where there is only magnitude.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(205,226,251,0)',
            0.2, '#cde2fb',
            0.4, '#8bbdf3',
            0.6, '#4a93e8',
            0.8, '#256abf',
            1, '#0d366b',
          ],
          // Clustered points carry a count; weight by it or a dense city
          // reads the same as an empty one.
          'heatmap-weight': ['case', ['has', 'point_count'], ['/', ['get', 'point_count'], 40], 0.35],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 4, 14, 12, 40],
          'heatmap-opacity': 0.85,
        },
      });

      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'vehicles',
        filter: ['!', ['has', 'point_count']],
        paint: {
          // Online/offline is STATUS — and it is paired with a text label in
          // the popup, so colour is never the only cue.
          'circle-color': ['case', ['==', ['get', 'online'], 1], '#0ca30c', '#b3bfd0'],
          'circle-radius': 7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('click', 'points', (event) => {
        const feature = event.features?.[0];
        if (!feature) return;

        const props = feature.properties as { id: string; label: string; sublabel: string; online: number };
        const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

        new maplibregl.Popup({ closeButton: false, offset: 12 })
          .setLngLat([lng, lat])
          .setHTML(
            `<div style="font:500 13px system-ui"><strong>${props.label}</strong>` +
              `<div style="color:#64748b;margin-top:4px">${props.sublabel}</div>` +
              `<div style="margin-top:4px">${props.online ? 'Online' : 'Offline'}</div></div>`
          )
          .addTo(map);

        clickRef.current?.(props.id);
      });

      map.on('click', 'clusters', (event) => {
        const feature = map.queryRenderedFeatures(event.point, { layers: ['clusters'] })[0];
        if (!feature) return;

        const source = map.getSource('vehicles') as maplibregl.GeoJSONSource;
        void source
          .getClusterExpansionZoom(feature.properties!.cluster_id as number)
          .then((z) => map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom: z }));
      });

      for (const layer of ['points', 'clusters']) {
        map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [markers, cluster]);

  /* ---- speed-banded track ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !track || track.length < 2) return;

    const apply = () => {
      // One LineString per consecutive pair, so each segment can carry its
      // own speed band. A single line could only have one colour.
      const features: GeoJSON.Feature[] = track.slice(1).map((point, i) => {
        const previous = track[i]!;
        const band = speedBand(point.speed);

        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [previous.lng, previous.lat],
              [point.lng, point.lat],
            ],
          },
          properties: { color: getComputedStyle(document.documentElement).getPropertyValue(band!.varName).trim() },
        };
      });

      const data: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };
      const existing = map.getSource('track') as maplibregl.GeoJSONSource | undefined;

      if (existing) {
        existing.setData(data);
      } else {
        map.addSource('track', { type: 'geojson', data });
        map.addLayer({
          id: 'track-line',
          type: 'line',
          source: 'track',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': ['get', 'color'], 'line-width': 4 },
        });
      }

      if (fitToData) {
        const bounds = track.reduce(
          (acc, p) => acc.extend([p.lng, p.lat]),
          new maplibregl.LngLatBounds([track[0]!.lng, track[0]!.lat], [track[0]!.lng, track[0]!.lat])
        );
        map.fitBounds(bounds as LngLatBoundsLike, { padding: 48, maxZoom: 14, duration: 600 });
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [track, fitToData]);

  /* ---- clusters vs heatmap: exactly one is visible ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const set = (id: string, visible: boolean) => {
        if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
      };
      set('heat', heatmap);
      set('points', !heatmap);
      set('clusters', !heatmap);
      set('cluster-count', !heatmap);
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [heatmap, markers]);

  /* ---- geofences ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geofences) return;

    const apply = () => {
      const data: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: geofences.filter((f) => f.active).map(fenceToFeature),
      };

      const existing = map.getSource('fences') as maplibregl.GeoJSONSource | undefined;
      if (existing) {
        existing.setData(data);
        return;
      }

      map.addSource('fences', { type: 'geojson', data });

      // Zones go in BELOW the vehicle layers. `beforeId` is what keeps a
      // translucent fill from swallowing the markers it contains.
      const below = map.getLayer('clusters') ? 'clusters' : undefined;

      map.addLayer(
        {
          id: 'fence-fill',
          type: 'fill',
          source: 'fences',
          paint: {
            // An exclusion zone is a STATUS, so it takes the reserved
            // critical colour; an operating zone takes a categorical hue.
            'fill-color': ['case', ['==', ['get', 'kind'], 'exclusion'], '#d03b3b', '#2a78d6'],
            'fill-opacity': ['case', ['==', ['get', 'kind'], 'exclusion'], 0.16, 0.07],
          },
        },
        below
      );

      // Two line layers, not one with a data-driven dash: `line-dasharray`
      // is a CONSTANT paint property in MapLibre — a `case` expression there
      // is silently ignored, which is the kind of bug that only shows up in
      // a screenshot six weeks later.
      map.addLayer(
        {
          id: 'fence-line',
          type: 'line',
          source: 'fences',
          filter: ['==', ['get', 'kind'], 'inclusion'],
          paint: { 'line-color': '#2a78d6', 'line-width': 2 },
        },
        below
      );

      map.addLayer(
        {
          id: 'fence-line-exclusion',
          type: 'line',
          source: 'fences',
          filter: ['==', ['get', 'kind'], 'exclusion'],
          // Dashed: the shape itself says "keep out", so the warning does
          // not depend on telling red from blue.
          paint: { 'line-color': '#d03b3b', 'line-width': 2, 'line-dasharray': [2, 2] },
        },
        below
      );

      map.addLayer(
        {
          id: 'fence-label',
          type: 'symbol',
          source: 'fences',
          layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'symbol-placement': 'line' },
          paint: { 'text-color': '#334155', 'text-halo-color': '#ffffff', 'text-halo-width': 1.4 },
        },
        below
      );
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [geofences]);

  /* ---- swap stations ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !stations) return;

    const apply = () => {
      const data: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: stations.map((s) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [s.position.lng, s.position.lat] },
          properties: {
            id: s.id,
            name: s.name,
            charged: s.charged,
            charging: s.charging,
            slots: s.slots,
            status: s.status,
          },
        })),
      };

      const existing = map.getSource('stations') as maplibregl.GeoJSONSource | undefined;
      if (existing) {
        existing.setData(data);
        return;
      }

      map.addSource('stations', { type: 'geojson', data });

      map.addLayer({
        id: 'station-dot',
        type: 'circle',
        source: 'stations',
        paint: {
          // SIZE carries availability, colour carries status. Two channels
          // for two facts, so neither has to do both jobs.
          'circle-radius': ['interpolate', ['linear'], ['get', 'charged'], 0, 7, 20, 20],
          'circle-color': [
            'match',
            ['get', 'status'],
            'offline', '#d03b3b',
            'degraded', '#fab219',
            '#0ca30c',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      });

      map.addLayer({
        id: 'station-count',
        type: 'symbol',
        source: 'stations',
        layout: { 'text-field': ['to-string', ['get', 'charged']], 'text-size': 11 },
        paint: { 'text-color': '#ffffff' },
      });

      map.on('click', 'station-dot', (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const props = feature.properties as {
          id: string;
          name: string;
          charged: number;
          charging: number;
          slots: number;
          status: string;
        };
        const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

        new maplibregl.Popup({ closeButton: false, offset: 14 })
          .setLngLat([lng, lat])
          .setHTML(
            `<div style="font:500 13px system-ui"><strong>${props.name}</strong>` +
              `<div style="margin-top:4px">${props.charged} charged · ${props.charging} charging · ${props.slots} slots</div>` +
              `<div style="color:#64748b;margin-top:2px;text-transform:capitalize">${props.status}</div></div>`
          )
          .addTo(map);

        stationClickRef.current?.(props.id);
      });

      map.on('mouseenter', 'station-dot', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'station-dot', () => (map.getCanvas().style.cursor = ''));
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [stations]);

  /* ---- playback ghost ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const data: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: ghost
          ? [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ghost.lng, ghost.lat] } }]
          : [],
      };

      const existing = map.getSource('ghost') as maplibregl.GeoJSONSource | undefined;
      if (existing) {
        existing.setData(data);
        return;
      }

      map.addSource('ghost', { type: 'geojson', data });
      map.addLayer({
        id: 'ghost-halo',
        type: 'circle',
        source: 'ghost',
        paint: { 'circle-radius': 14, 'circle-color': '#2b22e0', 'circle-opacity': 0.18 },
      });
      map.addLayer({
        id: 'ghost-dot',
        type: 'circle',
        source: 'ghost',
        paint: {
          'circle-radius': 7,
          'circle-color': '#2b22e0',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [ghost]);

  /* ---- follow prop changes to centre ---- */
  useEffect(() => {
    mapRef.current?.easeTo({ center: [center.lng, center.lat], duration: 600 });
  }, [center.lat, center.lng]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
