// Placeholder data matching docs/API_CONTRACT.md. Used when VITE_USE_MOCKS=true.
// Keep in sync with backend/app/data/mock.py (run /sync-contract in Claude Code).
import type {
  Consequence, CorridorDetail, Incident, LatLng, Level, Pipeline, Product, Ranking, RankingRow, Weight,
} from './types';

interface BaseCorridor {
  id: string; corridor: string; product: Product; incidents: number; consequence: Consequence; centroid: LatLng;
}

const BASE: BaseCorridor[] = [
  { id: 'hardisty', corridor: 'Hardisty', product: 'crude_oil', incidents: 24, consequence: 'high', centroid: { lat: 52.676, lng: -111.307 } },
  { id: 'drayton-valley', corridor: 'Drayton Valley', product: 'sour_gas', incidents: 22, consequence: 'high', centroid: { lat: 53.222, lng: -114.977 } },
  { id: 'fort-mcmurray', corridor: 'Fort McMurray', product: 'crude_oil', incidents: 20, consequence: 'high', centroid: { lat: 56.726, lng: -111.381 } },
  { id: 'rocky-mountain-house', corridor: 'Rocky Mountain House', product: 'sour_gas', incidents: 18, consequence: 'high', centroid: { lat: 52.375, lng: -114.922 } },
  { id: 'grande-prairie', corridor: 'Grande Prairie', product: 'sour_gas', incidents: 26, consequence: 'medium', centroid: { lat: 55.171, lng: -118.795 } },
  { id: 'whitecourt', corridor: 'Whitecourt', product: 'crude_oil', incidents: 25, consequence: 'medium', centroid: { lat: 54.142, lng: -115.683 } },
  { id: 'cold-lake', corridor: 'Cold Lake', product: 'crude_oil', incidents: 15, consequence: 'high', centroid: { lat: 54.464, lng: -110.182 } },
  { id: 'edson', corridor: 'Edson', product: 'sweet_gas', incidents: 41, consequence: 'low', centroid: { lat: 53.582, lng: -116.437 } },
  { id: 'swan-hills', corridor: 'Swan Hills', product: 'sour_gas', incidents: 13, consequence: 'high', centroid: { lat: 54.711, lng: -115.401 } },
  { id: 'hinton', corridor: 'Hinton', product: 'sweet_gas', incidents: 37, consequence: 'low', centroid: { lat: 53.4, lng: -117.585 } },
  { id: 'lloydminster', corridor: 'Lloydminster', product: 'crude_oil', incidents: 17, consequence: 'medium', centroid: { lat: 53.278, lng: -110.005 } },
  { id: 'brooks', corridor: 'Brooks', product: 'sweet_gas', incidents: 32, consequence: 'low', centroid: { lat: 50.565, lng: -111.898 } },
  { id: 'red-deer', corridor: 'Red Deer', product: 'crude_oil', incidents: 15, consequence: 'medium', centroid: { lat: 52.269, lng: -113.811 } },
  { id: 'medicine-hat', corridor: 'Medicine Hat', product: 'sweet_gas', incidents: 28, consequence: 'low', centroid: { lat: 50.041, lng: -110.677 } },
  { id: 'fox-creek', corridor: 'Fox Creek', product: 'sour_gas', incidents: 13, consequence: 'medium', centroid: { lat: 54.401, lng: -116.808 } },
];

const SUMMARY: Record<string, string> = {
  hardisty: 'Hardisty is a major crude-oil hub. It has fewer incidents than Edson, but any failure here is high consequence.',
  edson: 'Edson has the most incidents of any corridor, but they are mostly small sweet-gas releases.',
  'medicine-hat': 'Medicine Hat sees frequent sweet-gas events. Busy, but rarely severe.',
};

const weightOf = (c: Consequence, w: Weight) => (c === 'high' ? w : c === 'medium' ? 2 : 1);

// Count-only ranking: incidents desc, ties broken by name.
const countRank = new Map(
  [...BASE].sort((a, b) => b.incidents - a.incidents || a.corridor.localeCompare(b.corridor)).map((c, i) => [c.id, i + 1]),
);

