import React, { useContext, useEffect, useState } from "react";
import { Card, FloatingLabel, Form } from "react-bootstrap";
import Table from "../../Table/Table";
import payTypesApi from "../../../utils/Api/private/payTypesApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";

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
    payTypesApi
      .getPayTypes(filter)
      .then(({ pay_types, totalDocs }) => {
        setData(pay_types);
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
      isFilter: true,
      isSubtitle: true,
    },
    {
      field: "code",
      displayName: "Код",
      type: "text",
      isFilter: true,
      isSubtitle: true,
    },
    {
      field: "is_active",
      displayName: "Активность",
      type: "boolean",
      isFilter: true,
    },
    {
      field: "is_public",
      displayName: "Общая видимость",
      type: "boolean",
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
      <h1>Типы оплат</h1>
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
        totalDocs={totalDocs}
        editPage="/adm/pay_types/edit"
      />
    </>
  );
}
