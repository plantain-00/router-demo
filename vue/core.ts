import { defineComponent, createApp, PropType, reactive, createSSRApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import * as common from '../common'

export const methods: { fetchBlogs?: () => Promise<common.Blog[]> } = {}

export const AppState = reactive({
  blogs: [] as common.Blog[],
  maxPostId: 0,
  async fetchBlogs() {
    if (this.blogs.length === 0 && methods.fetchBlogs) {
      const blogs = await methods.fetchBlogs()
      this.blogs = blogs
      this.maxPostId = Math.max(...blogs.map(b => Math.max(...b.posts.map(p => p.id))))
    }
  },
  addPost(blogId: number, postContent: string) {
    const blog = this.blogs.find((blog) => blog.id === blogId)
    if (blog) {
      this.maxPostId++
      blog.posts.push({
        id: this.maxPostId,
        content: postContent
      })
    }
  },
})

export function createAppWithRoutes(appState: typeof AppState, isSSR: boolean) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/router-demo/vue/', component: Home, props: { appState } },
      { path: '/router-demo/vue/blogs/:blog_id', component: Blog, props: { appState } },
      { path: '/router-demo/vue/blogs/:blog_id/posts/:post_id', component: Post, props: { appState } }
    ]
  })

  const app = (isSSR ? createSSRApp : createApp)(App)
  app.use(router)
  return { app, router }
}

const Home = defineComponent({
  template: `
    <div>
        <div class="router">
            <a href="javascript:void(0)" @click="jumpTo('/router-demo/react/')">to react app</a>
        </div>
        <div class="blogs-title">blogs</div>
        <ul>
            <li v-for="blog in blogs" :key="blog.id">
                <router-link :to="'/router-demo/vue/blogs/' + blog.id">{{blog.content}}</router-link>
            </li>
        </ul>
    </div>
    `,
  props: {
    appState: {
      type: {} as PropType<typeof AppState>,
      required: true,
    }
  },
  computed: {
    blogs(): common.Blog[] {
      return this.appState.blogs
    }
  },
  methods: {
    jumpTo(url: string) {
      common.jumpTo(url, this.appState)
    }
  },
  beforeMount() {
    if (!common.isFirstPage) {
      this.appState.fetchBlogs()
    }
  }
})

const Blog = defineComponent({
  template: `
    <div>
        <div class="router">
            <a href="javascript:void(0)" @click="jumpTo('/router-demo/react/')">to react app</a>
            <router-link to="/router-demo/vue/">back to app</router-link>
        </div>
        <div class="blog-title">blog {{blog.id}}</div>
        <div class="blog-content">{{blog.content}}</div>
        <div>posts</div>
        <ul>
            <li v-for="post in blog.posts" :key="post.id">
                <router-link :to="'/router-demo/vue/blogs/' + blog.id + '/posts/' + post.id">{{post.content}}</router-link>
            </li>
        </ul>
        <input v-model="newPostContent" />
        <button v-if="newPostContent" @click="addNewPost()">add new post</button>
    </div>
    `,
  props: {
    appState: {
      type: {} as PropType<typeof AppState>,
      required: true,
    }
  },
  data: () => {
    return {
      newPostContent: ''
    }
  },
  computed: {
    blog(): common.Blog | undefined {
      const blogId = +this.$route.params.blog_id
      return this.appState.blogs.find((blog) => blog.id === blogId)
    }
  },
  methods: {
    addNewPost() {
      if (this.blog) {
        this.appState.addPost(this.blog.id, this.newPostContent)
      }
    },
    jumpTo(url: string) {
      common.jumpTo(url, this.appState)
    },
  },
  beforeMount() {
    if (!common.isFirstPage) {
      this.appState.fetchBlogs()
    }
  }
})

const Post = defineComponent({
  template: `
    <div>
        <div class="router">
            <a href="javascript:void(0)" @click="jumpTo('/router-demo/react/')">to react app</a>
            <router-link to="/router-demo/vue/">back to app</router-link>
            <router-link :to="'/router-demo/vue/blogs/' + blog.id">back to blog</router-link>
        </div>
        <div class="post-title">post {{post.id}}</div>
        <div class="post-content">{{post.content}}</div>
    </div>
    `,
  props: {
    appState: {
      type: {} as PropType<typeof AppState>,
      required: true,
    }
  },
  computed: {
    blog(): common.Blog | undefined {
      const blogId = +this.$route.params.blog_id
      return this.appState.blogs.find((blog) => blog.id === blogId)
    },
    post(): common.Post | undefined {
      const postId = +this.$route.params.post_id
      if (this.blog) {
        return this.blog.posts.find((post) => post.id === postId)
      }
      return undefined
    }
  },
  methods: {
    jumpTo(url: string) {
      common.jumpTo(url, this.appState)
    }
  },
  beforeMount() {
    if (!common.isFirstPage) {
      this.appState.fetchBlogs()
    }
  }
})

const App = defineComponent({
  template: `
    <div>
        <a href="https://github.com/plantain-00/router-demo/tree/master/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <router-view></router-view>
    </div>
    `
})

