import { useEffect, useState } from 'react';
import {
  APIProvider, ControlPosition, InfoWindow, Map, MapControl, Marker, Polygon, Polyline, useMap,
} from '@vis.gl/react-google-maps';
import type { CorridorDetail, Incident, Pipeline } from '../../api/types';
import { levelLabel } from '../../api/labels';
import { useTheme } from '../../hooks/useTheme';
import { Segmented } from '../../components/ui';
import { darkMapStyle, lightMapStyle } from './mapStyles';
import { useTokenColors } from './useTokenColors';
import { MapLegend } from './MapLegend';
import './map.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

interface Props {
  corridor: CorridorDetail;
  incidents: Incident[];
  pipelines: Pipeline[];
}

/** Zooms to the corridor boundary whenever the corridor changes. */
function FitToCorridor({ corridor }: { corridor: CorridorDetail }) {
  const map = useMap();
  useEffect(() => {
    if (!map || corridor.boundary.length === 0) return;
    const b = new google.maps.LatLngBounds();
    corridor.boundary.forEach((p) => b.extend(p));
    map.fitBounds(b, 48);
  }, [map, corridor.id, corridor.boundary]);
  return null;
}

function Overlays({ corridor, incidents, pipelines }: Props) {
  const { theme } = useTheme();
  const c = useTokenColors(theme);
  const [selected, setSelected] = useState<Incident | null>(null);

  useEffect(() => setSelected(null), [corridor.id]);

  return (
    <>
      <FitToCorridor corridor={corridor} />

      <Polygon paths={corridor.boundary} strokeColor={c.primary} strokeOpacity={0.9} strokeWeight={2}
        fillColor={c.primary} fillOpacity={0.07} clickable={false} />

      {pipelines.map((p, i) => (
        <Polyline key={p.id} path={p.path} clickable={false}
          strokeColor={i === 0 ? c.primary : p.product === 'sweet_gas' ? c.pipelineGas : c.pipeline}
          strokeOpacity={0.9} strokeWeight={i === 0 ? 4 : 2.5} />
      ))}

      {[...incidents].sort((a, b) => a.level - b.level).map((inc) => (
        <Marker key={inc.id} position={{ lat: inc.lat, lng: inc.lng }} title={`${inc.type} · level ${inc.level}`}
          zIndex={inc.level}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: inc.level >= 4 ? 8 : inc.level === 3 ? 6.5 : 5.5,
            fillColor: c.level[inc.level], fillOpacity: 0.95,
            strokeColor: '#FFFFFF', strokeOpacity: 0.7, strokeWeight: 1,
          }}
          onClick={() => setSelected(inc)} />
      ))}

      {selected && (
        <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}
          pixelOffset={[0, -10]} onClose={() => setSelected(null)} headerDisabled className="map-popup">
          <div className="map-popup__head">
            <span className="map-popup__dot" style={{ background: c.level[selected.level] }} />
            <strong>{selected.id}</strong>
            <span className="map-popup__lvl">Level {selected.level} · {levelLabel[selected.level]}</span>
          </div>
          <dl className="map-popup__grid">
            <dt>Type</dt><dd>{selected.type}</dd>
            <dt>Reported</dt><dd>{selected.date}</dd>
            <dt>Volume</dt><dd>{selected.volume_m3 != null ? `~${selected.volume_m3} m³` : 'Not reported'}</dd>
            <dt>Status</dt><dd>{selected.inspected ? 'Inspected' : 'Never inspected'}</dd>
          </dl>
        </InfoWindow>
      )}
    </>
  );
}

export function CorridorMap(props: Props) {
  const { theme } = useTheme();
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid' | 'terrain'>('roadmap');

  if (!API_KEY) {
    return (
      <div className="map map--empty">
        <div className="map__notice card">
          <strong>Add your Google Maps key to see the live map</strong>
          <p className="small text-secondary">
            Copy <code>frontend/.env.example</code> to <code>.env.local</code>, set <code>VITE_GOOGLE_MAPS_API_KEY</code>, then restart <code>npm run dev</code>.
          </p>
          <p className="caption text-muted">
            {props.incidents.length} incidents and {props.pipelines.length} pipelines are loaded and ready to plot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map">
      <APIProvider apiKey={API_KEY}>
        <Map
          key={theme /* legacy styles only apply on init */}
          defaultCenter={props.corridor.centroid}
          defaultZoom={9}
          mapTypeId={mapType}
          styles={theme === 'dark' ? darkMapStyle : lightMapStyle}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          fullscreenControl
          scaleControl
          clickableIcons={false}
          backgroundColor={theme === 'dark' ? '#0F1A2A' : '#F1F3EE'}
        >
          <Overlays {...props} />
          <MapControl position={ControlPosition.TOP_RIGHT}>
            <div className="map__control">
              <Segmented label="Map type" value={mapType} onChange={setMapType} options={[
                { value: 'roadmap', label: 'Map' }, { value: 'terrain', label: 'Terrain' }, { value: 'hybrid', label: 'Satellite' },
              ]} />
            </div>
          </MapControl>
          <MapControl position={ControlPosition.LEFT_BOTTOM}>
            <MapLegend />
          </MapControl>
        </Map>
      </APIProvider>
    </div>
  );
}
