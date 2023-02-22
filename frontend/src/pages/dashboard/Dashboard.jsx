//dashboard page

import React, { useState, useEffect, useRef } from "react";

import { useGlobalContext } from "../../UnContexte";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { id, setId } = useGlobalContext();

    const navigation = useNavigate();

    useEffect(() => {
        console.log("id", id);
        if(!id || id === "") {
            navigation("/auth");
        }
    }, [id]);


    async function createEvent() {
        //
    }

    async function deleteEvent() {
        //
    }

    async function getEvents() {
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

    return (
        <div>
            <h1>Dashboard id: {id}</h1>
        </div>
    )
}