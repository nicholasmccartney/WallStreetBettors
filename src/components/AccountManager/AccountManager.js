import avatar from "../../assets/default_avatar.png";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "./Account.css";
import { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import SignIn from "./SignIn";
import SignUp from "./SignUp"
import AccountLink from "./AccountLink"

export default function AccountManager(props) {
  const user = useContext(UserContext);

  if (user === undefined) {
    return (
        <SignIn/>
    );
  } else {
    return (
      <AccountLink/>
    );
  }
}
