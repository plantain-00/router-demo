"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Vue1 = require("vue");
var vue_class_component_1 = require("vue-class-component");
var VueRouter1 = require("vue-router");
var Vuex1 = require("vuex");
var common = require("../common");
// tslint:disable
var Vue = Vue1.default;
var VueRouter = VueRouter1.default;
var Vuex = Vuex1.default;
if (Vue1.default === undefined) {
    Vue = Vue1;
    VueRouter = VueRouter1;
    Vuex = Vuex1;
}
// tslint:enable
Vue.use(VueRouter);
Vue.use(Vuex);
exports.methods = {};
function createApp() {
    var store = new Vuex.Store({
        state: {
            blogs: [],
            maxPostId: 0,
        },
        actions: {
            fetchBlogs: function (context) {
                if (context.state.blogs.length > 0) {
                    return Promise.resolve();
                }
                if (exports.methods.fetchBlogs) {
                    return exports.methods.fetchBlogs().then(function (blogs) {
                        context.commit({ type: "initBlogs", blogs: blogs });
                    });
                }
                return Promise.resolve();
            },
        },
        mutations: {
            initBlogs: function (state, payload) {
                state.blogs = payload.blogs;
                state.maxPostId = Math.max.apply(Math, payload.blogs.map(function (b) { return Math.max.apply(Math, b.posts.map(function (p) { return p.id; })); }));
            },
            addPost: function (state, payload) {
                for (var _i = 0, _a = state.blogs; _i < _a.length; _i++) {
                    var blog = _a[_i];
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
    var router = new VueRouter({
        mode: "history",
        routes: [
            { path: "/router-demo/vue/", component: Home },
            { path: "/router-demo/vue/blogs/:blog_id", component: Blog },
            { path: "/router-demo/vue/blogs/:blog_id/posts/:post_id", component: Post },
        ],
    });
    return new App({ store: store, router: router });
}
exports.createApp = createApp;
var Home = /** @class */ (function (_super) {
    tslib_1.__extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.fetchData = function (store) {
        return store.dispatch({ type: "fetchBlogs" });
    };
    Object.defineProperty(Home.prototype, "blogs", {
        get: function () {
            return this.$store.state.blogs;
        },
        enumerable: true,
        configurable: true
    });
    Home.prototype.jumpTo = function (url) {
        common.jumpTo(url, this.$store.state);
    };
    Home.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.$store.dispatch({ type: "fetchBlogs" });
        }
    };
    Home = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n        </div>\n        <div class=\"blogs-title\">blogs</div>\n        <ul>\n            <li v-for=\"blog in blogs\" :key=\"blog.id\">\n                <router-link :to=\"'/router-demo/vue/blogs/' + blog.id\">{{blog.content}}</router-link>\n            </li>\n        </ul>\n    </div>\n    ",
        })
    ], Home);
    return Home;
}(Vue));
var Blog = /** @class */ (function (_super) {
    tslib_1.__extends(Blog, _super);
    function Blog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.newPostContent = "";
        return _this;
    }
    Blog.fetchData = function (store) {
        return store.dispatch({ type: "fetchBlogs" });
    };
    Object.defineProperty(Blog.prototype, "blog", {
        get: function () {
            var blogId = +this.$route.params.blog_id;
            var blogs = this.$store.state.blogs;
            for (var _i = 0, blogs_1 = blogs; _i < blogs_1.length; _i++) {
                var blog = blogs_1[_i];
                if (blog.id === blogId) {
                    return blog;
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Blog.prototype.addNewPost = function () {
        if (this.blog) {
            this.$store.commit({ type: "addPost", blogId: this.blog.id, postContent: this.newPostContent });
        }
    };
    Blog.prototype.jumpTo = function (url) {
        common.jumpTo(url, this.$store.state);
    };
    Blog.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.$store.dispatch({ type: "fetchBlogs" });
        }
    };
    Blog = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n            <router-link to=\"/router-demo/vue/\">back to app</router-link>\n        </div>\n        <div class=\"blog-title\">blog {{blog.id}}</div>\n        <div class=\"blog-content\">{{blog.content}}</div>\n        <div>posts</div>\n        <ul>\n            <li v-for=\"post in blog.posts\" :key=\"post.id\">\n                <router-link :to=\"'/router-demo/vue/blogs/' + blog.id + '/posts/' + post.id\">{{post.content}}</router-link>\n            </li>\n        </ul>\n        <input v-model=\"newPostContent\" />\n        <button v-if=\"newPostContent\" @click=\"addNewPost()\">add new post</button>\n    </div>\n    ",
        })
    ], Blog);
    return Blog;
}(Vue));
var Post = /** @class */ (function (_super) {
    tslib_1.__extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Post.fetchData = function (store) {
        return store.dispatch({ type: "fetchBlogs" });
    };
    Object.defineProperty(Post.prototype, "blog", {
        get: function () {
            var blogId = +this.$route.params.blog_id;
            var blogs = this.$store.state.blogs;
            for (var _i = 0, blogs_2 = blogs; _i < blogs_2.length; _i++) {
                var blog = blogs_2[_i];
                if (blog.id === blogId) {
                    return blog;
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "post", {
        get: function () {
            var postId = +this.$route.params.post_id;
            if (this.blog) {
                for (var _i = 0, _a = this.blog.posts; _i < _a.length; _i++) {
                    var post = _a[_i];
                    if (post.id === postId) {
                        return post;
                    }
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Post.prototype.jumpTo = function (url) {
        common.jumpTo(url, this.$store.state);
    };
    Post.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.$store.dispatch({ type: "fetchBlogs" });
        }
    };
    Post = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n            <router-link to=\"/router-demo/vue/\">back to app</router-link>\n            <router-link :to=\"'/router-demo/vue/blogs/' + blog.id\">back to blog</router-link>\n        </div>\n        <div class=\"post-title\">post {{post.id}}</div>\n        <div class=\"post-content\">{{post.content}}</div>\n    </div>\n    ",
        })
    ], Post);
    return Post;
}(Vue));
var App = /** @class */ (function (_super) {
    tslib_1.__extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <a href=\"https://github.com/plantain-00/router-demo/tree/master/vue/index.ts\" target=\"_blank\">the source code of the demo</a>\n        <br/>\n        <router-view></router-view>\n    </div>\n    ",
        })
    ], App);
    return App;
}(Vue));
