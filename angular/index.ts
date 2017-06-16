import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

enableProdMode();

import { Component } from "@angular/core";

import * as common from "../common";

@Component({
    template: `
    <div>
        <div>blogs</div>
        <ul>
            <li v-for="blog in blogs">
                <a [routerLink]="'/angular/blogs/' + blog.id">to /angular/blogs/{{blog.id}}</a>
            </li>
        </ul>
    </div>
    `,
})
class HomeComponent {
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
                <a [routerLink]="'/angular/blogs/' + blog.id + '/posts/' + post.id">to /angular/blogs/{{blog.id}}/posts/{{post.id}}</a>
            </li>
        </ul>
    </div>
    `,
})
class BlogComponent extends angular {
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
        <div><a [routerLink]="'/angular/blogs/' + blog.id">to /angular/blogs/{{blog.id}}</a></div>
        <div>post {{post.id}}</div>
        <div>{{post.content}}</div>
    </div>
    `,
})
class PostComponent {
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

@Component({
    selector: "app",
    template: `
    <div>
        <a href="https://github.com/plantain-00/router-demo/tree/master/angular/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <div><a routerLink="/angular">home</a></div>
        <router-view></router-view>
    </div>
    `,
})
export class MainComponent {
}

import { Routes, RouterModule } from "@angular/router";

const routers: Routes = [
    { path: "/angular", component: HomeComponent },
    { path: "/angular/blogs/:blog_id", component: BlogComponent },
    { path: "/angular/blogs/:blog_id/posts/:post_id", component: PostComponent },
];

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule.forRoot(routers)],
    declarations: [MainComponent, HomeComponent, BlogComponent, PostComponent],
    bootstrap: [MainComponent],
})
class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
