import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AgentContext } from "../../utils/Contexts/AgentContext";
import NavBar from "./NavBar";
import Events from "./Events";
import Event from "./Event";
import { ApplContext } from "../../utils/Contexts/ApplContext";
import agentApi from "../../utils/Api/public/agentApi";
import SignIn from "./Profile/SignIn";
import Profile from "./Profile/Profile";
import registrationApi from "../../utils/Api/public/registrationApi";
import Orders from "./Profile/Orders";
import Order from "./Profile/Order";

export default function Main() {
  const [agent, setAgent] = useState(null);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();

  useEffect(() => {
    agentApi
      .getMe()
      .then(({ agent }) => setAgent(agent))
      .catch(() => setAgent({ no_agent: 1 }));
  }, []);

  const getMe = () => {
    return agentApi
      .getMe()
      .then(({ agent }) => setAgent(agent))
      .catch(() => setAgent({ no_agent: 1 }));
  };

  const signOut = () => {
    appl.setLoading(true);
    registrationApi
      .signOut()
      .then(() => {
        setAgent({ no_agent: 1 });
        navigator("/");
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <AgentContext.Provider value={agent}>
      <NavBar />
      <div style={{ height: "calc(100vh - 67px)", display: "flex" }}>
        <Container>
          <Routes>
            <Route path="/" element={<Events />} />

            <Route
              path="/profile"
              element={<Profile signOut={signOut} getMe={getMe} />}
            />
            <Route path="/profile/orders" element={<Orders />} />
            <Route path="/profile/orders/:order_id" element={<Order />} />

            <Route path="/sign_in" element={<SignIn getMe={getMe} />} />
            <Route path="/event/:event_id" element={<Event getMe={getMe} />} />
          </Routes>
          <footer className="text-center m-5">
            powered by barbakov {new Date().getFullYear()}
          </footer>
        </Container>
      </div>
    </AgentContext.Provider>
  );
}
