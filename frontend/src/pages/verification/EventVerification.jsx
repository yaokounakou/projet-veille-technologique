import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useGlobalContext, useGlobalContext2 } from "../../UnContexte";

import * as faceapi from "face-api.js";

export default function EventVerification() {
  const { id, setId } = useGlobalContext();

  const navigation = useNavigate();

  const [ValidationGardien, setValidationGardien] = useState(false);

  const { eventId } = useParams();

  const [video, setVideo] = useState(null);

  const [captureVideo, setCaptureVideo] = useState(false);

  const [nextButtonBool, setNextButtonBool] = useState(false);

  const [users, setUsers] = useState([]);

  const [eventUsers, setEventUsers] = useState([]);

  const [formattedUsers, setFormattedUsers] = useState([]);

  const videoRef = React.useRef();
  const videoHeight = 800;
  const videoWidth = 400;

  useEffect(() => {
    if (id || id !== "") {
      if (eventId || eventId !== "") {
        fetch("https://guestgo.herokuapp.com/event/getUsers/" + eventId)
          .then((res) => res.json())
          .then((data) => {
            data.forEach((element) => {
              if (id.toString() === element.user.id) {
                if (
                  element.user.role === "Organisateur" ||
                  element.user.role === "Gardien"
                ) {
                  console.log("Organisateur", id);
                  setValidationGardien(true);
                }
              }
            });
          });
      } else {
        navigation("/dashboard");
      }
    } else {
      navigation("/auth");
    }
  }, [id]);

  async function loadLabeledImages() {
    return Promise.all(
      users.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          setTimeout(async () => {
            console.log(label.id, i);
            const img = await faceapi.fetchImage(
              `https://guestgo.herokuapp.com/user/picture/${label.id.toString()}/${i}`
            );
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
          }, 1000);
        }

        return new faceapi.LabeledFaceDescriptors(label.id, descriptions);
      })
    );
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

  function formatJsonUsers(json) {
    const result = {};
    json.forEach((item) => {
      result[item.id] = item.username;
    });
    return result;
  }

  useEffect(() => {
    Promise.all([
      new Promise((resolve) =>
        setTimeout(
          () => resolve(faceapi.nets.faceLandmark68Net.loadFromUri("/models")),
          100
        )
      ),
      new Promise((resolve) =>
        setTimeout(
          () => resolve(faceapi.nets.faceRecognitionNet.loadFromUri("/models")),
          200
        )
      ),
      new Promise((resolve) =>
        setTimeout(
          () => resolve(faceapi.nets.ssdMobilenetv1.loadFromUri("/models")),
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
                  setUsers(data);
                })
            ),
          400
        )
      ),
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              console.log("id", eventId),
              fetch(
                "https://guestgo.herokuapp.com/event/getUsers/" +
                  eventId
              )
                .then((res) => res.json())
                .then((data) => {
                  setEventUsers(data);
                })
            ),
          2000
        )
      ),
    ]);
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    console.log("loaded");
    console.log("start video");
    navigator.mediaDevices
    //   .getUserMedia({ video: { facingMode: "environment" } })
    .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        setVideo(video);
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    console.log("users", users);
    if (users.length > 0) {
      const formattedJson = formatJsonUsers(users);
      setFormattedUsers(formattedJson);
      console.log(formattedJson);
    }
  }, [users]);

  useEffect(() => {
    if (eventUsers.length > 0) {
      console.log("event users", eventUsers);
      const eventUsersIds = eventUsers.map((item) => item.user.id);
      console.log("event users ids", eventUsersIds);
    }
  }, [eventUsers]);

  const handleNextParticipant = () => {
    console.log("next participant");
    const nameh1 = document.getElementById("nameh1");
    nameh1.innerHTML = "";
    video.style.border = "";
    setNextButtonBool(false);
    startVideo();
  };

  const handleVideoOnPlay = async () => {
    let canvas;
    const labeledFaceDescriptors = await loadLabeledImages2();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    console.log("video on play");
    var intervalFace = setInterval(async () => {
      if (canvas) {
        canvas.remove();
      }
      canvas = faceapi.createCanvasFromMedia(video);
      canvas.style.position = "absolute";
      const divCanv = document.getElementById("divCanv");
      divCanv.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      resizedDetections.forEach((d) => {
        const result = faceMatcher.findBestMatch(d.descriptor);
        const box = d.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: formattedUsers[result.toString().split(" ")[0]] || "unknown",
        });
        drawBox.draw(canvas);
        if (result.toString().split(" ")[0] !== "unknown") {
          video.style.border = "5px solid green";
          console.log(
            result.toString().split(" ")[0],
            formattedUsers[result.toString().split(" ")[0]]
          );
          eventUsers.forEach((user) => {
            if (user.user.id === result.toString().split(" ")[0]) {
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: user.user.username,
              });
              drawBox.draw(canvas);
              const nameh1 = document.getElementById("nameh1");
              nameh1.innerHTML = user.user.username + " " + "☑";
              clearInterval(intervalFace);
              video.pause();
              video.srcObject.getTracks().forEach((track) => {
                track.stop();
              });
              canvas.remove();
              setNextButtonBool(true);
            }
          });
        } else {
          console.log("unknown");
          video.style.border = "5px solid red";
        }
      });
    }, 10);
  };

  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(
    window.navigator.userAgent
  ) === true ? (
    <div className="flex h-screen w-full items-center justify-center p-16">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        {ValidationGardien && (
          <div>
            <div>
              {!captureVideo && (
                <button
                  onClick={startVideo}
                  className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
                >
                  Commencer la vérification
                </button>
              )}
            </div>
            {captureVideo && (
              <div>
                <h1
                  id="nameh1"
                  className="mb-2 text-center text-4xl text-green-500"
                ></h1>
                <div
                  id="divCanv"
                  className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-md bg-gray-500"
                >
                  <video
                    ref={videoRef}
                    height={videoHeight}
                    width={videoWidth}
                    playsInline
                    muted
                    onPlay={handleVideoOnPlay}
                    className="flex h-full w-full rounded-md object-cover"
                  />
                </div>
              </div>
            )}
            {nextButtonBool && (
              <button
                onClick={handleNextParticipant}
                className="mt-1 w-full rounded-md bg-blue-500 p-4 font-semibold text-white hover:bg-blue-600 active:bg-blue-800"
              >
                Suivant
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    // <Verification />
    <h1>Verification peux juste etre sur le un mobile device</h1>
  );
}
