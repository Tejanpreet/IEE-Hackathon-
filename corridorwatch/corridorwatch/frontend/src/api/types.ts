// Mirrors docs/API_CONTRACT.md and backend/app/schemas.py. Change all three together.

export type Product = 'crude_oil' | 'sour_gas' | 'sweet_gas';
export type Consequence = 'high' | 'medium' | 'low';
export type Level = 1 | 2 | 3 | 4 | 5;
export type Weight = 2 | 3 | 5;

export interface LatLng { lat: number; lng: number }

export interface RankingRow {
  id: string;
  rank: number;
  corridor: string;
  product: Product;
  incidents: number;
  consequence: Consequence;
  score: number;
  count_rank: number;
  centroid: LatLng;
}

export interface Ranking {
  weight: Weight;
  generated_at: string;
  total_incidents: number;
  dropped_undated: number;
  total_corridors: number;
  top5_overlap_with_count_only: number;
  rows: RankingRow[];
}

export interface RecentIncident {
  id: string;
  date: string;
  type: string;
  level: Level;
  volume_m3: number | null;
}

export interface CorridorDetail extends Omit<RankingRow, 'centroid'> {
  summary: string;
  centroid: LatLng;
  boundary: LatLng[];
  by_level: Record<'1' | '2' | '3' | '4' | '5', number>;
  recent: RecentIncident[];
}

export interface Incident extends RecentIncident {
  lat: number;
  lng: number;
  inspected: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  product: Product;
  path: LatLng[];
}
