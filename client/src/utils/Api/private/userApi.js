import ApiPrivate from "./ApiPrivate";

class UserApi extends ApiPrivate {
  getUsers(params) {
    return fetch(this._baseURL + "users/" + this._queryString(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getUser(user_id) {
    return fetch(this._baseURL + "users/" + user_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  createUser({
    is_active,
    first_name,
    second_name,
    login,
    email,
    password,
    access,
  }) {
    return fetch(this._baseURL + "users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active,
        first_name,
        second_name,
        login,
        email,
        password,
        access,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editUser({
    _id,
    is_active,
    first_name,
    second_name,
    login,
    email,
    password,
    access,
  }) {
    return fetch(this._baseURL + "users/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        is_active,
        first_name,
        second_name,
        login,
        email,
        password,
        access,
      }),
    }).then((res) => this._checkResponse(res));
  }

  deleteUser(user_id) {
    return fetch(this._baseURL + "users/" + user_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  getMe() {
    return fetch(this._baseURL + "users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => this._checkResponse(res));
  }

  editMe({ first_name, second_name, login, email, password }) {
    return fetch(this._baseURL + "users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, second_name, login, email, password }),
    }).then((res) => this._checkResponse(res));
  }
}

const userApi = new UserApi();

export default userApi;
