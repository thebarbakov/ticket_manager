import React, { useContext } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { UserContext } from "../../utils/Contexts/UserContext";
import logoLight from "../../media/logo_light.svg";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const user = useContext(UserContext);
  const navigator = useNavigate();
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      data-bs-theme="dark"
      bg="primary"
      onSelect={(eventKey) => {
        navigator(eventKey);
      }}
    >
      <Container>
        <Navbar.Brand
          onClick={() => {
            navigator("/adm/");
          }}
        >
          <img src={logoLight} width={80} />
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Заказы" id="collapsible-nav-dropdown">
              <NavDropdown.Item eventKey="/adm/order/list">
                Заказы
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="/adm/order/report">
                Отчет по продажам
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link eventKey="/adm/events/list">Мероприятия</Nav.Link>
            <Nav.Link eventKey="/adm/agents/list">Клиенты</Nav.Link>
            <Nav.Link eventKey="/adm/discounts/list">Скидки</Nav.Link>
            <Nav.Link eventKey="/adm/halls/list">Залы</Nav.Link>
            <Nav.Link eventKey="/adm/pay_types/list">Типы оплат</Nav.Link>
            <NavDropdown title="Тарифы" id="collapsible-nav-dropdown">
              <NavDropdown.Item eventKey="/adm/tariff/list">
                Места
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="/adm/tariff_places/list">
                Типы
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link eventKey="/adm/me">Пользователи</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Nav.Link eventKey="#deets">{user?.first_name}</Nav.Link>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      </Container>
    </Navbar>
  );
}
