import { createRouter, createWebHashHistory } from 'vue-router';
import CardList from '../views/CardList.vue';
import Card from '../views/Card.vue';

const routes = [
  {
    path: '/',
    component: CardList
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/cards/:id',
    component: Card
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
