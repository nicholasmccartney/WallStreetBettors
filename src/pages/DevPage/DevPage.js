import { createChart } from "lightweight-charts";
import React, { useState } from "react";
import { makeChart, updateChartData, addSMALine, clearSMA } from "./Chart";

const queryString = require("query-string");
var dayjs = require("dayjs");

class DevPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "SPY",
      chartRef: React.createRef(),
      data: null,
      chart: false,
    };
  }

  getSPY = () => {
    var params = {
      sDate: undefined,
      eDate: undefined,
      interval: "5Min",
      limit: 1000,
    };

    var query = queryString.stringify(params);

    fetch(`/tickerDev/SPY${query !== "" ? "?" + query : ""}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({data: data})
        if (!this.state.chart) {
          makeChart(data, this.state.chartRef)
          this.setState({chart: true})
        } else {
          updateChartData(data);
        }
      });
  };

  getGME = () => {
    var params = {
      sDate: undefined,
      eDate: undefined,
      interval: "5Min",
      limit: 1000,
    };

    var query = queryString.stringify(params);

    fetch(`/tickerDev/GME${query !== "" ? "?" + query : ""}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data: data, chart: true });
        if (!this.state.chart) {
          makeChart(data, this.state.chartRef);
          this.setState({chart: true})
        }
        else updateChartData(data);
      });
  }

  sma = (e) => {
    addSMALine(e.target.value)
  }

  render() {
    return (
      <div className="App-header">
        Dev
        <button onClick={this.getSPY}>Get SPY</button>
        <button onClick={this.getGME}>Get GME</button>
        <button value={50} onClick={this.sma}>SMA 50</button>
        <button value={200} onClick={this.sma}>SMA 200</button>
        <button onClick={clearSMA}>Clear SMA</button>
        <div ref={this.state.chartRef}>
        </div>
      </div>
    );
  }
}

export default DevPage;
