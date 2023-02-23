import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/auth/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import { UnContexte } from "./UnContexte";
import React, { useState, useEffect } from "react";

function App() {
  //  const [id, setId] = useState(sessionStorage.getItem("id") || undefined);
  const [id, setId] = useState("63dd5c74f5b9340485eb89f3");

  useEffect(() => {
    console.log("id", id);
    const expires30m = new Date();
    expires30m.setMinutes(expires30m.getMinutes() + 30);
    if (!id || id === "") {
      sessionStorage.clear();
    } else {
      sessionStorage.setItem("id", id);
    }
  }, [id]);


  return (
    <Router>
      <UnContexte.Provider value={{ id, setId }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </UnContexte.Provider>
    </Router>
  );
}

export default App;
