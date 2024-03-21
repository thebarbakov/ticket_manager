import Api from "../Api";

class ApiPublic extends Api {
  constructor() {
    super();
    this._baseURL = "/api/public/";
  }
}

export default ApiPublic;
