# Motema World 🌍

## Description
This project was made with the intent to increase the pay for cobalt miners so that they can live better lives. One of the major issues we learned when analyzing the problem is that many Congolese miners get exposed to radiation because they cannot afford proper mining equipment. Without protection from the uranium traces in the cobalt mines, these people often leave the mines with traces of radiation.

We turn this lemon to lemonade by enabling them to prove they've been in the mine by proving that they are exposed to radiation. This proof, along with a worldcoin personhood verification, will make them eligible for payment. Those who want to give will install a chrome extension that scans for how much cobalt is used and comes up with a quote for the donation amount. For example, if I buy a mac with x grams of cobalt, I'd pay extra to pay the fair price for that cobalt in ETH. That ETH goes directly to the miners who mined that cobalt; no middle man (except the geiger counter :)). 

Imagine if a miner could quintuple their pay from these direct donations. Their and their families lives could change for the better! 

## Building the application
1) Create a python virtual environment with the dependencies in `requirements.txt`
2) Run the server with:
```bash
python zkml_geiger/server.py
```
3) Run the application with:
```bash
yarn install
yarn run dev
```
and open localhost:3000
4) Create a new miner, then verify the miner
5) Scan the geiger counter with some radioactive material
6) Receive a faucet payment!