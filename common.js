"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFirstPage = false;
var storeKey = 'router-demo:__INITIAL_STATE__';
function jumpTo(url, state) {
    localStorage.setItem(storeKey, JSON.stringify(state));
    location.href = url;
}
exports.jumpTo = jumpTo;
function getInitialState() {
    var storeString = localStorage.getItem(storeKey);
    if (storeString) {
        localStorage.removeItem(storeKey);
        window.__INITIAL_STATE__ = undefined;
        return JSON.parse(storeString);
    }
    var initialState = window.__INITIAL_STATE__;
    if (initialState) {
        window.__INITIAL_STATE__ = undefined;
        exports.isFirstPage = true;
        return initialState;
    }
    return undefined;
}
exports.getInitialState = getInitialState;
