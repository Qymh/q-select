import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: 'demo/js/index.js',
  output: {
    file: 'demo/js/dist/bundle.js',
    name: 'demo',
    format: 'umd'
  },
  plugins: [
    json(),
    typescript(),
    postcss({
      extract: true,
      extensions: ['.css']
    }),
    commonjs(),
    resolve({
      mainFields: ['main', 'browser']
    })
  ]
};
