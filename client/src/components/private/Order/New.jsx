import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Choicer from "../../Choicer/Choicer";
import ordersApi from "../../../utils/Api/private/ordersApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import agentApi from "../../../utils/Api/private/agentApi";
import InputMask from "react-input-mask";

export default function New() {
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const appl = useContext(ApplContext);
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [halls, setHalls] = useState([]);
  const [hallScheme, setHallScheme] = useState();
  const [event, setEvent] = useState({});
  const [payTypes, setPayTypes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [order, setOrder] = useState({});
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({});
  const [validated, setValidated] = useState(false);
  const [localOrder, setLocalOrder] = useState({});
  const [promocode, setPromocode] = useState("");
  const [promoError, setPromoError] = useState("");

  const navigator = useNavigate();

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

  const toSecondStep = (event_id) => {
    appl.setLoading(true);
    ordersApi
      .preCreateOrder(event_id)
      .then(({ event, pay_types, agents, hall_scheme }) => {
        setHallScheme(hall_scheme);
        setAgents(agents);
        setPayTypes(pay_types);
        setEvent(event);
        setStep(2);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const toThirdStep = () => {
    setStep(3);
  };

  const toFourthStep = () => {
    appl.setLoading(true);
    ordersApi
      .createOrder({ event_id: event._id, ...order })
      .then((res) => {
        setLocalOrder(res);
        setStep(4);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const onChangeNewAgent = (e) => {
    setNewAgent({ ...newAgent, [e.target.name]: e.target.value });
  };

  const handleSubmitNewAgent = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    event.preventDefault();
    appl.setLoading(true);
    agentApi
      .createAgent(newAgent)
      .then(({ agent }) => {
        setAgents([...agents, agent]);
        setOrder({ ...order, agent_id: agent._id });
        setIsCreatingAgent(false);
        setNewAgent({});
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const applyPromocode = () => {
    appl.setLoading(true);
    ordersApi
      .editOrder({
        order_id: localOrder.order._id,
        promocode: promocode,
      })
      .then((res) => {
        if (res.statusCode === 400)
          return setPromoError("Ошибка применения промокода");
        setLocalOrder(res);
        setPromoError(null);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
        setPromoError("Ошибка применения промокода");
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <Modal
      show={true}
      fullscreen={true}
      onHide={() => navigator("/adm/orders/list")}
    >
      <Modal.Header closeButton>
        <Modal.Title>Оформление заказа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 ? (
          <>
            <h4>Выберите мероприятие</h4>
            {events.map((event) => (
              <ListGroup.Item
                key={event._id}
                action
                onClick={() => {
                  toSecondStep(event._id);
                }}
              >
                <div>
                  <p className="fw-bold fs-4 mb-1">
                    {event.name} –{" "}
                    {new Date(event.date).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    {halls.find((el) => el._id === event.hall_id)?.name}
                    {"  |  "}
                    {halls.find((el) => el._id === event.hall_id)?.address}
                  </p>
                </div>
              </ListGroup.Item>
            ))}
          </>
        ) : step === 2 ? (
          <Choicer
            event={event}
            placesTariff={hallScheme.placesTariff}
            hall={hallScheme.hall}
            places={hallScheme.places}
            setSelectedPlaces={setSelectedPlaces}
            selectedPlaces={selectedPlaces}
            order={order}
            setOrder={setOrder}
            tariffs={hallScheme.tariffs}
            onNext={toThirdStep}
          />
        ) : step === 3 ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Клиент</Form.Label>
              <Form.Select
                value={order.agent_id}
                onChange={(e) =>
                  setOrder({ ...order, agent_id: e.target.value })
                }
                name={"agent_id"}
              >
                <option>---</option>
                {agents
                  ? agents.map((el) => (
                      <option value={el._id} key={el._id}>
                        {el.first_name} {el.second_name ? el.second_name : ""}
                      </option>
                    ))
                  : ""}
              </Form.Select>
            </Form.Group>
            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => setIsCreatingAgent(true)}
            >
              Или создать
            </Button>
            {isCreatingAgent ? (
              <Form
                validated={validated}
                onSubmit={(e) => handleSubmitNewAgent(e)}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Введите имя"
                    value={newAgent.first_name}
                    onChange={(e) => onChangeNewAgent(e)}
                    name="first_name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Укажите Ваше имя
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите фамилию"
                    value={newAgent.second_name}
                    onChange={(e) => onChangeNewAgent(e)}
                    name="second_name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Введите email"
                    value={newAgent.email}
                    onChange={(e) => onChangeNewAgent(e)}
                    name="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Укажите email
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Телефон</Form.Label>
                  <InputMask
                    mask="+7 (999) 999 99-99"
                    value={newAgent.phone}
                    onChange={(e) => onChangeNewAgent(e)}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        required
                        type="tel"
                        placeholder="Введите телефон"
                        name="phone"
                      />
                    )}
                  </InputMask>
                  <Form.Control.Feedback type="invalid">
                    Укажите номер телефона
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="mb-3">
                  Создать
                </Button>
              </Form>
            ) : (
              ""
            )}
            <Form.Group className="mb-3">
              <Form.Label>Тип оплаты</Form.Label>
              <Form.Select
                value={order.pay_type_id}
                onChange={(e) =>
                  setOrder({ ...order, pay_type_id: e.target.value })
                }
                name={"pay_type_id"}
              >
                <option>---</option>
                {payTypes
                  ? payTypes.map((el) => (
                      <option value={el._id} key={el._id}>
                        {el.name}
                      </option>
                    ))
                  : ""}
              </Form.Select>
            </Form.Group>
            <Button onClick={() => toFourthStep()}>Подтвердить</Button>
          </>
        ) : step === 4 ? (
          <>
            <h4>Детали заказа</h4>
            <Table hover>
              {event.places ? (
                <>
                  <thead>
                    <tr>
                      <th>Место</th>
                      <th>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localOrder.places.map((place) => {
                      const hallPlace = hallScheme.places.find(
                        (el) => el._id === place.place_id
                      );
                      return (
                        <tr key={place._id}>
                          <td>
                            <div>
                              <p className="mb-1 fw-bold">
                                {hallPlace.row} ряд, {hallPlace.place} место
                              </p>
                              <Badge>
                                {event.type === "places"
                                  ? hallScheme.placesTariff.find(
                                      (el) => el._id === place.places_tariff_id
                                    )?.name
                                  : event.type === "tariff"
                                  ? hallScheme.tariffs.find(
                                      (el) => el._id === place.tariff_id
                                    ).name
                                  : ""}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div>
                              {place.discount_sum ? (
                                <>
                                  <p className="fw">
                                    <s>
                                      {place.price}{" "}
                                      {appl.config["pay_types.currency"]}
                                    </s>
                                  </p>
                                  <p className="fw-bold">
                                    {place.total_sum}{" "}
                                    {appl.config["pay_types.currency"]}
                                  </p>
                                </>
                              ) : (
                                <p className="fw-bold">
                                  {place.total_sum}{" "}
                                  {appl.config["pay_types.currency"]}
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              ) : (
                <>
                  <thead>
                    <tr>
                      <th>Тариф</th>
                      <th>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localOrder.places.map((place) => {
                      return (
                        <tr key={place._id}>
                          <td>
                            <div>
                              {
                                hallScheme.tariffs.find(
                                  (el) => el._id === place.tariff_id
                                ).name
                              }
                            </div>
                          </td>
                          <td>
                            <div>
                              {place.discount_sum ? (
                                <>
                                  <p className="fw">
                                    <s>{place.price}</s>
                                  </p>
                                  <p className="fw-bold">{place.total_sum}</p>
                                </>
                              ) : (
                                <p className="fw-bold">{place.total_sum}</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}
            </Table>
            <InputGroup className="mt-3">
              <Form.Control
                placeholder="Применить промокод"
                aria-label="Применить промокод"
                value={promocode}
                onChange={(e) => setPromocode(e.target.value)}
              />
              <Button
                variant="outline-primary"
                onClick={() => applyPromocode()}
              >
                Применить
              </Button>
            </InputGroup>
            <p className="text-danger">{promoError}</p>
            <div className="mt-3 d-flex justify-content-between">
              <div>
                <p className="fs-3 mb-0">Итого</p>
              </div>
              <div>
                {localOrder.order.discount_sum ? (
                  <>
                    <p className="fw">
                      <s>
                        {localOrder.order.summa}{" "}
                        {appl.config["pay_types.currency"]}
                      </s>
                    </p>
                    <p className="fw-bold fs-3">
                      {localOrder.order.total_sum}{" "}
                      {appl.config["pay_types.currency"]}
                    </p>
                  </>
                ) : (
                  <p className="fw-bold fs-3">
                    {localOrder.order.total_sum}{" "}
                    {appl.config["pay_types.currency"]}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() =>
                navigator("/adm/orders/edit?id=" + localOrder.order._id)
              }
            >
              Перейти к заказу
            </Button>
          </>
        ) : (
          ""
        )}
      </Modal.Body>
    </Modal>
  );
}
