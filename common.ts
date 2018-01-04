type Post = {
    id: number;
    content: string;
};

export type Blog = {
    id: number;
    content: string;
    posts: Post[];
};

export let isFirstPage = false;

const storeKey = "router-demo:__INITIAL_STATE__";

export function jumpTo(url: string, state: any) {
    localStorage.setItem(storeKey, JSON.stringify(state));
    location.href = url;
}

export function getInitialState() {
    const storeString = localStorage.getItem(storeKey);
    if (storeString) {
        localStorage.removeItem(storeKey);
        (window as any).__INITIAL_STATE__ = undefined;
        return JSON.parse(storeString);
    }
    const initialState = (window as any).__INITIAL_STATE__;
    if (initialState) {
        (window as any).__INITIAL_STATE__ = undefined;
        isFirstPage = true;
        return initialState;
    }
    return undefined;
}
