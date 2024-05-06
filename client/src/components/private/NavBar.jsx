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
          style={{ cursor: "pointer" }}
        >
          <img src={logoLight} width={80} />
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {user.access.orders ? (
              <NavDropdown title="Заказы" id="collapsible-nav-dropdown">
                <NavDropdown.Item eventKey="/adm/orders/list">
                  Заказы
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="/adm/orders/report">
                  Отчет по продажам
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              ""
            )}
            {user.access.events ? (
              <Nav.Link eventKey="/adm/events/list">Мероприятия</Nav.Link>
            ) : (
              ""
            )}
            {user.access.agents ? (
              <Nav.Link eventKey="/adm/agents/list">Клиенты</Nav.Link>
            ) : (
              ""
            )}
            {user.access.discounts ? (
              <Nav.Link eventKey="/adm/discounts/list">Скидки</Nav.Link>
            ) : (
              ""
            )}
            {user.access.halls ? (
              <Nav.Link eventKey="/adm/halls/list">Залы</Nav.Link>
            ) : (
              ""
            )}
            {user.access.pay_types ? (
              <Nav.Link eventKey="/adm/pay_types/list">Типы оплат</Nav.Link>
            ) : (
              ""
            )}
            {user.access.tariff ? (
              <NavDropdown title="Тарифы" id="collapsible-nav-dropdown">
                <NavDropdown.Item eventKey="/adm/places_tariffs/list">
                  Места
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="/adm/tariffs/list">
                  Типы
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              ""
            )}
            {user.access.users ? (
              <Nav.Link eventKey="/adm/users/list">Пользователи</Nav.Link>
            ) : (
              ""
            )}
            {user.access.is_root ? (
              <Nav.Link eventKey="/adm/config">Настройки</Nav.Link>
            ) : (
              ""
            )}
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Nav.Link eventKey="/adm/me">{user?.first_name}</Nav.Link>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      </Container>
    </Navbar>
  );
}
