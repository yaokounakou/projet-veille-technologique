import { useRef, useState } from "react";

function Register() {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const videoInput = useRef(null);

  const handleRegister = () => {
    console.log(username);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-16">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-md bg-gray-500">
          <video
            useRef={videoInput}
            className="h-full w-full object-cover"
            autoPlay
            muted
          />
        </div>
        <input
          type="text"
          placeholder="Enter your username"
          onChange={handleUsernameChange}
          className="w-full rounded-md border p-4 focus:border-blue-500"
        />
        <button
          onClick={handleRegister}
          className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
        >
          Register with FaceID
        </button>
      </div>
    </div>
  );
}

export default Register;
