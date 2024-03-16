from flask import Flask, request
import asyncio
from geipy import payment


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        address = request.form.get('address')
        if address:
            try:
                receipt = asynchio.run(payment(address))