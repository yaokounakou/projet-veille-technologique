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


    async function GetEventUsers() {
        //
    }

    async function GetUserEvents() {
        //
    }

    async function CreateEvent() {
        //
    }

    async function DeleteEvent() {
        //
    }

    async function UpdateEvent() {
        //
    }

    async function AddUserToEvent() {
        //
    }

    async function ChangeRole() {
        //
    }

    async function RemoveUserFromEvent() {
        //
    }

    return (
        <div>
            <h1>Dashboard idd: {id}</h1>
        </div>
    )
}