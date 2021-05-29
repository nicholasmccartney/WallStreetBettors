import flask
import os
from flask import json
import requests
from datetime import datetime
from flask import request, jsonify
from dotenv import load_dotenv
from binance import Client
import alpaca_trade_api as tradeapi

#Day, Hour, Minute, Sec

load_dotenv()

BINANCE_API_KEY = os.getenv('BINANCE_API_KEY')
BINANCE_API_SECRET = os.getenv('BINANCE_SECRET_KEY')

APCA_API_KEY_ID='AKXVRITHH5YYDSRZCL6J'
APCA_API_SECRET_KEY='Peznnjiahcec21GzxzX8djPRuxWGjWoS5UaA0P4v'

client = Client(BINANCE_API_KEY, BINANCE_API_SECRET)
alpacaData = tradeapi.REST(APCA_API_KEY_ID, APCA_API_SECRET_KEY, 'https://api.alpaca.markets', api_version="v2")
alpacaAccount = tradeapi.REST(APCA_API_KEY_ID, APCA_API_SECRET_KEY, 'https://paper-api.alpaca.markets', api_version="v2")

app = flask.Flask(__name__)
app.config["DEBUG"] = True

def getParam(qp, param, default = None):
    """
    Takes query params and finds the requested item or returns default.
    """
    return qp.get(param) if qp.get(param) != None else default

@app.route('/ticker', methods=['GET'])
def ticker():
    """
    Endpoint to fetch market data for a ticker and other params from UI search.
    """
    qp = request.args
    id = qp.get('id')
    limit = getParam(qp, 'limit', 10)
    interval = getParam(qp, 'interval', '15Min')
    eDate = getParam(qp, 'eDate')
    sDate = getParam(qp, 'sDate')
    
    data = alpacaData.get_barset(id, interval, limit=limit)._raw.get(id)
    data = [{
        'x': datetime.fromtimestamp(candle['t']).strftime("MM/DD hh:mm"), 
        'y': [
            candle['o'],
            candle['h'],
            candle['l'],
            candle['c']
        ]} for candle in data]

    return jsonify(data)

@app.route('/marketStatus', methods=['GET'])
def marketStatus():
    """
    Fetch the stock market open status. Returns status, next open/close.
    """
    clock = alpacaData.get_clock()._raw
    return jsonify(clock)

@app.route('/watchlist')
def watchlist():
    """
    Fetch all watchlist tickers for an account.
    """
    qp = request.args
    tickers  = qp.get('tickers')
    watchlistData = alpacaData.get_barset(tickers, '1Min', limit=1)._raw
    data = []
    for ticker, candle in watchlistData.items():
        data.append({
            'ticker': ticker,
            'price': candle[0]['c'],
            'delta': candle[0]['c'] - candle[0]['o']
        })
    return jsonify(data)

@app.route('/exchanges')
def exchanges():
    """
    Fetch the exchanges for tickers on watchlist. 
    Currently doesnt support crypto
    """

    qp = request.args
    tickers = qp.get('tickers').split(',')

    assets = alpacaAccount.list_assets()
    myAssets = [x for x in assets if x.symbol in tickers]
    myAssets = [f"{x.exchange}:{x.symbol}" for x in myAssets]

    return jsonify(myAssets)

app.run()