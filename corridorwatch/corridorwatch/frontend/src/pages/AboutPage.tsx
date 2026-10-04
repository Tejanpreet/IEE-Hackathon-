import { useNavigate } from 'react-router-dom';
import { Button, SectionHeader } from '../components/ui';
import './about.css';

const PROBLEMS = [
  { title: 'Crews are limited', body: 'Integrity teams can only walk so many kilometres a season. Every visit has to count.' },
  { title: 'Counts mislead', body: 'The corridors with the most incidents are often low-consequence. Counting alone sends crews to noise.' },
  { title: 'Consequence is missing', body: 'A sour-gas or crude release near a town matters more than a small sweet-gas puff. Rankings should say so.' },
];

// TODO(team): replace with real names and roles.
const TEAM = [
  { name: 'Team member', role: 'Front-end and design' },
  { name: 'Team member', role: 'Risk model and data' },
  { name: 'Team member', role: 'Mapping and geospatial' },
  { name: 'Team member', role: 'Domain and pitch' },
];

export function AboutPage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="container about-hero">
        <span className="eyebrow">About CorridorWatch</span>
        <h1 className="about-hero__title">Built for crews with more pipe than hours</h1>
        <p className="about-hero__sub">
          We turn the CER's public incident record into a ranked inspection list. Likelihood tells you where pipe has failed.
          Consequence tells you where failure would hurt most. Together they tell you where to go first.
        </p>
      </section>

      <section className="section section--band">
        <div className="container">
          <SectionHeader eyebrow="The problem" title="Why a better list matters" />
          <div className="about-grid">
            {PROBLEMS.map((p, i) => (
              <article key={p.title} className="about-card card">
                <span className="method__step">{i + 1}</span>
                <h3 className="h3">{p.title}</h3>
                <p className="small text-secondary">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="section container">
        <SectionHeader eyebrow="Team" title="Who built it" sub="IEEE YP Industry Hackathon 2026, Calgary. Energy and infrastructure stream." />
        <div className="about-team">
          {TEAM.map((m, i) => (
            <article key={i} className="about-person card">
              <span className="about-person__avatar" aria-hidden="true">{m.name.split(' ').map((w) => w[0]).join('')}</span>
              <strong>{m.name}</strong>
              <span className="small text-secondary">{m.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="container cta-wrap">
        <div className="cta">
          <div>
            <h2 className="h2" style={{ fontSize: 28 }}>See the priority list</h2>
            <p className="text-secondary">Fifteen corridors, ranked by real risk, each one on the map.</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/#priority')}>View priority list</Button>
        </div>
      </section>
    </>
  );
}
