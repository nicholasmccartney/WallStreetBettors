var express = require("express");
var cors = require("cors");
var app = express();

const url = require("url");
const querystring = require("querystring");
const Alpaca = require("@alpacahq/alpaca-trade-api");
const axios = require('axios')

require("dotenv").config();
var dayjs = require("dayjs");

const strategies = []

// setting constants for alpaca to use down below if needed
const alpaca = new Alpaca({
  keyId: process.env.REACT_APP_API_KEY,
  secretKey: process.env.REACT_APP_SECRET_API_KEY,
  paper: true,
  usePolygon: false,
});

const alpacaV2 = axios.create({
  baseURL: "https://data.alpaca.markets/v2",
  headers: {
    "APCA-API-KEY-ID": "AKBEZOXNBF3AM560AA2G",
    "APCA-API-SECRET-KEY": "M9fx3FNwyHclSWcrcZudKHMgp6Gc8FiYTUspF5Pg",
  },
});

const binance = axios.create({
  baseURL: "https://api.binance.us/api/v3",
});

const intervals = {
  "1m": 60000,
  "5m": 300000,
  "15Min": 900000,
  "1D": 86400000,
};

class Strategy {
  constructor(ticker, interval, type) {
    this.ticker = ticker;
    this.interval = interval;
    this.type = type;
    this.strat = this.initiate(ticker, interval, type)
    this.data = [];
  }

  get data() {
    return this._data
  }

  set data(data) {
    if (data.length == 1) {
      this._data = this._data.concat(data)
    } else {
      this._data = data;
    }
  }

  initiate(ticker, interval, type){
    if (type === "crypto") {
      var params = {
        symbol: ticker,
        interval: interval,
        limit: 10,
      };
      var query = querystring.stringify(params);
      binance
        .get(`/klines${query !== "" ? "?" + query : ""}`)
        .then(res => {
          var data = res.data;
          console.log("strategy created")
          this.data = data
          return setInterval(SMA2050Stragey, 60000, ticker, interval, type, this)
        })
        .catch((e) => console.log(e));
    }
  }
}

function SMA2050Stragey(ticker, interval, type, strat) {
  if (type==="crypto"){
    var params = {
      symbol: ticker,
      interval: interval,
      limit: 1,
    };
    var query = querystring.stringify(params);
    binance.get(`/klines${query !== "" ? "?" + query : ""}`)
    .then(res => {
      console.log("stratsetdata");
      var data = res.data
      strat.data = data
    });
  }
}

app.use(cors());

app.get("/ticker/:id", (req, res) => {
  let parsedUrl = url.parse(req.originalUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  console.log(parsedUrl);
  console.log(parsedQs);
  var ticker = req.params.id;
  var limit = parsedQs.limit ? parsedQs.limit : "1000";
  var interval = parsedQs.interval ? parsedQs.interval : "1Min"
  var eDate = parsedQs.eDate ? new Date(parsedQs.eDate) : null;
  var sDate = parsedQs.sDate ? new Date(parsedQs.sDate) : null;
  var formattedData = [];

  alpaca
    .getBars(interval, ticker, {
      start: sDate,
      end: eDate,
      limit: limit,
    })
    .then((data) => {
      data[ticker].map((candle) => {
        formattedData.push({
          x: dayjs(candle["startEpochTime"]*1000).format("MM/DD hh:mm"),
          y: [
            candle["openPrice"],
            candle["highPrice"],
            candle["lowPrice"],
            candle["closePrice"],
          ],
        });
      });
      console.log(formattedData)
      res.json(formattedData);
    });
});

app.get("/watchlist", (req, res) => {
  let parsedUrl = url.parse(req.originalUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  let tickers = parsedQs.tickers
  let tickersList = tickers.split(',').map(x=>x)
  var formattedData = []
  alpaca.getBars("1Min", tickers, {
    limit: 1
  }).then((data) => {
    tickersList.map((ticker) => {
      let tData = data[ticker][0]
      formattedData.push({
        ticker: ticker,
        price: tData.closePrice,
        delta: tData.closePrice - tData.openPrice
      });
    });
    console.log(formattedData)
    res.json(formattedData)
  });
});

app.get("/marketStatus", (req, res) =>  {
  alpaca 
    .getClock()
    .then((clock) => {
      res.json(clock);
    })
});

app.get("/tickerDev/:id", (req, res) => {
  let parsedUrl = url.parse(req.originalUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  console.log(parsedUrl);
  console.log(parsedQs);
  var ticker = req.params.id;
  var limit = parsedQs.limit ? parsedQs.limit : "1000";
  var interval = parsedQs.interval ? parsedQs.interval : "1Min";
  var eDate = parsedQs.eDate ? new Date(parsedQs.eDate) : null;
  var sDate = parsedQs.sDate ? new Date(parsedQs.sDate) : null;
  var formattedData = [];

  alpaca
    .getBars(interval, ticker, {
      start: sDate,
      end: eDate,
      limit: limit,
    })
    .then((data) => {
      data[ticker].map((candle) => {
        formattedData.push({
          time: candle["startEpochTime"],
          open: candle["openPrice"],
          high: candle["highPrice"],
          low: candle["lowPrice"],
          close: candle["closePrice"],
        });
      });
      console.log(formattedData);
      res.json(formattedData);
    });
}) 

app.get("/tickerDevV2/:id", (req, res) => {
  let parsedUrl = url.parse(req.originalUrl);
  let parsedQs = querystring.parse(parsedUrl.query);

  console.log(parsedQs)

  var ticker = req.params.id;
  var limit = parsedQs.limit ? parsedQs.limit : "1000";
  var timeframe = parsedQs.interval ? parsedQs.interval : "1Min";
  var eDate = dayjs('2021-04-12').format();
  var sDate = dayjs('2017-01-01').format();

  var params = {
    limit: limit,
    timeframe: timeframe,
    start: sDate,
    end: eDate
  }

  var formattedData = [];

  ///v2/stocks/{symbol}/bars
  //axios.get(`https://data.alpaca.markets/v2/${ticker}/bars${parsedUrl}`, {
  //  headers: {
  //    "APCA-API-KEY-ID": "AKBEZOXNBF3AM560AA2G",
  //    "APCA-API-SECRET-KEY": "M9fx3FNwyHclSWcrcZudKHMgp6Gc8FiYTUspF5Pg",
  //  },
  //})
  //.then(res => res.json())
  //.then(data => {
  //  console.log(data)
  //});

  alpacaV2
    .get(`/stocks/${ticker}/bars`, {
      params: params,
    })
    .then((data) => {
      res.json(data['data'])
    })
    .catch((e) => {
      console.log(e);
    });

})

app.get("/strategy", (req, res) => {
  try {
    strategies.push(new Strategy("DOGEUSD","1m","crypto"))
    return res.status(200)
  } catch (e) {
    return res.status(500).send(`Error: ${e}`)
  }
})

app.get("/strategies", (req,res)=>{
  return strategies
})

app.listen(3001, () => {
  console.log("Express server running on localhost:3001");
});
