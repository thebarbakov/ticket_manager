import ApiPrivate from "./ApiPrivate";

class RegistrationApi extends ApiPrivate {
  signIn({ login, password }) {
    return fetch(this._baseURL + "registration/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    }).then((res) => this._checkResponse(res));
  }

  signUp({ first_name, second_name, login, email, password }) {
    return fetch(this._baseURL + "registration/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, second_name, login, email, password }),
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
