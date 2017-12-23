import { createApp, methods } from "./core";

const app = createApp();

methods.fetchBlogs = () => fetch("/router-demo/blogs.json").then(response => response.json());

if ((window as any).__INITIAL_STATE__) {
    app.$store.replaceState((window as any).__INITIAL_STATE__);
}

app.$router.onReady(() => {
    app.$mount("#container");
});
