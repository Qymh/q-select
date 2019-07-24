import QSelect from './vue/Index.vue';
// eslint-disable-next-line
import { VueConstructor } from 'vue';
import { plugin } from 'vue-function-api';
interface Options {
  name: string;
}
export default {
  install(Vue: VueConstructor, options: Options) {
    Vue.use(plugin);
    Vue.component(options.name || 'QSelect', QSelect as any);
  }
};
