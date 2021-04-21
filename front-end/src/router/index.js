import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Library from '../views/Library.vue'
import Browse from '../views/Browse.vue'
import MyMovies from '../views/MyMovies.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  },
  {
    path: '/browse',
    name: 'Browse',
    component: Browse
  },
  {
    path: '/mymovies',
    name: 'MyMovies',
    component: MyMovies
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
