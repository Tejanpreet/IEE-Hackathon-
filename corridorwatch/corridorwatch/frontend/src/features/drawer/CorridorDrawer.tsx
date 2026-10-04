import { useEffect, useRef } from 'react';
import type { CorridorDetail, Level, RankingRow, Weight } from '../../api/types';
import { useCorridor, useIncidents, usePipelines } from '../../api/client';
import { consequenceColor, consequenceLabel, levelColor, levelLabel, productColor, productLabel } from '../../api/labels';
import { Badge, Button, Dot, InlineError, RankChip, StatTile, shiftLabel } from '../../components/ui';
import { CorridorMap } from '../map/CorridorMap';
import './drawer.css';

interface Props {
  id: string;
  weight: Weight;
  order: RankingRow[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const LEVELS: Level[] = [5, 4, 3, 2, 1];

function InfoPanel({ c, weight }: { c: CorridorDetail; weight: Weight }) {
  const max = Math.max(1, ...Object.values(c.by_level));
  const shift = shiftLabel(c.rank, c.count_rank);
  const multiplier = c.consequence === 'high' ? weight : c.consequence === 'medium' ? 2 : 1;
  return (
    <div className="drawer__panel">
      <section className="drawer__block">
        <h3 className="drawer__h">Why it ranks #{c.rank}</h3>
        <p className="small text-secondary">{c.summary}</p>
      </section>

      <section className="drawer__stats" aria-label="Key numbers">
        <StatTile value={String(c.score)} label="Risk score" color="var(--brand-primary)" />
        <StatTile value={String(c.incidents)} label="Incidents" />
        <StatTile value={`×${multiplier}`} label={`${consequenceLabel[c.consequence]} consequence`} color={consequenceColor[c.consequence]} />
        <StatTile value={shift.text.split('  ')[0]} label={c.rank === c.count_rank ? 'Same as count-only' : `Shift from #${c.count_rank}`} color={shift.color} />
      </section>

      <section className="drawer__block">
        <div className="drawer__row-between">
          <h3 className="drawer__h">Incidents by likelihood</h3>
          <span className="caption text-muted">{c.incidents} total</span>
        </div>
        <ul className="drawer__levels">
          {LEVELS.map((l) => {
            const n = c.by_level[String(l) as keyof typeof c.by_level];
            return (
              <li key={l}>
                <Dot color={levelColor(l)} size={10} />
                <span className="drawer__level-name">{l} {levelLabel[l]}</span>
                <span className="bar" aria-hidden="true"><span style={{ width: `${(n / max) * 100}%`, background: levelColor(l) }} /></span>
                <span className="drawer__level-n">{n}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="drawer__block">
        <h3 className="drawer__h">Recent incidents</h3>
        <ul className="drawer__recent">
          {c.recent.map((r) => (
            <li key={r.id}>
              <Dot color={levelColor(r.level)} size={10} />
              <span className="drawer__recent-text">
                <span className="small" style={{ fontWeight: 500 }}>{r.type}{r.volume_m3 != null ? ` · ~${r.volume_m3} m³` : ''}</span>
                <span className="caption text-muted">{r.date} · Level {r.level}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="drawer__actions">
        <Button style={{ flex: 1 }}>Add to inspection plan</Button>
        <Button>Export</Button>
      </div>
    </div>
  );
}

export function CorridorDrawer({ id, weight, order, onClose, onNavigate }: Props) {
  const corridor = useCorridor(id, weight);
  const incidents = useIncidents(id);
  const pipelines = usePipelines(id);
  const closeRef = useRef<HTMLButtonElement>(null);

  const idx = order.findIndex((r) => r.id === id);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && e.altKey && prev) onNavigate(prev.id);
      if (e.key === 'ArrowRight' && e.altKey && next) onNavigate(next.id);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose, onNavigate, prev, next]);

  const c = corridor.data;
  const mapsUrl = c ? `https://www.google.com/maps/search/?api=1&query=${c.centroid.lat},${c.centroid.lng}` : '#';

  return (
    <div className="drawer-root">
      <div className="drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer__header">
          <div className="drawer__title">
            <RankChip rank={c?.rank ?? idx + 1} size="lg" />
            <div>
              <span className="caption text-muted">Priority list  /  {c?.corridor ?? '…'}</span>
              <div className="drawer__title-row">
                <h2 id="drawer-title" className="h3" style={{ fontSize: 22, fontWeight: 700 }}>{c ? `${c.corridor} corridor` : 'Loading…'}</h2>
                {c && <Badge color={productColor[c.product]} size="sm">{productLabel[c.product]}</Badge>}
                {c && <Badge color={consequenceColor[c.consequence]} size="sm">{consequenceLabel[c.consequence]} consequence</Badge>}
              </div>
            </div>
          </div>
          <div className="drawer__header-actions">
            <div className="drawer__pager">
              <Button size="sm" disabled={!prev} onClick={() => prev && onNavigate(prev.id)} aria-label="Previous corridor">‹ Prev</Button>
              <Button size="sm" disabled={!next} onClick={() => next && onNavigate(next.id)} aria-label="Next corridor">Next ›</Button>
            </div>
            <a className="btn btn--primary btn--sm" href={mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
            <Button ref={closeRef} size="sm" icon onClick={onClose} aria-label="Close">✕</Button>
          </div>
        </header>

        <div className="drawer__body">
          {corridor.error ? (
            <div style={{ padding: 24 }}><InlineError message={corridor.error} onRetry={corridor.retry} /></div>
          ) : c ? (
            <>
              <InfoPanel c={c} weight={weight} />
              <div className="drawer__map">
                <CorridorMap corridor={c} incidents={incidents.data ?? []} pipelines={pipelines.data ?? []} />
              </div>
            </>
          ) : (
            <div className="drawer__loading" aria-busy="true">
              <span className="skeleton" style={{ height: 120 }} />
              <span className="skeleton" style={{ height: 220 }} />
              <span className="skeleton" style={{ height: 180 }} />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
