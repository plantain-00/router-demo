import { createApp } from "./core";

import express = require("express");
import * as vueServerRenderer from "vue-server-renderer";
import * as fs from "fs";
import * as util from "util";

const readFileAsync = util.promisify(fs.readFile);

const server = express();
const renderer = vueServerRenderer.createRenderer();

const template = fs.readFileSync("./vue/index.html").toString();

server.get("/router-demo/vue/", async (req, res) => {
    const app = createApp();
    const html = await renderer.renderToString(app);
    res.end(template.replace(`<!--vue-ssr-outlet-->`, html));
});

server.get("/router-demo/vue/blogs/:blog_id", async (req, res) => {
    const app = createApp();
    app.$router.replace({ path: `/router-demo/vue/blogs/${req.params.blog_id}` });
    const html = await renderer.renderToString(app);
    res.end(template.replace(`<!--vue-ssr-outlet-->`, html));
});

server.get("/router-demo/vue/blogs/:blog_id/posts/:post_id", async (req, res) => {
    const app = createApp();
    app.$router.replace({ path: `/router-demo/vue/blogs/${req.params.blog_id}/posts/${req.params.post_id}` });
    const html = await renderer.renderToString(app);
    res.end(template.replace(`<!--vue-ssr-outlet-->`, html));
});

const staticFiles: { [name: string]: string } = {};

server.get("/router-demo/vue/:name.js", async (req, res) => {
    const filename = req.params.name;
    if (staticFiles[filename]) {
        res.end(staticFiles[filename]);
        return;
    }
    const buffer = await readFileAsync(`./vue/${filename}.js`);
    staticFiles[filename] = buffer.toString();
    res.end(staticFiles[filename]);
});

server.listen(9000);
