import { createApp } from "./core";

const app = createApp();

app.$router.onReady(() => {
    app.$mount("#container");
});
