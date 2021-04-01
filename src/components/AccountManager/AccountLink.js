import Popup from "reactjs-popup";
import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { auth } from "../../firebase";
import avatar from "../../assets/default_avatar.png";
import { Link } from "react-router-dom";

import "./Account.css";

export default function AccountLink(props) {
    const user = useContext(UserContext);
  return (
    <Popup
      trigger={open => (
        <div className="account-link">
          <img src={avatar} alt="avatar" height="45" width="45"></img>
          <p>{user ? user.displayName : ""}</p>
        </div>
      )}
      position="right center"
      closeOnDocumentClick
    >
      <div>
        <Link className="account-link" to="/account">
          Account Settings
        </Link>
        <button
          onClick={() => {
            auth.signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </Popup>
  );
}
