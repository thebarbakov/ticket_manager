import ApiPrivate from "./ApiPrivate";

class PlacesTariffsApi extends ApiPrivate {
  getPlacesTariffs(params) {
    return fetch(this._baseURL + "places_tariffs/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getPlacesTariff(hall_id) {
    return fetch(this._baseURL + "places_tariffs/" + hall_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createPlacesTariff({ event_id, name, price, places, color }) {
    return fetch(this._baseURL + "places_tariffs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id, name, price, places, color
      }),
    }).then((res) => this._checkResponse(res));
  }

  editPlacesTariff({ _id, event_id, name, price, places, color }) {
    return fetch(this._baseURL + "places_tariffs/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id, event_id, name, price, places, color
      }),
    }).then((res) => this._checkResponse(res));
  }

  preCreatePlacesTariff() {
    return fetch(this._baseURL + "places_tariffs/creation_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  deletePlacesTariff(tariff_id) {
    return fetch(this._baseURL + "places_tariffs/" + tariff_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const placesTariffsApi = new PlacesTariffsApi();

export default placesTariffsApi;
