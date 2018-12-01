"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var rxjs_1 = require("rxjs");
var immer_1 = tslib_1.__importDefault(require("immer"));
var common = tslib_1.__importStar(require("../common"));
// tslint:disable:no-duplicate-string
exports.methods = {};
var isClientSide = true;
function isServerSide() {
    isClientSide = false;
}
exports.isServerSide = isServerSide;
var Home = /** @class */ (function (_super) {
    tslib_1.__extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.subject.next({ type: 'fetch blogs' });
        }
    };
    Home.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("div", { className: 'router' },
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.props.appState); } }, "to vue app")),
            React.createElement("div", { className: 'blogs-title' }, "blogs"),
            React.createElement("ul", null, this.props.appState.blogs.map(function (blog) { return React.createElement("li", { key: blog.id },
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/rxjs-react/blogs/' + blog.id }, blog.content)); }))));
    };
    return Home;
}(React.Component));
var Blog = /** @class */ (function (_super) {
    tslib_1.__extends(Blog, _super);
    function Blog(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            appState: _this.props.appState,
            newPostContent: ''
        };
        return _this;
    }
    Object.defineProperty(Blog.prototype, "blog", {
        get: function () {
            var blogId = +this.props.match.params.blog_id;
            return this.props.appState.blogs.find(function (blog) { return blog.id === blogId; });
        },
        enumerable: true,
        configurable: true
    });
    // tslint:disable-next-line:no-identical-functions
    Blog.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.subject.next({ type: 'fetch blogs' });
        }
    };
    Blog.prototype.render = function () {
        var _this = this;
        if (!this.blog) {
            return null;
        }
        var newPostContentButton = this.state.newPostContent ? React.createElement("button", { onClick: function () { return _this.addNewPost(); } }, "add new post") : null;
        var posts = this.blog.posts.map(function (post) {
            return (React.createElement("li", { key: post.id },
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/rxjs-react/blogs/' + _this.blog.id + '/posts/' + post.id }, post.content)));
        });
        return (React.createElement("div", null,
            React.createElement("div", { className: 'router' },
                React.createElement("a", { href: 'javascript:void(0)', onClick: function () { return common.jumpTo('/router-demo/vue/', _this.state.appState); } }, "to vue app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/rxjs-react/' }, "back to app")),
            React.createElement("div", { className: 'blog-title' },
                "blog ",
                this.blog.id),
            React.createElement("div", { className: 'blog-content' }, this.blog.content),
            React.createElement("div", null, "posts"),
            React.createElement("ul", null, posts),
            React.createElement("input", { defaultValue: this.state.newPostContent, onChange: function (e) { return _this.setNewPostContent(e.target.value); } }),
            newPostContentButton));
    };
    Blog.prototype.addNewPost = function () {
        if (this.blog) {
            this.props.subject.next({ type: 'add post', postId: this.blog.id, postContent: this.state.newPostContent });
        }
    };
    Blog.prototype.setNewPostContent = function (content) {
        this.setState({ newPostContent: content });
    };
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
            var blogId = +this.props.match.params.blog_id;
            return this.props.appState.blogs.find(function (blog) { return blog.id === blogId; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "post", {
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
    // tslint:disable-next-line:no-identical-functions
    Post.prototype.componentWillMount = function () {
        if (isClientSide && !common.isFirstPage) {
            this.props.subject.next({ type: 'fetch blogs' });
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
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/rxjs-react/' }, "back to app"),
                React.createElement(react_router_dom_1.Link, { to: '/router-demo/rxjs-react/blogs/' + this.blog.id }, "back to blog")),
            React.createElement("div", { className: 'post-title' },
                "post ",
                this.post.id),
            React.createElement("div", { className: 'post-content' }, this.post.content)));
    };
    return Post;
}(React.Component));
var Main = /** @class */ (function (_super) {
    tslib_1.__extends(Main, _super);
    function Main(props) {
        var _this = _super.call(this, props) || this;
        _this.subject = new rxjs_1.Subject();
        _this.state = {
            appState: _this.props.appState
        };
        return _this;
    }
    Main.prototype.componentWillMount = function () {
        var _this = this;
        this.subscription = this.subject.subscribe(function (command) {
            if (command.type === 'fetch blogs') {
                _this.fetchBlogs();
            }
            else if (command.type === 'add post') {
                _this.addPost(command.postId, command.postContent);
            }
        });
    };
    Main.prototype.componentWillUnmount = function () {
        this.subject.unsubscribe();
        this.subscription.unsubscribe();
    };
    Main.prototype.fetchBlogs = function () {
        var _this = this;
        if (this.state.appState.blogs.length === 0 && exports.methods.fetchBlogs) {
            exports.methods.fetchBlogs().then(function (blogs) {
                var nextState = immer_1.default(_this.state.appState, function (draftState) {
                    draftState.blogs = blogs;
                    draftState.maxPostId = Math.max.apply(Math, tslib_1.__spread(blogs.map(function (b) { return Math.max.apply(Math, tslib_1.__spread(b.posts.map(function (p) { return p.id; }))); })));
                });
                _this.setState({
                    appState: nextState
                });
            });
        }
    };
    Main.prototype.addPost = function (blogId, postContent) {
        var index = this.state.appState.blogs.findIndex(function (blog) { return blog.id === blogId; });
        if (index >= 0) {
            var nextState = immer_1.default(this.state.appState, function (draftState) {
                draftState.maxPostId++;
                draftState.blogs[index].posts.push({
                    id: draftState.maxPostId,
                    content: postContent
                });
            });
            this.setState({ appState: nextState });
        }
    };
    Main.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("a", { href: 'https://github.com/plantain-00/router-demo/tree/master/rxjs-react/index.ts', target: '_blank' }, "the source code of the demo"),
            React.createElement("br", null),
            React.createElement(react_router_dom_1.Route, { key: 'home', path: '/router-demo/rxjs-react/', render: function (props) { return React.createElement(Home, tslib_1.__assign({ appState: _this.state.appState, subject: _this.subject }, props)); }, exact: true }),
            React.createElement(react_router_dom_1.Route, { key: 'blog', path: '/router-demo/rxjs-react/blogs/:blog_id', render: function (props) { return React.createElement(Blog, tslib_1.__assign({ appState: _this.state.appState, subject: _this.subject }, props)); }, exact: true }),
            React.createElement(react_router_dom_1.Route, { key: 'post', path: '/router-demo/rxjs-react/blogs/:blog_id/posts/:post_id', render: function (props) { return React.createElement(Post, tslib_1.__assign({ appState: _this.state.appState, subject: _this.subject }, props)); }, exact: true })));
    };
    return Main;
}(React.Component));
exports.Main = Main;
