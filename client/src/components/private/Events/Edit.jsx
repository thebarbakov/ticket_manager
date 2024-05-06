import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import payTypesApi from "../../../utils/Api/private/payTypesApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import eventsApi from "../../../utils/Api/private/eventsApi";

export default function Edit() {
  const [data, setData] = useState({});
  const [halls, setHalls] = useState([]);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();
  const config = [
    {
      field: "name",
      displayName: "Название",
      type: "text",
    },
    {
      field: "description",
      displayName: "Описание",
      type: "text",
    },
    {
      field: "date",
      displayName: "Дата проведения",
      type: "date",
      withTime: true,
    },
    {
      field: "places",
      displayName: "Использование схемы зала",
      type: "boolean",
    },
    {
      field: "hall_id",
      displayName: "Выберите зал",
      type: "select",
      sourceField: "name",
      source: [{ _id: null, name: "---" }, ...halls],
    },
    {
      field: "type",
      displayName: "Тип тарифов",
      type: "select",
      sourceField: "type",
      source: [
        { _id: "", type: "---" },
        { _id: "tariff", type: "Тарифы" },
        { _id: "places", type: "Места" },
      ],
    },
    {
      field: "open_sales",
      displayName: "Начало продаж",
      type: "date",
      withTime: true,
    },
    {
      field: "close_sales",
      displayName: "Закрытие продаж",
      type: "date",
      withTime: true,
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      eventsApi
        .getEvent(urlParams.get("id"))
        .then(({ event }) => {
          setData(event);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
    eventsApi
      .preCreateEvent()
      .then(({ halls }) => {
        setHalls(halls);
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
      eventsApi
        .editEvent(data)
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      eventsApi
        .createEvent(data)
        .then(({ event }) => {
          setData(event);
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
    eventsApi
      .deleteEvent(urlParams.get("id"))
      .then(() => {
        navigator("/adm/events/list");
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
      title={data.name ? data.name : "Новое мероприятие"}
      onDelete={onDelete}
      back_href="/adm/events/list"
    />
  );
}
