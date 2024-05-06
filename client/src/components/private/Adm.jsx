import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { UserContext } from "../../utils/Contexts/UserContext";
import Registration from "./Registration/Registration";
import userApi from "../../utils/Api/private/userApi";
import NavBar from "./NavBar";
import { ApplContext } from "../../utils/Contexts/ApplContext";
import registrationApi from "../../utils/Api/private/registrationApi";
import CloseRoutes from "./CloseRoutes";

export default function Adm() {
  const [user, setUser] = useState(null);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();

  useEffect(() => {
    userApi
      .getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser({ no_user: 1 }));
  }, []);

  const getMe = () => {
    return userApi
      .getMe()
      .then(({ agent }) => setUser(agent))
      .catch(() => setUser({ no_user: 1 }));
  };

  const signOut = () => {
    appl.setLoading(true);
    registrationApi
      .signOut()
      .then(() => {
        setUser({ no_user: 1 });
        navigator("/adm");
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <UserContext.Provider value={user}>
      {Boolean(user) & !user?.no_user ? (
        <>
          <NavBar />
          <Container className="mt-2">
            <CloseRoutes getMe={getMe} signOut={signOut} />
          </Container>
        </>
      ) : (
        <Registration setUser={setUser} />
      )}
    </UserContext.Provider>
  );
}
