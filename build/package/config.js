'use strict';

const path = require('path');
const replace = require('rollup-plugin-replace');
const typescript = require('rollup-plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const commonjs = require('rollup-plugin-commonjs');
const vue = require('rollup-plugin-vue');
const resolve = require('rollup-plugin-node-resolve');
const pack = require('../../lerna.json');
const version = pack.version;

const bannerJs = `/**
 * @qymh/q-select v${version}
 * (c) ${new Date().getFullYear()} Qymh
 * @license MIT
 */`;

const bannerVue = `/**
 * @qymh/vue-q-select v${version}
 * (c) ${new Date().getFullYear()} Qymh
 * @license MIT
 */`;

exports.resolve = _path => {
  return path.resolve(__dirname, '../../', _path);
};

exports.getSize = code => {
  return (code.length / 1024).toFixed(2) + 'kb';
};

exports.logError = msg => {
  // eslint-disable-next-line
  console.log(msg);
};

exports.blueTips = msg => {
  // eslint-disable-next-line
  console.log('\x1b[1m\x1b[34m' + msg + '\x1b[39m\x1b[22m');
};

const mapsJs = {
  umdProd: {
    input: this.resolve('packages/@qymh/q-select/src/index.ts'),
    file: this.resolve('packages/@qymh/q-select/dist/q-select.min.js'),
    cssFile: this.resolve('packages/@qymh/q-select/dist/q-select.css'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    input: this.resolve('packages/@qymh/q-select/src/index.ts'),
    file: this.resolve('packages/@qymh/q-select/dist/q-select.common.js'),
    format: 'cjs'
  },
  esm: {
    input: this.resolve('packages/@qymh/q-select/src/index.ts'),
    file: this.resolve('packages/@qymh/q-select/dist/q-select.esm.js'),
    format: 'es'
  }
};

const mapsVue = {
  umdProd: {
    input: this.resolve('packages/@qymh/vue-q-select/src/index.ts'),
    file: this.resolve('packages/@qymh/vue-q-select/dist/q-select.min.js'),
    cssFile: this.resolve('packages/@qymh/vue-q-select/dist/q-select.css'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    input: this.resolve('packages/@qymh/vue-q-select/src/index.ts'),
    file: this.resolve('packages/@qymh/vue-q-select/dist/q-select.common.js'),
    format: 'cjs'
  },
  esm: {
    input: this.resolve('packages/@qymh/vue-q-select/src/index.ts'),
    file: this.resolve('packages/@qymh/vue-q-select/dist/q-select.esm.js'),
    format: 'es'
  }
};

function generateOpts(opts, type, category) {
  const base = {
    input: opts.input,
    output: {
      banner: type === 'vue' ? bannerVue : bannerJs,
      file: opts.file,
      format: opts.format,
      name: 'QSelect',
      cssFile: opts.cssFile
    },
    plugins: [
      commonjs(),
      typescript(),
      postcss({
        extract: true,
        extensions: ['.css']
      }),
      resolve({
        mainFields: ['main', 'browser']
      }),
      replace({
        __VERSION__: version
      })
    ]
  };

  opts.env &&
    base.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env)
      })
    );

  if (type === 'vue') {
    if (category !== 'umdProd') {
      base.external = ['vue', 'vue-function-api', '@qymh/q-select'];
    }
    base.plugins.push(vue());
  }

  return base;
}

const jsConfig = Object.keys(mapsJs).reduce((acc, val) => {
  acc[val] = generateOpts(mapsJs[val], 'js');
  return acc;
}, {});

const vueConfig = Object.keys(mapsVue).reduce((acc, val) => {
  acc[val] = generateOpts(mapsVue[val], 'vue', val);
  return acc;
}, {});

exports.JsConfig = jsConfig;

exports.VueConfig = vueConfig;
