


# ...existing code...


# ...existing code...

import os
import traceback
import json
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)
CORS(app)

# Set your OpenAI API key and org ID from environment variables (now loaded from .env)
openai_api_key = os.environ.get('OPENAI_API_KEY')
openai_org_id = os.environ.get('OPENAI_ORG_ID')

@app.route('/api/coey-chat', methods=['POST'])
def coey_chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'reply': "Please enter a question."}), 400
    try:
        # 1. Check for custom answers (exact match, case-insensitive)
        custom_path = os.path.join(os.path.dirname(__file__), 'coey_custom_answers.json')
        if os.path.exists(custom_path):
            try:
                with open(custom_path, 'r', encoding='utf-8') as f:
                    custom_qa = json.load(f)
                for qa in custom_qa:
                    if qa.get('question', '').strip().lower() == user_message.strip().lower():
                        return jsonify({'reply': qa.get('answer', '')}), 200
            except Exception as e:
                print('Error reading custom answers:', e)

        # 2. Custom logic for marketing question (legacy, fallback)
        if 'how do i market rizzosai' in user_message.lower():
            stripe_connected = data.get('stripe_connected', False)
            if not stripe_connected:
                reply = (
                    "To market RizzosAI, you first need to connect your Stripe account. "
                    "Please complete the 'Connect Stripe Account' step in your dashboard. "
                    "[Stripe Setup Guide](https://dashboard.stripe.com/register)\n\n"
                    "Once that's done, I'll show you the full marketing guide!"
                )
                return jsonify({'reply': reply, 'showGuide': 'stripe'}), 200
            else:
                reply = (
                    "Great! Now that your Stripe account is connected, check out our full marketing guide here: "
                    "[RizzosAI Marketing Guide](https://rizzosai.com/marketing-guide)\n\n"
                    "If you've finished this guide, you can mark it as done and revisit it anytime from the Guides section."
                )
                return jsonify({'reply': reply, 'showGuide': 'marketing'}), 200

        # 3. Default: Use OpenAI
        client = openai.OpenAI(api_key=openai_api_key, organization=openai_org_id)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are Coey, a helpful, friendly assistant for affiliate marketers. Answer clearly and simply."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=400,
            temperature=0.7
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({'reply': reply})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'reply': f"Sorry, there was an error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
