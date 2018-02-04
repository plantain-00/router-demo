"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("./react/core");
var core_2 = require("./vue/core");
var express = require("express");
var fs = tslib_1.__importStar(require("fs"));
var util = tslib_1.__importStar(require("util"));
var React = tslib_1.__importStar(require("react"));
var ReactDOMServer = tslib_1.__importStar(require("react-dom/server"));
var react_router_dom_1 = require("react-router-dom");
var mobx_react_1 = require("mobx-react");
var vueServerRenderer = tslib_1.__importStar(require("vue-server-renderer"));
var readFileAsync = util.promisify(fs.readFile);
var server = express();
core_1.isServerSide();
var renderer = vueServerRenderer.createRenderer();
var reactTemplate = fs.readFileSync('./react/index.html').toString();
var vueTemplate = fs.readFileSync('./vue/index.html').toString();
var blogs = JSON.parse(fs.readFileSync('./blogs.json').toString());
server.get('/router-demo/blogs.json', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        res.json(blogs).end();
        return [2 /*return*/];
    });
}); });
server.get('/router-demo/:name.css', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var buffer;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readFileAsync("./" + req.params.name + ".css")];
            case 1:
                buffer = _a.sent();
                res.end(buffer.toString());
                return [2 /*return*/];
        }
    });
}); });
server.get('/router-demo/:type/:name.js', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var buffer;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readFileAsync("./" + req.params.type + "/" + req.params.name + ".js")];
            case 1:
                buffer = _a.sent();
                res.end(buffer.toString());
                return [2 /*return*/];
        }
    });
}); });
core_1.methods.fetchBlogs = function () { return Promise.resolve(JSON.parse(JSON.stringify(blogs))); };
core_2.methods.fetchBlogs = function () { return Promise.resolve(JSON.parse(JSON.stringify(blogs))); };
server.get('/router-demo/react/*', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var appState, matchedRouters, html, result, error_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appState = new core_1.AppState();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                matchedRouters = core_1.routes.filter(function (r) { return react_router_dom_1.matchPath(req.url, r); });
                if (matchedRouters.length === 0) {
                    res.status(404).end();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Promise.all(matchedRouters.map(function (router) {
                        if (router.component.fetchData) {
                            return router.component.fetchData(appState);
                        }
                    }))];
            case 2:
                _a.sent();
                html = ReactDOMServer.renderToString(React.createElement(react_router_dom_1.StaticRouter, { location: req.url, context: {} },
                    React.createElement(mobx_react_1.Provider, { appState: appState },
                        React.createElement(core_1.Main, null))));
                result = reactTemplate.replace("<!--react-ssr-outlet-->", html)
                    .replace("<!--react-ssr-state-->", "<script>window.__INITIAL_STATE__=" + JSON.stringify(appState) + "</script>");
                res.end(result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).end();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
server.get('/router-demo/vue/*', function (req, res) {
    var appState = new core_2.AppState();
    var app = core_2.createApp(appState);
    app.$router.push(req.url);
    app.$router.onReady(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var matchedComponents, html, result, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    matchedComponents = app.$router.getMatchedComponents();
                    if (matchedComponents.length === 0) {
                        res.status(404).end();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(matchedComponents.map(function (Component) {
                            if (Component.fetchData) {
                                return Component.fetchData(appState);
                            }
                        }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, renderer.renderToString(app)];
                case 2:
                    html = _a.sent();
                    result = vueTemplate.replace("<!--vue-ssr-outlet-->", html)
                        .replace("<!--vue-ssr-state-->", "<script>window.__INITIAL_STATE__=" + JSON.stringify(appState.$data) + "</script>");
                    res.end(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    res.status(500).end();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
server.listen(9000);
