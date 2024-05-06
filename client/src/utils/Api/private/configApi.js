import ApiPrivate from "./ApiPrivate";

class ConfigApi extends ApiPrivate {
  getConfig() {
    return fetch(this._baseURL + "config/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
  updateConfig(configs) {
    return fetch(this._baseURL + "config/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        configs,
      }),
    }).then((res) => this._checkResponse(res));
  }
}

const configApi = new ConfigApi();

export default configApi;
