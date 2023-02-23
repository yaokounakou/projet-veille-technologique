import React from "react";

export const UnContexte = React.createContext({
    id: "",
    setId: () => {},
});

export const useGlobalContext = () => React.useContext(UnContexte);


export const DeuxContexte = React.createContext({
    eventid: "",
    setEventid: () => {},
});

export const useGlobalContext2 = () => React.useContext(DeuxContexte);