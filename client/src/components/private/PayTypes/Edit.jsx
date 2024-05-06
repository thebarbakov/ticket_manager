import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import payTypesApi from "../../../utils/Api/private/payTypesApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";

export default function Edit() {
  const [data, setData] = useState({});
  const appl = useContext(ApplContext);
  const navigator = useNavigate();
  const config = [
    {
      field: "is_active",
      displayName: "Активность",
      type: "boolean",
    },
    {
      field: "name",
      displayName: "Название",
      type: "text",
      inputType: "text",
    },
    {
      field: "description",
      displayName: "Описание",
      type: "text",
    },
    {
      field: "code",
      displayName: "Код",
      type: "text",
    },
    {
      field: "is_public",
      displayName: "Общая видимость",
      type: "boolean",
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      payTypesApi
        .getPayType(urlParams.get("id"))
        .then(({ pay_type }) => {
          setData(pay_type);
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
      payTypesApi
        .editPayType(data)
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      payTypesApi
        .createPayType(data)
        .then(({ pay_type }) => {
          setData(pay_type);
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
    payTypesApi
      .deletePayType(urlParams.get("id"))
      .then(() => {
        navigator("/adm/pay_types/list");
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
      title={data.name ? data.name : "Новый тип оплаты"}
      onDelete={onDelete}
      back_href="/adm/pay_types/list"
    />
  );
}
