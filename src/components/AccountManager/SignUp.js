import React, { useState } from "react";
import Popup from "reactjs-popup";
import { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";

import "./Account.css";
import { auth, generateUserDocument } from "../../firebase";

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();

    try {
        const {user} = await auth.createUserWithEmailAndPassword(email, password);
        generateUserDocument(user, {displayName});
    } catch(error) {
        setError("Error signing up with email and password");
        console.log(error)
    }

    setEmail("");
    setPassword("");
    setDisplayName("");
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
        <p>
          No Account?{" "}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Sign Up!
          </a>
        </p>
      }
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <h3>Welcome to EZ-Trade!</h3>
          <form>
            <div className="form">
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
                onChange={(event) => onChangeHandler(event)}
              ></input>

              <button
                onClick={(event) => {
                  createUserWithEmailAndPasswordHandler(event, email, password);
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
}
