import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";

const User = ({ user }) => {
  return (
    <div>{user.username}</div>
  );
};

export default User;
