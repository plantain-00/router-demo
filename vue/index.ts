import Vue from "vue";
import Component from "vue-class-component";
import VueRouter from "vue-router";
import Vuex from "vuex";
import * as common from "../common";

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        blogs: common.blogs,
    },
});

@Component({
    template: `
    <div>
        <div>blogs</div>
        <ul>
            <li v-for="blog in blogs">
                <router-link :to="'/vue/blogs/' + blog.id">to /vue/blogs/{{blog.id}}</router-link>
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
            <li v-for="post in blog.posts">
                <router-link :to="'/vue/blogs/' + blog.id + '/posts/' + post.id">to /vue/blogs/{{blog.id}}/posts/{{post.id}}</router-link>
            </li>
        </ul>
    </div>
    `,
})
class Blog extends Vue {
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
}

@Component({
    template: `
    <div>
        <div><router-link :to="'/vue/blogs/' + blog.id">to /vue/blogs/{{blog.id}}</router-link></div>
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

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/vue", component: Home },
        { path: "/vue/blogs/:blog_id", component: Blog },
        { path: "/vue/blogs/:blog_id/posts/:post_id", component: Post },
    ],
});

@Component({
    template: `
    <div>
        <a href="https://github.com/plantain-00/router-demo/tree/master/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <div><router-link to="/vue">home</router-link></div>
        <router-view></router-view>
    </div>
    `,
})
class App extends Vue {
}

// tslint:disable-next-line:no-unused-expression
new App({ router, store }).$mount("#container");
