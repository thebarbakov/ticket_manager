import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import payTypesApi from "../../../utils/Api/private/payTypesApi";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import tariffsApi from "../../../utils/Api/private/tariffsApi";
import placesTariffsApi from "../../../utils/Api/private/placesTariffApi";
import HallScheme from "../../HallScheme/HallScheme";

export default function Edit() {
  const [data, setData] = useState({});
  const [events, setEvents] = useState([]);
  const [hall, setHall] = useState({});
  const [selectedPlace, setSelectedPlaces] = useState([]);
  const appl = useContext(ApplContext);
  const navigator = useNavigate();
  const config = [
    {
      field: "name",
      displayName: "Название",
      type: "text",
      inputType: "text",
    },
    {
      field: "event_id",
      displayName: "Мероприятие",
      type: "select",
      sourceField: "name",
      isSubSubtitle: true,
      source: [{ _id: "", name: "---" }, ...events],
    },
    {
      field: "color",
      displayName: "Цвет",
      type: "color",
      inputType: "color",
    },
    {
      field: "price",
      displayName: "Цена",
      type: "number",
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      placesTariffsApi
        .getPlacesTariff(urlParams.get("id"))
        .then(({ places_tariff, events, hall }) => {
          setData({
            ...places_tariff,
            places: places_tariff.places.map((el) => el.id),
          });
          setSelectedPlaces(places_tariff.places.map((el) => el.id));
          setEvents(events);
          setHall(hall);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
    appl.setLoading(true);
    placesTariffsApi
      .preCreatePlacesTariff(urlParams.get("id"))
      .then(({ events }) => {
        setEvents(events);
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    if (urlParams.has("id")) {
      placesTariffsApi
        .editPlacesTariff({
          ...data,
          places: selectedPlace.map((el) => {
            return {
              id: el,
            };
          }),
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      placesTariffsApi
        .createPlacesTariff(data)
        .then(({ places_tariff }) => {
          navigator("/adm/places_tariffs/edit?id=" + places_tariff._id);
          setData(places_tariff);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
  };

  const onDelete = () => {
    const urlParams = new URLSearchParams(window.location.search);
    appl.setLoading(true);
    placesTariffsApi
      .deletePlacesTariff(urlParams.get("id"))
      .then(() => {
        navigator("/adm/places_tariffs/list");
      })
      .catch((err) => {
        if (err.message) appl.setError(err.message);
      })
      .finally(() => appl.setLoading(false));
  };

  return (
    <Form
      setData={setData}
      data={data}
      config={config}
      onSubmit={onSubmit}
      title={data.name ? data.name : "Новый тариф"}
      onDelete={onDelete}
      back_href="/adm/places_tariffs/list"
    >
      {data._id ? (
        <HallScheme
          hall={hall.hall}
          places={hall.places}
          selectedPlace={selectedPlace}
          setSelectedPlaces={setSelectedPlaces}
          color={data.color}
          service={true}
        />
      ) : (
        ""
      )}
    </Form>
  );
}
