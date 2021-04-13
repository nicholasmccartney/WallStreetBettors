import { createChart } from "lightweight-charts";
import React, { useState } from "react";

const queryString = require("query-string");
var dayjs = require("dayjs");

//function dp() {
//
//  const [data, setData] = useState("");
//  const chartRef = React.createRef()
//
//  var ticker = "GME";
//
//  if (data === null) {
//    var params = {
//      sDate: undefined,
//      eDate: undefined,
//      interval: "5Min",
//      limit: 100,
//    };
//
//    var query = queryString.stringify(params);
//
//    fetch(`/tickerDev/${ticker}${query !== "" ? "?" + query : ""}`)
//      .then((res) => res.json())
//      .then((data) => {
//          console.log(data)
//        setData(data);
//      });
//  }
//
//  console.log(chartRef.current)
//
//  return (
//      <div className="App-header" ref={chartRef}>
//            {ticker}
//      </div>
//  )
//
//}

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
        var candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(this.state.data)


  }

  getData = () => {
    var params = {
      sDate: undefined,
      eDate: undefined,
      interval: "1D",
      limit: 350,
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
