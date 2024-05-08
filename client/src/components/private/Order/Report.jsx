import React, { useContext, useEffect, useState } from "react";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import ordersApi from "../../../utils/Api/private/ordersApi";
import Filters from "../../Table/Filters";
import { Table } from "react-bootstrap";

export default function Report() {
  const [filter, setFilter] = useState({
    p: 1,
    s: 20,
  });
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  const appl = useContext(ApplContext);

  const getData = () => {
    appl.setLoading(true);
    ordersApi
      .getReport(filter)
      .then(({ report, events }) => {
        if (report) setData(report);
        if (events) setEvents(events);
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
  ];

  const count = (field) => {
    if (!data) return;
    let total = 0;
    data.forEach((pt) => (total += pt[field]));
    return total;
  }
  return (
    <>
      <h1>Заказы</h1>
      <Filters
        config={config}
        setFilter={setFilter}
        filter={filter}
        getData={getData}
      />
      <Table>
        <thead>
          <tr>
            <th>Тип оплаты</th>
            <th>Кол-во</th>
            <th>Сумма не оплаченых</th>
            <th>Сумма оплаченных</th>
            <th>Итого</th>
          </tr>
        </thead>
        <tbody>
          {data.map((payType) => (
            <tr>
              <td>{payType.name}</td>
              <td>{payType.total}</td>
              <td>
                {payType.summa_not_payed} {appl.config["pay_types.currency"]}
              </td>
              <td>
                {payType.summa_payed} {appl.config["pay_types.currency"]}
              </td>
              <td>
                {payType.summa_total} {appl.config["pay_types.currency"]}
              </td>
            </tr>
          ))}
          <tr>
            <td>Итого:</td>
            <td>
              <strong>
              {count("total")}
              </strong>
            </td>
            <td>
              <strong>
              {count("summa_not_payed")}{" "}
                {appl.config["pay_types.currency"]}
              </strong>
            </td>
            <td>
              <strong>
                {count("summa_payed")}{" "}
                {appl.config["pay_types.currency"]}
              </strong>
            </td>
            <td>
              <strong>
                {count("summa_total")}{" "}
                {appl.config["pay_types.currency"]}
              </strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
