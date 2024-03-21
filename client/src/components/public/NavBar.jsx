import React, { useContext } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
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
        >
          <img src={logoLight} width={80} />
        </Navbar.Brand>
        <Nav>
          <Nav.Link eventKey="#deets">
            {agent ? agent?.first_name : "Вход"}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
