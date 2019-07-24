import Vue from 'vue';
import App from './App.vue';
import QSelect from 'vue-q-select';
Vue.use(QSelect);
new Vue({
  el: '#app',
  render: h => h(App)
});
