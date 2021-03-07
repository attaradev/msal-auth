import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth-context";

export default function UserAvatar() {
  const {user} = useContext(AuthContext);
  // If a user avatar is available, return an img tag with the pic
  if (user.avatar) {
    return <img
      src={user.avatar} alt="user"
      className="rounded-circle align-self-center mr-2"
      style={{ width: '32px' }}></img>;
  }

  // No avatar available, return a default icon
  return <i
    className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
    style={{ width: '32px' }}></i>;
}