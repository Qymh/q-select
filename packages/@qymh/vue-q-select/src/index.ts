import QSelect from './vue/Index.vue';
// eslint-disable-next-line
import { VueConstructor } from 'vue';
import { plugin } from 'vue-function-api';
import '@qymh/q-select/dist/q-select.css';
export default {
  install(Vue: VueConstructor) {
    Vue.use(plugin);
    Vue.component('QSelect', QSelect as any);
  }
};
