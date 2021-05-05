import React, { useState } from "react";

const queryString = require("query-string");
var dayjs = require("dayjs");

export default class TradingPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
    }

    makeStrategy = () => {
        fetch(`/strategy`)
        .then(res => {
          if (res.status === 200) {
            alert("Strategy Created!")
          } else {
            alert("Error Creating Strategy")
          }
        })
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
          this.setState({ data: data });
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
          this.setState({ data: data });
        });
    };

    render() {
        return (
            <div>
                Order Ticket
                <button onClick={this.makeStrategy}>Get Data</button>
            </div>
        )
    }
}
