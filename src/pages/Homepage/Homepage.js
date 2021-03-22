import React from 'react'
import Chart from "react-apexcharts";
import "./Homepage.css"
import { getTickerData } from '../../api/api.js'
import {series} from "./tempData.js"
import Search from './tickerSearch.js'
import axios from 'axios'

class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      data: null
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
      xaxis: {
        labels: {
        }
      }
    };
    return (
      <div className="App-header">
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
          height="750px"
        />}
      </div>
    );

  }
}

export default Homepage;