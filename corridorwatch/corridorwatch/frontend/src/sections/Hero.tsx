import type { Ranking } from '../api/types';
import { productLabel, consequenceLabel } from '../api/labels';
import { Button, RankChip } from '../components/ui';

export function Hero({ ranking }: { ranking: Ranking | null }) {
  const top = ranking?.rows.slice(0, 3) ?? [];
  const replaced = ranking ? 5 - ranking.top5_overlap_with_count_only : null;
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero container">
      <div className="hero__copy">
        <span className="hero__eyebrow">
          <span className="hero__pulse" aria-hidden="true" />
          Alberta pilot · {ranking ? ranking.total_incidents.toLocaleString() : '2,034'} CER incidents analyzed
        </span>
        <h1 className="hero__title">Inspect where it matters most</h1>
        <p className="hero__sub">
          CorridorWatch ranks pipeline corridors by how often they fail and how bad a failure would be.
          Your integrity crews walk the riskiest stretches first, not just the noisiest ones.
        </p>
        <div className="hero__ctas">
          <Button variant="primary" onClick={() => scroll('priority')}>View priority list →</Button>
          <Button onClick={() => scroll('method')}>How scoring works</Button>
        </div>
      </div>

      <aside className="hero__card card" aria-label="This week's top priorities">
        <div className="hero__card-head">
          <span className="small" style={{ fontWeight: 600 }}>This week's top priorities</span>
          <span className="caption text-secondary hero__live"><span aria-hidden="true" />Updated Sep 25</span>
        </div>
        {top.map((r) => (
          <div key={r.id} className="hero__card-row">
            <RankChip rank={r.rank} />
            <div className="hero__card-name">
              <strong>{r.corridor}</strong>
              <span className="caption text-secondary">{productLabel[r.product]} · {consequenceLabel[r.consequence]} consequence</span>
            </div>
            <div className="hero__card-score">
              <strong>{r.score}</strong>
              <span className="caption text-muted">risk score</span>
            </div>
          </div>
        ))}
        {replaced !== null && (
          <div className="hero__card-foot caption">
            <strong style={{ color: 'var(--status-warning)', fontSize: 14 }}>{replaced} of 5</strong>
            <span className="text-secondary">of the count-only top 5 get replaced once consequence is weighted</span>
          </div>
        )}
      </aside>
    </section>
  );
}
