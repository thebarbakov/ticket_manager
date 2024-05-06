import ApiPrivate from "./ApiPrivate";

class HallsApi extends ApiPrivate {
  getHalls(params) {
    return fetch(this._baseURL + "halls/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getHall(hall_id) {
    return fetch(this._baseURL + "halls/" + hall_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createHall({ name, address, scheme_file, scheme_file_name, file_name }) {
    return fetch(this._baseURL + "halls/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        scheme_file,
        scheme_file_name,
        file_name,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editHall({ name, address, _id }) {
    return fetch(this._baseURL + "halls/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        _id,
      }),
    }).then((res) => this._checkResponse(res));
  }

  preCreateHall({ scheme_file, scheme_file_name }) {
    return fetch(this._baseURL + "halls/analyze_scheme", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheme_file,
        scheme_file_name,
      }),
    }).then((res) => this._checkResponse(res));
  }

  deleteHall(hall_id) {
    return fetch(this._baseURL + "halls/" + hall_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const hallsApi = new HallsApi();

export default hallsApi;
