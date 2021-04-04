var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
const axios = require("axios");

var app = express();
const Alpaca = require("@alpacahq/alpaca-trade-api");

require("dotenv").config();

// setting constants for alpaca to use down below if needed
const alpaca = new Alpaca({
  keyId: process.env.REACT_APP_API_KEY,
  secretKey: process.env.REACT_APP_SECRET_API_KEY,
  paper: true,
  usePolygon: false,
});

app.use(cors())
//app.use(bodyParser.urlencoded({extended: false}));


app.get('/ticker/:id', (req, res) => {
    var ticker = req.params.id;
    // return in this format -> [TimeStamp,O,H,L,C]
    var eDate = new Date(); // today
    var sDate = new Date();
    sDate.setFullYear(sDate.getFullYear() - 1);
    //eDate = Math.floor(eDate.getTime() / 1000)
    //sDate = Math.floor(sDate.getTime() / 1000)
    var formattedData = [];

    alpaca
      .getBars("5Min", ticker, {
        start: sDate,
        end: eDate,
        limit: 100
      })
      .then((data) => {
        console.log(data)
        //data[ticker].map((candle) => {
        //  formattedData.push([
        //    new Date(candle["startEpochTime"] * 1000).toLocaleString(),
        //    candle["openPrice"],
        //    candle["highPrice"],
        //    candle["lowPrice"],
        //    candle["closePrice"],
        //  ]);
        //});
        data[ticker].map((candle) => {
          formattedData.push({
            x: new Date(candle["startEpochTime"] * 1000).toLocaleString(),
            y: [candle["openPrice"], candle["highPrice"], candle["lowPrice"], candle["closePrice"]]
          })
        })
        //console.log(formattedData)
        res.json(formattedData)
      });
})

app.listen(3001, () => {
    console.log('Express server running on localhost:3001')
})