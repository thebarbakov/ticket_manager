import ApiPrivate from "./ApiPrivate";

class DiscountApi extends ApiPrivate {
  getDiscounts(params) {
    return fetch(this._baseURL + "discounts/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getDiscount(discount_id) {
    return fetch(this._baseURL + "discounts/" + discount_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createDiscount({
    name,
    publicName,
    is_on,
    limit_is_active,
    limit,
    tariff_available,
    places_tariff_available,
    promocode,
    summa,
    percent,
    max_summa,
    min_summa,
    max_places,
    condition_min_summa,
    condition_max_summa,
    condition_min_places,
    condition_max_places,
  }) {
    return fetch(this._baseURL + "discounts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        publicName,
        is_on,
        limit_is_active,
        limit,
        tariff_available,
        places_tariff_available,
        promocode,
        summa,
        percent,
        max_summa,
        min_summa,
        max_places,
        condition_min_summa,
        condition_max_summa,
        condition_min_places,
        condition_max_places,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editDiscount({
    _id,
    name,
    publicName,
    is_on,
    limit_is_active,
    limit,
    tariff_available,
    places_tariff_available,
    promocode,
    summa,
    percent,
    max_summa,
    min_summa,
    max_places,
    condition_min_summa,
    condition_max_summa,
    condition_min_places,
    condition_max_places,
  }) {
    return fetch(this._baseURL + "discounts/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        name,
        publicName,
        is_on,
        limit_is_active,
        limit,
        tariff_available,
        places_tariff_available,
        promocode,
        summa,
        percent,
        max_summa,
        min_summa,
        max_places,
        condition_min_summa,
        condition_max_summa,
        condition_min_places,
        condition_max_places,
      }),
    }).then((res) => this._checkResponse(res));
  }

  preCreateDiscount() {
    return fetch(this._baseURL + "discounts/creation_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  deleteDiscount(discount_id) {
    return fetch(this._baseURL + "discounts/" + discount_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const discountsApi = new DiscountApi();

export default discountsApi;
