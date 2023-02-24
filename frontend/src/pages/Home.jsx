import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/auth");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-16">
      <div className="mx-auto flex flex-col items-center justify-center space-y-2">
        <h1 className="text-4xl font-bold">GuestGo</h1>
        <button
          onClick={handleClick}
          className="rounded-md bg-blue-500 p-4 text-white hover:bg-blue-600 active:bg-blue-800"
        >
          Connexion
        </button>
      </div>
    </div>
  );
}

export default Home;
