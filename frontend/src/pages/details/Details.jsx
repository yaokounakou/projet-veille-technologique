import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Details = () => {
  const { id } = useParams();

  async function getEvent(id) {}

  useEffect(() => {
    getEvent(id);
  }, [id]);

  return (
    <div>
      <h1>Details</h1>
      <p>{id}</p>
    </div>
  );
};

export default Details;
