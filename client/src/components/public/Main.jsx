import React, { useState } from "react";
import { Card, Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { AgentContext } from "../../utils/Contexts/AgentContext";
import NavBar from "./NavBar";
import Events from "./Events";

export default function Main() {
  const [agent, setAgent] = useState(null);
  return (
    <AgentContext.Provider value={agent}>
      <NavBar />
      <div
        style={{ height: "calc(100vh - 67px)", display: "flex" }}
      >
        <Container>
          <Routes>
            <Route
              path="/"
              element={<Events />}
            />
          </Routes>
        </Container>
      </div>
    </AgentContext.Provider>
  );
}
