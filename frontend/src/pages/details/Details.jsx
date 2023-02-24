import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "./components"; 
import { API_URL, LOCAL_URL } from "../../contants/index";

const Details = () => {
  const { id } = useParams();
  const [users, setUsers] = useState(null)
  const [event , setEvent] = useState(null)

  async function getEvent(id) {
    if (id === undefined) {
      return;
    } else {
      console.log("id", id);
      fetch(`${API_URL}/event/getUsers/${id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUsers(data.users);
          setEvent(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    getEvent(id);
  }, [id]);

  return (
    <div>
      <h1>Details</h1>
      <br></br>
      <p>Id: {id}</p>
      <br></br>
      <p>Name: {event && event.name}</p>
      <br></br>
      <p>Description: {event && event.description}</p>
      <br></br>
      <p>Location: {event && event.location}</p>
      <br></br>

      {users &&
        users.map((user) => {
          return <User key={user.user.id} user={user.user} />;
        }
      )}
    </div>
  );
};

export default Details;
