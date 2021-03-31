import React from 'react'
import Chart from "react-apexcharts";
import "./Homepage.css"
import { getTickerData } from '../../api/api.js'
import {series} from "./tempData.js"
import Search from './tickerSearch.js'

const queryString = require("query-string")
var dayjs = require("dayjs");

class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      data: null
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
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
      this.setState({data: data})
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
          formatter: function (val) {
            return `$${val.toFixed(2)}`;
          },
        },
      },
    };
    console.log(this.state.data)
    return (
      <div className="App-header">
        <br/>
        <Search onSubmit={this.handleSubmit}/>
        <br/>
        {this.state.data !== null && 
        <Chart
          options={options}
          series={[
            {
              data: this.state.data
            }
          ]}
          type="candlestick"
          className="candlestickchart"
          width="1200px"
          height="700px"
        />}
      </div>
    );

  }
}

export default Homepage;