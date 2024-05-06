import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import userApi from "../../../utils/Api/private/userApi";
import { Button } from "react-bootstrap";

export default function Me({ signOut, getMe }) {
  const [data, setData] = useState({});

  const appl = useContext(ApplContext);
  const navigator = useNavigate();
  const config = [
    {
      field: "first_name",
      displayName: "Имя",
      type: "text",
    },
    {
      field: "second_name",
      displayName: "Фамилия",
      type: "text",
      inputType: "text",
    },
    {
      field: "login",
      displayName: "Логин",
      type: "text",
    },
    {
      field: "email",
      displayName: "Email",
      type: "text",
      inputType: "email",
    },
    {
      field: "password",
      displayName: "Пароль",
      type: "text",
      inputType: "password",
    },
  ];

  useEffect(() => {
    appl.setLoading(true);
    userApi
      .getMe()
      .then(({ user }) => {
        setData(user);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    appl.setLoading(true);
    userApi
      .editMe(data)
      .then(() => {
        getMe();
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <Form
      setData={setData}
      data={data}
      config={config}
      onSubmit={onSubmit}
      title={data.first_name}
      me={true}
    >
      <Button onClick={() => signOut()} variant="danger">
        Выход
      </Button>
    </Form>
  );
}
