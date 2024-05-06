import ApiPublic from "./ApiPublic";

class EventsApi extends ApiPublic {
  getEvents(params) {
    return fetch(this._baseURL + "events/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getEvent(id) {
    return fetch(this._baseURL + "events/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const eventsApi = new EventsApi();

export default eventsApi;
