import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/reader',
    name: 'Reader',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Reader.vue')
  },
  {
    path: '/sources',
    name: 'Sources',
    component: () => import(/* webpackChunkName: "about" */ '../views/Sources.vue')
}

]

const router = createRouter({
  routes,
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
})

export default router
