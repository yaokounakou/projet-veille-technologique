import React from "react";

export const UnContexte = React.createContext({
    id: "",
    setId: () => {},
});

export const useGlobalContext = () => React.useContext(UnContexte);