import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';

export default {
  input: 'demo/vue/index.js',
  output: {
    file: 'demo/vue/dist/bundle.js',
    name: 'demo',
    format: 'umd'
  },
  plugins: [
    vue(),
    typescript(),
    postcss({
      extract: true,
      extensions: ['.css'],
      plugins: [
        require('postcss-px-to-viewport')({
          unitToConvert: 'px',
          viewportWidth: 750,
          viewportHeight: 1334,
          unitPrecision: 3,
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          minPixelValue: 1,
          mediaQuery: false
        })
      ]
    }),
    commonjs(),
    resolve({
      mainFields: ['main', 'browser']
    })
  ]
};
