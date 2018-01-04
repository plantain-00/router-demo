import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import * as common from "../common";

import { Main, AppState, methods } from "./core";

methods.fetchBlogs = () => fetch("/router-demo/blogs.json").then(response => response.json());

const initialState = common.getInitialState();
// tslint:disable-next-line:no-console
console.log({ initialState });
const appState = new AppState(initialState);

ReactDOM.render(
    <BrowserRouter>
        <Provider appState={appState}>
            <Main />
        </Provider>
    </BrowserRouter>,
    document.getElementById("container"));
