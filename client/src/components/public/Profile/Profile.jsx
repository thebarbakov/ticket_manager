import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Form } from "react-bootstrap";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { AgentContext } from "../../../utils/Contexts/AgentContext";
import avatar from "../../../media/images/avatar.png";
import agentApi from "../../../utils/Api/public/agentApi";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

export default function Profile({ signOut, getMe }) {
  const [agent, setAgent] = useState({});
  const appl = useContext(ApplContext);
  const agentContext = useContext(AgentContext);
  const navigator = useNavigate();

  useEffect(() => {
    if (agentContext?.no_agent) navigator("/sign_in");
  }, [agentContext]);

  useEffect(() => {
    if (!agentContext) return;
    setAgent(agentContext);
  }, [agentContext]);

  const onChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const editor = {};
    Object.keys(agent).forEach((field) => {
      if (agent[field] !== agentContext[field]) editor[field] = agent[field];
    });
    if (Object.keys(editor).length !== 0) {
      appl.setLoading(true);
      agentApi
        .editMe(editor)
        .then(() => {
          getMe();
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  };

  return (
    <Card className="">
      <Card.Body>
        <Button
          variant="secondary"
          className="mb-3"
          style={{ width: "100%" }}
          onClick={() => navigator("/profile/orders")}
        >
          Мои заказы
        </Button>
        <div>
          <img
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              borderColor: "#000",
              borderWidth: 0.75,
            }}
            src={avatar}
          />
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                value={agent.first_name}
                onChange={(e) => onChange(e)}
                name="first_name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Фамилия</Form.Label>
              <Form.Control
                type="text"
                value={agent.second_name}
                onChange={(e) => onChange(e)}
                name="second_name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={agent.email}
                onChange={(e) => onChange(e)}
                name="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Телефон</Form.Label>
              <InputMask
                mask="+7 (999) 999 99-99"
                value={agent.phone}
                onChange={onChange}
              >
                {(inputProps) => (
                  <Form.Control type="tel" {...inputProps} name="phone" />
                )}
              </InputMask>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <ButtonGroup>
                <Button variant="outline-danger" onClick={() => signOut()}>
                  Выйти
                </Button>
                <Button variant="secondary" type="submit">
                  Сохранить
                </Button>
              </ButtonGroup>
            </div>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
}
