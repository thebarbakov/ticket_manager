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
import { ApplContext } from "../../utils/Contexts/ApplContext";
import { AgentContext } from "../../utils/Contexts/AgentContext";
import agentApi from "../../utils/Api/public/agentApi";
import registrationApi from "../../utils/Api/public/registrationApi";
import ordersApi from "../../utils/Api/public/ordersApi";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

export default function CreateOrder({
  isModalShow,
  onCloseModal,
  getMe,
  event,
  order,
  hallPlaces,
  placesTariff,
  tariffs,
}) {
  const agentContext = useContext(AgentContext);
  const appl = useContext(ApplContext);
  const [step, setStep] = useState(1);

  const [localOrder, setLocalOrder] = useState({});
  const [places, setPlaces] = useState([]);
  const [payTypes, setPayTypes] = useState([]);
  const [promocode, setPromocode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [payType, setPayType] = useState("");
  const [discountError, setDiscountError] = useState(null);

  const [agent, setAgent] = useState({});
  const [validated, setValidated] = useState(false);

  const navigator = useNavigate();

  const onChangeAgent = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    event.preventDefault();
    if (agentContext) {
      const editor = {};
      Object.keys(agent).forEach((field) => {
        if (agent[field] !== agentContext[field]) editor[field] = agent[field];
      });
      if (Object.keys(editor).length !== 0) {
        agentApi
          .editMe(editor)
          .then(() => {
            getMe();
            setStep(2);
            preCreateOrder();
          })
          .catch((err) => {
            if (err.message) appl.setError(err.message);
          })
          .finally(() => appl.setLoading(false));
      } else {
        setStep(2);
        preCreateOrder();
      }
    } else {
      registrationApi
        .signUp(agent)
        .then(({ agent }) => {
          getMe();
          setAgent(agent);
          setStep(2);
          preCreateOrder(agent);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  };

  const preCreateOrder = (agent) => {
    appl.setLoading(true);
    ordersApi
      .preCreate({
        agent_id: agent ? agent._id : agentContext._id,
        places: order.places,
        event_id: event._id,
      })
      .then(({ order, pay_types, places }) => {
        setLocalOrder(order);
        setPayTypes(pay_types);
        setPlaces(places);
        setPromoError(null);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const applyPromocode = () => {
    appl.setLoading(true);
    ordersApi
      .applyPromocode({
        order_id: localOrder._id,
        promocode: promocode,
      })
      .then(({ order, places, statusCode }) => {
        if (statusCode === 400)
          return setPromoError("Ошибка применения промокода");
        setLocalOrder(order);
        setPlaces(places);
        setPromoError(null);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
        setPromoError("Ошибка применения промокода");
      })
      .finally(() => appl.setLoading(false));
  };

  const confirmedOrder = () => {
    appl.setLoading(true);
    ordersApi
      .completeOrder({
        order_id: localOrder._id,
        pay_type_id: payType,
      })
      .then(() => {
        setStep(3);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  useEffect(() => {
    if (!agentContext) return;
    setAgent(agentContext);
  }, [agentContext, isModalShow]);

  const onClose = () => {
    setStep(1);
    setLocalOrder({});
    setPlaces([]);
    setPayTypes([]);
    setPromocode("");
    setPromoError("");
    setPayType("");
    setAgent({});
    setValidated(false);
    onCloseModal();
  };

  return (
    <Modal
      show={isModalShow}
      onHide={() => {
        onClose();
      }}
      fullscreen={"lg-down"}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Оформление заказа</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "80vh", overflowY: "scroll" }}>
        {step === 1 ? (
          <div className="d-flex flex-column">
            <Form
              style={{ width: "100%" }}
              validated={validated}
              onSubmit={handleSubmit}
            >
              <h4>Укажите свои контактные данные</h4>
              <p>На указанную почту придут билеты и данные для оплаты</p>
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Введите имя"
                  value={agent.first_name}
                  onChange={(e) => onChangeAgent(e)}
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
                  value={agent.second_name}
                  onChange={(e) => onChangeAgent(e)}
                  name="second_name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Введите email"
                  value={agent.email}
                  onChange={(e) => onChangeAgent(e)}
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
                  value={agent.phone}
                  onChange={(e) => onChangeAgent(e)}
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
              <Button type="submit">Продолжить</Button>
            </Form>
          </div>
        ) : step === 2 ? (
          <div className="d-flex flex-column">
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
                    {places.map((place) => {
                      const hallPlace = hallPlaces.find(
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
                                  ? placesTariff.find(
                                      (el) => el._id === place.places_tariff_id
                                    )?.name
                                  : event.type === "tariff"
                                  ? tariffs.find(
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
                    {places.map((place) => {
                      return (
                        <tr key={place._id}>
                          <td>
                            <div>
                              {
                                tariffs.find((el) => el._id === place.tariff_id)
                                  .name
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
                {localOrder.discount_sum ? (
                  <>
                    <p className="fw">
                      <s>
                        {localOrder.summa} {appl.config["pay_types.currency"]}
                      </s>
                    </p>
                    <p className="fw-bold fs-3">
                      {localOrder.total_sum} {appl.config["pay_types.currency"]}
                    </p>
                  </>
                ) : (
                  <p className="fw-bold fs-3">
                    {localOrder.total_sum} {appl.config["pay_types.currency"]}
                  </p>
                )}
              </div>
            </div>
            <h3>Выберите тип оплаты</h3>
            <ListGroup>
              {payTypes.map((type) => (
                <ListGroup.Item
                  action
                  onClick={() => setPayType(type._id)}
                  key={type._id}
                >
                  <Form.Check
                    type="radio"
                    name="pay_type"
                    label={type.name}
                    checked={payType === type._id}
                    onClick={() => setPayType(type._id)}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              onClick={() => confirmedOrder()}
              disabled={payType === ""}
              className="mt-3"
            >
              Оформить заказ
            </Button>
          </div>
        ) : step === 3 ? (
          <div>
            <h4>Ваш заказ успешно оформлен</h4>
            <Button
              onClick={() => navigator("/profile/orders/" + localOrder._id)}
            >
              Перейти в заказ
            </Button>
          </div>
        ) : (
          ""
        )}
      </Modal.Body>
    </Modal>
  );
}
