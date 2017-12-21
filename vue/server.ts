import { createApp } from "./core";

import express = require("express");
import * as vueServerRenderer from "vue-server-renderer";
import * as fs from "fs";
import * as util from "util";
import * as common from "../common";

const readFileAsync = util.promisify(fs.readFile);

const server = express();
const renderer = vueServerRenderer.createRenderer();

const template = fs.readFileSync("./vue/index.html").toString();

const staticFiles: { [name: string]: string } = {};

server.get("/router-demo/blogs.json", async (req, res) => {
    res.json(common.blogs).end();
});

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

server.get("*", (req, res) => {
    const app = createApp({
        fetchBlogs() {
            return Promise.resolve(common.blogs);
        },
    });
    app.$router.push(req.url);
    app.$router.onReady(async () => {
        try {
            const matchedComponents = app.$router.getMatchedComponents();
            if (matchedComponents.length === 0) {
                res.status(404).end();
                return;
            }
            await Promise.all(matchedComponents.map(Component => {
                if ((Component as any).fetchData) {
                    return (Component as any).fetchData(app.$store);
                }
            }));
            const html = await renderer.renderToString(app);
            const result = template.replace(`<!--vue-ssr-outlet-->`, html)
                .replace(`<!--vue-ssr-state-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(app.$store.state)}</script>`);
            res.end(result);
        } catch (error) {
            res.status(500).end();
        }
    });
});

server.listen(9000);
