import React, { useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import logo from "../../../media/logo.svg";
import { UserContext } from "../../../utils/Contexts/UserContext";

export default function Registration({ setUser }) {
  const userContext = useContext(UserContext);
  const navigator = useNavigate();

  useEffect(() => {
    if (userContext?.no_user) navigator("/adm/");
  }, [userContext]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Card className="p-4" style={{ width: "80%", maxWidth: 400 }}>
        <img src={logo} className="mb-3" />
        <Routes>
          <Route path="/" element={<SignIn setUser={setUser} />} />
          {/* <Route path="/sign_up" element={<SignUp />} /> */}
        </Routes>
      </Card>
    </div>
  );
}
