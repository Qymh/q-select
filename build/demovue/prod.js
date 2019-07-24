import base from './base';
import replace from 'rollup-plugin-replace';
import htmlTemplate from 'rollup-plugin-generate-html-template';

base.plugins.push(
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  htmlTemplate({
    template: 'demo/vue/index.html',
    target: 'index.html'
  })
);

base.output = {
  file: 'gitpage/vue/bundle.js',
  name: 'demo',
  format: 'umd'
};

export default base;
