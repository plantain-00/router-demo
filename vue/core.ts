import Vue1 = require("vue");
import Component from "vue-class-component";
import VueRouter1 = require("vue-router");
import Vuex1 = require("vuex");
import { sync } from "vuex-router-sync";
import * as common from "../common";

// tslint:disable
let Vue = Vue1.default;
let VueRouter = VueRouter1.default;
let Vuex = Vuex1.default;
if (Vue1.default === undefined) {
    (Vue as any) = Vue1;
    (VueRouter as any) = VueRouter1;
    (Vuex as any) = Vuex1;
}
// tslint:enable

Vue.use(VueRouter);
Vue.use(Vuex);

export function createApp() {
    const store = new Vuex.Store({
        state: {
            blogs: common.blogs,
            maxPostId: common.maxPostId,
        },
        mutations: {
            addPost(state, payload: { blogId: number, postContent: string }) {
                for (const blog of state.blogs) {
                    if (blog.id === payload.blogId) {
                        state.maxPostId++;
                        blog.posts.push({
                            id: state.maxPostId,
                            content: payload.postContent,
                        });
                        return;
                    }
                }
            },
        },
    });

    const router = new VueRouter({
        mode: "history",
        routes: [
            { path: "/router-demo/vue/", component: Home },
            { path: "/router-demo/vue/blogs/:blog_id", component: Blog },
            { path: "/router-demo/vue/blogs/:blog_id/posts/:post_id", component: Post },
        ],
    });

    sync(store, router);

    return new App({ store, router });
}

@Component({
    template: `
    <div>
        <div>blogs</div>
        <ul>
            <li v-for="blog in blogs" :key="blog.id">
                <router-link :to="'/router-demo/vue/blogs/' + blog.id">to /blogs/{{blog.id}}</router-link>
            </li>
        </ul>
    </div>
    `,
})
class Home extends Vue {
    get blogs() {
        return this.$store.state.blogs;
    }
}

@Component({
    template: `
    <div>
        <div>blog {{blog.id}}</div>
        <div>{{blog.content}}</div>
        <div>posts</div>
        <ul>
            <li v-for="post in blog.posts" :key="post.id">
                <router-link :to="'/router-demo/vue/blogs/' + blog.id + '/posts/' + post.id">to /blogs/{{blog.id}}/posts/{{post.id}}</router-link>
            </li>
        </ul>
        <input v-model="newPostContent" />
        <button v-if="newPostContent" @click="addNewPost()">add new post</button>
    </div>
    `,
})
class Blog extends Vue {
    newPostContent = "";

    get blog() {
        const blogId = +this.$route.params.blog_id;
        const blogs: common.Blog[] = this.$store.state.blogs;
        for (const blog of blogs) {
            if (blog.id === blogId) {
                return blog;
            }
        }
        return null;
    }

    addNewPost() {
        if (this.blog) {
            this.$store.commit("addPost", { blogId: this.blog.id, postContent: this.newPostContent });
        }
    }
}

@Component({
    template: `
    <div>
        <div><router-link :to="'/router-demo/vue/blogs/' + blog.id">to /blogs/{{blog.id}}</router-link></div>
        <div>post {{post.id}}</div>
        <div>{{post.content}}</div>
    </div>
    `,
})
class Post extends Vue {
    get blog() {
        const blogId = +this.$route.params.blog_id;
        const blogs: common.Blog[] = this.$store.state.blogs;
        for (const blog of blogs) {
            if (blog.id === blogId) {
                return blog;
            }
        }
        return null;
    }
    get post() {
        const postId = +this.$route.params.post_id;
        if (this.blog) {
            for (const post of this.blog.posts) {
                if (post.id === postId) {
                    return post;
                }
            }
        }
        return null;
    }
}

@Component({
    template: `
    <div>
        <a href="https://github.com/plantain-00/router-demo/tree/master/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <div><router-link to="/router-demo/vue/">home</router-link></div>
        <router-view></router-view>
    </div>
    `,
})
class App extends Vue {
}
