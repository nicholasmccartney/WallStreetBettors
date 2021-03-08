import React from 'react'
import './topbar.css'
import logo from './ez_trade_logo.png'
import avatar from './default_avatar.png'
import { Link } from "react-router-dom";

function Topbar() {
    return (
      <div class="container">
          <Link to="/">
            <img src={logo} alt="logo" height="50" width="75"></img>
          </Link>
        <div class="links">
          <p class="link">Link One</p>
          <p class="link">Link Two</p>
          <p class="link">Link Three</p>
        </div>
        <Link class="account-link" to="/account">
          <img src={avatar} alt="avatar" height="45" width="45"></img>
          <p>Account</p>
        </Link>
      </div>
    );
}

export default Topbar;