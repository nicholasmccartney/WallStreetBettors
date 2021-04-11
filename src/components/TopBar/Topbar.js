import React from 'react'
import './topbar.css'
import logoSVG from "../../assets/logo_full_blue.svg";
import { Link } from "react-router-dom";
import Timer from "../Timer/Timer.js";
import AccountLink from "../AccountLink/AccountLink.js";

class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loggedIn: false,
      user: null,
    };
  }

  marketStatus = () => {
    if (this.state.is_open) {
      return "Market Open";
    } else {
      return "Market Closed";
    }
  };

  getMarketStatus = () => {
    fetch("/marketStatus")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  };

  componentDidMount() {
    this.getMarketStatus();
  }

  render() {
    if (this.state.loading === false) {
      return (
        <div>
          <div className="container">
            <Link to="/">
              <img src={logoSVG} alt="logo" height="50" width="75"></img>
            </Link>
            <div className="links">
              <Link to="/">
                <p>Home</p>
              </Link>
              <Link to="/strategies">
                <p>Strategies</p>
              </Link>
            </div>
            <AccountManager />
          </div>
          <div
            className={
              this.state.is_open ? "marketStatus-open" : "marketStatus-closed"
            }
          >
              {this.marketStatus()}
              <Timer
                compareDate={
                  this.state.is_open
                    ? this.state.next_close
                    : this.state.next_open
                }
                resetTimer={this.getMarketStatus}
              />
            </div>
            <Watchlist />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Topbar;