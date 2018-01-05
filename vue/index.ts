import { createApp, methods, AppState } from "./core";
import * as common from "../common";

methods.fetchBlogs = () => fetch("/router-demo/blogs.json").then(response => response.json());

const initialState = common.getInitialState();
// tslint:disable-next-line:no-console
console.log({ initialState });
const appState = AppState.create(initialState);
const app = createApp(appState);

app.$router.onReady(() => {
    app.$mount("#container");
});
