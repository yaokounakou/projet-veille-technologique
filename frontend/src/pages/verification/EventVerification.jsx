import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../context/UnContexte";

import { Verification } from "./components";

import * as faceapi from "face-api.js";

export default function EventVerification() {
  const { id, setId } = useGlobalContext();

  const navigation = useNavigate();

  const [ValidationGardien, setValidationGardien] = useState(false);

  const { eventId } = useParams();

  useEffect(() => {
    if (id || id !== "") {
      if (eventId || eventId !== "") {
        fetch("https://guestgo.herokuapp.com/event/getUsers/" + eventId)
          .then((res) => res.json())
          .then((data) => {
            data.users.forEach((element) => {
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

  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(
    window.navigator.userAgent
  ) === true ? (
    <div className="flex h-screen w-full items-center justify-center p-16">
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        {ValidationGardien && eventId && (
          <Verification  eventId={eventId}/>
        )}
      </div>
    </div>
  ) : (
    // <Verification />
    <h1>Verification peux juste etre sur le un mobile device</h1>
  );
}
