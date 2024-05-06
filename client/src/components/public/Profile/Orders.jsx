import React, { useContext, useEffect, useState } from "react";
import { Badge, Card, ListGroup } from "react-bootstrap";
import ordersApi from "../../../utils/Api/public/ordersApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { fs } from "../../../utils/fs";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../utils/Contexts/UserContext";
import { AgentContext } from "../../../utils/Contexts/AgentContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();
  const agentContext = useContext(AgentContext);

  useEffect(() => {
    if (agentContext?.no_agent) navigator("/sign_in");
  }, [agentContext]);

  useEffect(() => {
    appl.setLoading(true);
    ordersApi
      .getOrders()
      .then(({ orders }) => {
        setOrders(orders);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);
  return (
    <Card>
      <Card.Header>Ваши заказы</Card.Header>
      <Card.Body>
        <ListGroup action>
          {orders.map((order) => (
            <ListGroup.Item
              className="d-flex justify-content-between align-items-start"
              action
              onClick={() => navigator("/profile/orders/" + order._id)}
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">№ {order.number}</div>
                {order.places.length}{" "}
                {fs(order.places.length, "билет", "билета", "билетов")} |{" "}
                {order.total_sum} {appl.config["pay_types.currency"]}
              </div>
              <Badge
                pill
                bg={
                  order.status === "booked"
                    ? "secondary"
                    : order.status === "canceled"
                    ? "danger"
                    : order.status === "confirmed"
                    ? "success"
                    : order.status === "blank"
                    ? "primary"
                    : "primary"
                }
              >
                {order.status === "booked"
                  ? "Забронировано"
                  : order.status === "canceled"
                  ? "Отменен"
                  : order.status === "confirmed"
                  ? "Подтвержден"
                  : order.status === "blank"
                  ? "Черновик"
                  : order.status}
              </Badge>
              <Badge pill bg={order.is_payed ? "secondary" : "danger"}>
                {order.is_payed ? "Оплачен" : "Не оплачен"}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
