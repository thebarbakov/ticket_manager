import React, { useContext, useEffect, useState } from "react";
import { Card, FloatingLabel, Form } from "react-bootstrap";
import Table from "../../Table/Table";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import Filters from "../../Table/Filters";
import ordersApi from "../../../utils/Api/private/ordersApi";

export default function List() {
  const [filter, setFilter] = useState({
    p: 1,
    s: 20,
  });
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [payTypes, setPayTypes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [totalDocs, setTotalDocs] = useState(1);

  const appl = useContext(ApplContext);

  const getData = () => {
    appl.setLoading(true);
    ordersApi
      .getOrders(filter)
      .then(({ orders, events, pay_types, agents, totalDocs }) => {
        setData(orders);
        setEvents(events);
        setPayTypes(pay_types);
        setAgents(agents);
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
    // {
    //   field: "event_id",
    //   displayName: "Мероприятие",
    //   type: "text",
    //   inputType: "text",
    //   isFilter: true,
    //   isTitle: true,
    //   isSubtitle: false,
    //   isSubSubtitle: false,
    // },
    {
      field: "event_id",
      displayName: "Мероприятие",
      type: "select",
      sourceField: "name",
      isFilter: true,
      isTitle: true,
      source: [{ _id: "", name: "---" }, ...events],
    },
    {
      field: "created_date",
      displayName: "Дата",
      type: "date",
      inputType: "date",
      isSubtitle: true,
      isFilter: true,
      range: true,
    },
    {
      field: "agent_id",
      displayName: "Клиент",
      isFilter: true,
      source: [{ _id: "", name: "---" }, ...agents],
      sourceField: ["first_name", "second_name"],
      type: "select",
    },
    {
      field: "status",
      displayName: "Статус",
      isFilter: true,
      source: [
        { _id: "", name: "---" },
        { _id: "blank", name: "Черновик" },
        { _id: "booked", name: "Забронировано" },
        { _id: "confirmed", name: "Подтверждено" },
        { _id: "canceled", name: "Отменено" },
      ],
      sourceField: "name",
      type: "select",
    },
    {
      field: "is_payed",
      displayName: "Статус оплаты",
      isFilter: true,
      type: "boolean",
    },
    {
      field: "pay_type_id",
      displayName: "Способ оплаты",
      isFilter: true,
      source: [{ _id: "", name: "---" }, ...payTypes],
      sourceField: "name",
      type: "select",
    },
    {
      field: "total_sum",
      displayName: "Сумма",
      type: "number",
      inputType: "number",
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
      <h1>Заказы</h1>
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
        editPage="/adm/orders/edit"
        onCreate="/adm/orders/new"
        totalDocs={totalDocs}
      />
    </>
  );
}
