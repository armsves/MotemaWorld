from flask import Flask, request, jsonify
import asyncio
from geiger import payment


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        address = request.form.get('address')
        if address:
            try:
                receipt = asyncio.run(payment(address))
                if receipt is None:
                    return jsonify({"error": "No receipt returned"}), 500
                transaction_data = {
                    "address": str(address),
                    "transaction_hash": receipt.transactionHash.hex(),
                    "status": receipt.status
                }
                return jsonify(transaction_data), 200
            except Exception as e:
                return jsonify({"error": str(e)}), 500
            
        else:
            return jsonify({"error": "No address provided"}), 400
        
        
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)