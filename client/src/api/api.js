//const express = require("express");
const dateFns = require('date-fns');
const format = `yyyy-MM-dd HH:mm:ss`;
const today = new Date();
const Alpaca = require("@alpacahq/alpaca-trade-api");
//const app = express();

//setting constants for alpaca to use down below if needed
const alpaca = new Alpaca({
  keyId: process.env.REACT_APP_API_KEY,
  secretKey: process.env.REACT_APP_SECRET_API_KEY,
  paper: true,
  usePolygon: false,
});

//Documentation on API and available variables you can get
//https://alpaca.markets/docs/api-documentation/api-v2/market-data/alpaca-data-api-v2/historical/ 

//hardcoded variables to get whatever data needed
//var axios = require('axios');
//let stockTicker = 'SPY'; 
//let startDate = '2021-02-03';
//let endDate = '2021-03-07'; 
//let amountOfDataReturned = 1000; //number of data points returned goes up to 10k
//let timeFrame = '1Hour' //this can be 1Min, 1Hour, 1Day

//api call that uses above variables in the GET to get all of the stock ticker data
//var config = {
//  method: 'get',
//  url: `https://data.alpaca.markets/v2/stocks/${stockTicker}/bars?start=${startDate}&end=${endDate}&limit=${amountOfDataReturned}&timeframe=${timeFrame}`,
//  headers: { 
//    'APCA-API-KEY-ID': process.env.API_KEY, 
//    'APCA-API-SECRET-KEY': process.env.SECRET_API_KEY
//  }
//};

//axios is used to ge the data and then print it properly
//axios(config)
//  .then(function (response) {
//    console.log(JSON.stringify(response.data, null, 4));
//  })
//  .catch(function (error) {
//    console.log(error);
//  });



//function to check if market is open or closed
async function checkIfOpen(callback) {
  alpaca 
    .getClock()
    .then((clock) => {
      callback(clock);
    })
}
//checkIfOpen();



//function to check when the market will open on your calendar day
function checkWhenOpenedToday(){
  const date = dateFns.format(today, format)
  alpaca.getCalendar({
    start: date,
    end: date
  }).then((calendars) => {
    console.log(calendars)
  })
}
//checkWhenOpenedToday();




//function to print user account info
function printAccountInfo() {
  const account = alpaca.getAccount();
  console.log(account);
}
//printAccountInfo();


export { checkIfOpen, checkWhenOpenedToday, printAccountInfo };