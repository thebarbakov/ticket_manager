import ApiPrivate from "./ApiPrivate";

class PayTypesApi extends ApiPrivate {
  getPayTypes(params) {
    return fetch(this._baseURL + "pay_types/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getPayType(pay_type_id) {
    return fetch(this._baseURL + "pay_types/" + pay_type_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createPayType({ is_active, name, description, is_public, code }) {
    return fetch(this._baseURL + "pay_types/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active,
        name,
        description,
        is_public,
        code,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editPayType({ is_active, name, description, is_public, _id, code }) {
    return fetch(this._baseURL + "pay_types/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active,
        name,
        description,
        is_public,
        _id,
        code,
      }),
    }).then((res) => this._checkResponse(res));
  }

  deletePayType(pay_type_id) {
    return fetch(this._baseURL + "pay_types/" + pay_type_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const payTypesApi = new PayTypesApi();

export default payTypesApi;
