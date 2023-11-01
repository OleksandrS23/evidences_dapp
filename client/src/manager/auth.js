
import consts from './consts';
import axios from 'axios';

export function login(address, user, password, callback) {
    //console.log(consts.API_URL);
    return axios
      .post(consts.API_URL + "auth/login", { address, user, password }, consts.HEADER_SIMPLE)
      .then(res => {
        //console.log(res);
        if (res.data.error || !res.data.token) {
          return {
            type: "LOGIN_FAIL"
          };
        } else {
          localStorage.setItem("token", res.data.token);
          callback();
          return {
            type: "LOGIN_SUCCESS",
            payload: {
              token: res.data.token
            }
          };
        }
      })
      .catch(err => {
        localStorage.removeItem("token");
        callback(err);
        return {
          type: "LOGIN_FAIL"
        };
      });
  }
  

export function logout() {
    localStorage.removeItem("token");
    return {
        type: "LOGOUT",
    };
};