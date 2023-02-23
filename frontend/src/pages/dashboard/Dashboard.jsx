//dashboard page

import React, { useState, useEffect, useRef } from "react";

import { useGlobalContext } from "../../context/UnContexte";
import { Event } from "./components";
import { API_URL } from "../../contants/index";

import { useNavigate } from "react-router";

const Dashboard = () => {

    const navigation = useNavigate();
  const { id, setId } = useGlobalContext();
  const nbEvents = 1;

  const [user, setUser] = useState({
    id: "",
    username: "",
    pictures: [],
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("id", id);
    if (id || id !== "") {
      navigation("/auth");
    }
  }, [id]);

  async function getUser(id) {
    if (id === undefined) {
      return;
    } else {
      console.log("id", id);
      fetch(`${API_URL}/user/${id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUser(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  async function getAllEvents() {
    fetch(`${API_URL}/event`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setEvents(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function createEvent() {
    //
  }

  async function deleteEvent() {
    //
  }

  async function getRoles() {
    //
  }

  async function changeRoles() {
    //
  }

  async function getListOfUsersInEvents() {
    //
  }

  async function AddUserToEvent() {
    //
  }

  useEffect(() => {
    getUser(id);
  }, [id]);

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <div className="flex max-h-screen w-full items-start justify-center">
      <div className="grid w-full md:min-h-screen md:grid-cols-12">
        <div className="md:col-span-3 md:max-h-screen">
          <div className="flex h-full w-full items-start justify-center p-0 md:p-8">
            <div className="flex h-[var(--header-height)] w-full items-center justify-center bg-white md:h-fit md:rounded-lg">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className=" h-16 w-16 rounded-full bg-black md:h-32 md:w-32"></div>
                <p className="font-semibold">{user.username}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[var(--dashboard-height)] bg-gradient-to-t from-blue-800 md:col-span-9 md:h-screen md:max-h-screen">
          <div className="flex h-full w-full flex-col items-start justify-center p-6 md:p-8">
            <h1 className="mb-4 text-2xl font-extrabold text-blue-800 md:mb-6 md:text-5xl">
              Dashboard
            </h1>
            <div className="grid h-full w-full grid-cols-1 gap-6 overflow-auto rounded-md bg-red-300">
              {events.map((event) => (
                <Event key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
