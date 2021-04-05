import "./Account.css";
import { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import SignIn from "./SignIn";
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
