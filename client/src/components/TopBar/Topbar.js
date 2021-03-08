import React from 'react'
import './topbar.css'
import logo from './ez_trade_logo.png'
import avatar from './default_avatar.png'

function Topbar() {
    return (
      <div class="container">
        <img src={logo} alt="logo" height="50" width="75"></img>
        <div class="links">
          <p class="link">Link One</p>
          <p class="link">Link Two</p>
          <p class="link">Link Three</p>
        </div>
        <div class="account-link">
          <img src={avatar} alt="avatar" height="45" width="45"></img>
          <p>Account</p>
        </div>
      </div>
    );
}

export default Topbar;