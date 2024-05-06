import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import userApi from "../../../utils/Api/private/userApi";

export default function Edit() {
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
      field: "is_active",
      displayName: "Активность",
      type: "boolean",
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      userApi
        .getUser(urlParams.get("id"))
        .then(({ user }) => {
          setData(user);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    if (urlParams.has("id")) {
      userApi
        .editUser(data)
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      userApi
        .createUser(data)
        .then(({ user }) => {
          setData(user);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  };

  const onDelete = () => {
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    userApi
      .deleteUser(urlParams.get("id"))
      .then(() => {
        navigator("/adm/users/list");
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
      title={data.first_name ? data.first_name : "Новый пользователь"}
      onDelete={onDelete}
      back_href="/adm/users/list"
    />
  );
}
