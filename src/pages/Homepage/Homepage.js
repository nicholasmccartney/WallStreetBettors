import Chart from "react-apexcharts";
import "./Homepage.css"
import Search from './tickerSearch.js'
import React from "react";
import { getSMA, getCandleEMA, linetocandle, getMACD, getHistogram, getCross } from './algorithms.js'
import { BounceLoader as Loader } from "react-spinners";

const queryString = require("query-string")
const chartsRef = React.createRef();

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
      annotations:null,
      loading: false,
    };
  }

  //componentDidUpdate() {
  //  this.scrollToChart()
  //}
//
  //scrollToChart = () => {
  //  console.log(chartsRef)
  //  //chartsRef.current.scrollIntoView({ behavior: "smooth" });
  //}

  handleSubmit = (event) => {
    this.setState({signal: null, macd: null, loading: true, ticker: event.target[0].value})
    event.preventDefault();
    var ticker = event.target[0].value;
    var interval = event.target[1].value;
    var sDate = event.target[2].value;
    var eDate = event.target[3].value;
    var limit = event.target[4].value;

    var params = {
      sDate: sDate !== "" ? sDate : undefined,
      eDate: eDate !== "" ? eDate : undefined,
      interval: interval,
      limit: limit,
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
          signal: getSMA(linetocandle(getMACD(data,26,12)),9),
          annotations: getCross(),
          loading: false,
        })
    })
  }
  
  render () {
    var options = {
      chart: {
        group: "combine",
        id: "candlestick",
        redrawOnParentResize: false,
      },
      title: {
        text: this.state.ticker,
        align: "center",
        style: {
          fontSize: '24px',
        }
      },
      annotations: {
        xaxis: this.state.annotations,
      },
      yaxis: {
        decimalsInFloat: 2,
        labels: {
          style: {
            colors: ["#000000"],
          },
          // The reason for the if else is that sometiems val returns null
          // This could cause the 'toFixed' (built in round) to fail as its cant round null
          // which would crash
          formatter: function (val) {
            if (val === null) {
              return val;
            } else {
              return `$${val.toFixed(2)}`;
            }
          },
          minWidth: 40,
          maxWidth: 40,
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
      },
      markers: {
        size: 0.5,
      },
      stroke: {
        width: [1, 5, 5],
      },
    };

    var options2 = {
      chart: {
        group: "combine",
        id: "macd",
        type: "line",
        redrawOnParentResize: false,
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
            if (val === null) {
              return val;
            } else {
              return `${val.toFixed(3)}`;
            }
          },
          minWidth: 40,
        },
      },
      markers: {
        size: 0.5,
      },
      stroke: {
        width: [2, 2],
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: -1000,
                to: 0,
                color: "#de0408",
              },
              {
                from: 0,
                to: 1000,
                color: "#1bfa44",
              },
            ],
          },
        },
      },
      stroke: {
        width: [2, 2, 0],
      },
    };
    return (
      <div className="App-header">
        <br/>
        <Search onSubmit={this.handleSubmit} />
        <br />
        {this.state.loading && (
          <div>
            <div className="loaders">
              <Loader size={25} margin={2} color={"red"} />
              <Loader size={50} margin={2} />
              <Loader size={25} margin={2} color="white" />
            </div>
            Loading...
          </div>
        )}
        {this.state.data !== null &&
          this.state.sma !== null &&
          this.state.macd !== null &&
          this.state.signal !== null && (
            <div className="chart-container" ref={chartsRef}>
              <Chart
                options={options}
                series={[
                  {
                    name: "candle",
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
                height="700"
              />
              <Chart
                options={options2}
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
                    name: "test",
                    type: "bar",
                    data: getHistogram(this.state.macd, this.state.signal),
                  },
                ]}
                className="macdchart"
                height="200px"
              />
            </div>
          )}
      </div>
    );
  }
}

export default Homepage;
