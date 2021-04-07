import Chart from "react-apexcharts";
import "./Homepage.css"
import { getTickerData } from '../../api/api.js'
import {series} from "./tempData.js"
import Search from './tickerSearch.js'
import React from "react";


const queryString = require("query-string")
var dayjs = require("dayjs");

function getSMA(data, period) {
  var arr = [];
  var value = 0;
  for (var i = 0; i <= data.length - period; i++) {
    if (arr[i - 1]) {
      arr.push({
        x: data[i + period - 1].x,
        y:
          (arr[i - 1].y * period -
            data[i - 1].y[3] +
            data[i + period - 1].y[3]) /
          period,
      });
    } else if(data[i].y[3] !== null) {
      for (var j = i; j < i + period; j++) {
        value += data[j].y[3];
      }
      arr.push({ x: data[i + period - 1].x, y: value / period });
      value = 0;
    }
  }
  var length = arr.length + 1
  console.log(length + " " + period)
  for (var i = 0; i < 101 - length ; i++) {
    arr.unshift({ x: "undefined", y: null });
  }
  return arr;
}

function getCandleEMA(data, period) {
  var multiplier = 2 / (1 + period);
  var ema = getSMA(data, period);
  for (var i = period - 1; i < data.length; i++) {
    if (ema[i - 1].y) {
      ema[i].y = (data[i].y[3] - ema[i - 1].y) * multiplier + ema[i - 1].y;
    }
  }
  return ema;
}

function linetocandle(data){
  var candledata = [];
  for(var i = 0; i <data.length; i++){
    candledata.push({
      x: data[i].x,
      y: [null,null,null,data[i].y]
    })
  }
  return candledata;
}

function getMACD(data, period1, period2){
  var macd = [];
  var greater = period1 > period2 ? period1 : period2
  var ema26 = getCandleEMA(data,period1)
  var ema12 = getCandleEMA(data,period2)
  for(var i = 0; i < greater; i++){
    macd.push({
      x:data[i].x,
      y:null
    })
  }
  for(var i = greater; i < data.length; i++){
    macd.push({x:ema26[i].x,y:ema12[i].y - ema26[i].y})
  }
  return macd;
}

function getHistogram(data1, data2) {
  var histData = [];
  for(var i = 0; i < data1.length;i++){
    if(data1[i].y !== null && data2[i].y !== null){
      histData.push({
        x:data1[i].x,
        y:data1[i].y - data2[i].y,
      })
    } else{
      histData.push({
        x: "undefined",
        y: null
      })
    }
  }
  return histData
}

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      data: null,
      sma: null,
      sma2: null,
      macd: null,
      signal: null,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    var ticker = event.target[0].value;
    var params = {
      sDate: undefined,
      eDate: undefined,
      interval: "5Min",
      limit: 100,
    };

    var query = queryString.stringify(params);

    fetch(`/ticker/${ticker}${query !== "" ? "?" + query : ""}`)
    .then(res => res.json())
    .then(data => {
      this.setState({
          data: data,
          sma: getSMA(data, 5),
          sma2: getSMA(data, 20),
          macd: getMACD(data,26,12),
          signal: getSMA(linetocandle(getMACD(data,26,12)),9)
        })
    })
  }
  
  render () {
    var options = {
      chart: {
        group: "combine",
        id: "candlestick",
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#000000"],
          },
          // The reason for the if else is that sometiems val returns null
          // This could cause the 'toFixed' (built in round) to fail as its cant round null
          // which would crash
          formatter: function (val) {
            if(val === null){
              return val;
            }else{
              return `$${val.toFixed(2)}`;
            }
          },
          minWidth: 40
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
      },
      markers: {
        size: .5,
      },
      stroke: {
        width: [1, 5, 5],
      },
    };

    return (
      <div className="App-header">
        <Search onSubmit={this.handleSubmit} />
        <br />
        {this.state.data !== null &&
          this.state.sma !== null && (
            <div>
              <Chart
                options={options}
                series={[
                  {
                    name: "close",
                    type: "candlestick",
                    data: this.state.data,
                  },
                  {
                    name: "sma5",
                    type: "line",
                    data: this.state.sma,
                  },
                  {
                    name: "sma20",
                    type: "line",
                    data: this.state.sma2,
                  },
                ]}
                className="candlestickchart"
                width="1200px"
                height="750px"
              />
              <br />
              <Chart
                options={{
                  chart: {
                    group: "combine",
                    id: "macd",
                    type: "line",
                  },
                  yaxis: {
                    labels: {
                      minWidth: 40
                    }
                  },
                  markers: {
                    size: .5,
                  },
                  stroke: {
                    width: [2,2],
                  },
                  plotOptions: {
                    bar: {
                      colors: {
                        ranges: [{
                          from: -1000,
                          to: 0,
                          color: '#de0408'
                        }, {
                          from: 0,
                          to: 1000,
                          color: '#1bfa44'
                        }]
                      }
                    }
                  },
                  stroke: {
                    width: [2,2,0],
                  }
                }}
                series={[
                  {
                    name: "macd",
                    type: "line",
                    data: this.state.macd,
                  },
                  {
                    name: "signal",
                    type: "line",
                    data: this.state.signal,
                  },
                  {
                    name:"test",
                    type: "bar",
                    data: getHistogram(this.state.macd, this.state.signal)
                  },
                ]}
                className = "macdchart"
                height = "300px"
              />
            </div>
          )}
      </div>
    );
  }
}

export default Homepage;
