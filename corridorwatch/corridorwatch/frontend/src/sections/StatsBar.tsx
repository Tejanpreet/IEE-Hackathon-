import type { Ranking } from '../api/types';

export function StatsBar({ ranking }: { ranking: Ranking | null }) {
  const replacedPct = ranking ? Math.round(((5 - ranking.top5_overlap_with_count_only) / 5) * 100) : 80;
  const stats = [
    { v: ranking?.total_incidents.toLocaleString() ?? '—', l: 'Incidents analyzed', s: '2008 to 2026' },
    { v: String(ranking?.rows.length ?? 15), l: 'Priority corridors', s: 'Grouped by nearest town' },
    { v: `${ranking?.weight ?? 3}×`, l: 'Weight on high consequence', s: 'Sour gas, crude, large spills' },
    { v: `${replacedPct}%`, l: 'Count-only top 5 replaced', s: 'Noise filtered out' },
  ];
  return (
    <div className="container stats">
      <dl className="stats__bar card">
        {stats.map((s) => (
          <div key={s.l} className="stats__item">
            <dd className="stats__value">{s.v}</dd>
            <dt className="small" style={{ fontWeight: 500 }}>{s.l}</dt>
            <dd className="caption text-secondary">{s.s}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
