import ApiPrivate from "./ApiPrivate";

class AgentApi extends ApiPrivate {
  createAgent({ first_name, second_name, email, phone }) {
    return fetch(this._baseURL + "agents/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, second_name, phone, email }),
    }).then((res) => this._checkResponse(res));
  }
}

const agentApi = new AgentApi();

export default agentApi;
