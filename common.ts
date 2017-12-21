export type Post = {
    id: number;
    content: string;
};

export type Blog = {
    id: number;
    content: string;
    posts: Post[];
};

// tslint:disable-next-line:no-var-requires
export const blogs: Blog[] = require("./blogs.json");

export const maxPostId = 23;
