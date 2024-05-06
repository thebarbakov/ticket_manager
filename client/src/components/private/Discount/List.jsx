import React, { useContext, useEffect, useState } from "react";
import Table from "../../Table/Table";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";
import discountsApi from "../../../utils/Api/private/discountApi";

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
    discountsApi
      .getDiscounts(filter)
      .then(({ discounts, totalDocs }) => {
        setData(discounts);
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
      field: "publicName",
      displayName: "Название на сайте",
      isFilter: true,
      type: "text",
    },
    {
      field: "promocode",
      displayName: "Промокод",
      type: "text",
    },
    {
      field: "is_on",
      displayName: "Активность",
      isFilter: true,
      type: "boolean",
    },
    {
      field: "summa",
      displayName: "Сумма",
      type: "number",
    },
    {
      field: "percent",
      displayName: "Процент",
      type: "number",
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
      <h1>Скидки</h1>
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
        editPage="/adm/discounts/edit"
        totalDocs={totalDocs}
      />
    </>
  );
}
