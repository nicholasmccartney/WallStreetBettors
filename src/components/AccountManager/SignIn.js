import Popup from "reactjs-popup";
import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import SignUp from "./SignUp";
import { auth } from "../../firebase";

import "./Account.css";

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => {
        setError("Error signing in with password and email");
        console.log("error signing in with email and password", error)
    })
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
    <Popup trigger={<button>Login</button>} modal>
      {(close) => (
        <div className="modal">
          <form>
            <div className="form">
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
