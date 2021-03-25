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
  console.log(data)
  console.log(arr)
  return arr;
}

class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      data: null,
      sma: null,
      sma2: null
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
      this.setState({data: data})
      this.state.sma = getSMA(this.state.data,5)
      this.state.sma2 = getSMA(this.state.data,20)
    })
  }
  
  render () {
    var options = {
      chart: {
        id: "candlestick",
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
    return (
      <div className="App-header">
        <Search onSubmit={this.handleSubmit}/>
        <br/>
        {this.state.data !== null && this.state.sma !== null &&
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
          ]}
          type="line"
          className="candlestickchart"
          width="1200px"
          height="750px"
        />}
      </div>
    );

  }
}

export default Homepage;