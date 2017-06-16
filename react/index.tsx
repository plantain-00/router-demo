import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, RouteComponentProps } from "react-router-dom";
// import { observable } from "mobx";
// import { observer } from "mobx-react";
import * as common from "../common";

// class AppState {
//     @observable
//     blogs = common.blogs;
// }
// const appState = new AppState();

// @observer
class Home extends React.Component<RouteComponentProps<{}>, {}> {
    blogs = common.blogs;

    render() {
        return (
            <div>
                <div>blogs</div>
                <ul>
                    {this.blogs.map(blog => <li><Link to={"/react/blogs/" + blog.id}>to /react/blogs/{blog.id}</Link></li>)}
                </ul>
            </div>
        );
    }
}

// @observer
class Blog extends React.Component<RouteComponentProps<{ blog_id: string }>, {}> {
    blog: common.Blog;

    componentWillMount() {
        const blogId = +this.props.match.params.blog_id;
        for (const blog of common.blogs) {
            if (blog.id === blogId) {
                this.blog = blog;
                break;
            }
        }
    }

    render() {
        const posts = this.blog.posts.map(post => {
            return (
                <li>
                    <Link to={"/react/blogs/" + this.blog.id + "/posts/" + post.id}>to /react/blogs/{this.blog.id}/posts/{post.id}</Link>
                </li>
            );
        });
        return (
            <div>
                <div>blog {this.blog.id}</div>
                <div>{this.blog.content}</div>
                <div>posts</div>
                <ul>
                    {posts}
                </ul>
            </div >
        );
    }
}

// @observer
class Post extends React.Component<RouteComponentProps<{ blog_id: string, post_id: string }>, {}> {
    post: common.Post;
    blog: common.Blog;

    componentWillMount() {
        const blogId = +this.props.match.params.blog_id;
        const postId = +this.props.match.params.post_id;
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

    render() {
        return (
            <div>
                <div><Link to={"/react/blogs/" + this.blog.id}>to /react/blogs/{this.blog.id}</Link></div>
                <div>post {this.post.id}</div>
                <div>{this.post.content}</div>
            </div >
        );
    }
}

// @observer
class Main extends React.Component<{}, {}> {
    render() {
        return (
            <Router>
                <div>
                    <a href="https://github.com/plantain-00/router-demo/tree/master/react/index.ts" target="_blank">the source code of the demo</a>
                    <br />
                    <div><Link to="/react">home</Link></div>
                    <Route exact path="/react" component={Home}></Route>
                    <Route exact path="/react/blogs/:blog_id" component={Blog}></Route>
                    <Route exact path="/react/blogs/:blog_id/posts/:post_id" component={Post}></Route>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
