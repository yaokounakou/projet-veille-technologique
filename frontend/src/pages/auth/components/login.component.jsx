import { useRef, useState, useEffect } from "react";

function Login() {
  // setIsRegistered(false);
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const imageRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.style.transform = "scaleX(-1)";
        // setVideo(video);
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const takePhoto = () => {
    let video = videoRef.current;
    let canvas = photoRef.current;
    let image = imageRef.current;

    let context = canvas.getContext("2d");

    let width = video.videoWidth;
    let height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context.translate(width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, width, height);

    let data = canvas.toDataURL();

    image.src = data;

    setHasPhoto(true);
  };

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center p-16">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-md bg-gray-500 md:h-full">
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
            onLoad={() => {
              console.log("canvas loaded");
            }}
            className={hasPhoto ? "hidden" : "hidden"}
          ></canvas>
          <img
            ref={imageRef}
            src=""
            alt=""
            className={
              hasPhoto
                ? "flex h-96 w-full object-cover transition-all delay-500 duration-500 ease-in-out"
                : "hidden"
            }
          />
        </div>
        <button
          onClick={takePhoto}
          className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
        >
          Authentificate
        </button>
      </div>
    </div>
  );
}

export default Login;
