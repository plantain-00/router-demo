"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Vue1 = require("vue");
var vue_class_component_1 = require("vue-class-component");
var VueRouter1 = require("vue-router");
var common = require("../common");
// tslint:disable
var Vue = Vue1.default;
var VueRouter = VueRouter1.default;
if (Vue1.default === undefined) {
    Vue = Vue1;
    VueRouter = VueRouter1;
}
// tslint:enable
Vue.use(VueRouter);
exports.methods = {};
var AppState = /** @class */ (function (_super) {
    tslib_1.__extends(AppState, _super);
    function AppState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.blogs = [];
        _this.maxPostId = 0;
        return _this;
    }
    AppState_1 = AppState;
    AppState.create = function (data) {
        var appState = new AppState_1();
        if (data) {
            appState.blogs = data.blogs;
            appState.maxPostId = data.maxPostId;
        }
        return appState;
    };
    AppState.prototype.fetchBlogs = function () {
        var _this = this;
        if (this.blogs.length > 0) {
            return Promise.resolve();
        }
        if (exports.methods.fetchBlogs) {
            return exports.methods.fetchBlogs().then(function (blogs) {
                _this.initBlogs(blogs);
            });
        }
        return Promise.resolve();
    };
    AppState.prototype.addPost = function (blogId, postContent) {
        for (var _i = 0, _a = this.blogs; _i < _a.length; _i++) {
            var blog = _a[_i];
            if (blog.id === blogId) {
                this.maxPostId++;
                blog.posts.push({
                    id: this.maxPostId,
                    content: postContent,
                });
                return;
            }
        }
    };
    AppState.prototype.initBlogs = function (blogs) {
        this.blogs = blogs;
        this.maxPostId = Math.max.apply(Math, blogs.map(function (b) { return Math.max.apply(Math, b.posts.map(function (p) { return p.id; })); }));
    };
    AppState = AppState_1 = tslib_1.__decorate([
        vue_class_component_1.default
    ], AppState);
    return AppState;
    var AppState_1;
}(Vue));
exports.AppState = AppState;
function createApp(appState) {
    var router = new VueRouter({
        mode: "history",
        routes: [
            { path: "/router-demo/vue/", component: Home, props: { appState: appState } },
            { path: "/router-demo/vue/blogs/:blog_id", component: Blog, props: { appState: appState } },
            { path: "/router-demo/vue/blogs/:blog_id/posts/:post_id", component: Post, props: { appState: appState } },
        ],
    });
    return new App({ router: router });
}
exports.createApp = createApp;
var Home = /** @class */ (function (_super) {
    tslib_1.__extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.fetchData = function (appState) {
        return appState.fetchBlogs();
    };
    Object.defineProperty(Home.prototype, "blogs", {
        get: function () {
            return this.appState.blogs;
        },
        enumerable: true,
        configurable: true
    });
    Home.prototype.jumpTo = function (url) {
        common.jumpTo(url, this.appState.$data);
    };
    Home.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.appState.fetchBlogs();
        }
    };
    Home = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n        </div>\n        <div class=\"blogs-title\">blogs</div>\n        <ul>\n            <li v-for=\"blog in blogs\" :key=\"blog.id\">\n                <router-link :to=\"'/router-demo/vue/blogs/' + blog.id\">{{blog.content}}</router-link>\n            </li>\n        </ul>\n    </div>\n    ",
            props: ["appState"],
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
    Blog.fetchData = function (appState) {
        return appState.fetchBlogs();
    };
    Object.defineProperty(Blog.prototype, "blog", {
        get: function () {
            var blogId = +this.$route.params.blog_id;
            var blogs = this.appState.blogs;
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
            this.appState.addPost(this.blog.id, this.newPostContent);
        }
    };
    Blog.prototype.jumpTo = function (url) {
        common.jumpTo(url, this.appState.$data);
    };
    Blog.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.appState.fetchBlogs();
        }
    };
    Blog = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n            <router-link to=\"/router-demo/vue/\">back to app</router-link>\n        </div>\n        <div class=\"blog-title\">blog {{blog.id}}</div>\n        <div class=\"blog-content\">{{blog.content}}</div>\n        <div>posts</div>\n        <ul>\n            <li v-for=\"post in blog.posts\" :key=\"post.id\">\n                <router-link :to=\"'/router-demo/vue/blogs/' + blog.id + '/posts/' + post.id\">{{post.content}}</router-link>\n            </li>\n        </ul>\n        <input v-model=\"newPostContent\" />\n        <button v-if=\"newPostContent\" @click=\"addNewPost()\">add new post</button>\n    </div>\n    ",
            props: ["appState"],
        })
    ], Blog);
    return Blog;
}(Vue));
var Post = /** @class */ (function (_super) {
    tslib_1.__extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Post.fetchData = function (appState) {
        return appState.fetchBlogs();
    };
    Object.defineProperty(Post.prototype, "blog", {
        get: function () {
            var blogId = +this.$route.params.blog_id;
            var blogs = this.appState.blogs;
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
        common.jumpTo(url, this.appState.$data);
    };
    Post.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.appState.fetchBlogs();
        }
    };
    Post = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n            <router-link to=\"/router-demo/vue/\">back to app</router-link>\n            <router-link :to=\"'/router-demo/vue/blogs/' + blog.id\">back to blog</router-link>\n        </div>\n        <div class=\"post-title\">post {{post.id}}</div>\n        <div class=\"post-content\">{{post.content}}</div>\n    </div>\n    ",
            props: ["appState"],
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
