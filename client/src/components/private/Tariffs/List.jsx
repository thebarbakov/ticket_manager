import React, { useContext, useEffect, useState } from "react";
import { Card, FloatingLabel, Form } from "react-bootstrap";
import Table from "../../Table/Table";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";
import tariffsApi from "../../../utils/Api/private/tariffsApi";

export default function List() {
  const [filter, setFilter] = useState({
    p: 1,
    s: 20,
  });
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [totalDocs, setTotalDocs] = useState(1);

  const appl = useContext(ApplContext);

  const getData = () => {
    appl.setLoading(true);
    tariffsApi
      .getTariffs(filter)
      .then(({ tariffs, events, totalDocs }) => {
        setData(tariffs);
        setEvents(events);
        setTotalDocs(totalDocs);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  useEffect(() => {
    getData();
  }, [filter]);

  const config = [
    {
      field: "name",
      displayName: "Название",
      type: "text",
      inputType: "text",
      isFilter: true,
      isTitle: true,
      isSubtitle: false,
      isSubSubtitle: false,
    },
    {
      field: "description",
      displayName: "Описание",
      type: "text",
      isSubtitle: true,
    },
    {
      field: "event_id",
      displayName: "Мероприятие",
      type: "select",
      sourceField: "name",
      isSubSubtitle: true,
      source: events,
      isFilter: true,
    },
    {
      field: "price",
      displayName: "Цена",
      type: "number",
      isFilter: true,
    },
    // {
    //   field: "name",
    //   displayName: "Название",
    //   type: "select",
    //   source: [],
    //   sourceField: "select",
    //   isFilter: true,
    //   isTitle: true,
    //   isSubtitle: false,
    //   isSubSubtitle: false,
    // },
  ];

  return (
    <>
      <h1>Тарифы</h1>
      <Filters
        config={config}
        setFilter={setFilter}
        filter={filter}
        getData={getData}
      />
      <Table
        config={config}
        setFilter={setFilter}
        filter={filter}
        data={data}
        editPage="/adm/tariffs/edit"
        totalDocs={totalDocs}
      />
    </>
  );
}
