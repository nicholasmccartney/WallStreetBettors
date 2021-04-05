import React from "react";
import DatePicker from "react-datepicker";
import Slider from '@material-ui/core/Slider';
import 'react-datepicker/dist/react-datepicker.css';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      date1: null,
      date2: null,
      limit: 100,
    };
  }

  setTicker = (data) => {
    this.setState({
      ticker: data.target.value.toUpperCase(),
    });
  };

  setDate1 = (data) => {
    this.setState({
      date1: data,
    });
  };

  setDate2 = (data) => {
    this.setState({
      date2: data,
    });
  };

  setLimit = (event, val) => {
    this.setState({
      limit: val
    })
  }

  render() {
    console.log(this.state)
    return (
      <form onSubmit={this.props.onSubmit}>
          <input
            type="text"
            placeholder="Search for a stock ticker"
            value={this.state.ticker}
            onChange={this.setTicker}
          />
          
          <select name="interval" id="1">
            <option value="1Min">1Min</option>
            <option value="5Min">5Min</option>
            <option value="1Hr">1Hr</option>
          </select>

          <DatePicker selected={this.state.date1} 
            onChange={this.setDate1} 
            maxDate= {new Date()} 
            isClearable 
            placeholderText="Choose Start Date"/>

          <DatePicker selected={this.state.date2} 
            onChange={this.setDate2} 
            maxDate= {new Date()} 
            isClearable 
            placeholderText="Choose End Date"/>

          <Slider 
            min={100}
            max={1000}
            defaultValue={100}
            steps={10}
            onChange={this.setLimit}
            marks
            />

        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Search;
