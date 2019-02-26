import config from "./config"
import { fetch } from "tns-core-modules/fetch";

var baseUrl = config.apiUrl + "appdata/" + config.appKey + "/Groceries";

export const fetchItems = function() {
    return fetch(baseUrl, {
        headers: getCommonHeaders()
    })
    .then(handleErrors)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        return data.map( grocery => (
            {
                name: grocery.Name,
                id: grocery._id
            }));
    });
};

export const addItem = function(grocery) {
    return fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify({
            Name: grocery
        }),
        headers: getCommonHeaders()
    })
    .then(handleErrors)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        return { name: grocery, id: data._id };
    });
}


function getCommonHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Kinvey " + config.token
    }
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}