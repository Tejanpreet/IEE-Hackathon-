import { SectionHeader } from '../components/ui';

const STEPS = [
  { n: 1, label: 'Likelihood', q: 'How often does it fail here?', body: 'We count every dated CER incident in the corridor. Rows without a date are dropped.' },
  { n: 2, label: 'Consequence', q: 'How bad would a failure be?', body: 'Sour gas, crude oil and large spills weigh ×3 by default. Medium ×2. Small sweet-gas releases ×1.' },
  { n: 3, label: 'Risk score', q: 'Where should crews go first?', body: 'Corridors are ranked by score. Raise the weight and high-consequence corridors climb further.' },
];

export function MethodSection() {
  return (
    <section id="method" className="section container" aria-labelledby="method-title">
      <SectionHeader id="method-title" eyebrow="How it works" title="One score, two questions"
        sub="Every corridor gets a risk score that combines its track record with what's at stake." />
      <div className="method__row">
        {STEPS.map((s, i) => (
          <div key={s.n} style={{ display: 'contents' }}>
            {i > 0 && <span className="method__op" aria-hidden="true">{i === 1 ? '×' : '='}</span>}
            <article className={`method__card${i === 2 ? ' method__card--featured' : ''}`}>
              <span className="method__step">{s.n}</span>
              <span className="eyebrow" style={{ color: i === 2 ? 'var(--brand-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
              <h3 className="h3">{s.q}</h3>
              <p className="small text-secondary">{s.body}</p>
            </article>
          </div>
        ))}
      </div>
      <div className="method__note" role="note">
        <span aria-hidden="true">ⓘ</span>
        CorridorWatch ranks historical incident hotspots to prioritize inspections. It doesn't certify any pipe as safe and isn't a repair design.
      </div>
    </section>
  );
}
