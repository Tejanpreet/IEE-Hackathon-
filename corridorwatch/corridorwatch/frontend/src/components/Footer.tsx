import { Link } from 'react-router-dom';
import { Logo } from './ui';
import './Footer.css';

const COLS = [
  { title: 'Product', links: [['Priority list', '/#priority'], ['Compare', '/#compare'], ['How it works', '/#method']] },
  { title: 'Company', links: [['About', '/about'], ['Team', '/about#team'], ['Contact', '/about#contact']] },
  {
    title: 'Data',
    links: [
      ['CER incident data', 'https://open.canada.ca/data/en/dataset/7dffedc4-23fa-440c-a36d-adf5a6cc09f1'],
      ['CER pipeline safety', 'https://www.cer-rec.gc.ca/en/safety-environment/industry-performance/interactive-pipeline/index.html'],
      ['Methodology', '/#method'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="small text-secondary">Risk-ranked pipeline corridors for integrity teams.</p>
          </div>
          <div className="footer__cols">
            {COLS.map((c) => (
              <div key={c.title} className="footer__col">
                <h3 className="small">{c.title}</h3>
                {c.links.map(([label, href]) =>
                  href.startsWith('http')
                    ? <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
                    : <Link key={label} to={href}>{label}</Link>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer__bottom caption text-muted">
          <span>© 2026 CorridorWatch. Built at the IEEE YP Industry Hackathon, Calgary.</span>
          <span>Ranks historical hotspots. Doesn't certify any pipe as safe.</span>
        </div>
      </div>
    </footer>
  );
}
