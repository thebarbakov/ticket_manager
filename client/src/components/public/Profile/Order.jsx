import React, { useContext, useEffect, useState } from "react";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import ordersApi from "../../../utils/Api/public/ordersApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Modal,
  Table,
} from "react-bootstrap";
import { AgentContext } from "../../../utils/Contexts/AgentContext";

export default function Order() {
  const [order, setOrder] = useState({});
  const [places, setPlaces] = useState([]);
  const [openModal, setOpenModal] = useState(0);
  const appl = useContext(ApplContext);
  const { order_id } = useParams();
  const navigator = useNavigate();
  const agentContext = useContext(AgentContext);

  useEffect(() => {
    if (agentContext?.no_agent) navigator("/sign_in");
  }, [agentContext]);

  useEffect(() => {
    appl.setLoading(true);
    ordersApi
      .getOrder(order_id)
      .then(({ order, places }) => {
        setOrder(order);
        setPlaces(places);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  const onCancel = () => {
    appl.setLoading(true);
    ordersApi
      .cancelOrder(order_id)
      .then(() => {
        setOpenModal(0);
        ordersApi.getOrder(order_id).then(({ order, places }) => {
          setOrder(order);
          setPlaces(places);
        });
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const sendTicket = (type) => {
    appl.setLoading(true);
    ordersApi
      .getTickets({ order_id, type })
      .then(({ fileName }) => {
        if (type === "email") return setOpenModal(2);
        window.open("/api/assets/tickets/" + fileName, "_blank");
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <>
      <Card>
        <Card.Header>
          <strong>Заказ №{order.number}</strong>
          <Badge
            pill
            className="ms-4"
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
        </Card.Header>
        <Card.Body>
          <Button
            variant="outline-primary"
            style={{ width: "100%" }}
            className="mb-3"
            onClick={() => navigator("/profile/orders")}
          >
            Назад
          </Button>
          <p>
            Мероприятие: <strong>{order.event?.name}</strong> |{" "}
            {new Date(order.event?.date).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            Место: <strong>{order.hall?.name}</strong>, {order.hall?.address}
          </p>
          {order.pay_type ? (
            <p>
              Тип оплаты: <strong>{order.pay_type?.name}</strong>
            </p>
          ) : (
            ""
          )}
          <Table hover>
            {order.event?.places === true ? (
              <>
                <thead>
                  <tr>
                    <th>Место</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((place) => {
                    return (
                      <tr key={place._id}>
                        <td>
                          <div>
                            <p className="mb-1 fw-bold">
                              {place.place.row} ряд, {place.place.place} место
                            </p>
                            <Badge>{place.tariff.name}</Badge>
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
            ) : order.event?.places === false ? (
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
                          <div>{place.tariff.name}</div>
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
            ) : (
              ""
            )}
          </Table>
          <div className="mt-3 d-flex justify-content-between">
            <div>
              <p className="fs-3 mb-0">Итого</p>
            </div>
            <div>
              {order.discount_sum ? (
                <>
                  <p className="fw">
                    <s>
                      {order.summa} {appl.config["pay_types.currency"]}
                    </s>
                  </p>
                  <p className="fw-bold fs-3">
                    {order.total_sum} {appl.config["pay_types.currency"]}
                  </p>
                </>
              ) : (
                <p className="fw-bold fs-3">
                  {order.total_sum} {appl.config["pay_types.currency"]}
                </p>
              )}
            </div>
          </div>
          {(order.status === "confirmed") & order.is_payed ? (
            <ButtonGroup style={{ width: "100%" }}>
              <Button variant="secondary" onClick={() => sendTicket("file")}>
                Сохранить билеты
              </Button>
              <Button variant="secondary" onClick={() => sendTicket("email")}>
                Отправить билеты на почту
              </Button>
            </ButtonGroup>
          ) : (
            ""
          )}
          {(order.status === "blank" || order.status === "booked") &
          !order.is_payed ? (
            <Button
              variant="danger"
              style={{ width: "100%" }}
              onClick={() => setOpenModal(1)}
            >
              Отменить заказ
            </Button>
          ) : (
            ""
          )}
        </Card.Body>
      </Card>
      <Modal onHide={() => setOpenModal(0)} show={openModal !== 0}>
        <Modal.Header closeButton>
          {openModal === 1
            ? "Вы уверены?"
            : openModal === 2
            ? "Билеты успешно отправлены на Вашу почту"
            : ""}
        </Modal.Header>
        <Modal.Footer>
          {openModal === 1 ? (
            <>
              <Button variant="outline-primary" onClick={() => setOpenModal(0)}>
                Закрыть
              </Button>
              <Button
                variant="danger"
                className="ms-2"
                onClick={() => onCancel()}
              >
                Отменить
              </Button>
            </>
          ) : openModal === 2 ? (
            <Button variant="outline-primary" onClick={() => setOpenModal(0)}>
              Закрыть
            </Button>
          ) : (
            ""
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
