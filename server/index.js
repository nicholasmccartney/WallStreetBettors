var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

const url = require("url");
const querystring = require("querystring");
const Alpaca = require("@alpacahq/alpaca-trade-api");

require("dotenv").config();
var dayjs = require("dayjs");

const intervals = {
  "1Min": 60000,
  "5Min": 300000,
  "15Min": 900000,
  "1D": 86400000,
};

// convert date to unix Math.floor(eDate.getTime() / 1000)
// to find number of candles that will be returned, subract sDate from eDate, divide by 1000, divide by interval = # of candles
// if above 1000, need to make multiple requests
// 



// setting constants for alpaca to use down below if needed
const alpaca = new Alpaca({
  keyId: process.env.REACT_APP_API_KEY,
  secretKey: process.env.REACT_APP_SECRET_API_KEY,
  paper: true,
  usePolygon: false,
});

app.use(cors());

app.get("/ticker/:id", (req, res) => {
  let parsedUrl = url.parse(req.originalUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  //console.log(parsedUrl);
  //console.log(parsedQs);
  var ticker = req.params.id;
  var limit = parsedQs.limit ? parsedQs.limit : "1000";
  var interval = parsedQs.interval ? parsedQs.interval : "1Min"
  var eDate = parsedQs.eDate ? parsedQs.eDate : new Date(); // today
  var sDate = parsedQs.sDate ? parsedQs.sDate : new Date();
  sDate.setFullYear(sDate.getFullYear() - 1);
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

app.listen(3001, () => {
  console.log("Express server running on localhost:3001");
});
