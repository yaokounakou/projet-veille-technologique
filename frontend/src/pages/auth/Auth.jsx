import React, { useState } from "react";

import { Login, Register } from "./components";

function Auth() {
  const [isRegistered, setIsRegistered] = useState(true);

  return <>{isRegistered ? <Login /> : <Register />}</>;
}

export default Auth;
