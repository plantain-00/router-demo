"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var mobx_react_1 = require("mobx-react");
var react_router_dom_1 = require("react-router-dom");
var common = require("../common");
var core_1 = require("./core");
core_1.methods.fetchBlogs = function () { return fetch("/router-demo/blogs.json").then(function (response) { return response.json(); }); };
var initialState = common.getInitialState();
// tslint:disable-next-line:no-console
console.log({ initialState: initialState });
var appState = new core_1.AppState(initialState);
ReactDOM.render(React.createElement(react_router_dom_1.BrowserRouter, null,
    React.createElement(mobx_react_1.Provider, { appState: appState },
        React.createElement(core_1.Main, null))), document.getElementById("container"));
