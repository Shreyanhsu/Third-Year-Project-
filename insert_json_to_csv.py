import json
import csv
import os
import re

CSV_FILE = "Instagram Data - Sheet1.csv"
JSON_FILE = "Leishapatidarrr.json"   # <-- rename your JSON file accordingly

FIELDNAMES = [
    "Scrape version",
    "scrape_phase",
    "creator_username",
    "niche",
    "post_id",
    "post_url",
    "post_type",
    "posted_at",
    "scraped_at",
    "caption",
    "hashtags",
    "hashtag_count",
    "views",
    "likes",
    "comments_count",
    "shares",
    "scrape_mode"
]

# -------------------------------------------------
# HELPERS
# -------------------------------------------------

def clean_text(value):
    """Remove invalid control characters but keep emojis."""
    if not isinstance(value, str):
        return value
    return re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", "", value)


def load_existing_post_ids(csv_file):
    post_ids = set()

    if not os.path.exists(csv_file):
        return post_ids

    with open(csv_file, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("post_id"):
                post_ids.add(row["post_id"])

    return post_ids


def normalize_record(record):
    """Normalize one post object into CSV-ready row."""
    return {
        "Scrape version": record.get("Scrape version", "1.0"),
        "scrape_phase": record.get("scrape_phase"),
        "creator_username": record.get("creator_username"),
        "niche": record.get("niche"),
        "post_id": record.get("post_id"),
        "post_url": record.get("post_url"),
        "post_type": record.get("post_type"),
        "posted_at": record.get("posted_at"),
        "scraped_at": record.get("scraped_at"),
        "caption": clean_text(record.get("caption")),
        "hashtags": "|".join(record.get("hashtags", [])),
        "hashtag_count": record.get("hashtag_count"),
        "views": record.get("views"),
        "likes": record.get("likes"),
        "comments_count": record.get("comments_count"),
        "shares": record.get("shares"),
        "scrape_mode": record.get("scrape_mode")
    }

# -------------------------------------------------
# MAIN FUNCTION
# -------------------------------------------------

def insert_json_into_csv():

    # Load JSON safely
    with open(JSON_FILE, "r", encoding="utf-8", errors="ignore") as f:
        raw_text = f.read()

    json_data = json.loads(raw_text)

    if not isinstance(json_data, list):
        raise ValueError("JSON file must contain a LIST of post objects")

    existing_post_ids = load_existing_post_ids(CSV_FILE)
    new_rows = []

    for record in json_data:
        post_id = record.get("post_id")

        if not post_id:
            continue

        if post_id in existing_post_ids:
            continue

        new_rows.append(normalize_record(record))

    if not new_rows:
        print("⚠️ No new records to insert.")
        return

    file_exists = os.path.exists(CSV_FILE)

    with open(CSV_FILE, "a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)

        if not file_exists:
            writer.writeheader()

        writer.writerows(new_rows)

    print(f"✅ Inserted {len(new_rows)} new records into {CSV_FILE}")

# -------------------------------------------------

if __name__ == "__main__":
    insert_json_into_csv()
