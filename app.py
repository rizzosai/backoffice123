


# --- Clean Flask Backend: Affiliate Backoffice ---
import os
from flask import Flask, request, jsonify, session, make_response, send_from_directory, abort
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'supersecretkey')  # Set this in your .env for production

# --- Minimal CORS after_request handler ---
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin', '*')
    acr_headers = request.headers.get('Access-Control-Request-Headers', 'Content-Type, Authorization')
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Vary'] = 'Origin'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = acr_headers
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# --- Session-based Login ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data.get('username', '')
    password = data.get('password', '')
    # Demo credentials: rizzo / farout
    if username == 'rizzo' and password == 'farout':
        session['logged_in'] = True
        session['username'] = username
        return jsonify({'success': True, 'message': 'Login successful.', 'username': username})
    else:
        session.clear()
        return jsonify({'success': False, 'message': 'Invalid username or password.'}), 401

@app.route('/api/session-check', methods=['GET'])
def session_check():
    if session.get('logged_in'):
        return jsonify({'logged_in': True, 'username': session.get('username')})
    else:
        return jsonify({'logged_in': False}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out.'})

# --- Mock Data for Leaderboard and Recent Joins ---
LEADERBOARD = [
    {"username": "Rizzo", "earnings": 999, "level": "Empire"},
    {"username": "Alex", "earnings": 497, "level": "Empire"},
    {"username": "Sarah", "earnings": 197, "level": "Professional"},
    {"username": "Mike", "earnings": 97, "level": "Starter Tools"},
    {"username": "Jordan", "earnings": 29, "level": "Basic Starter"},
]

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    return jsonify({"leaderboard": LEADERBOARD})

@app.route('/api/recent-joins', methods=['GET'])
def get_recent_joins():
    RECENT_JOINS = [
        {"username": "newuser1", "joined_at": (datetime.utcnow() - timedelta(minutes=2)).isoformat() + "Z"},
        {"username": "newuser2", "joined_at": (datetime.utcnow() - timedelta(minutes=5)).isoformat() + "Z"},
        {"username": "newuser3", "joined_at": (datetime.utcnow() - timedelta(minutes=10)).isoformat() + "Z"},
    ]
    return jsonify({"recent_joins": RECENT_JOINS})

# --- Guides Endpoints ---
GUIDES_DIR = os.path.join(os.path.dirname(__file__), 'guides')

@app.route('/api/guides', methods=['GET'])
def list_guides():
    try:
        guides = []
        for fname in os.listdir(GUIDES_DIR):
            if fname.endswith('.md'):
                title = fname.replace('_', ' ').replace('.md', '').title()
                guides.append({'filename': fname, 'title': title})
        return jsonify({'guides': guides})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/guides/<guide_name>', methods=['GET'])
def get_guide(guide_name):
    if not guide_name.endswith('.md'):
        guide_name += '.md'
    try:
        with open(os.path.join(GUIDES_DIR, guide_name), 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'content': content})
    except FileNotFoundError:
        abort(404)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/guides/download/<guide_name>', methods=['GET'])
def download_guide(guide_name):
    if not guide_name.endswith('.md'):
        guide_name += '.md'
    try:
        return send_from_directory(GUIDES_DIR, guide_name, as_attachment=True)
    except FileNotFoundError:
        abort(404)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- Serve static HTML for login and dashboard ---
@app.route('/login')
def serve_login():
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), 'affiliate_login.html')

@app.route('/dashboard')
def serve_dashboard():
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), 'affiliate_backoffice.html')

if __name__ == '__main__':
    app.run(debug=True)
