import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Weight } from '../api/types';

const WEIGHTS: Weight[] = [2, 3, 5];

/** Shareable UI state lives in the URL: ?weight=3&corridor=hardisty */
export function useUrlState() {
  const [params, setParams] = useSearchParams();
  const w = Number(params.get('weight'));
  const weight: Weight = WEIGHTS.includes(w as Weight) ? (w as Weight) : 3;
  const corridor = params.get('corridor');

  const update = useCallback((patch: Record<string, string | null>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([k, v]) => (v === null ? next.delete(k) : next.set(k, v)));
      return next;
    }, { replace: false });
  }, [setParams]);

  return {
    weight,
    corridor,
    setWeight: (v: Weight) => update({ weight: v === 3 ? null : String(v) }),
    openCorridor: (id: string) => update({ corridor: id }),
    closeCorridor: () => update({ corridor: null }),
  };
}
