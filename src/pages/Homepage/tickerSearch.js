import React from "react";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
    };
  }

  setTicker = (data) => {
    this.setState({
      ticker: data.target.value.toUpperCase(),
    });
  };

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
          <input
            type="text"
            placeholder="Search for a stock ticker"
            value={this.state.ticker}
            onChange={this.setTicker}
          />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Search;
