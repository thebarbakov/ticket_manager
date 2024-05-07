import React, { useContext, useEffect, useState } from "react";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Form,
  Modal,
  ModalFooter,
  Table,
} from "react-bootstrap";
import ordersApi from "../../../utils/Api/private/ordersApi";

export default function Edit() {
  const [data, setData] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isShow: false,
    action: null,
    title: "",
    ob: false,
  });

  const appl = useContext(ApplContext);
  const navigator = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      ordersApi
        .getOrder(urlParams.get("id"))
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
    appl.setLoading(true);
  }, []);

  const sendTicket = (type) => {
    appl.setLoading(true);
    const windowReference = window.open();
    ordersApi
      .getTickets({ order_id: data.order._id, type })
      .then(({ fileName }) => {
        if (type === "email")
          return setConfirmModal({
            isShow: true,
            action: null,
            title: "Успешно отправлено!",
            ob: true,
          });
        windowReference.location = "/api/assets/tickets/" + fileName;
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  const onUpdateOrder = ({ status, pay_type_id, is_payed, promocode }) => {
    appl.setLoading(true);
    ordersApi
      .editOrder({
        order_id: data.order._id,
        status,
        pay_type_id,
        is_payed,
        promocode,
      })
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => {
        appl.setLoading(false);
        setConfirmModal({
          isShow: false,
          action: null,
          title: "",
          ob: false,
        });
      });
  };

  if (!data) return "";

  return (
    <Card>
      <Card.Header>
        Заказ №{data.order.number}{" "}
        <Badge
          pill
          className="ms-4"
          bg={
            data.order.status === "booked"
              ? "secondary"
              : data.order.status === "canceled"
              ? "danger"
              : data.order.status === "confirmed"
              ? "success"
              : data.order.status === "blank"
              ? "primary"
              : "primary"
          }
        >
          {data.order.status === "booked"
            ? "Забронировано"
            : data.order.status === "canceled"
            ? "Отменен"
            : data.order.status === "confirmed"
            ? "Подтвержден"
            : data.order.status === "blank"
            ? "Черновик"
            : data.order.status}
        </Badge>
        <Badge pill bg={data.order.is_payed ? "secondary" : "danger"}>
          {data.order.is_payed ? "Оплачен" : "Не оплачен"}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Button
          variant="secondary"
          className="me-4"
          onClick={() => navigator("/adm/orders/list")}
        >
          Назад
        </Button>
        <Form>
          <p>
            Мероприятие: <strong>{data.order.event?.name}</strong> |{" "}
            {new Date(data.order.event?.date).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            Место: <strong>{data.order.hall?.name}</strong>,{" "}
            {data.order.hall?.address}
          </p>
          {data.order.pay_type ? (
            <p>
              Тип оплаты: <strong>{data.order.pay_type?.name}</strong>
            </p>
          ) : (
            ""
          )}
          <ButtonGroup>
            {data.order.status === "booked" ? (
              <Button
                variant="secondary"
                onClick={() =>
                  onUpdateOrder({
                    status: "confirmed",
                  })
                }
              >
                Подтвердить
              </Button>
            ) : (data.order.status === "confirmed") & !data.order.is_payed ? (
              <Button
                variant="secondary"
                onClick={() =>
                  onUpdateOrder({
                    is_payed: true,
                  })
                }
              >
                Оплатить
              </Button>
            ) : (
              ""
            )}
            {(data.order.status === "booked") & !data.order.is_payed ? (
              <Button
                variant="secondary"
                onClick={() =>
                  onUpdateOrder({
                    is_payed: true,
                    status: "confirmed",
                  })
                }
              >
                Подтвердить и оплатить
              </Button>
            ) : (
              ""
            )}
            {data.order.is_payed ? (
              <Button
                variant="primary"
                onClick={() =>
                  setConfirmModal({
                    isShow: true,
                    action: () =>
                      onUpdateOrder({
                        is_payed: false,
                      }),
                    title: "Вы уверены??",
                  })
                }
              >
                Снять флаг оплаты
              </Button>
            ) : (
              ""
            )}
            {data.order.status !== "canceled" ? (
              <Button
                disabled={data.order.is_payed}
                variant="danger"
                onClick={() =>
                  setConfirmModal({
                    isShow: true,
                    action: () =>
                      onUpdateOrder({
                        status: "canceled",
                      }),
                    title: "Вы уверены??",
                  })
                }
              >
                Отменить
              </Button>
            ) : (
              ""
            )}
          </ButtonGroup>
          {(data.order.status === "confirmed") & data.order.is_payed ? (
            <ButtonGroup>
              <Button variant="secondary" onClick={() => sendTicket("email")}>
                Отправить билеты на почту
              </Button>
              <Button variant="secondary" onClick={() => sendTicket("file")}>
                Открыть билеты
              </Button>
            </ButtonGroup>
          ) : (
            ""
          )}
          <Table hover>
            {data.order.event?.places === true ? (
              <>
                <thead>
                  <tr>
                    <th>Место</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {data.places.map((place) => {
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
            ) : data.order.event?.places === false ? (
              <>
                <thead>
                  <tr>
                    <th>Тариф</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {data.places.map((place) => {
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
              {data.order.discount_sum ? (
                <>
                  <p className="fw">
                    <s>
                      {data.order.summa} {appl.config["pay_types.currency"]}
                    </s>
                  </p>
                  <p className="fw-bold fs-3">
                    {data.order.total_sum} {appl.config["pay_types.currency"]}
                  </p>
                </>
              ) : (
                <p className="fw-bold fs-3">
                  {data.order.total_sum} {appl.config["pay_types.currency"]}
                </p>
              )}
            </div>
          </div>
        </Form>
      </Card.Body>
      <Modal
        show={confirmModal.isShow}
        onHide={() => {
          setConfirmModal({
            isShow: false,
            action: null,
            title: "",
            ob: false,
          });
        }}
      >
        <Modal.Header closeButton>{confirmModal.title}</Modal.Header>
        <Modal.Footer>
          {confirmModal.ob ? (
            <Button
              variant="primary"
              onClick={() => {
                setConfirmModal({
                  isShow: false,
                  action: null,
                  title: "",
                  ob: false,
                });
              }}
            >
              Ок
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  setConfirmModal({
                    isShow: false,
                    action: null,
                    title: "",
                    ob: false,
                  });
                }}
              >
                Нет
              </Button>
              <Button variant="danger" onClick={() => confirmModal.action()}>
                Да
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
