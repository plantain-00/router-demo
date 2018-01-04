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
    if ((window as any).__INITIAL_STATE__) {
        (window as any).__INITIAL_STATE__ = undefined;
        isFirstPage = true;
        return (window as any).__INITIAL_STATE__;
    }
    const storeString = localStorage.getItem(storeKey);
    if (storeString) {
        localStorage.removeItem(storeKey);
        return JSON.parse(storeString);
    }
    return undefined;
}
