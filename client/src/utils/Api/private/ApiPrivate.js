import Api from "../Api";

class ApiPrivate extends Api {
  constructor() {
    super();
    this._baseURL = "/api/private/";
  }
}

export default ApiPrivate;
