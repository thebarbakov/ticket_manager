import ApiPublic from "./ApiPublic";

class AgentApi extends ApiPublic {
  getMe() {
    return fetch(this._baseURL + "agent/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  editMe({ first_name, second_name, phone, email }) {
    return fetch(this._baseURL + "agent/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, second_name, phone, email }),
    }).then((res) => this._checkResponse(res));
  }
}

const agentApi = new AgentApi();

export default agentApi;
