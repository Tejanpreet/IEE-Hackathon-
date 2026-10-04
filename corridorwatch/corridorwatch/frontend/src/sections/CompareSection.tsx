import type { Ranking, RankingRow } from '../api/types';
import { productLabel } from '../api/labels';
import { Badge, ConsequenceBadge, SectionHeader } from '../components/ui';

function List({ title, sub, rows, mode, featured }: {
  title: string; sub: string; rows: RankingRow[]; mode: 'count' | 'score'; featured?: boolean;
}) {
  return (
    <div className={`compare__list${featured ? ' compare__list--featured' : ''}`}>
      <div className="compare__list-head">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <strong>{title}</strong>
          {featured && <Badge color="var(--brand-primary)" size="sm">CorridorWatch</Badge>}
        </div>
        <span className="small text-secondary">{sub}</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.id} className="compare__item">
          <span style={{ display: 'flex', gap: 12 }}>
            <strong style={{ color: featured ? 'var(--brand-primary)' : 'var(--text-muted)' }}>{i + 1}</strong>
            {r.corridor}
          </span>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="small text-secondary">
            {mode === 'count' ? `${r.incidents} incidents` : `Score ${r.score}`}
            <ConsequenceBadge value={r.consequence} size="sm" />
          </span>
        </div>
      ))}
    </div>
  );
}

function moverCopy(r: RankingRow) {
  const product = productLabel[r.product].toLowerCase();
  if (r.rank < r.count_rank)
    return `${r.consequence === 'high' ? 'High-consequence' : 'Medium-consequence'} ${product} corridor. Fewer incidents, but a failure here would be severe.`;
  return `Frequent but ${r.consequence}-consequence ${product} events. Busy, not dangerous.`;
}

export function CompareSection({ ranking }: { ranking: Ranking | null }) {
  if (!ranking) return <section id="compare" className="section section--band" />;
  const byCount = [...ranking.rows].sort((a, b) => a.count_rank - b.count_rank).slice(0, 5);
  const byScore = ranking.rows.slice(0, 5);
  const delta = (r: RankingRow) => r.count_rank - r.rank;
  const sorted = [...ranking.rows].sort((a, b) => delta(b) - delta(a));
  const movers = [sorted[0], sorted[sorted.length - 1], sorted[sorted.length - 2]].filter(Boolean);

  return (
    <section id="compare" className="section section--band" aria-labelledby="compare-title">
      <div className="container">
        <SectionHeader id="compare-title" eyebrow="Why weighting matters" title="Counting alone sends crews to the wrong places"
          sub="The busiest corridors aren't always the most dangerous. Here's how the top 5 changes once consequence counts." />
        <div className="compare__grid">
          <List title="Count-only ranking" sub="Most incidents first" rows={byCount} mode="count" />
          <span className="compare__arrow" aria-hidden="true">→</span>
          <List title="Risk-weighted ranking" sub={`Incidents × consequence (high ×${ranking.weight})`} rows={byScore} mode="score" featured />
        </div>
        <div className="compare__movers">
          {movers.map((r) => {
            const d = delta(r);
            const up = d > 0;
            const color = up ? 'var(--status-high)' : 'var(--status-low)';
            return (
              <article key={r.id} className="compare__mover card">
                <div className="compare__mover-head">
                  <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <strong>{r.corridor}</strong>
                    <Badge color={color} size="sm">{up ? 'Rose' : 'Fell'}</Badge>
                  </span>
                  <strong style={{ color, fontSize: 20 }}>{up ? '▲' : '▼'} {Math.abs(d)}</strong>
                </div>
                <span className="small text-secondary" style={{ fontWeight: 600 }}>#{r.count_rank} → #{r.rank}</span>
                <p className="small text-secondary">{moverCopy(r)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
