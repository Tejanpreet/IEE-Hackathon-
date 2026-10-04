"""FastAPI app. Routes follow docs/API_CONTRACT.md. Run: uvicorn app.main:app --reload --port 8000"""
import os

from dotenv import load_dotenv

load_dotenv()  # must run before the adapter reads RISK_ENGINE_PATH
load_dotenv("env")  # also pick up a file literally named "env" (no leading dot)

from fastapi import FastAPI, HTTPException, Query  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402

from app.adapters import risk_engine  # noqa: E402
from app.schemas import CorridorDetail, Incident, Pipeline, Ranking  # noqa: E402
from app.services import ranking  # noqa: E402

app = FastAPI(title="CorridorWatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()],
    allow_methods=["GET"],
    allow_headers=["*"],
)

WeightParam = Query(3, description="High-consequence weight", enum=[2, 3, 5])


@app.get("/api/health")
def health():
    return {"ok": True, "source": "live" if risk_engine.LIVE else "mock"}


@app.get("/api/ranking", response_model=Ranking)
def get_ranking(weight: int = WeightParam, limit: int = Query(15, ge=1, le=200)):
    return ranking.rank(weight, limit)


@app.get("/api/corridor/{cid}", response_model=CorridorDetail)
def get_corridor(cid: str, weight: int = WeightParam):
    detail = ranking.corridor_detail(cid, weight)
    if not detail:
        raise HTTPException(404, "Corridor not found")
    return detail


@app.get("/api/corridor/{cid}/incidents", response_model=list[Incident])
def get_incidents(cid: str):
    if not any(c["id"] == cid for c in risk_engine.corridors()):
        raise HTTPException(404, "Corridor not found")
    return risk_engine.incidents(cid)


@app.get("/api/pipelines", response_model=list[Pipeline])
def get_pipelines(corridor: str):
    return risk_engine.pipelines(corridor)
