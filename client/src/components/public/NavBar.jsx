import React, { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import logoLight from "../../media/logo.svg";
import { useNavigate } from "react-router-dom";
import { AgentContext } from "../../utils/Contexts/AgentContext";

export default function NavBar() {
  const agent = useContext(AgentContext);
  const navigator = useNavigate();
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      onSelect={(eventKey) => {
        navigator(eventKey);
      }}
    >
      <Container>
        <Navbar.Brand
          onClick={() => {
            navigator("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={logoLight} width={80} alt="Лого" />
        </Navbar.Brand>
        <Nav>
          <Nav.Link
            onClick={() =>
              Boolean(agent) & !agent?.no_agent
                ? navigator("/profile")
                : navigator("/sign_in")
            }
          >
            {Boolean(agent) & !agent?.no_agent ? agent?.first_name : "Вход"}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
