import BaseApi from "./BaseApi";
import {authApiConfig} from "./constants";

class AuthApi extends BaseApi {
  signUp({email, password}) {
    return this._fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({email, password})
    });
  }

  signIn({email, password}) {
    return this._fetch('/signin', {
      method: 'POST',
      body: JSON.stringify({email, password})
    });
  }

  checkToken(token) {
    return this._fetch('/users/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
}

const authApi = new AuthApi(authApiConfig);
export default authApi;
