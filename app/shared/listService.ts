import config from "./config"
import { fetch } from "tns-core-modules/fetch";
import { getTokenFromCachedCredentials } from './loginService'
import { navigate } from "svelte-native";
import Login from "../views/Login.svelte";

var baseUrl = config.apiUrl + "appdata/" + config.appKey + "/Groceries";

export const fetchItems = async () => {
    let data  = await jsonOrDie("");
    
    return data.map(grocery => (
        {
            name: grocery.Name,
            id: grocery._id
        })
    );
};

export const addItem = async (grocery) => {
    let data = await jsonOrDie("", {
        method: "POST",
        body: JSON.stringify({
            Name: grocery
        }),
    })
    return { name: grocery, id: data._id };
}


export const deleteItem = async function (groceryItem) {
    await responseOrDie("/" + groceryItem.id, {
        method: "DELETE",
    })
};

function getCommonHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Kinvey " + config.token
    }
}

async function responseOrDie(relative_url, fetchOptions:Record<string,any> = {}) {
    let url = baseUrl + relative_url;
    let options = { ...fetchOptions, headers: { ...getCommonHeaders(), ...fetchOptions.headers}}
    let response = await fetch(url, options);

    //refresh token if needed
    if (response.status == 401) {
        try {
            await getTokenFromCachedCredentials();
        } catch {
            navigate({ page: Login, clearHistory: true })
            return;
        }
        response = await fetch(url, options);
    }

    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

async function jsonOrDie(relative_url, fetchOptions:Record<string,any> = {}) {
    let response = await responseOrDie(relative_url, fetchOptions);
    return await response.json();
}

