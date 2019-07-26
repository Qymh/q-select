import Vue from 'vue';
import App from './App.vue';
import QSelect from '@qymh/vue-q-select/src/index';
Vue.use(QSelect);
new Vue({
  el: '#app',
  render: h => h(App)
});
