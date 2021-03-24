var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

const url = require("url");
const querystring = require("querystring");
const Alpaca = require("@alpacahq/alpaca-trade-api");

require("dotenv").config();

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
  console.log(parsedUrl);
  console.log(parsedQs);
  var ticker = req.params.id;
  var limit = parsedQs.limit ? parsedQs.limit : "5Min"
  var eDate = new Date(); // today
  var sDate = new Date();
  sDate.setFullYear(sDate.getFullYear() - 1);
  var formattedData = [];

  alpaca
    .getBars(limit, ticker, {
      start: sDate,
      end: eDate,
      limit: 100,
    })
    .then((data) => {
      data[ticker].map((candle) => {
        formattedData.push({
          x: new Date(candle["startEpochTime"] * 1000).toLocaleString(),
          y: [
            candle["openPrice"],
            candle["highPrice"],
            candle["lowPrice"],
            candle["closePrice"],
          ],
        });
      });
      res.json(formattedData);
    });
});

app.listen(3001, () => {
  console.log("Express server running on localhost:3001");
});
