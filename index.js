import Vue from 'vue'
import Router from 'vue-router'

import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import Graph from '@/components/Graph'
import firebase from 'firebase'
import Eps from '@/components/Eps'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'signin'
    },
    {
      path: '/',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/Graph',
      name: 'Graph',
      component: Graph
    },
    {
      path: '/Eps',
      name: 'Eps',
      component: Eps
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})

export default router
