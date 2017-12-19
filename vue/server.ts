import { App, router, store } from "./core";

import express = require("express");
import * as vueServerRenderer from "vue-server-renderer";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const readFileAsync = util.promisify(fs.readFile);

const server = express();
const renderer = vueServerRenderer.createRenderer();

const template = fs.readFileSync("./vue/index.html").toString();

server.get("/router-demo/vue/", async (req, res) => {
    const app = new App({ router, store });
    const html = await renderer.renderToString(app);
    res.end(template.replace(`<!--vue-ssr-outlet-->`, html));
});

server.get("/router-demo/vue/*.js", async (req, res) => {
    const buffer = await readFileAsync(`./vue/${path.basename(req.url)}`);
    res.end(buffer.toString());
});

server.listen(9000);
