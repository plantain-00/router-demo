import * as Vue from "vue";
import Component from "vue-class-component";
import VueRouter from "vue-router";
import { blogs } from "../common";

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
class Blogs extends Vue {
    blogs = blogs;
}

@Component({
    template: `
    <div>blog {{$route.params.blog_id}}</div>
    `,
})
class Blog extends Vue {
}

@Component({
    template: `
    <div>post</div>
    `,
})
class Post extends Vue {
}

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/vue/blogs", component: Blogs },
        { path: "/vue/blogs/:blog_id", component: Blog },
        { path: "/vue/blogs/:blog_id/posts/:post_id", component: Post },
    ],
});

@Component({
    template: `
    <div>
        <a href="https://github.com/plantain-00/router-demo/tree/master/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <router-link to="/vue/blogs">to /vue/blogs</router-link>
        <router-view></router-view>
    </div>
    `,
})
class App extends Vue {
}

// tslint:disable-next-line:no-unused-expression
new App({ router }).$mount("#container");
