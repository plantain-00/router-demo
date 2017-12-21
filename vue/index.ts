import { createApp } from "./core";

const app = createApp({});

if ((window as any).__INITIAL_STATE__) {
    app.$store.replaceState((window as any).__INITIAL_STATE__);
}

app.$router.onReady(() => {
    app.$mount("#container");
});
