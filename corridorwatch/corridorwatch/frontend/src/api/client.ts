// The ONLY place the frontend talks to the backend. Components use the hooks below.
import { useEffect, useState } from 'react';
import type { CorridorDetail, Incident, Pipeline, Ranking, Weight } from './types';
import { mockCorridor, mockIncidents, mockPipelines, mockRanking } from './mocks';

const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'true') !== 'false';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(res.status === 404 ? 'Not found' : `Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 150));

export const api = {
  ranking: (weight: Weight) =>
    USE_MOCKS ? delay(mockRanking(weight)) : get<Ranking>(`/ranking?weight=${weight}&limit=15`),
  corridor: (id: string, weight: Weight) =>
    USE_MOCKS
      ? delay(mockCorridor(id, weight)).then((c) => { if (!c) throw new Error('Not found'); return c; })
      : get<CorridorDetail>(`/corridor/${encodeURIComponent(id)}?weight=${weight}`),
  incidents: (id: string) =>
    USE_MOCKS ? delay(mockIncidents(id)) : get<Incident[]>(`/corridor/${encodeURIComponent(id)}/incidents`),
  pipelines: (id: string) =>
    USE_MOCKS ? delay(mockPipelines(id)) : get<Pipeline[]>(`/pipelines?corridor=${encodeURIComponent(id)}`),
};

export interface Query<T> { data: T | null; error: string | null; loading: boolean; retry: () => void }

function useQuery<T>(fn: (() => Promise<T>) | null, deps: unknown[]): Query<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    if (!fn) { setData(null); return; }
    let alive = true;
    setLoading(true);
    setError(null);
    fn()
      .then((d) => alive && setData(d))
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);
  return { data, error, loading, retry: () => setNonce((n) => n + 1) };
}

export const useRanking = (weight: Weight) => useQuery(() => api.ranking(weight), [weight]);
export const useCorridor = (id: string | null, weight: Weight) =>
  useQuery(id ? () => api.corridor(id, weight) : null, [id, weight]);
export const useIncidents = (id: string | null) => useQuery(id ? () => api.incidents(id) : null, [id]);
export const usePipelines = (id: string | null) => useQuery(id ? () => api.pipelines(id) : null, [id]);
