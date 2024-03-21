import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import registrationApi from "../../../utils/Api/private/registrationApi";

export default function SignIn({ setUser }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onClick = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { login, password } = form;
    registrationApi
      .signIn({ login, password })
      .then(({ user }) => setUser(user))
      .catch((err) => {
        if (err.message) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Form onSubmit={(e) => onClick(e)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Логин</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите Логин"
          value={form.login}
          onChange={onChange}
          name="login"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          type="password"
          placeholder="Введите пароль"
          value={form.password}
          onChange={onChange}
          name="password"
          autoComplete="current-password"
        />
      </Form.Group>
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
  );
}
