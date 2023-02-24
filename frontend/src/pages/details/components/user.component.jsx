import { GrUser } from "react-icons/gr";

const User = ({ user }) => {
  return (
    <div className="w-full rounded-lg bg-white p-4">
      <p>Nom: {user.username}</p>
      <p>Rôle: {user.role}</p>
      <p>Id: {user.id}</p>
    </div>
  );
};

export default User;
