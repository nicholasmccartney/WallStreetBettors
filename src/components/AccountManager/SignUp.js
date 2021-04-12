import React, { useState } from "react";
import Popup from "reactjs-popup";
import logoSVG from "../../assets/logo_diamond.svg";
import welcomeSVG from "../../assets/sign_up_white2.svg";

import "./Account.css";
import { auth, generateUserDocument } from "../../firebase";

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const createUserWithEmailAndPasswordHandler = async (
    event,
    email,
    password
  ) => {
    event.preventDefault();

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      generateUserDocument(user, { displayName });
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Invalid Email");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(error.message);
        alert(error.message, "Please contact support.");
      }
    }
  };
  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value);
    }
  };

  return (
    <Popup
      trigger={
        <button>
          No Account?
        </button>
      }
      modal
      closeOnDocumentClick
      className="sign-up"
    >
      {(close) => (
        <div className="modal">
          <div className="welcome">
            <img src={welcomeSVG} alt="welcome"/>
            <img src={logoSVG} alt="logo" height="150" width="150"></img>
          </div>
          <form className="form">
            <div>
              <label htmlFor="displayName">Display Name:</label>
              <input
                type="text"
                name="displayName"
                value={displayName}
                placeholder="E.g: WallStreetBettor1"
                id="displayName"
                onChange={(event) => onChangeHandler(event)}
              ></input>

              <label htmlFor="userEmail">Email:</label>
              <input
                type="email"
                name="userEmail"
                value={email}
                placeholder="E.g: wallstreetbettor1@gmail.com"
                id="userEmail"
                onChange={(event) => onChangeHandler(event)}
              ></input>

              <label htmlFor="userPassword">Password:</label>
              <input
                type="password"
                name="userPassword"
                value={password}
                id="userPassword"
                placeholder="6 Characters"
                onChange={(event) => onChangeHandler(event)}
              ></input>
              {error && (
                <div>
                  <span className="error">{error}</span>
                  <br />
                  <br />
                </div>
              )}
                  </div>
                  <br/>
              <button
                onClick={(event) => {
                  createUserWithEmailAndPasswordHandler(event, email, password);
                }}
              >
                Sign Up
              </button>
          </form>
        </div>
      )}
    </Popup>
  );
}
