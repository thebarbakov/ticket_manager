import ApiPublic from "./ApiPublic";

class RegistrationApi extends ApiPublic {
  signIn({ email, code, agent_id }) {
    return fetch(this._baseURL + "registration/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, agent_id }),
    }).then((res) => this._checkResponse(res));
  }

  sendCode({ email }) {
    return fetch(this._baseURL + "registration/send_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((res) => this._checkResponse(res));
  }

  signUp({ first_name, second_name, email, phone }) {
    return fetch(this._baseURL + "registration/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, second_name, phone, email }),
    }).then((res) => this._checkResponse(res));
  }

  signOut() {
    return fetch(this._baseURL + "registration/sign_out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }
}

const registrationApi = new RegistrationApi();

export default registrationApi;
