import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import avatar from "../../assets/default_avatar.png";
import "./Account.css";

function Account() {
  const user = useContext(UserContext);

  if (user === null || user === undefined) {
    return <div className="App-header">Please Log In</div>;
  } else {
    console.log(user);
    return (
      <div className="App-header">
        <div className="account-content">
          <img
            src={user ? user.photoURL : avatar}
            alt="avatar"
            height="200"
            width="200"
          ></img>
          <div>
            <p>{user.displayName}</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
