import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Casino from './views/Casino.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/casino',
      name: 'casino',
      component: Casino
    },
    {
      path: '/more',
      name: 'more',
      component: ()=>import('./views/more.vue')
    },
    {
      path: '/csmodel',
      name: 'csmodel',
      component: ()=>import('./views/CsModel.vue')
    },
    {
      path: '/seat',
      name: 'seat',
      component: ()=>import('./views/Seat.vue')
    },
    {
      path: '/scale',
      name: 'scale',
      component: ()=>import('./views/Scale.vue')
    },
    {
      path: '/init',
      name: 'init',
      component: ()=>import('./views/InitScale.vue')
    },
    {
      path: '/loop',
      name: 'loop',
      component: ()=>import('./views/Loop.vue')
    },
  ]
})
