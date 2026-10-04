"""Response models. Mirror docs/API_CONTRACT.md and frontend/src/api/types.ts — change all three together."""
from typing import Literal, Optional

from pydantic import BaseModel

Product = Literal["crude_oil", "sour_gas", "sweet_gas"]
Consequence = Literal["high", "medium", "low"]
Level = Literal[1, 2, 3, 4, 5]
Weight = Literal[2, 3, 5]


class LatLng(BaseModel):
    lat: float
    lng: float


class RankingRow(BaseModel):
    id: str
    rank: int
    corridor: str
    product: Product
    incidents: int
    consequence: Consequence
    score: float
    count_rank: int
    centroid: LatLng


class Ranking(BaseModel):
    weight: Weight
    generated_at: str
    total_incidents: int
    dropped_undated: int
    total_corridors: int
    top5_overlap_with_count_only: int
    rows: list[RankingRow]


class RecentIncident(BaseModel):
    id: str
    date: str
    type: str
    level: Level
    volume_m3: Optional[float] = None


class CorridorDetail(RankingRow):
    summary: str
    boundary: list[LatLng]
    by_level: dict[Literal["1", "2", "3", "4", "5"], int]
    recent: list[RecentIncident]


class Incident(RecentIncident):
    lat: float
    lng: float
    inspected: bool


class Pipeline(BaseModel):
    id: str
    name: str
    product: Product
    path: list[LatLng]
