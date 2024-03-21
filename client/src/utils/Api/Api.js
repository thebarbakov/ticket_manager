class Api {
  async _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    const err = await res.json();
    return Promise.reject(err);
  }

  _queryString(params) {
    const query = [];
    for (let p in params)
      query.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
    return "?" + query.join("&");
  }
}

export default Api;
