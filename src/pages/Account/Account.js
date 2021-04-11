import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import avatar from "../../assets/default_avatar.png";
import "./Account.css";
import { useState } from "react";
import { updateUserDocument } from "../../firebase";
import { BounceLoader as Loader } from "react-spinners";

function Account() {
  const user = useContext(UserContext);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(undefined)
  const [photoURL, setPhotoURL] = useState(undefined);
  const [watchlist, setWatchlist] = useState(undefined);

  const editAccount = (event) => {
    event.preventDefault()
    setEdit(true);
  }

  const saveAccount = (event) => {
    event.preventDefault()
    try {
        updateUserDocument(user, { displayName, photoURL, watchlist });
    } catch(error) {
        console.log(error)
    }
    setLoading(true)
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "displayName") {
      setDisplayName(value);
    } else if (name === "photoURL") {
      setPhotoURL(value);
    } else if (name === "watchlist") {
      setWatchlist(value)
    }
  };

  if (loading || user === null) {
    return (
      <div className="App-header">
        <br />
        <div className="loaders">
          <Loader size={25} margin={2} color={"red"}/>
          <Loader size={50} margin={2} />
          <Loader size={25} margin={2} color="white"/>
        </div>
        Loading...
      </div>
    );
  } 
  if (user === undefined) {
    return <div className="App-header">Please Log In</div>;
  } else if (displayName === undefined || photoURL === undefined) {
    setDisplayName(user.displayName)
    setPhotoURL(user.photoURL)
    setWatchlist(user.watchlist)
  } else {
    return (
      <div className="App-header">
        {!edit && (
          <div className="account-content">
            <img
              src={user && photoURL ? photoURL : avatar}
              alt="avatar"
              height="200"
              width="200"
            ></img>
            <div>
              <p>{displayName}</p>
              <p>{user.email}</p>
            </div>
            <br />
            <button onClick={editAccount}>Edit Account</button>
          </div>
        )}
        {edit && (
          <div className="account-edit">
            <br />
            <form>
              <div>
                <label htmlFor="displayName">Display Name:</label>
                <input
                  type="text"
                  name="displayName"
                  value={displayName}
                  placeholder="E.g: WallStreetBettor1"
                  id="displayName"
                  onChange={onChangeHandler}
                ></input>
                <br />
                <label htmlFor="photoURL">Profile Picture URL:</label>
                <input
                  type="text"
                  name="photoURL"
                  value={photoURL}
                  placeholder="E.g: imgur.com/abc123"
                  id="photoURL"
                  onChange={onChangeHandler}
                ></input>
                <br />
                <label htmlFor="watchlist">
                  Watchlist (comma separated list):
                </label>
                <input type="text" name="watchlist" value={watchlist} placeholder="E.g: GME,MO,F,AMC,SPY,VOO,TRVG" id="watchlist" onChange={onChangeHandler}></input>
                <br />
                <button onClick={saveAccount}>Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Account;
