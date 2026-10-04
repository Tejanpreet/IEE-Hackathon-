import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Logo, Segmented } from './ui';
import { useTheme, type Theme } from '../hooks/useTheme';
import { useUrlState } from '../hooks/useUrlState';
import { api } from '../api/client';
import { downloadRankingCsv } from '../lib/csv';
import './Nav.css';

const SECTIONS = [
  { id: 'priority', label: 'Inspect list' },
  { id: 'compare', label: 'Compare' },
  { id: 'method', label: 'Method' },
];

export function Nav() {
  const { theme, setTheme } = useTheme();
  const { weight } = useUrlState();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<string>('priority');

  // Highlight the section currently in view.
  useEffect(() => {
    if (pathname !== '/') return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [pathname]);

  const goTo = (id: string) => {
    if (pathname !== '/') { navigate(`/#${id}`); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
  };

  const exportList = async () => {
    const r = await api.ranking(weight);
    downloadRankingCsv(r.rows, weight);
  };

  return (
    <nav className="nav" aria-label="Main">
      <div className="container nav__inner">
        <Link to="/" aria-label="CorridorWatch home"><Logo /></Link>
        <ul className="nav__links">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button type="button" className="nav__link"
                aria-current={pathname === '/' && active === s.id ? 'true' : undefined}
                onClick={() => goTo(s.id)}>
                {s.label}
              </button>
            </li>
          ))}
          <li>
            <Link to="/about" className="nav__link" aria-current={pathname === '/about' ? 'page' : undefined}>About</Link>
          </li>
        </ul>
        <div className="nav__actions">
          <Segmented<Theme> pill label="Theme" value={theme} onChange={setTheme}
            options={[{ value: 'dark', label: '☾ Dark' }, { value: 'light', label: '☀ Light' }]} />
          <Button onClick={exportList}>Export list</Button>
        </div>
      </div>
    </nav>
  );
}
