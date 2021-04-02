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
      trigger={(open) => (
        <div className="account-link">
          <img
            src={user ? user.photoURL : avatar}
            alt="avatar"
            height="45"
            width="45"
          ></img>
          <p>{user ? user.displayName : ""}</p>
        </div>
      )}
      position="left top"
      offsetY="1"
      offsetX="-1"
      closeOnDocumentClick
      className="settings"
    >
      <div className="settings-link">
        <Link to="/account">
          <button className="settings-button">Account Settings</button>
        </Link>
        <button
          onClick={() => {
            auth.signOut();
          }}
          className="settings-button"
        >
          Sign Out
        </button>
      </div>
    </Popup>
  );
}
