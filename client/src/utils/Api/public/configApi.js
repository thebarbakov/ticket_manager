import ApiPublic from "./ApiPublic";

class ConfigApi extends ApiPublic {
  getInitConfig() {
    return fetch(this._baseURL + "config", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const configApi = new ConfigApi();

export default configApi;
