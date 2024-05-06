import React, { useContext, useEffect } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import { ApplContext } from "../../utils/Contexts/ApplContext";
import HallScheme from "../HallScheme/HallScheme";
import { fs } from "../../utils/fs";

export default function Choicer({
  event,
  placesTariff,
  hall,
  places,
  setSelectedPlaces,
  selectedPlaces,
  order,
  setOrder,
  tariffs,
  onNext,
}) {
  
  const appl = useContext(ApplContext);

  useEffect(() => {
    if (selectedPlaces.length === 0) return;
    if (event.type === "places") {
      setOrder({
        places: selectedPlaces.map((el) => {
          return {
            place_id: el,
            tariff_id: places.find((le) => le._id === el)?.tariff,
          };
        }),
      });
    } else if (event.type === "tariff") {
      setOrder({
        places: selectedPlaces.map((le) => {
          return {
            place_id: le,
            tariff_id: tariffs[0]._id,
          };
        }),
      });
    }
  }, [selectedPlaces]);

  return (
    <>
      {event.places === true ? (
        <div className="mt-2">
          <div>
            {placesTariff
              ? placesTariff.map((tariff) => (
                  <div
                    className="d-flex flex-wrap mb-3 justify-content-center"
                    style={{ gap: 10 }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{
                        backgroundColor: tariff.color,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                      }}
                    />
                    <p className="mb-0 ms-1">
                      – {tariff.price} {appl.config["pay_types.currency"]}
                    </p>
                  </div>
                ))
              : ""}
          </div>
          <HallScheme
            hall={hall}
            places={places}
            setSelectedPlaces={setSelectedPlaces}
            selectedPlace={selectedPlaces}
          />
          <div
            className="d-flex align-items-center justify-content-center flex-md-row flex-column flex-nowrap"
            style={{ overflow: "hidden", maxWidth: "100%" }}
          >
            <div
              className="mt-2"
              style={{ overflowX: "scroll", maxWidth: "100%" }}
            >
              <div className="d-flex flex-row" style={{ gap: 10 }}>
                {order.places &&
                  order.places.map((place) => {
                    const hallPlace = places.find(
                      (el) => el._id === place.place_id
                    );
                    return (
                      <Card style={{ width: 200, minWidth: 200 }}>
                        <Card.Header>
                          <p className="mb-1 fw-bold">
                            {hallPlace.row} ряд, {hallPlace.place} место
                          </p>
                        </Card.Header>
                        <Card.Body>
                          <p className="mb-1">
                            {event.type === "places" ? (
                              placesTariff.find(
                                (tariff) => tariff._id === place.tariff_id
                              )?.name
                            ) : event.type === "tariff" ? (
                              <Form.Select
                                value={place.tariff_id}
                                onChange={(e) =>
                                  setOrder({
                                    ...order,
                                    places: order.places.map((pl) => {
                                      if (pl.place_id === place.place_id) {
                                        return {
                                          ...pl,
                                          tariff_id: e.target.value,
                                        };
                                      } else return pl;
                                    }),
                                  })
                                }
                              >
                                {tariffs?.map((el) => (
                                  <option value={el._id} key={el._id}>
                                    {el.name}
                                  </option>
                                ))}
                              </Form.Select>
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="m-1">
                            {event.type === "places"
                              ? placesTariff.find(
                                  (tariff) => tariff._id === place.tariff_id
                                )?.price
                              : event.type === "tariff"
                              ? tariffs.find(
                                  (tariff) => tariff._id === place.tariff_id
                                ).price
                              : ""}
                            {appl.config["pay_types.currency"]}
                          </p>
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </div>
            {selectedPlaces.length !== 0 ? (
              <div className="ms-3 d-flex flex-column p-2 justify-content-center col-md-3 col">
                <p className="fw-bold text-center">
                  Итого: {selectedPlaces.length}{" "}
                  {fs(selectedPlaces.length, "билет", "билета", "билетов")}
                </p>
                <Button onClick={() => onNext(true)}>
                  Перейти к оформлению
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : event.places === false ? (
        <>
          <Table hover>
            <thead>
              <tr>
                <th>Тарифы</th>
                <th>Количество</th>
                <th>Осталось</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((tariff) => (
                <tr>
                  <td>{tariff.name}</td>
                  <td>
                    <div className="d-flex">
                      <Button
                        onClick={() =>
                          setOrder({
                            ...order,
                            places: order.places?.filter(
                              (el, ind) =>
                                ind + 1 <
                                order.places?.filter(
                                  (el) => el.tariff_id === tariff._id
                                ).length
                            ),
                          })
                        }
                      >
                        -
                      </Button>
                      <div className="p-2 me-2 ms-2 fw-bold">
                        {order.places?.filter(
                          (el) => el.tariff_id === tariff._id
                        )?.length
                          ? order.places?.filter(
                              (el) => el.tariff_id === tariff._id
                            )?.length
                          : 0}
                      </div>
                      <Button
                        onClick={() => {
                          if (
                            order.places?.length >=
                            appl.config["orders.max_tickets"]
                          )
                            return appl.setError(
                              "Превышено максимальное количество билетов в заказе"
                            );
                          if (order.places) {
                            setOrder({
                              ...order,
                              places: [
                                ...order.places,
                                { tariff_id: tariff._id },
                              ],
                            });
                          } else {
                            setOrder({
                              ...order,
                              places: [{ tariff_id: tariff._id }],
                            });
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{tariff.limit_left}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {order.places?.length ? (
            <Button onClick={() => onNext(true)} className="mt-2">
              Перейти к оформлению
            </Button>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
