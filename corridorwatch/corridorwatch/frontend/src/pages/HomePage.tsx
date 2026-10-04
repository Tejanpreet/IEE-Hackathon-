import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRanking } from '../api/client';
import { useUrlState } from '../hooks/useUrlState';
import { downloadRankingCsv } from '../lib/csv';
import { Hero } from '../sections/Hero';
import { StatsBar } from '../sections/StatsBar';
import { PriorityList } from '../sections/PriorityList';
import { CompareSection } from '../sections/CompareSection';
import { MethodSection } from '../sections/MethodSection';
import { CtaBand } from '../sections/CtaBand';
import { CorridorDrawer } from '../features/drawer/CorridorDrawer';
import '../sections/sections.css';

export function HomePage() {
  const { weight, setWeight, corridor, openCorridor, closeCorridor } = useUrlState();
  const ranking = useRanking(weight);
  const { hash } = useLocation();

  // Support /#priority links from other pages.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50);
    return () => clearTimeout(t);
  }, [hash]);

  const rows = ranking.data?.rows ?? [];

  return (
    <>
      <Hero ranking={ranking.data} />
      <StatsBar ranking={ranking.data} />
      <PriorityList ranking={ranking.data} loading={ranking.loading} error={ranking.error} retry={ranking.retry}
        weight={weight} onWeight={setWeight} onOpen={openCorridor} />
      <CompareSection ranking={ranking.data} />
      <MethodSection />
      <CtaBand
        onExport={() => ranking.data && downloadRankingCsv(rows, weight)}
        onMap={() => rows[0] && openCorridor(rows[0].id)} />
      {corridor && (
        <CorridorDrawer id={corridor} weight={weight} order={rows}
          onClose={closeCorridor} onNavigate={openCorridor} />
      )}
    </>
  );
}
