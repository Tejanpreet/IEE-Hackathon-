import type { Level } from '../../api/types';
import { levelColor } from '../../api/labels';

const LEVELS: Level[] = [5, 4, 3, 2, 1];

export function MapLegend() {
  return (
    <div className="map__legend" aria-label="Map legend">
      <div className="map__legend-row"><span className="map__legend-area" />Corridor boundary</div>
      <div className="map__legend-row"><span className="map__legend-line map__legend-line--primary" />Main line</div>
      <div className="map__legend-row"><span className="map__legend-line" />Pipeline</div>
      <div className="map__legend-row">
        <span className="map__legend-scale">
          {LEVELS.map((l) => <span key={l} style={{ background: levelColor(l) }} title={`Level ${l}`} />)}
        </span>
        Incident level 5 → 1
      </div>
    </div>
  );
}
