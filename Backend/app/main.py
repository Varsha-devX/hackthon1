from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from .database import engine, Base
from .routes import auth, courses, quiz
import logging

app = FastAPI(title="Quiz App API", version="1.0.0")

# CORS middleware configuration - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fix_sqlite_schema():
    if "sqlite" not in str(engine.url):
        return

    insp = inspect(engine)
    if "user_scores" in insp.get_table_names():
        columns = [c["name"] for c in insp.get_columns("user_scores")]
        if "time_taken" not in columns:
            logging.warning("Adding missing 'time_taken' column to user_scores")
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE user_scores ADD COLUMN time_taken INTEGER DEFAULT 0"))
                conn.commit()


@app.on_event("startup")
def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        fix_sqlite_schema()
        logging.info("Database tables created successfully.")
    except Exception as exc:
        logging.exception("Database initialization failed - app is starting but may be unusable.")


@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(courses.router, prefix="/courses", tags=["Courses"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Quiz App API"}
