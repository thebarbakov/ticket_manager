import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ApplContext } from "../../utils/Contexts/ApplContext";
import eventsApi from "../../utils/Api/public/eventsApi";
import CreateOrder from "./CreateOrder";
import Choicer from "../Choicer/Choicer";

export default function Event({ getMe }) {
  const [event, setEvent] = useState([]);
  const [hall, setHall] = useState({});
  const [places, setPlaces] = useState([]);
  const [order, setOrder] = useState({});
  const [tariffs, setTariffs] = useState([]);
  const [placesTariff, setPlacesTariff] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const appl = useContext(ApplContext);
  const { event_id } = useParams();

  useEffect(() => {
    appl.setLoading(true);
    eventsApi
      .getEvent(event_id)
      .then(({ event, hall, places, tariffs, places_tariff }) => {
        setEvent(event);
        setHall(hall);
        setPlaces(places);
        setTariffs(tariffs);
        setPlacesTariff(places_tariff);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  const onCloseModal = () => {
    setIsModalShow(false);
    setOrder({});
    setSelectedPlaces([]);
    appl.setLoading(true);
    eventsApi
      .getEvent(event_id)
      .then(({ event, hall, places, tariffs, places_tariff }) => {
        setEvent(event);
        setHall(hall);
        setPlaces(places);
        setTariffs(tariffs);
        setPlacesTariff(places_tariff);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <>
      <Card className="m-3">
        <Card.Header>
          <h1 className="m-0">{event.name ? event.name : "Мероприятие"}</h1>
          <p>
            {hall.name}
            {"  |  "}
            {hall.address}
          </p>
        </Card.Header>
        <Card.Body>
          <div>
            <p>{event.description}</p>
          </div>
          <Choicer
            event={event}
            placesTariff={placesTariff}
            hall={hall}
            places={places}
            setSelectedPlaces={setSelectedPlaces}
            selectedPlaces={selectedPlaces}
            order={order}
            setOrder={setOrder}
            tariffs={tariffs}
            onNext={setIsModalShow}
          />
        </Card.Body>
      </Card>
      <CreateOrder
        onCloseModal={onCloseModal}
        isModalShow={isModalShow}
        selectedPlaces={selectedPlaces}
        getMe={getMe}
        event={event}
        order={order}
        hallPlaces={places}
        tariffs={tariffs}
        placesTariff={placesTariff}
      />
    </>
  );
}
