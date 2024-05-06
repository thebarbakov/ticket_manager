import ApiPrivate from "./ApiPrivate";

class TariffsApi extends ApiPrivate {
  getTariffs(params) {
    return fetch(this._baseURL + "tariffs/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getTariff(tarrif_id) {
    return fetch(this._baseURL + "tariffs/" + tarrif_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createTariff({ event_id, name, description, limit, is_on_limit, price }) {
    return fetch(this._baseURL + "tariffs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id,
        name,
        description,
        limit,
        is_on_limit,
        price,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editTariff({ event_id, name, description, limit, is_on_limit, price, _id }) {
    return fetch(this._baseURL + "tariffs/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id,
        name,
        description,
        limit,
        is_on_limit,
        price,
        _id,
      }),
    }).then((res) => this._checkResponse(res));
  }

  preCreateTariff() {
    return fetch(this._baseURL + "tariffs/creation_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  deleteTariff(tarrif_id) {
    return fetch(this._baseURL + "tariffs/" + tarrif_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const tariffsApi = new TariffsApi();

export default tariffsApi;
