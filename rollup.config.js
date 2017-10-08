const resolve = require('rollup-plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');
const Rollup = require('rollup');
const { rollup } = Rollup;

const globals = {
  '@angular/core': 'ng.core',
  '@angular/compiler': 'ng.compiler',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-server': 'ng.platformServer',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx'
};

const options = {
  input: 'dist/packages-dist/index.js',
  output: 'dist/packages-dist/index.umd.js',
  format: 'umd',
  name: 'angularstatic',
  plugins: [resolve(), sourcemaps()],
  external: Object.keys(globals),
  globals: globals,
  file: 'dist/packages-dist/index.umd.js'
};

console.log(options);

rollup(options).then(bundle => bundle.write(options));
