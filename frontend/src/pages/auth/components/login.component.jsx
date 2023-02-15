import { useRef, useState, useEffect } from "react";

function Login() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.style.transform = "scaleX(-1)";
        setVideo(video);
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center p-16">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-md bg-gray-500">
          <video
            ref={videoRef}
            className={
              hasPhoto ? "hidden" : "flex h-full w-full rounded-md object-cover"
            }
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={photoRef}
            className={hasPhoto ? "flex h-full w-full object-cover" : "hidden"}
          ></canvas>
        </div>
        <button className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800">
          Authentificate
        </button>
      </div>
    </div>
  );
}

export default Login;
