import ApiPrivate from "./ApiPrivate";

class EventsApi extends ApiPrivate {
  getEvents(params) {
    return fetch(this._baseURL + "events/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getEvent(event_id) {
    return fetch(this._baseURL + "events/" + event_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createEvent({
    hall_id,
    name,
    description,
    date,
    image_file,
    image_file_name,
    places,
    type,
    open_sales,
    close_sales,
  }) {
    return fetch(this._baseURL + "events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hall_id,
        name,
        description,
        date,
        image_file,
        image_file_name,
        places,
        type,
        open_sales,
        close_sales,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editEvent({
    _id,
    name,
    description,
    date,
    image_file,
    image_file_name,
    open_sales,
    close_sales,
  }) {
    return fetch(this._baseURL + "events/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        name,
        description,
        date,
        image_file,
        image_file_name,
        open_sales,
        close_sales,
      }),
    }).then((res) => this._checkResponse(res));
  }

  preCreateEvent() {
    return fetch(this._baseURL + "events/creation_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  deleteEvent(event_id) {
    return fetch(this._baseURL + "events/" + event_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const eventsApi = new EventsApi();

export default eventsApi;
