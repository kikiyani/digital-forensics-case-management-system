from fastapi import FastAPI
from .database import engine, Base
from .routes import cases, evidence, audit, auth_routes, chain_of_custody
from fastapi.middleware.cors import CORSMiddleware

print("🔥 app/main.py is running 🔥")

app = FastAPI(title="Forensic CMS API")

# create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(cases.router)
app.include_router(evidence.router)
app.include_router(audit.router)
app.include_router(chain_of_custody.router)

@app.get("/health")
def health():
    return {"status": "ok"}
