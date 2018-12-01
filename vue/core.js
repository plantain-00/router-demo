"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vue_1 = tslib_1.__importDefault(require("vue"));
var vue_class_component_1 = tslib_1.__importDefault(require("vue-class-component"));
var vue_router_1 = tslib_1.__importDefault(require("vue-router"));
var common = tslib_1.__importStar(require("../common"));
vue_1.default.use(vue_router_1.default);
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blogs;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.blogs.length === 0 && exports.methods.fetchBlogs)) return [3 /*break*/, 2];
                        return [4 /*yield*/, exports.methods.fetchBlogs()];
                    case 1:
                        blogs = _a.sent();
                        this.blogs = blogs;
                        this.maxPostId = Math.max.apply(Math, tslib_1.__spread(blogs.map(function (b) { return Math.max.apply(Math, tslib_1.__spread(b.posts.map(function (p) { return p.id; }))); })));
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    AppState.prototype.addPost = function (blogId, postContent) {
        var blog = this.blogs.find(function (blog) { return blog.id === blogId; });
        if (blog) {
            this.maxPostId++;
            blog.posts.push({
                id: this.maxPostId,
                content: postContent
            });
        }
    };
    var AppState_1;
    AppState = AppState_1 = tslib_1.__decorate([
        vue_class_component_1.default
    ], AppState);
    return AppState;
}(vue_1.default));
exports.AppState = AppState;
function createApp(appState) {
    var router = new vue_router_1.default({
        mode: 'history',
        routes: [
            { path: '/router-demo/vue/', component: Home, props: { appState: appState } },
            { path: '/router-demo/vue/blogs/:blog_id', component: Blog, props: { appState: appState } },
            { path: '/router-demo/vue/blogs/:blog_id/posts/:post_id', component: Post, props: { appState: appState } }
        ]
    });
    return new App({ router: router });
}
exports.createApp = createApp;
var Home = /** @class */ (function (_super) {
    tslib_1.__extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
            props: ['appState']
        })
    ], Home);
    return Home;
}(vue_1.default));
var Blog = /** @class */ (function (_super) {
    tslib_1.__extends(Blog, _super);
    function Blog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.newPostContent = '';
        return _this;
    }
    Object.defineProperty(Blog.prototype, "blog", {
        get: function () {
            var blogId = +this.$route.params.blog_id;
            return this.appState.blogs.find(function (blog) { return blog.id === blogId; });
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
    // tslint:disable-next-line:no-identical-functions
    Blog.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.appState.fetchBlogs();
        }
    };
    Blog = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n            <router-link to=\"/router-demo/vue/\">back to app</router-link>\n        </div>\n        <div class=\"blog-title\">blog {{blog.id}}</div>\n        <div class=\"blog-content\">{{blog.content}}</div>\n        <div>posts</div>\n        <ul>\n            <li v-for=\"post in blog.posts\" :key=\"post.id\">\n                <router-link :to=\"'/router-demo/vue/blogs/' + blog.id + '/posts/' + post.id\">{{post.content}}</router-link>\n            </li>\n        </ul>\n        <input v-model=\"newPostContent\" />\n        <button v-if=\"newPostContent\" @click=\"addNewPost()\">add new post</button>\n    </div>\n    ",
            props: ['appState']
        })
    ], Blog);
    return Blog;
}(vue_1.default));
var Post = /** @class */ (function (_super) {
    tslib_1.__extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Post.prototype, "blog", {
        // tslint:disable-next-line:no-identical-functions
        get: function () {
            var blogId = +this.$route.params.blog_id;
            return this.appState.blogs.find(function (blog) { return blog.id === blogId; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "post", {
        get: function () {
            var postId = +this.$route.params.post_id;
            if (this.blog) {
                return this.blog.posts.find(function (post) { return post.id === postId; });
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Post.prototype.jumpTo = function (url) {
        common.jumpTo(url, this.appState.$data);
    };
    // tslint:disable-next-line:no-identical-functions
    Post.prototype.beforeMount = function () {
        if (!common.isFirstPage) {
            this.appState.fetchBlogs();
        }
    };
    Post = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <div class=\"router\">\n            <a href=\"javascript:void(0)\" @click=\"jumpTo('/router-demo/react/')\">to react app</a>\n            <router-link to=\"/router-demo/vue/\">back to app</router-link>\n            <router-link :to=\"'/router-demo/vue/blogs/' + blog.id\">back to blog</router-link>\n        </div>\n        <div class=\"post-title\">post {{post.id}}</div>\n        <div class=\"post-content\">{{post.content}}</div>\n    </div>\n    ",
            props: ['appState']
        })
    ], Post);
    return Post;
}(vue_1.default));
var App = /** @class */ (function (_super) {
    tslib_1.__extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App = tslib_1.__decorate([
        vue_class_component_1.default({
            template: "\n    <div>\n        <a href=\"https://github.com/plantain-00/router-demo/tree/master/vue/index.ts\" target=\"_blank\">the source code of the demo</a>\n        <br/>\n        <router-view></router-view>\n    </div>\n    "
        })
    ], App);
    return App;
}(vue_1.default));
