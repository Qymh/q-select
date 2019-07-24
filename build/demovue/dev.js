import base from './base';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import replace from 'rollup-plugin-replace';
import htmlTemplate from 'rollup-plugin-generate-html-template';

base.plugins.push(
  replace({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  serve({
    contentBase: ['demo/vue/dist'],
    port: 10003
  }),
  livereload(),
  htmlTemplate({
    template: 'demo/vue/index.html',
    target: 'index.html'
  })
);

export default base;
