import Vue from 'vue'
import Router from 'vue-router'
// import firebase from 'firebase';

import helloworld from './components/HelloWorld.vue'
import Menu from './components/Menu.vue'
import test from './components/Test.vue'
import fly from './components/Fly.vue'
import login from './components/Login.vue'
import Gazer from './components/Gazer.vue'
import GazerEmotionPredict from './components/GazerEmotionPredict.vue'
import PersonalUse from './components/PersonalUse.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: Menu,
    },
    {
      path: '/indvidual',
      component: PersonalUse
    },
    {
      path: '/model',
      component: GazerEmotionPredict,
    },
    {
      path: '/test',
      component: test,
    },
    {
      path: '/gazer',
      component: Gazer,
    },
    {
      path: '/test_emotion_model',
      component: GazerEmotionPredict,
    },
    {
      path: '/test_fly',
      component: fly,
    },
    {
      path: '/start',
      name: 'start',
      component: test,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      component: login,
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(firebase.auth().currentUser)
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('/login');
  else next();
});

export default router;