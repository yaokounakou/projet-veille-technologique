import React, { useState, useRef, useEffect } from "react";
// import loadLabeledImages2 from "../../loadLabeledImages.jsx";
import * as faceapi from "face-api.js";

import { useNavigate } from "react-router-dom";

function Auth() {
  //Step 1 ========================================================================================
  const navigation = useNavigate();

  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const imageRef = useRef(null);

  const [username, setUsername] = useState("");
  const [identifiedUserName, setIdentifiedUserName] = useState(null);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [unknown, setUnknown] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRegister = () => {
    console.log(username);
  };

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

  function formatJsonUsers(json) {
    const result = {};
    json.forEach((item) => {
      result[item.id] = item.username;
    });
    return result;
  }

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

  useEffect(() => {
    startVideo();
  }, []);

  useEffect(() => {
    console.log("users", users);
    if (users.length > 0) {
      const formattedJson = formatJsonUsers(users);
      setFormattedUsers(formattedJson);
      console.log(formattedJson);
    }
  }, [users]);

  let countRender = 0;
  useEffect(() => {
    countRender++;
    if (countRender === 1) {
      Promise.all([
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                faceapi.nets.faceLandmark68Net
                  .loadFromUri("/models")
                  .then(() => console.log("face faceLandmark68Net loaded"))
              ),
            100
          )
        ),
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                faceapi.nets.faceRecognitionNet
                  .loadFromUri("/models")
                  .then(() => console.log("face faceRecognitionNet loaded"))
              ),
            200
          )
        ),
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                faceapi.nets.ssdMobilenetv1
                  .loadFromUri("/models")
                  .then(() => console.log("face ssdMobilenetv1 loaded"))
              ),
            300
          )
        ),
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                fetch("https://guestgo.herokuapp.com/user")
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    setUsers(data);
                  })
              ),
            400
          )
        ),
      ]);
    }
  }, []);

  //Step 2 ========================================================================================

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
    startVideo();
    setHasPhoto(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-16">
      {step === 1 &&
        <div className="flex w-full flex-col items-center justify-center space-y-4">
        {identifiedUserName && <h1 id="nameh1">{identifiedUserName}</h1>}
        {!unknown && !identifiedUserName && (
          <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-md bg-gray-500">
            <video
              ref={videoRef}
              className={
                hasPhoto
                  ? "hidden"
                  : "flex h-full w-full rounded-md object-cover"
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
                  ? "flex h-96 w-full object-cover transition-all delay-500 duration-500 ease-in-out"
                  : "hidden"
              }
              onLoad={handleImageOnLoad}
            />
          </div>
        )}
        {!unknown && !identifiedUserName && (
          <button
            onClick={takePhoto}
            className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
          >
            Authentificate
          </button>
        )}
        {unknown && (
          <div>
            <input
              type="text"
              placeholder="Entrez votre nom"
              onChange={handleUsernameChange}
              className="w-full rounded-md border p-4 focus:border-blue-500"
            />
            <button
              onClick={nextStep}
              className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
            >
              Suivant
            </button>
            <h4 className="text-lg text-gray-400">
              Inscrivez-vous en liant votre nom et visage dès maintenant.
            </h4>
          </div>
        )}
        {!unknown && identifiedUserName && (
          <button
            onClick={() => navigation("/dashboard")}
            className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
          >
            Aller au tableau de bord
          </button>
        )}
      </div>}
      {step === 2 && 
      <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 id="nameh1">Inscription</h1>
        <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-md bg-gray-500">
          <video
            ref={videoRef}
            className={
              hasPhoto
                ? "hidden"
                : "flex h-full w-full rounded-md object-cover"
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
                ? "flex h-96 w-full object-cover transition-all delay-500 duration-500 ease-in-out"
                : "hidden"
            }
            onLoad={handleImageOnLoad}
          />
        </div>
        </div>}
    </div>
  );

  // return <>{isRegistered ? <Login /> : <Register />}</>;
}

export default Auth;
