/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import { svelteNative } from "svelte-native";
import App from  "./views/Login.svelte";
import { registerElement } from "svelte-native/dom"
import RadListViewElement from "./RadListViewElement"

registerElement('radListView', () => new RadListViewElement())

svelteNative(App, {});

