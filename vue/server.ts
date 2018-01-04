import { createApp, methods } from "./core";

import express = require("express");
import * as vueServerRenderer from "vue-server-renderer";
import * as fs from "fs";
import * as util from "util";
import * as common from "../common";

const readFileAsync = util.promisify(fs.readFile);

const server = express();
const renderer = vueServerRenderer.createRenderer();

const template = fs.readFileSync("./vue/index.html").toString();
const blogs: common.Blog[] = JSON.parse(fs.readFileSync("./blogs.json").toString());

const staticFiles: { [name: string]: string } = {};

server.get("/router-demo/blogs.json", async (req, res) => {
    res.json(blogs).end();
});

server.get("/router-demo/vue/:name.js", async (req, res) => {
    const filename = req.params.name + ".js";
    if (staticFiles[filename]) {
        res.end(staticFiles[filename]);
        return;
    }
    const buffer = await readFileAsync(`./vue/${filename}`);
    staticFiles[filename] = buffer.toString();
    res.end(staticFiles[filename]);
});

server.get("/router-demo/:name.css", async (req, res) => {
    const filename = req.params.name + ".css";
    if (staticFiles[filename]) {
        res.end(staticFiles[filename]);
        return;
    }
    const buffer = await readFileAsync(`./${filename}`);
    staticFiles[filename] = buffer.toString();
    res.end(staticFiles[filename]);
});

methods.fetchBlogs = () => Promise.resolve(blogs);

server.get("*", (req, res) => {
    const app = createApp();
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
            // tslint:disable-next-line:no-console
            console.log(error);
            res.status(500).end();
        }
    });
});

server.listen(9000);
