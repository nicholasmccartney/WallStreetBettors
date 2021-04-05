import Popup from "reactjs-popup";
import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import SignUp from "./SignUp";
import { auth } from "../../firebase";
import logoSVG from "../../assets/logo_diamond.svg";
import welcomeSVG from "../../assets/sign_in_white.svg";

import "./Account.css";

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      if (error.code === "auth/wrong-password") {
        setError("Password is incorrect.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email.");
      } else if (error.code === "auth/user-not-found") {
        setError(
          "User does not exist. Enter existing account email or sign up."
        );
      } else {
        setError(error.message);
        alert(error.message, "Please contact support.");
      }
    });
  };

  const resetState = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    }
  };
  return (
    <Popup
      trigger={<button>Login</button>}
      modal
      onClose={resetState}
      nested
      closeOnDocumentClick
      className="sign-in"
    >
      {(close) => (
        <div className="modal">
          <div className="welcome">
            <img src={welcomeSVG} alt="welcome"/>
            <img src={logoSVG} alt="logo" height="150" width="150"></img>
          </div>
          <form className="form">
            <div>
              Email:{" "}
              <input
                type="email"
                name="userEmail"
                value={email}
                placeholder="UserEmail123@gmail.com"
                id="userEmail"
                onChange={(event) => onChangeHandler(event)}
              ></input>
              <br />
              Password:{" "}
              <input
                type="password"
                name="userPassword"
                value={password}
                id="userPassword"
                onChange={(event) => onChangeHandler(event)}
              ></input>
            </div>
            <br />
            {error && (
              <div>
                <span className="error">{error}</span>
                <br />
                <br />
              </div>
            )}

            <button
              onClick={(event) => {
                signInWithEmailAndPasswordHandler(event, email, password);
              }}
            >
              Sign In
            </button>
          </form>
          <SignUp />
        </div>
      )}
    </Popup>
  );
}
