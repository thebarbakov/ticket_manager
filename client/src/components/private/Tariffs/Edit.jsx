import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import payTypesApi from "../../../utils/Api/private/payTypesApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import tariffsApi from "../../../utils/Api/private/tariffsApi";

export default function Edit() {
  const [data, setData] = useState({});
  const [events, setEvents] = useState([]);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();
  const config = [
    {
      field: "name",
      displayName: "Название",
      type: "text",
      inputType: "text",
    },
    {
      field: "event_id",
      displayName: "Мероприятие",
      type: "select",
      sourceField: "name",
      isSubSubtitle: true,
      source: [{ _id: "", name: "---" }, ...events],
    },
    {
      field: "description",
      displayName: "Описание",
      type: "text",
    },
    {
      field: "is_on_limit",
      displayName: "Использовать лимит",
      type: "boolean",
    },
    {
      field: "limit",
      displayName: "Лимит",
      type: "number",
    },

    {
      field: "price",
      displayName: "Цена",
      type: "number",
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      tariffsApi
        .getTariff(urlParams.get("id"))
        .then(({ tariff, events }) => {
          setData(tariff);
          setEvents(events);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
    appl.setLoading(true);
    tariffsApi
      .preCreateTariff(urlParams.get("id"))
      .then(({ events }) => {
        setEvents(events);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    if (urlParams.has("id")) {
      tariffsApi
        .editTariff(data)
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      tariffsApi
        .createTariff(data)
        .then(({ new_tariff }) => {
          setData(new_tariff);
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
        navigator("/adm/tariffs/list");
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
      title={data.name ? data.name : "Новый тариф"}
      onDelete={onDelete}
      back_href="/adm/tariffs/list"
    />
  );
}