export function mockRanking(weight: Weight): Ranking {
  const rows: RankingRow[] = BASE.map((c) => ({
    ...c,
    rank: 0,
    score: c.incidents * weightOf(c.consequence, weight),
    count_rank: countRank.get(c.id)!,
  }))
    .sort((a, b) => b.score - a.score || b.incidents - a.incidents)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const top5 = new Set(rows.slice(0, 5).map((r) => r.id));
  const overlap = [...countRank.entries()].filter(([id, r]) => r <= 5 && top5.has(id)).length;
  return {
    weight,
    generated_at: '2026-09-25T00:00:00Z',
    total_incidents: 2034,
    dropped_undated: 12,
    total_corridors: 128,
    top5_overlap_with_count_only: overlap,
    rows,
  };
}

// Deterministic pseudo-random so the map looks the same every load.
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const TYPES = ['Crude oil release', 'Valve leak at pump station', 'Pressure exceedance', 'Corrosion pinhole', 'Fire at meter station', 'Gas release', 'Third-party damage'];

function levelsFor(n: number, r: () => number): Level[] {
  const dist: Level[] = [];
  for (let i = 0; i < n; i++) {
    const x = r();
    dist.push(x < 0.12 ? 5 : x < 0.3 ? 4 : x < 0.55 ? 3 : x < 0.8 ? 2 : 1);
  }
  return dist;
}

export function mockIncidents(id: string): Incident[] {
  const c = BASE.find((b) => b.id === id);
  if (!c) return [];
  const r = rng(id);
  return levelsFor(c.incidents, r).map((level, i) => {
    const year = 2026 - Math.floor(r() * 8);
    const month = 1 + Math.floor(r() * (year === 2026 ? 8 : 12)); // data ends 2026-09-25
    const day = 1 + Math.floor(r() * 27);
    return {
      id: `INC${year}-${String(100 + i * 7).padStart(4, '0')}`,
      lat: c.centroid.lat + (r() - 0.5) * 0.36,
      lng: c.centroid.lng + (r() - 0.5) * 0.6,
      level,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      type: TYPES[Math.floor(r() * TYPES.length)],
      volume_m3: r() > 0.4 ? Math.round(r() * 50) / 10 : null,
      inspected: r() > 0.6,
    };
  });
}

function boundary(center: LatLng): LatLng[] {
  const pts: LatLng[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const wobble = 1 + 0.12 * Math.sin(a * 3);
    pts.push({ lat: center.lat + Math.sin(a) * 0.22 * wobble, lng: center.lng + Math.cos(a) * 0.36 * wobble });
  }
  return pts;
}

export function mockCorridor(id: string, weight: Weight): CorridorDetail | null {
  const ranking = mockRanking(weight);
  const row = ranking.rows.find((r) => r.id === id);
  if (!row) return null;
  const incidents = mockIncidents(id);
  const by_level = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as CorridorDetail['by_level'];
  incidents.forEach((i) => (by_level[String(i.level) as keyof typeof by_level] += 1));
  const recent = [...incidents].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
    .map(({ id, date, type, level, volume_m3 }) => ({ id, date, type, level, volume_m3 }));
  return {
    ...row,
    summary: SUMMARY[id] ?? `${row.corridor} ranks #${row.rank} once consequence is weighted, up from #${row.count_rank} on incident count alone.`,
    boundary: boundary(row.centroid),
    by_level,
    recent,
  };
}

export function mockPipelines(id: string): Pipeline[] {
  const c = BASE.find((b) => b.id === id);
  if (!c) return [];
  const { lat, lng } = c.centroid;
  const line = (dLat1: number, dLng1: number, dLat2: number, dLng2: number): LatLng[] => [
    { lat: lat + dLat1, lng: lng + dLng1 },
    { lat: lat + dLat1 * 0.4, lng: lng + dLng1 * 0.5 },
    { lat, lng },
    { lat: lat + dLat2 * 0.5, lng: lng + dLng2 * 0.4 },
    { lat: lat + dLat2, lng: lng + dLng2 },
  ];
  return [
    { id: `${id}-p1`, name: 'Mainline', product: c.product, path: line(-0.2, -0.9, 0.25, 0.9) },
    { id: `${id}-p2`, name: 'Lateral north', product: c.product, path: line(0.6, -0.15, -0.5, 0.2) },
    { id: `${id}-p3`, name: 'Gathering line', product: 'sweet_gas', path: line(0.35, 0.7, -0.4, -0.6) },
  ];
}
