"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var common = tslib_1.__importStar(require("../common"));
mobx_1.configure({ enforceActions: true });
// tslint:disable:no-duplicate-string
exports.methods = {};
var isClientSide = true;
function isServerSide() {
    isClientSide = false;
}
exports.isServerSide = isServerSide;
var AppState = /** @class */ (function () {
    function AppState(appState) {
        this.blogs = [];
        this.maxPostId = 0;
        if (appState) {
            this.blogs = appState.blogs;
            this.maxPostId = appState.maxPostId;
        }
    }
    AppState.prototype.fetchBlogs = function () {
        var _this = this;
        if (this.blogs.length > 0) {
            return Promise.resolve();
        }
        if (exports.methods.fetchBlogs) {
            return exports.methods.fetchBlogs().then(function (blogs) {
                _this.blogs = blogs;
                _this.maxPostId = Math.max.apply(Math, tslib_1.__spread(blogs.map(function (b) { return Math.max.apply(Math, tslib_1.__spread(b.posts.map(function (p) { return p.id; }))); })));
            });
        }
        return Promise.resolve();
    };
    AppState.prototype.addPost = function (blogId, postContent) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.blogs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var blog = _c.value;
                if (blog.id === blogId) {
                    this.maxPostId++;
                    blog.posts.push({
                        id: this.maxPostId,
                        content: postContent
                    });
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
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
        tslib_1.__metadata("design:returntype", void 0)
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
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState); } }, "to vue app")),
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
var Blog = /** @class */ (function (_super) {
    tslib_1.__extends(Blog, _super);
    function Blog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.newPostContent = '';
        return _this;
    }
    Object.defineProperty(Blog.prototype, "blog", {
        get: function () {
            var e_2, _a;
            var blogId = +this.props.match.params.blog_id;
            try {
                for (var _b = tslib_1.__values(this.props.appState.blogs), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var blog = _c.value;
                    if (blog.id === blogId) {
                        return blog;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    // tslint:disable-next-line:no-identical-functions
    Blog.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.appState.fetchBlogs();
        }
    };
    Blog.prototype.render = function () {
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
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState); } }, "to vue app"),
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
    Blog.prototype.addNewPost = function () {
        if (this.blog) {
            this.props.appState.addPost(this.blog.id, this.newPostContent);
        }
    };
    Blog.prototype.setNewPostContent = function (content) {
        this.newPostContent = content;
        this.setState({ newPostContent: this.newPostContent });
    };
    Blog = tslib_1.__decorate([
        mobx_react_1.inject('appState'),
        mobx_react_1.observer
    ], Blog);
    return Blog;
}(React.Component));
var Post = /** @class */ (function (_super) {
    tslib_1.__extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Post.prototype, "blog", {
        // tslint:disable-next-line:no-identical-functions
        get: function () {
            var e_3, _a;
            var blogId = +this.props.match.params.blog_id;
            try {
                for (var _b = tslib_1.__values(this.props.appState.blogs), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var blog = _c.value;
                    if (blog.id === blogId) {
                        return blog;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "post", {
        get: function () {
            var e_4, _a;
            var postId = +this.props.match.params.post_id;
            if (this.blog) {
                try {
                    for (var _b = tslib_1.__values(this.blog.posts), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var post = _c.value;
                        if (post.id === postId) {
                            return post;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    // tslint:disable-next-line:no-identical-functions
    Post.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.appState.fetchBlogs();
        }
    };
    Post.prototype.render = function () {
        var _this = this;
        if (!this.blog || !this.post) {
            return null;
        }
        return (React.createElement("div", null,
            React.createElement("div", { className: 'router' },
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState); } }, "to vue app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/' }, "back to app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/react/blogs/' + this.blog.id }, "back to blog")),
            React.createElement("div", { className: 'post-title' },
                "post ",
                this.post.id),
            React.createElement("div", { className: 'post-content' }, this.post.content)));
    };
    Post = tslib_1.__decorate([
        mobx_react_1.inject('appState'),
        mobx_react_1.observer
    ], Post);
    return Post;
}(React.Component));
exports.routes = [
    {
        path: '/router-demo/react/',
        component: Home,
        exact: true
    },
    {
        path: '/router-demo/react/blogs/:blog_id',
        component: Blog,
        exact: true
    },
    {
        path: '/router-demo/react/blogs/:blog_id/posts/:post_id',
        component: Post,
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
