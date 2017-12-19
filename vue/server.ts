import { createApp } from "./core";

import express = require("express");
import * as vueServerRenderer from "vue-server-renderer";
import * as fs from "fs";
import * as util from "util";

const readFileAsync = util.promisify(fs.readFile);

const server = express();
const renderer = vueServerRenderer.createRenderer();

const template = fs.readFileSync("./vue/index.html").toString();

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
            const html = await renderer.renderToString(app);
            res.end(template.replace(`<!--vue-ssr-outlet-->`, html));
        } catch (error) {
            res.status(500).end();
        }
    });
});

server.listen(9000);
