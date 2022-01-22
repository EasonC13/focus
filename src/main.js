import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false


import firebase from 'firebase';
let app = '';
const firebaseConfig = {
  apiKey: "AIzaSyAyVfAUfzY41tysObkfx2d6viGGacC_4wo",
  authDomain: "focusplus-332103.firebaseapp.com",
  projectId: "focusplus-332103",
  storageBucket: "focusplus-332103.appspot.com",
  messagingSenderId: "1064271659722",
  appId: "1:1064271659722:web:f80b44f5ecd60b2a39aa33",
  measurementId: "G-81W248DL48"
};

firebase.initializeApp(firebaseConfig);


firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    window.firebase = firebase
    /* eslint-disable no-new */
    // app = new Vue({
    //   router,
    //   render: h => h(App)
    // }).$mount('#app');
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')
  }
});

