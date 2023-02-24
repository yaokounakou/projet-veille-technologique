import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../context/UnContexte";

import { Register, Login } from "./components";

function Auth() {
  const { id, setId } = useGlobalContext();
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [unknown, setUnknown] = useState(false);
  const [users, setUsers] = useState([]);

  function formatJsonUsers(json) {
    const result = {};
    json.forEach((item) => {
      result[item.id] = item.username;
    });
    return result;
  }

  useEffect(() => {
    if (users.length > 0) {
      const formattedJson = formatJsonUsers(users);
      setFormattedUsers(formattedJson);
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

  return (
    <div className="flex max-h-screen w-full items-center justify-center p-20 md:p-60">
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        {!unknown && (
          <Login
            setUnknown={setUnknown}
            users={users}
            formattedUsers={formattedUsers}
          />
        )}
        {unknown && <Register />}
      </div>
    </div>
  );
}

export default Auth;
