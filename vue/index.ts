import * as Vue from "vue";
import Component from "vue-class-component";
import VueRouter from "vue-router";
import * as common from "../common";

Vue.use(VueRouter);

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
    blogs = common.blogs;
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
    blog: common.Blog;

    beforeMount() {
        const blogId = +this.$route.params.blog_id;
        for (const blog of common.blogs) {
            if (blog.id === blogId) {
                this.blog = blog;
                break;
            }
        }
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
    post: common.Post;
    blog: common.Blog;

    beforeMount() {
        const blogId = +this.$route.params.blog_id;
        const postId = +this.$route.params.post_id;
        for (const blog of common.blogs) {
            if (blog.id === blogId) {
                this.blog = blog;
                for (const post of blog.posts) {
                    if (post.id === postId) {
                        this.post = post;
                        break;
                    }
                }
                break;
            }
        }
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
new App({ router }).$mount("#container");
