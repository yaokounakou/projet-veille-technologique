import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "./components";
import { API_URL, LOCAL_URL } from "../../contants/index";
import { IoLocationSharp } from "react-icons/io5";
import { useGlobalContext } from "../../context/UnContexte";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { id } = useGlobalContext();
  const [users, setUsers] = useState(null);
  const [event, setEvent] = useState(null);

  const [isOrganizer, setIsOrganizer] = useState(false);

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
    if (id && users) {
      users.forEach((user) => {
        console.log(user.user);
        console.log(id);
        if (
          user.user.id === id &&
          (user.user.role === "Organisateur" || user.user.role === "Guarde")
        ) {
          setIsOrganizer(true);
        }
      });
    }
  }, [users, id]);

  useEffect(() => {
    getEvent(eventId);
  }, [eventId]);

  return (
    event && (
      <div className="w-full">
        <div className="min-h-screen bg-gradient-to-t from-blue-800 md:col-span-9 md:h-screen md:max-h-screen">
          <div className="flex h-full w-full flex-col items-start justify-start p-6 md:p-8">
            <h1 className="mb-4 text-2xl font-extrabold text-blue-800 md:mb-6 md:text-5xl">
              Détails
            </h1>
            <div className="mb-6 first-letter:md:mb-10">
              <p className="mb-4">Identifiant d'évènement: {id}</p>
              <div className="flex gap-4">
                <h1 className="text-lg font-bold md:mb-3 md:text-4xl">
                  {event.name}
                </h1>
                <div className="flex items-center justify-center">
                  <IoLocationSharp className="mr-1 inline-block text-sm md:text-2xl" />
                  <p className="text-sm font-semibold md:text-2xl">
                    {event.location}
                  </p>
                </div>
              </div>
              <div className="w-full">
                <p className="line-clamp-2 md:text-2xl md:line-clamp-3">
                  {event.description}
                </p>
              </div>
            </div>
            {isOrganizer && (
              <>
                <div className="mb-4 grid w-full gap-4 md:grid-cols-4">
                  {users &&
                    users.map((user) => {
                      return <User key={user.user.id} user={user.user} />;
                    })}
                </div>
                <button
                  className="rounded bg-blue-500 p-4"
                  onClick={() => {
                    navigate(`/verification/${eventId}`);
                  }}
                >
                  Vérification
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Details;
