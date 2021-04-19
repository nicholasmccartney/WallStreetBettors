import { createChart } from "lightweight-charts";
import React, { useState } from "react";

const queryString = require("query-string");
var dayjs = require("dayjs");

class DevPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "SPY",
      chartRef: React.createRef(),
      data: null,
      chart: null,
    };
  }

  makeChart = () => {
      console.log(this.state.data)
        var chart = createChart(this.state.chartRef.current, {width: 1000, height: 750});
        chart.timeScale().fitContent()
        var candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(this.state.data)


  }

  getData = () => {
    var params = {
      sDate: undefined,
      eDate: undefined,
      interval: "1D",
      limit: 1000,
    };

    var query = queryString.stringify(params);

    fetch(`/tickerDev/${this.state.ticker}${query !== "" ? "?" + query : ""}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({data: data})
        this.makeChart();
      });
  };

  render() {
    return (
      <div className="App-header" ref={this.state.chartRef}>
        Dev
        {!this.state.data && (
            <button onClick={this.getData}>Get Data</button>
        )}

      </div>
    );
  }
}

export default DevPage;
