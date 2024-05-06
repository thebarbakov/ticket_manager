import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import registrationApi from "../../../utils/Api/public/registrationApi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../utils/Contexts/UserContext";

export default function SignIn({ getMe }) {
  const [form, setForm] = useState({});
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isEmailSent) {
      const { email, code } = form;
      registrationApi
        .signIn({ email, code })
        .then(({ user }) => {
          getMe();
          setTimeout(() => navigator("/profile"), 100);
        })
        .catch((err) => {
          if (err.message) setError(err.message);
        })
        .finally(() => setIsLoading(false));
    } else {
      const { email } = form;
      registrationApi
        .sendCode({ email })
        .then(() => {
          setIsEmailSent(true);
          setError(null);
        })
        .catch((err) => {
          if (err.message) setError(err.message);
        })
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <div className="d-flex justify-content-center">
      <Card style={{ maxWidth: 500, width: "80%" }} className="mt-4">
        <Card.Header>Авторизация</Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Введите Email"
                value={form.email}
                onChange={onChange}
                name="email"
              />
            </Form.Group>
            {isEmailSent ? (
              <Form.Group className="mb-3">
                <Form.Label>Код из Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите код"
                  value={form.code}
                  onChange={onChange}
                  name="code"
                />
              </Form.Group>
            ) : (
              ""
            )}
            {error ? <p className="text-danger">{error}</p> : ""}
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              Войти
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
