import stripe
# --- Stripe Webhook: Mark user as paid ---
@app.route('/api/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    if not webhook_secret:
        return 'Webhook secret not set', 500
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except Exception as e:
        return str(e), 400

    if event['type'] == 'checkout.session.completed':
        session_obj = event['data']['object']
        user_email = session_obj.get('customer_email')
        if user_email:
            with sqlite3.connect(DB_PATH) as conn:
                c = conn.cursor()
                c.execute('UPDATE users SET paid=1 WHERE email=?', (user_email,))
                conn.commit()
    return '', 200
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
# --- SQLite Setup ---
DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0,
            paid INTEGER DEFAULT 0
        )''')
        conn.commit()

init_db()
# --- User Registration ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    is_admin = int(data.get('is_admin', 0))
    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'All fields required.'}), 400
    pw_hash = generate_password_hash(password)
    try:
        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()
            c.execute('INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
                      (username, email, pw_hash, is_admin))
            conn.commit()
        return jsonify({'success': True, 'message': 'Registration successful.'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username or email already exists.'}), 409
# --- User Login (with admin code for admins) ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data.get('username', '').strip()
    password = data.get('password', '')
    admin_code = data.get('admin_code', '')
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute('SELECT id, password_hash, is_admin, paid FROM users WHERE username = ?', (username,))
        row = c.fetchone()
        if not row:
            return jsonify({'success': False, 'message': 'Invalid username or password.'}), 401
        user_id, pw_hash, is_admin, paid = row
        if not check_password_hash(pw_hash, password):
            return jsonify({'success': False, 'message': 'Invalid username or password.'}), 401
        # Admin login: require admin_code
        if is_admin:
            expected_code = os.environ.get('ADMIN_SECRET_CODE', 'letmein')
            if admin_code != expected_code:
                return jsonify({'success': False, 'message': 'Admin code required or incorrect.'}), 403
        else:
            if not paid:
                return jsonify({'success': False, 'message': 'Payment required. Please complete your purchase.'}), 403
        session['logged_in'] = True
        session['username'] = username
        session['is_admin'] = bool(is_admin)
        return jsonify({'success': True, 'message': 'Login successful.', 'username': username, 'is_admin': bool(is_admin)})
# --- Password Reset (send email logic not implemented) ---
@app.route('/api/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json(force=True)
    email = data.get('email', '').strip().lower()
    # Here you would generate a reset token and send an email
    # For now, just return success for demo
    return jsonify({'success': True, 'message': 'If this email exists, a reset link will be sent.'})
import requests
# --- Example: Securely load Namecheap API credentials from environment variables ---
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
# --- AI Chat Endpoint ---
@app.route('/api/ai-chat', methods=['POST'])
def ai_chat():
    data = request.get_json(force=True)
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided.'}), 400
    if not OPENAI_API_KEY:
        return jsonify({'error': 'OpenAI API key not set.'}), 500
    # Call OpenAI API (GPT-3.5 Turbo)
    try:
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {'role': 'system', 'content': 'You are a helpful AI assistant for affiliate marketers.'},
                {'role': 'user', 'content': user_message}
            ],
            'max_tokens': 300
        }
        resp = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload, timeout=20)
        resp.raise_for_status()
        result = resp.json()
        ai_reply = result['choices'][0]['message']['content'].strip()
        return jsonify({'reply': ai_reply})
    except Exception as e:
        return jsonify({'error': f'AI request failed: {str(e)}'}), 500



# --- Clean Flask Backend: Affiliate Backoffice ---

import os
from flask import Flask, request, jsonify, session, make_response, send_from_directory, abort
from datetime import datetime, timedelta
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'supersecretkey')  # Set this in your .env for production

# --- Secure CORS for production ---
# Only allow requests from your frontend domains
CORS(app, origins=[
    "https://rizzosai.com",
    "https://www.rizzosai.com",
    "https://backoffice.rizzosai.com"
], supports_credentials=True)

# --- Example: Securely load Namecheap API credentials from environment variables ---
NAMECHEAP_API_USER = os.environ.get('NAMECHEAP_API_USER')
NAMECHEAP_API_KEY = os.environ.get('NAMECHEAP_API_KEY')


## Removed manual CORS handler; using Flask-CORS for security and simplicity

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

# --- Render Deployment Notes ---
# 1. Add your environment variables (NAMECHEAP_API_USER, NAMECHEAP_API_KEY, SECRET_KEY) in the Render dashboard under Environment.
# 2. Flask-CORS is now used for secure CORS. Adjust the origins list if you add more frontend domains.
# 3. Never commit secrets to your codebase. Always use environment variables for API keys and credentials.
