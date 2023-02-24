import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";

const User = ({ user }) => {
  return (
    <div>
      <br></br>
      <p>Name: {user.username}</p>
      <p>Role: {user.role}</p>
      <p>Id: {user.id}</p>
    </div>
  );
};

export default User;
