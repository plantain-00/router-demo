"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var common = require("../common");
var app = core_1.createApp();
core_1.methods.fetchBlogs = function () { return fetch("/router-demo/blogs.json").then(function (response) { return response.json(); }); };
var initialState = common.getInitialState();
// tslint:disable-next-line:no-console
console.log({ initialState: initialState });
if (initialState) {
    app.$store.replaceState(initialState);
}
app.$router.onReady(function () {
    app.$mount("#container");
});
