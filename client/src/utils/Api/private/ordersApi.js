import ApiPrivate from "./ApiPrivate";

class OrdersApi extends ApiPrivate {
  getOrders(params) {
    return fetch(this._baseURL + "orders/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getReport(params) {
    return fetch(this._baseURL + "orders/report" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getOrder(order_id) {
    return fetch(this._baseURL + "orders/" + order_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createOrder({
    agent_id,
    promocode,
    discount,
    pay_type_id,
    first_name,
    second_name,
    phone,
    email,
    places,
    event_id,
    status,
  }) {
    return fetch(this._baseURL + "orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id,
        promocode,
        discount,
        pay_type_id,
        first_name,
        second_name,
        phone,
        email,
        places,
        event_id,
        status,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editOrder({
    order_id,
    agent_id,
    promocode,
    discount,
    status,
    pay_type_id,
    is_tickets_sent,
    is_tickets_print,
    is_payed,
    places,
  }) {
    return fetch(this._baseURL + "orders/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id,
        agent_id,
        promocode,
        discount,
        status,
        pay_type_id,
        is_tickets_sent,
        is_tickets_print,
        is_payed,
        places,
      }),
    }).then((res) => this._checkResponse(res));
  }

  preCreateOrder(event_id) {
    return fetch(this._baseURL + "orders/creation_info/" + event_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getSchemeOrders(event_id) {
    return fetch(this._baseURL + "orders/scheme_orders/" + event_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getEventsInfo() {
    return fetch(this._baseURL + "orders/events_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getTickets({ order_id, type }) {
    return fetch(
      this._baseURL + "orders/tickets?order_id=" + order_id + "&type=" + type,
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
