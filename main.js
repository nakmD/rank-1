// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDPzR8gpncWtGk-VieDdhXoBUnNxsKPMK0',
  authDomain: 'fan-vote2020.firebaseapp.com',
  databaseURL: 'https://fan-vote2020.firebaseio.com',
  projectId: 'fan-vote2020',
  storageBucket: 'fan-vote2020.appspot.com',
  messagingSenderId: '315334088574'
}

firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
