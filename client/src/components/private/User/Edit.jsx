import React, { useContext, useEffect, useState } from "react";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import userApi from "../../../utils/Api/private/userApi";
import Form from "../../Form/Form";
import { UserContext } from "../../../utils/Contexts/UserContext";
import { Form as FormB } from "react-bootstrap";

export default function Edit() {
  const [data, setData] = useState({ access: {} });

  const appl = useContext(ApplContext);
  const user = useContext(UserContext);
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

  const onChangeAccess = (e) => {
    setData({
      ...data,
      access: { ...data.access, [e.target.name]: !data.access[e.target.name] },
    });
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
    >
      <h5>Доступы</h5>
      {data.access ? (
        <div className="d-flex flex-column">
          <FormB.Check
            className={`${user.access.scanner ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Сканнер"
            name="scanner"
            checked={data.access.scanner === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${
              user.access.set_pay_status ? "d-block" : "d-none"
            } m-2`}
            type="switch"
            label=" Менять статус оплаты"
            name="set_pay_status"
            checked={data.access.set_pay_status === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.orders ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Заказы"
            name="orders"
            checked={data.access.orders === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.pay_types ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Типы Оплат"
            name="pay_types"
            checked={data.access.pay_types === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.events ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" События"
            name="events"
            checked={data.access.events === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.halls ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Залы"
            name="halls"
            checked={data.access.halls === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.agents ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Клиенты"
            name="agents"
            checked={data.access.agents === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.users ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Пользователи"
            name="users"
            checked={data.access.users === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.discounts ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Скидки"
            name="discounts"
            checked={data.access.discounts === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.users ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Пользователи"
            name="users"
            checked={data.access.users === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.tariff ? "d-block" : "d-none"} m-2`}
            type="switch"
            label=" Тарифы"
            name="tariff"
            checked={data.access.tariff === true ? "on" : ""}
            onChange={onChangeAccess}
          />
          <FormB.Check
            className={`${user.access.cancelToPay ? "d-block" : "d-none"} m-2`}
            type="is_root"
            label=" Полный доступ"
            name="is_root"
            checked={data.access.is_root === true ? "on" : ""}
            onChange={onChangeAccess}
          />
        </div>
      ) : (
        ""
      )}
    </Form>
  );
}
