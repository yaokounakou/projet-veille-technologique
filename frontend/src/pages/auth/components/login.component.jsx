import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context/UnContexte";
import * as faceapi from "face-api.js";

const Login = ({ setUnknown, users, formattedUsers }) => {
  const [identifiedUserName, setIdentifiedUserName] = useState(null);
  const navigation = useNavigate();
  const { id, setId } = useGlobalContext();
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
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const stopVideo = () => {
    let video = videoRef.current;
    if (video) {
      video.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  async function loadLabeledImages2() {
    const lab = users.map(async (label) => {
      const descriptions = [];
      console.log(label.id, 1);
      const img = await faceapi.fetchImage(
        `https://guestgo.herokuapp.com/user/picture/${label.id.toString()}/${1}`
      );
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);

      return new faceapi.LabeledFaceDescriptors(label.id, descriptions);
    });
    console.log(lab);
    return Promise.all(lab);
  }

  const handleImageOnLoad = async () => {
    setUnknown(false);
    setIdentifiedUserName("");
    const img = document.getElementById("img");
    const labeledFaceDescriptors = await loadLabeledImages2();
    console.log(labeledFaceDescriptors);
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    console.log("image on load");
    var intervalFace = setInterval(async () => {
      const displaySize = { width: img.width, height: img.height };
      const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      resizedDetections.forEach((d) => {
        const result = faceMatcher.findBestMatch(d.descriptor);
        console.log(result.toString().split(" ")[0]);
        let counterr = 0;
        if (result.toString().split(" ")[0] !== "unknown") {
          counterr++;
          if (counterr === 1) {
            setUnknown(false);
          }
          setIdentifiedUserName(
            formattedUsers[result.toString().split(" ")[0]]
          );
          setId(result.toString().split(" ")[0]);
          stopVideo();
          clearInterval(intervalFace);
        } else {
          counterr++;
          if (counterr === 1) {
            setUnknown(true);
          }
          setIdentifiedUserName("Vous n'êtes pas encore inscrit");
          stopVideo();
          clearInterval(intervalFace);
        }
      });
    }, 100);
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
    <div>
      {!identifiedUserName && (
        <div>
          <div className="relative flex h-96 w-full items-center justify-center overflow-hidden bg-gray-500 md:h-full">
            <video
              ref={videoRef}
              className={
                hasPhoto ? "hidden" : "flex h-full w-full object-cover"
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
              id="img"
              className={
                hasPhoto
                  ? "flex h-96 w-full object-cover transition-all delay-500 duration-500 ease-in-out md:h-full"
                  : "hidden"
              }
              onLoad={handleImageOnLoad}
            />
          </div>
          <button
            onClick={takePhoto}
            className="w-full bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800 md:p-8 md:text-2xl"
          >
            Authentificate
          </button>
        </div>
      )}

      {identifiedUserName && (
        <div>
          <h1 id="nameh1">Welcome back {identifiedUserName}!</h1>
          <button
            onClick={() => navigation("/dashboard")}
            className="w-full bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800 md:p-8 md:text-2xl"
          >
            Go to your dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
