from flask import Flask, request, jsonify
from flask_cors import CORS
from geiger import claim_payment

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        request_data = request.get_json()
        if request_data and 'address' in request_data:
            address = request_data['address']
            try:
                tx = claim_payment(address)
                if tx is None:
                    return jsonify({"error": "No receipt returned"}), 500
                transaction_hash = {
                    "transaction_hash": tx.hex(),
                }
                return jsonify(transaction_hash), 200
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        else:
            return jsonify({"error": "No address provided"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)