import React, { useContext, useEffect, useState } from "react";
import Table from "../../Table/Table";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";
import hallsApi from "../../../utils/Api/private/hallsApi";

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
    hallsApi
      .getHalls(filter)
      .then(({ halls, totalDocs }) => {
        setData(halls);
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
      field: "address",
      displayName: "Описание",
      type: "text",
      isSubtitle: true,
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
        editPage="/adm/halls/edit"
        totalDocs={totalDocs}
      />
    </>
  );
}
