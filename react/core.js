"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var common = tslib_1.__importStar(require("../common"));
exports.methods = {};
var isClientSide = true;
function isServerSide() {
    isClientSide = false;
}
exports.isServerSide = isServerSide;
var Blog = /** @class */ (function () {
    function Blog(blog) {
        var _this = this;
        this.id = blog.id;
        this.content = blog.content;
        this.posts = blog.posts.map(function (p) { return new Post(p, _this); });
    }
    Blog.prototype.toJS = function () {
        return {
            id: this.id,
            content: this.content,
            posts: this.posts.map(function (post) { return post.toJS(); })
        };
    };
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", Number)
    ], Blog.prototype, "id", void 0);
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", String)
    ], Blog.prototype, "content", void 0);
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", Array)
    ], Blog.prototype, "posts", void 0);
    return Blog;
}());
var Post = /** @class */ (function () {
    function Post(post, blog) {
        this.id = post.id;
        this.content = post.content;
        this.blog = blog;
    }
    Post.prototype.toJS = function () {
        return {
            id: this.id,
            content: this.content
        };
    };
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", Number)
    ], Post.prototype, "id", void 0);
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", String)
    ], Post.prototype, "content", void 0);
    tslib_1.__decorate([
        mobx_1.observable.ref,
        tslib_1.__metadata("design:type", Blog)
    ], Post.prototype, "blog", void 0);
    return Post;
}());
var AppState = /** @class */ (function () {
    function AppState(appState) {
        this.blogs = [];
        this.maxPostId = 0;
        if (appState) {
            this.blogs = mobx_1.observable.array(appState.blogs.map(function (blog) { return new Blog(blog); }));
            this.maxPostId = appState.maxPostId;
        }
    }
    AppState.prototype.toJS = function () {
        return {
            blogs: this.blogs.map(function (blog) { return blog.toJS(); }),
            maxPostId: this.maxPostId
        };
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
                        this.blogs = mobx_1.observable.array(blogs.map(function (blog) { return new Blog(blog); }));
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
            blog.posts.push(new Post({
                id: this.maxPostId,
                content: postContent
            }, blog));
        }
    };
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", Array)
    ], AppState.prototype, "blogs", void 0);
    tslib_1.__decorate([
        mobx_1.observable,
        tslib_1.__metadata("design:type", Object)
    ], AppState.prototype, "maxPostId", void 0);
    tslib_1.__decorate([
        mobx_1.action,
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", Promise)
    ], AppState.prototype, "fetchBlogs", null);
    tslib_1.__decorate([
        mobx_1.action,
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Number, String]),
        tslib_1.__metadata("design:returntype", void 0)
    ], AppState.prototype, "addPost", null);
    return AppState;
}());
exports.AppState = AppState;
var Home = /** @class */ (function (_super) {
    tslib_1.__extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.appState.fetchBlogs();
        }
    };
    Home.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("div", { className: 'router' },
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState.toJS()); } }, "to vue app")),
            React.createElement("div", { className: 'blogs-title' }, "blogs"),
            React.createElement("ul", null, this.props.appState.blogs.map(function (blog) { return React.createElement("li", { key: blog.id },
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/blogs/' + blog.id }, blog.content)); }))));
    };
    Home = tslib_1.__decorate([
        mobx_react_1.inject('appState'),
        mobx_react_1.observer
    ], Home);
    return Home;
}(React.Component));
var BlogComponent = /** @class */ (function (_super) {
    tslib_1.__extends(BlogComponent, _super);
    function BlogComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.newPostContent = '';
        return _this;
    }
    Object.defineProperty(BlogComponent.prototype, "blog", {
        get: function () {
            var blogId = +this.props.match.params.blog_id;
            return this.props.appState.blogs.find(function (blog) { return blog.id === blogId; });
        },
        enumerable: true,
        configurable: true
    });
    BlogComponent.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.appState.fetchBlogs();
        }
    };
    BlogComponent.prototype.render = function () {
        var _this = this;
        if (!this.blog) {
            return null;
        }
        var newPostContentButton = this.newPostContent ? React.createElement("button", { onClick: function () { return _this.addNewPost(); } }, "add new post") : null;
        var posts = this.blog.posts.map(function (post) {
            return (React.createElement("li", { key: post.id },
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/blogs/' + _this.blog.id + '/posts/' + post.id }, post.content)));
        });
        return (React.createElement("div", null,
            React.createElement("div", { className: 'router' },
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState.toJS()); } }, "to vue app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/' }, "back to app")),
            React.createElement("div", { className: 'blog-title' },
                "blog ",
                this.blog.id),
            React.createElement("div", { className: 'blog-content' }, this.blog.content),
            React.createElement("div", null, "posts"),
            React.createElement("ul", null, posts),
            React.createElement("input", { defaultValue: this.newPostContent, onChange: function (e) { return _this.setNewPostContent(e.target.value); } }),
            newPostContentButton));
    };
    BlogComponent.prototype.addNewPost = function () {
        if (this.blog) {
            this.props.appState.addPost(this.blog.id, this.newPostContent);
        }
    };
    BlogComponent.prototype.setNewPostContent = function (content) {
        this.newPostContent = content;
        this.setState({ newPostContent: this.newPostContent });
    };
    BlogComponent = tslib_1.__decorate([
        mobx_react_1.inject('appState'),
        mobx_react_1.observer
    ], BlogComponent);
    return BlogComponent;
}(React.Component));
var PostComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PostComponent, _super);
    function PostComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PostComponent.prototype, "blog", {
        get: function () {
            var blogId = +this.props.match.params.blog_id;
            return this.props.appState.blogs.find(function (blog) { return blog.id === blogId; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PostComponent.prototype, "post", {
        get: function () {
            var postId = +this.props.match.params.post_id;
            if (this.blog) {
                return this.blog.posts.find(function (post) { return post.id === postId; });
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    PostComponent.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.appState.fetchBlogs();
        }
    };
    PostComponent.prototype.render = function () {
        var _this = this;
        if (!this.blog || !this.post) {
            return null;
        }
        return (React.createElement("div", null,
            React.createElement("div", { className: 'router' },
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState.toJS()); } }, "to vue app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/' }, "back to app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/blogs/' + this.blog.id }, "back to blog")),
            React.createElement("div", { className: 'post-title' },
                "post ",
                this.post.id),
            React.createElement("div", { className: 'post-content' }, this.post.content)));
    };
    PostComponent = tslib_1.__decorate([
        mobx_react_1.inject('appState'),
        mobx_react_1.observer
    ], PostComponent);
    return PostComponent;
}(React.Component));
exports.routes = [
    {
        path: '/router-demo/react/',
        component: Home,
        exact: true
    },
    {
        path: '/router-demo/react/blogs/:blog_id',
        component: BlogComponent,
        exact: true
    },
    {
        path: '/router-demo/react/blogs/:blog_id/posts/:post_id',
        component: PostComponent,
        exact: true
    }
];
var Main = /** @class */ (function (_super) {
    tslib_1.__extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("a", { href: 'https://github.com/plantain-00/router-demo/tree/master/react/index.ts', target: '_blank' }, "the source code of the demo"),
            React.createElement("br", null),
            exports.routes.map(function (route) { return (React.createElement(react_router_dom_1.Route, tslib_1.__assign({ key: route.path }, route))); })));
    };
    return Main;
}(React.Component));
exports.Main = Main;
