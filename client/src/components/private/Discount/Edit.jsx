import React, { useContext, useEffect, useState } from "react";
import Form from "../../Form/Form";
import { ApplContext } from "../../../utils/Contexts/ApplContext";
import { useNavigate } from "react-router-dom";
import discountsApi from "../../../utils/Api/private/discountApi";

export default function Edit() {
  const [data, setData] = useState({});

  const [tariffsPlaces, setTariffsPlaces] = useState([]);
  const [tariffs, setTariffs] = useState([]);

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
      field: "publicName",
      displayName: "Название на сайте",
      type: "text",
      inputType: "text",
    },
    {
      field: "is_on",
      displayName: "Активность",
      type: "boolean",
    },
    {
      field: "limit_is_active",
      displayName: "Использовать лимит",
      type: "boolean",
    },
    {
      field: "limit",
      displayName: "Кол-во",
      type: "text",
      inputType: "number",
    },
    {
      field: "tariff_available",
      displayName: "Разрешенные тарифы",
      type: "multy_select",
      sourceField: "name",
      sourceArrayKey: "tariff_id",
      source: [{ _id: "", name: "---" }, ...tariffs],
    },
    {
      field: "places_tariff_available",
      displayName: "Разрешенные тарифы/места",
      type: "multy_select",
      sourceField: "name",
      sourceArrayKey: "places_tariff_id",
      source: [{ _id: "", name: "---" }, ...tariffsPlaces],
    },
    {
      field: "promocode",
      displayName: "Промокод",
      type: "text",
    },
    {
      field: "summa",
      displayName: "Сумма",
      type: "text",
      inputType: "number",
    },
    {
      field: "percent",
      displayName: "Процент",
      type: "text",
      inputType: "number",
    },
    {
      field: "max_summa",
      displayName: "Максимальная сумма скидки",
      type: "text",
      inputType: "number",
    },
    {
      field: "min_summa",
      displayName: "Минимальная сумма скидки",
      type: "text",
      inputType: "number",
    },
    {
      field: "max_places",
      displayName: "Максимальное кол-во мест",
      type: "text",
      inputType: "number",
    },
    {
      field: "condition_min_summa",
      displayName: "Минимальная сумма для автоматического срабатывания скидки",
      type: "text",
      inputType: "number",
    },
    {
      field: "condition_max_summa",
      displayName: "Максимальная сумма для автоматического срабатывания скидки",
      type: "text",
      inputType: "number",
    },
    {
      field: "condition_min_places",
      displayName:
        "Минимальная кол-во мест для автоматического срабатывания скидки",
      type: "text",
      inputType: "number",
    },
    {
      field: "condition_max_places",
      displayName:
        "Максимальное кол-во мест для автоматического срабатывания скидки",
      type: "text",
      inputType: "number",
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
      appl.setLoading(true);
      discountsApi
        .getDiscount(urlParams.get("id"))
        .then(({ discount, tariffs, tariffs_places }) => {
          setData(discount);
          setTariffs(tariffs);
          setTariffsPlaces(tariffs_places);
        })
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    }
    appl.setLoading(true);
    discountsApi
      .preCreateDiscount()
      .then(({ tariffs, tariffs_places }) => {
        setTariffs(tariffs);
        setTariffsPlaces(tariffs_places);
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
      discountsApi
        .editDiscount(data)
        .catch((err) => {
          if (err.message) appl.setError(err.message);
        })
        .finally(() => appl.setLoading(false));
    } else {
      discountsApi
        .createDiscount(data)
        .then(({ discount }) => {
          setData(discount);
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
    discountsApi
      .deleteDiscount(urlParams.get("id"))
      .then(() => {
        navigator("/adm/discounts/list");
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
      title={data.name ? data.name : "Новая скидка"}
      onDelete={onDelete}
      back_href="/adm/discounts/list"
    />
  );
}
