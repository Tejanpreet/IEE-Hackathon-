"""Quick check that every endpoint answers and matches the schemas. Run: python -m app.smoke"""
from fastapi.testclient import TestClient

from app.main import app

c = TestClient(app)


def check(path: str, expect: int = 200):
    r = c.get(path)
    assert r.status_code == expect, f"{path} → {r.status_code}: {r.text[:200]}"
    print(f"ok  {r.status_code}  {path}")
    return r.json()


health = check("/api/health")
rk = check("/api/ranking?weight=3")
assert len(rk["rows"]) == 15 and rk["rows"][0]["rank"] == 1
first = rk["rows"][0]["id"]
check("/api/ranking?weight=5")
d = check(f"/api/corridor/{first}")
assert sum(d["by_level"].values()) == d["incidents"]
check(f"/api/corridor/{first}/incidents")
check(f"/api/pipelines?corridor={first}")
check("/api/corridor/nope", 404)
print(f"\nAll good. Data source: {health['source']}. Top corridor: {rk['rows'][0]['corridor']} ({rk['rows'][0]['score']}).")
