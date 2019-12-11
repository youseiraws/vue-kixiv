import Vue from 'vue'
import VueRouter from 'vue-router'
import { Latest, Random, Category, Tag } from '../views'

Vue.use(VueRouter)

const routes = [
  {
    path: '/latest',
    name: 'latest',
    component: Latest,
  },
  {
    path: '/random',
    name: 'random',
    component: Random,
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
  },
  {
    path: '/tag/:name',
    name: 'tag',
    component: Tag,
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
