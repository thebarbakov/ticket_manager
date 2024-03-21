import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import registrationApi from "../../../utils/Api/private/registrationApi";

export default function SignUp() {
  const [form, setForm] = useState({});
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onClick = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { first_name, second_name, login, email, password } = form;
    registrationApi
      .signUp({ first_name, second_name, login, email, password })
      .then(() => alert("OK"))
      .catch((err) => {
        if (err.message) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Form onSubmit={(e) => onClick(e)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Имя</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите Имя"
          value={form.first_name}
          onChange={onChange}
          name="first_name"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Фамилию</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите Фамилию"
          value={form.second_name}
          onChange={onChange}
          name="second_name"
        />
      </Form.Group>
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
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>E-Mail</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите E-Mail"
          value={form.email}
          onChange={onChange}
          name="email"
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
        Зарегистрироваться
      </Button>
    </Form>
  );
}
