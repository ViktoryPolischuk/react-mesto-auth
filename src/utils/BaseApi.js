class BaseApi {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _fetch(url, {method, body, headers}) {
    return fetch(`${this._baseUrl}${url}`, {
      method,
      body,
      headers: {...this._headers, ...headers}
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
}

export default BaseApi;
