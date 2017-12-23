import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";

import { Main, AppState, methods } from "./core";

methods.fetchBlogs = () => fetch("/router-demo/blogs.json").then(response => response.json());

const appState = new AppState((window as any).__INITIAL_STATE__);

ReactDOM.render(
    <BrowserRouter>
        <Provider appState={appState}>
            <Main />
        </Provider>
    </BrowserRouter>,
    document.getElementById("container"));
