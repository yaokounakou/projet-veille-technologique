import React, { useState, useRef, useEffect } from "react";

import * as faceapi from "face-api.js";

import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context/UnContexte";

const Register = ({}) => {
  const navigation = useNavigate();
  const { id, setId } = useGlobalContext();
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const imageRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);

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
  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  const handleImageInscriptionOnLoad = async () => {
    // console.log(imageRef.current.src);
    console.log(username);

    //take ref and change into formdata and send to backend

    try {
      const response = await fetch("https://guestgo.herokuapp.com/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      const result = await response.json();
      if (result["user created"].user.id !== undefined) {
        console.log(result["user created"].user.id);
        const file = dataURItoBlob(imageRef.current.src);
        const formData = new FormData();
        formData.append("image", file);
        const url =
          "https://guestgo.herokuapp.com/user/picture/" +
          result["user created"].user.id;
        const options = {
          method: "POST",
          body: formData,
        };
        fetch(url, options)
          .then((response) => {
            console.log(response);
            if (response.status === 201) {
              console.log("one photo added successfully");
              fetch(url, options)
                .then((response) => {
                  console.log(response);
                  if (response.status === 201) {
                    console.log("two photos added successfully");
                    setId(result["user created"].user.id);
                    navigation("/dashboard");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    startVideo();
    setHasPhoto(false);
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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div>
      <h1 className="text-2xl text-blue-500">Inscription</h1>
      {step === 1 && (
        <div>
          <input
            type="text"
            placeholder="Entrez votre nom"
            onChange={handleUsernameChange}
            className="w-full rounded-md border p-4 focus:border-blue-500"
          />
          <button
            onClick={nextStep}
            className="w-full bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800 md:p-8 md:text-2xl"
          >
            Suivant
          </button>
          <h4 className="text-lg text-gray-400">
            Sign up by using your name and a photo of your face
          </h4>
        </div>
      )}

      {step === 2 && (
        <div className="flex w-full flex-col items-center justify-center space-y-4">
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
              onLoad={handleImageInscriptionOnLoad}
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
    </div>
  );
};

export default Register;
