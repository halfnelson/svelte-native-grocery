import config from "./config"
import { fetch } from "tns-core-modules/fetch";

export function login(email: string, password: string) {
    return fetch(config.apiUrl + "user/" + config.appKey + "/login", {
        method: "POST",
        body: JSON.stringify({
            username: email,
            password: password
        }),
        headers: getCommonHeaders()
    })
    .then(handleErrors)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        config.token = data._kmd.authtoken;
    });
};

export function register(email: string, password: string): Promise<any> {
    if (!email || !password) {
      return Promise.reject(new Error("Please provide both an email address and password."));
    }
    
    return fetch(config.apiUrl + "user/" + config.appKey, {
      method: "POST",
      body: JSON.stringify({
        username: email,
        email: email,
        password: password
      }),
      headers: getCommonHeaders()
    }).then(handleErrors);
};

function getCommonHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": config.appUserHeader
  }
}

function handleErrors(response) {
  if (!response.ok) {
    console.log(JSON.stringify(response));
    throw Error(response.statusText);
  }
  return response;
}
