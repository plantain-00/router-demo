import { createApp, methods } from "./core";
import * as common from "../common";

const app = createApp();

methods.fetchBlogs = () => fetch("/router-demo/blogs.json").then(response => response.json());

const initialState = common.getInitialState();
// tslint:disable-next-line:no-console
console.log({ initialState });
if (initialState) {
    app.$store.replaceState(initialState);
}

app.$router.onReady(() => {
    app.$mount("#container");
});
