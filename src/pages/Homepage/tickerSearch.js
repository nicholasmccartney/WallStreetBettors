import React from "react";
import DatePicker from "react-datepicker";
import Slider from '@material-ui/core/Slider';
import 'react-datepicker/dist/react-datepicker.css';

import { styled } from "@material-ui/core/styles";

const MySlider = styled(Slider)({
  color: "red",
  width: "75%"
});

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      startDate: null,
      endDate: null,
      limit: 100,
    };
  }

  setTicker = (data) => {
    this.setState({
      ticker: data.target.value.toUpperCase(),
    });
  };

  setStartDate = (data) => {
    this.setState({
      startDate: data,
    });
  };

  setEndDate = (data) => {
    this.setState({
      endDate: data,
    });
  };

  setLimit = (event, val) => {
    this.setState({
      limit: val
    })
  }

  render() {
    //console.log(this.state)
    return (
      <form className="search" onSubmit={this.props.onSubmit}>
        <div className="search-cont">
          <div className="top-line">
            <input
              className="ticker"
              type="text"
              placeholder="Search for a stock ticker"
              value={this.state.ticker}
              onChange={this.setTicker}
            />
            <select className="interval" id="1">
              <option value="1Min">1Min</option>
              <option value="5Min">5Min</option>
              <option value="15Min">15Min</option>
              <option value="1D">1Day</option>
            </select>

          </div>
          <br />
          <div className="mid-line">
            <DatePicker
              className="start-date"
              selected={this.state.startDate}
              onChange={this.setStartDate}
              maxDate={new Date()}
              placeholderText="Choose Start Date"
              filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
            />
            <DatePicker
              className="end-date"
              selected={this.state.endDate}
              onChange={this.setEndDate}
              maxDate={new Date()}
              placeholderText="Choose End Date"
              filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
            />
          </div>
          <br />
            <label for="slider">Candle Limit: {this.state.limit}</label>
            <MySlider
              min={50}
              max={1000}
              defaultValue={100}
              step={50}
              onChange={this.setLimit}
              marks
              id="slider"
            />
          <input type="submit" value="Search" className="submit"/>
        </div>
      </form>
    );
  }
}

export default Search;
