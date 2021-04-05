import React from 'react'
import Chart from "react-apexcharts";
import "./Homepage.css"
import { getTickerData } from '../../api/api.js'
import {series} from "./tempData.js"
import Search from './tickerSearch.js'
import axios from 'axios'

function getSMA(data,period){
  var arr = [];
  var value = 0;
  for(var i = 0; i <= data.length - period; i++){
      if(arr[i-1]){
        arr.push({x:data[i+period-1].x,y:(arr[i-1].y * period - data[i-1].y[3] + data[i+period-1].y[3]) / period})
      } else{
        for(var j = i; j < i+period; j++){
          value += data[j].y[3]
        }
        arr.push({x:data[i+period-1].x,y:(value / period)})
        value = 0
      }
  }
    for(var i = 0; i < period - 1; i++){
      arr.unshift({x:"undefined",y:null})
    }
  return arr;
}

function getEMA(data,period){
  var multiplier = 2/(1+ period)
  var ema = getSMA(data,period);
  for(var i = period - 1; i < data.length; i++){
    if(ema[i-1].y){
      ema[i].y = (data[i].y[3] - ema[i-1].y) * multiplier + ema[i-1].y
    } 
  }
  return ema;
}

class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      data: null,
      sma: null,
      sma2: null,
      ema: null,
      ema2: null
    }
  }

  handleChange = (data) => {
    this.setState({ticker: data.target.value})
  }
  handleSubmit = (event) => {
    event.preventDefault()
    var ticker = event.target[0].value;
    fetch(`/ticker/${ticker}`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        data: data,
        sma: getSMA(data, 5),
        sma2: getSMA(data, 20),
        ema: getEMA(data,5)
        // ema2: getEMA(data,20)
      })
    })
  }
  
  render () {
    var options = {
      chart: {
        id: "candlestick"
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#000000"],
          },
        },
      },
      // xaxis: {
      //   labels: {
      //   },
      // },
      markers:{
        size:1
      },
      stroke: {
        width:[1,5,5]
      },
    };
  
    var optionsBar = {
      chart: {
        height: 160,
        type: 'bar',
        brush: {
          enabled: true,
          target: 'candles'
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date('20 Jan 2017').getTime(),
            max: new Date('10 Dec 2017').getTime()
          },
          fill: {
            color: '#ccc',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
          }
        },
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: '80%',
          colors: {
            ranges: [{
              from: -1000,
              to: 0,
              color: '#F15B46'
            }, {
              from: 1,
              to: 10000,
              color: '#FEB019'
            }],
      
          },
        }
      },
      stroke: {
        width: 0
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          offsetX: 13
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
    console.log(this.state.ema)
    return (
      <div className="App-header">
        <Search onSubmit={this.handleSubmit}/>
        <br/>
        {(this.state.ema !== null && this.state.sma !== null && this.state.ema !== null) &&
        <div> 
        <Chart
          options={options}
          series={[
            {
              name:"close",
              type:"candlestick",
              data: this.state.data
            },
            {
              name:"sma5",
              type:"line",
              data: this.state.sma
            },
            {
              name:"sma20",
              type:"line",
              data: this.state.sma2
            }
            // {
            //   name:"ema5",
            //   type:"line",
            //   data: this.state.ema
            // }
            // },
            // {
            //   name:"ema20",
            //   type:"line",
            //   data: this.state.ema2
            // }
          ]}
          className="candlestickchart"
          width="1200px"
          height="750px"
        />
        <Chart
          options={optionsBar}
          seriesbar={[
          {
            name: 'volume',
            data: this.state.ema
          }
          ]}
        />
        </div>
        }
      </div>
    );

  }
}

export default Homepage;