import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { UserContext } from "../../utils/Contexts/UserContext";
import Registration from "./Registration/Registration";
import userApi from "../../utils/Api/private/userApi";
import NavBar from "./NavBar";
import PayTypes from "./PayTypes/PayTypes";

export default function Adm() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    userApi.getMe().then(({ user }) => setUser(user));
  }, []);

  return (
    <UserContext.Provider value={user}>
      {user ? (
        <>
          <NavBar />
          <Container className="mt-2">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pay_types/*" element={<PayTypes />} />
            </Routes>
          </Container>
        </>
      ) : (
        <Registration setUser={setUser} />
      )}
    </UserContext.Provider>
  );
}
