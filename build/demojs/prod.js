import replace from 'rollup-plugin-replace';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import base from './base';

base.plugins.push(
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  htmlTemplate({
    template: 'demo/js/index.html',
    target: 'index.html'
  })
);

base.output = {
  file: 'gitpage/js/bundle.js',
  name: 'demo',
  format: 'umd'
};

export default base;
