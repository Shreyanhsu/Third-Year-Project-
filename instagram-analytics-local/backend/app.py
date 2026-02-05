from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ------------------------
# SIGNUP
# ------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        INSERT INTO users (email, password_hash, created_at)
        VALUES (?, ?, ?)
    """, (
        data["email"],
        data["password"],  # demo-only
        datetime.utcnow().isoformat()
    ))

    db.commit()
    return jsonify({"status": "ok"})


# ------------------------
# LOGIN
# ------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    db = get_db()
    cur = db.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email = ?",
        (data["email"],)
    )

    user = cur.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "email": user["email"],
        "user_id": user["id"]
    })


# ------------------------
# CREATE SESSION
# ------------------------
@app.route("/api/session", methods=["POST"])
def create_session():
    data = request.json
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        INSERT INTO sessions (
            user_id, input_caption, input_hashtags,
            input_category, created_at
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["user_id"],
        data["caption"],
        data["hashtags"],
        data["category"],
        datetime.utcnow().isoformat()
    ))

    db.commit()
    session_id = cur.lastrowid
    return jsonify({"session_id": session_id})


if __name__ == "__main__":
    app.run(debug=True)
