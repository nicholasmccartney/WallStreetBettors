import avatar from "../../assets/default_avatar.png";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import './AccountLink.css'

export default function AccountLink(props) {

    var user = props.user

    if (user === null) {
        return (
            <Popup trigger={<button>Login</button>} modal>
                {close => (
                    <div className="modal">
                        <div className="form">
                            Username: <input></input>
                            <br/>
                            Password: <input></input>

                        </div>
                        <button className="button" onClick={() => {
                            close();
                        }}>Close</button>
                    </div>
                )}
            </Popup>
        )
    } else {
        return (
          <Link className="account-link" to="/account">
            <img src={avatar} alt="avatar" height="45" width="45"></img>
            <p>Account</p>
          </Link>
        );
    }


}