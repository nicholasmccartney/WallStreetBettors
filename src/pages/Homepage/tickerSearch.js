import React from 'react'


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ticker: "",
        }
    }

    setTicker = (data) => {
        this.setState({
            ticker: data.target.value.toUpperCase()
        })
    }

    render() {
        return (
          <form onSubmit={this.props.onSubmit}>
            <label>
              Ticker:
              <input type="text" value={this.state.ticker} onChange={this.setTicker} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
    }
}

export default Search;