import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, RouteComponentProps } from "react-router-dom";
import { observable, useStrict, action } from "mobx";
import { observer, inject, Provider } from "mobx-react";
import * as common from "../common";

useStrict(true);

class AppState {
    @observable
    blogs = common.blogs;
    @observable
    private maxPostId = common.maxPostId;

    @action
    addPost(payload: { blogId: number, postContent: string }) {
        for (const blog of this.blogs) {
            if (blog.id === payload.blogId) {
                this.maxPostId++;
                blog.posts.push({
                    id: this.maxPostId,
                    content: payload.postContent,
                });
                return;
            }
        }
    }
}
const appState = new AppState();

@inject("appState")
@observer
class Home extends React.Component<RouteComponentProps<{}> & { appState: AppState }, {}> {
    render() {
        return (
            <div>
                <div>blogs</div>
                <ul>
                    {this.props.appState.blogs.map(blog => <li><Link to={"/react/blogs/" + blog.id}>to /react/blogs/{blog.id}</Link></li>)}
                </ul>
            </div>
        );
    }
}

@inject("appState")
@observer
class Blog extends React.Component<RouteComponentProps<{ blog_id: string }> & { appState: AppState }, {}> {
    private blog: common.Blog;
    private newPostContent = "";

    componentWillMount() {
        const blogId = +this.props.match.params.blog_id;
        for (const blog of this.props.appState.blogs) {
            if (blog.id === blogId) {
                this.blog = blog;
                break;
            }
        }
    }

    render() {
        const newPostContentButton = this.newPostContent ? <button v-if="newPostContent" onClick={() => this.addNewPost()}>add new post</button> : null;
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
                <input defaultValue={this.newPostContent} onChange={e => this.setNewPostContent(e.target.value)} />
                {newPostContentButton}
            </div >
        );
    }

    private addNewPost() {
        if (this.blog) {
            this.props.appState.addPost({ blogId: this.blog.id, postContent: this.newPostContent });
        }
    }

    private setNewPostContent(content: string) {
        this.newPostContent = content;
        this.setState({ newPostContent: this.newPostContent });
    }
}

@inject("appState")
@observer
class Post extends React.Component<RouteComponentProps<{ blog_id: string, post_id: string }> & { appState: AppState }, {}> {
    private post: common.Post;
    private blog: common.Blog;

    componentWillMount() {
        const blogId = +this.props.match.params.blog_id;
        const postId = +this.props.match.params.post_id;
        for (const blog of this.props.appState.blogs) {
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

class Main extends React.Component<{}, {}> {
    render() {
        return (
            <Router>
                <Provider appState={appState}>
                    <div>
                        <a href="https://github.com/plantain-00/router-demo/tree/master/react/index.ts" target="_blank">the source code of the demo</a>
                        <br />
                        <div><Link to="/react">home</Link></div>
                        <Route exact path="/react" component={Home}></Route>
                        <Route exact path="/react/blogs/:blog_id" component={Blog}></Route>
                        <Route exact path="/react/blogs/:blog_id/posts/:post_id" component={Post}></Route>
                    </div>
                </Provider>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
