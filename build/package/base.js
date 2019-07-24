const rollup = require('rollup');
const terser = require('terser');
const fs = require('fs-extra');
const zlib = require('zlib');
const { getSize, blueTips, logError } = require('./config');

function report(file, size) {
  blueTips(`output: ${file} ${size ? `gzip: ${size}` : ''}`);
}

async function write(file, code) {
  await fs.outputFile(file, code);
  await zlib.gzip(code, (err, zipped) => {
    if (err) throw new Error(err);
    const size = getSize(zipped);
    report(file, size);
  });
}

async function build(config) {
  for (const item of Object.keys(config)) {
    const chunk = config[item];
    const isProd = /min\.js$/.test(chunk.output.file);
    try {
      await rollup
        .rollup(chunk)
        .then(bundle => bundle.generate(chunk.output))
        .then(output => {
          const js = output.output[0];
          const css = output.output[1];
          const jscode = js.code;
          const csscode = css ? css.source : '';
          if (jscode) {
            if (isProd) {
              if (csscode) {
                const csscodeString = csscode.toString();
                write(chunk.output.cssFile, csscodeString);
              }
              const minified = terser.minify(jscode, {
                toplevel: true,
                output: {
                  ascii_only: true
                },
                compress: {
                  pure_funcs: ['makeMap']
                }
              }).code;
              write(chunk.output.file, minified);
            } else {
              write(chunk.output.file, jscode);
            }
          }
        });
    } catch (error) {
      logError(error);
    }
  }
}

module.exports = build;
