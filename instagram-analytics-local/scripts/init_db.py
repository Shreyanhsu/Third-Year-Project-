import sqlite3
import pandas as pd
from pathlib import Path

# ==================================================
# Paths
# ==================================================
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "db" / "instagram_analytics.db"
CSV_PATH = BASE_DIR / "data" / "Instagram Data - Sheet1.csv"

# Ensure DB directory exists
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

# ==================================================
# Connect to SQLite
# ==================================================
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# ==================================================
# Create Tables
# ==================================================

# Users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);
""")

# Sessions table
cursor.execute("""
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    input_caption TEXT,
    input_hashtags TEXT,
    input_category TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
""")

# Posts table
cursor.execute("""
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_username TEXT,
    niche TEXT,
    post_id TEXT,
    post_url TEXT,
    post_type TEXT,
    posted_at TEXT,
    caption TEXT,
    hashtags TEXT,
    hashtag_count INTEGER,
    views INTEGER,
    likes TEXT,
    comments TEXT,
    shares INTEGER,
    scrape_mode TEXT
);
""")

conn.commit()
print("✅ Tables created successfully")

# ==================================================
# Load CSV (robust for Excel / Windows / emojis)
# ==================================================
if not CSV_PATH.exists():
    raise FileNotFoundError(f"CSV not found at {CSV_PATH}")

try:
    df = pd.read_csv(
        CSV_PATH,
        encoding="utf-8",
        engine="python"
    )
except UnicodeDecodeError:
    df = pd.read_csv(
        CSV_PATH,
        encoding="latin1",
        engine="python"
    )

print(f"📄 Loaded CSV with {len(df)} rows")

# ==================================================
# Normalize NULL values
# ==================================================
def normalize_null(value):
    if pd.isna(value):
        return None
    value = str(value).strip()
    if value.lower() == "null" or value == "":
        return None
    return value

# ==================================================
# Prepare records for insertion
# ==================================================
records = []

for _, row in df.iterrows():
    records.append((
        normalize_null(row.get("creator_username")),
        normalize_null(row.get("niche")),
        normalize_null(row.get("post_id")),
        normalize_null(row.get("post_url")),
        normalize_null(row.get("post_type")),
        normalize_null(row.get("posted_at")),
        normalize_null(row.get("caption")),
        normalize_null(row.get("hashtags")),
        normalize_null(row.get("hashtag_count")),
        None,  # views intentionally NULL (not scraped yet)
        normalize_null(row.get("likes")),
        normalize_null(row.get("comments")),
        None,  # shares intentionally NULL
        normalize_null(row.get("scrape_mode")),
    ))

# ==================================================
# Insert data into posts table
# ==================================================
cursor.executemany("""
INSERT INTO posts (
    creator_username,
    niche,
    post_id,
    post_url,
    post_type,
    posted_at,
    caption,
    hashtags,
    hashtag_count,
    views,
    likes,
    comments,
    shares,
    scrape_mode
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
""", records)

conn.commit()
print(f"✅ Inserted {len(records)} posts into database")

# ==================================================
# Close connection
# ==================================================
conn.close()
print("🎉 Database setup complete")
