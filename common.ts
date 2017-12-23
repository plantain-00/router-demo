type Post = {
    id: number;
    content: string;
};

export type Blog = {
    id: number;
    content: string;
    posts: Post[];
};

export function isFirstPage() {
    if ((window as any).__INITIAL_STATE__) {
        (window as any).__INITIAL_STATE__ = undefined;
        return true;
    }
    return false;
}
