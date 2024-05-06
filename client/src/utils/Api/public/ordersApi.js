import ApiPublic from "./ApiPublic";

class OrdersApi extends ApiPublic {
  preCreate({ agent_id, places, event_id }) {
    return fetch(this._baseURL + "order/pre_create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id, places, event_id }),
    }).then((res) => this._checkResponse(res));
  }

  applyPromocode({ order_id, promocode }) {
    return fetch(this._baseURL + "order/promocode", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: order_id, promocode }),
    }).then((res) => this._checkResponse(res));
  }

  completeOrder({ order_id, pay_type_id }) {
    return fetch(this._baseURL + "order/confirme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: order_id, pay_type_id }),
    }).then((res) => this._checkResponse(res));
  }

  getOrders() {
    return fetch(this._baseURL + "order/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getOrder(order_id) {
    return fetch(this._baseURL + "order/" + order_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  cancelOrder(order_id) {
    return fetch(this._baseURL + "order/" + order_id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getTickets({ order_id, type }) {
    return fetch(
      this._baseURL + "order/tickets?order_id=" + order_id + "&type=" + type,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => this._checkResponse(res));
  }
}

const ordersApi = new OrdersApi();

export default ordersApi;
