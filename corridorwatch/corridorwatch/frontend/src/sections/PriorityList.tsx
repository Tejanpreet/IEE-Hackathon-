import { useMemo, useState, type KeyboardEvent } from 'react';
import type { Product, Ranking, Weight } from '../api/types';
import { consequenceColor } from '../api/labels';
import {
  ConsequenceBadge, InlineError, ProductLabel, RankChip, SearchInput, SectionHeader, Segmented, shiftLabel,
} from '../components/ui';

type Filter = 'all' | Product;

interface Props {
  ranking: Ranking | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  weight: Weight;
  onWeight: (w: Weight) => void;
  onOpen: (id: string) => void;
}

export function PriorityList({ ranking, loading, error, retry, weight, onWeight, onOpen }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => (ranking?.rows ?? []).filter((r) =>
    (filter === 'all' || r.product === filter) && r.corridor.toLowerCase().includes(query.trim().toLowerCase())),
  [ranking, filter, query]);
  const maxScore = Math.max(1, ...(ranking?.rows.map((r) => r.score) ?? [1]));

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(id); }
  };

  return (
    <section id="priority" className="section container" aria-labelledby="priority-title">
      <SectionHeader id="priority-title" eyebrow="Priority list" title={`Top ${ranking?.rows.length ?? 15} corridors to inspect`}
        sub="Ranked by risk score: incidents × consequence weight. Select a corridor to see it on the map." />

      <div className="toolbar">
        <div className="toolbar__group">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by town" />
          <Segmented<Filter> label="Product" value={filter} onChange={setFilter} options={[
            { value: 'all', label: 'All' }, { value: 'crude_oil', label: 'Crude oil' },
            { value: 'sour_gas', label: 'Sour gas' }, { value: 'sweet_gas', label: 'Sweet gas' },
          ]} />
        </div>
        <div className="toolbar__group">
          <span className="small text-secondary" id="weight-label">High-consequence weight</span>
          <Segmented<Weight> label="High-consequence weight" value={weight} onChange={onWeight}
            options={[{ value: 2, label: '×2' }, { value: 3, label: '×3' }, { value: 5, label: '×5' }]} />
        </div>
      </div>

      {error ? <InlineError message={error} onRetry={retry} /> : (
        <div className={`table card${loading ? ' table--loading' : ''}`} role="table" aria-label="Priority corridors" aria-busy={loading}>
          <div className="table__row table__row--head" role="row">
            {['#', 'Corridor', 'Product', 'Incidents', 'Consequence', 'Risk score', 'vs count-only', ''].map((h, i) => (
              <span key={i} role="columnheader" className="table__cell">{h}</span>
            ))}
          </div>
          {rows.map((r) => {
            const shift = shiftLabel(r.rank, r.count_rank);
            return (
              <div key={r.id} className="table__row" role="row" tabIndex={0}
                aria-label={`Rank ${r.rank}, ${r.corridor}. Open map`}
                onClick={() => onOpen(r.id)} onKeyDown={(e) => onKey(e, r.id)}>
                <span className="table__cell" role="cell"><RankChip rank={r.rank} /></span>
                <span className="table__cell table__name" role="cell">
                  <strong>{r.corridor}</strong><span className="caption text-muted">Alberta</span>
                </span>
                <span className="table__cell" role="cell"><ProductLabel value={r.product} /></span>
                <span className="table__cell table__num" role="cell">{r.incidents}</span>
                <span className="table__cell" role="cell"><ConsequenceBadge value={r.consequence} /></span>
                <span className="table__cell table__score" role="cell">
                  <strong>{r.score}</strong>
                  <span className="bar" aria-hidden="true">
                    <span style={{ width: `${(r.score / maxScore) * 100}%`, background: consequenceColor[r.consequence] }} />
                  </span>
                </span>
                <span className="table__cell small" role="cell" style={{ color: shift.color, fontWeight: 500 }}>{shift.text}</span>
                <span className="table__cell table__chev" role="cell" aria-hidden="true">›</span>
              </div>
            );
          })}
          {!loading && rows.length === 0 && (
            <div className="table__empty">
              <strong>No corridors match "{query}"</strong>
              <span className="small text-secondary">Try another town or clear the product filter.</span>
            </div>
          )}
        </div>
      )}

      <div className="table__note caption text-muted">
        <span>Showing {rows.length} of {ranking?.total_corridors ?? '—'} corridors · {ranking?.dropped_undated ?? 0} undated incidents excluded</span>
        <span>Last refreshed {ranking ? new Date(ranking.generated_at).toLocaleDateString('en-CA', { dateStyle: 'medium', timeZone: 'UTC' }) : '—'}</span>
      </div>
    </section>
  );
}
