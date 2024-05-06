import React, { useContext, useEffect, useState } from "react";
import Table from "../../Table/Table";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";
import userApi from "../../../utils/Api/private/userApi";

export default function List() {
  const [filter, setFilter] = useState({
    p: 1,
    s: 20,
  });
  const [data, setData] = useState([]);
  const [totalDocs, setTotalDocs] = useState(1);
  setTotalDocs(totalDocs);

  const appl = useContext(ApplContext);

  const getData = () => {
    appl.setLoading(true);
    userApi
      .getUsers(filter)
      .then(({ users, totalDocs }) => {
        setData(users);
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
      field: "second_name",
      displayName: "Фамилия",
      type: "text",
      inputType: "text",
      isFilter: true,
      isTitle: true,
      isSubtitle: false,
      isSubSubtitle: false,
    },
    {
      field: "first_name",
      displayName: "Имя",
      isFilter: true,
      isSubtitle: true,
      type: "text",
    },
    {
      field: "login",
      displayName: "Логин",
      isFilter: true,
      type: "text",
    },
    {
      field: "is_active",
      displayName: "Активность",
      isFilter: true,
      type: "boolean",
    },
  ];

  return (
    <>
      <h1>Пользователи</h1>
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
        editPage="/adm/users/edit"
        totalDocs={totalDocs}
      />
    </>
  );
}
