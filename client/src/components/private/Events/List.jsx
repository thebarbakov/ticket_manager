import React, { useContext, useEffect, useState } from "react";
import Table from "../../Table/Table";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";
import hallsApi from "../../../utils/Api/private/hallsApi";
import eventsApi from "../../../utils/Api/private/eventsApi";

export default function List() {
  const [filter, setFilter] = useState({
    p: 1,
    s: 20,
  });
  const [data, setData] = useState([]);
  const [totalDocs, setTotalDocs] = useState(1);

  const appl = useContext(ApplContext);

  const getData = () => {
    appl.setLoading(true);
    eventsApi
      .getEvents(filter)
      .then(({ events, totalDocs }) => {
        setData(events);
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
      inputType: "text",
      isSubtitle: true,
      isFilter: true,
    },
    {
      field: "date",
      displayName: "Дата",
      type: "date",
      inputType: "date",
      isSubSubtitle: true,
      isFilter: true,
      range: true,
    },
    {
      field: "open_sales",
      displayName: "Начало продаж",
      type: "date",
      inputType: "date",
    },
    {
      field: "close_sales",
      displayName: "Конец продаж",
      type: "date",
      inputType: "date",
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
      <h1>Залы</h1>
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
        editPage="/adm/events/edit"
        totalDocs={totalDocs}
      />
    </>
  );
}
