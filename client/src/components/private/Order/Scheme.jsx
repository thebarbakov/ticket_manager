import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import ordersApi from "../../../utils/Api/private/ordersApi";
import HallScheme from "../../HallScheme/HallScheme";
import { useNavigate } from "react-router-dom";

export default function Scheme() {
  const [events, setEvents] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [order, setOrder] = useState(null);
  const [scheme, setScheme] = useState();
  const navigator = useNavigate();
  const appl = useContext(ApplContext);

  useEffect(() => {
    appl.setLoading(true);
    ordersApi
      .getEventsInfo()
      .then(({ events, halls }) => {
        setHalls(halls);
        setEvents(events);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPlace.length > 1)
      setSelectedPlace(selectedPlace.filter((_, ind) => ind === 1));
  }, [selectedPlace]);

  useEffect(() => {
    if (!selectedPlace[0]) return;
    setSelectedOrder(scheme.places.find((el) => el._id === selectedPlace[0]));
  }, [selectedPlace]);

  const downloadScheme = (event_id) => {
    appl.setLoading(true);
    ordersApi
      .getSchemeOrders(event_id)
      .then((res) => {
        setScheme(res);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  useEffect(() => {
    if (!selectedOrder) return;
    ordersApi
      .getOrder(selectedOrder.order.order_id)
      .then((res) => {
        setOrder(res);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, [selectedOrder]);

  return (
    <Card className="">
      <Card.Body>
        <Card.Title>Заказы по схеме мест</Card.Title>
        <Form.Group className="mb-3">
          <Form.Label>Мероприятие</Form.Label>
          <Form.Select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              downloadScheme(e.target.value);
            }}
            name={"event_id"}
          >
            <option>---</option>
            {events
              ? events.map((el) => (
                  <option value={el._id} key={el._id}>
                    {el.name}
                  </option>
                ))
              : ""}
          </Form.Select>
        </Form.Group>
        {scheme ? (
          <>
            <h4>{scheme.event.name}</h4>
            <HallScheme
              hall={scheme.hall}
              places={scheme.places}
              setSelectedPlaces={setSelectedPlace}
              selectedPlace={selectedPlace}
              ordersScheme={true}
            />
          </>
        ) : (
          ""
        )}
        {order ? (
          <Card>
            <Card.Body>
              <strong>Заказ №{order.order.number}</strong>
              <p>
                Клиент: {order.order.agent.second_name}{" "}
                {order.order.agent.first_name}
              </p>
              <p>
                Сумма: {order.order.total_sum}{" "}
                {appl.config["pay_types.currency"]}
              </p>
              <p>Места в заказе</p>
              {order.places.map(({ place }) => (
                <p>
                  {place.row} ряд, {place.place} место
                </p>
              ))}
              <Button
                onClick={() =>
                  navigator("/adm/orders/edit?id=" + order.order._id)
                }
              >
                Перейти
              </Button>
            </Card.Body>
          </Card>
        ) : (
          ""
        )}
      </Card.Body>
    </Card>
  );
}
