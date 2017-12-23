import { Main, AppState, methods, routes, isServerSide } from "./core";

import express = require("express");
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import { Provider } from "mobx-react";
import * as fs from "fs";
import * as util from "util";
import * as common from "../common";

const readFileAsync = util.promisify(fs.readFile);

const server = express();

isServerSide();

const template = fs.readFileSync("./react/index.html").toString();
const blogs: common.Blog[] = JSON.parse(fs.readFileSync("./blogs.json").toString());

const staticFiles: { [name: string]: string } = {};

server.get("/router-demo/blogs.json", async (req, res) => {
    res.json(blogs).end();
});

server.get("/router-demo/react/:name.js", async (req, res) => {
    const filename = req.params.name;
    if (staticFiles[filename]) {
        res.end(staticFiles[filename]);
        return;
    }
    const buffer = await readFileAsync(`./react/${filename}.js`);
    staticFiles[filename] = buffer.toString();
    res.end(staticFiles[filename]);
});

methods.fetchBlogs = () => Promise.resolve(blogs);

server.get("*", async (req, res) => {
    const appState = new AppState();

    try {
        const matchedRouters = routes.filter(r => matchPath(req.url, r));
        if (matchedRouters.length === 0) {
            res.status(404).end();
            return;
        }
        await Promise.all(matchedRouters.map(router => {
            if ((router.component as any).fetchData) {
                return (router.component as any).fetchData(appState);
            }
        }));
        const html = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={{}}>
                <Provider appState={appState}>
                    <Main />
                </Provider>
            </StaticRouter>);
        const result = template.replace(`<!--react-ssr-outlet-->`, html)
            .replace(`<!--react-ssr-state-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(appState)}</script>`);
        res.end(result);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
        res.status(500).end();
    }
});

server.listen(9000);
