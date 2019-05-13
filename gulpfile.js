const { src, dest, watch, parallel, series, task } = require('gulp');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const clean = require('gulp-clean');

const paths = {
  source: {
    base: './src',
    css: './src/css/',
    scss: './src/scss/**/*.scss',
    html: './src/*.html'
  },
  dist: {
    base: './dist',
    css: './dist/css/'
  }
}

function style() {
  return src(paths.source.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest(paths.source.css));
}

function minify() {
  return src(paths.source.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist.css));
}

function clear() {
  return src([`${paths.source.css}/*`, paths.dist.base], {read: false, allowEmpty: true})
    .pipe(clean({force: true}))
}

function see() {
  browserSync.init({
    server: {
      baseDir: "./src"
    },
  })

  watch(paths.source.scss, series(clear, style)).on('change', browserSync.reload)
  watch(paths.source.html).on('change', browserSync.reload)
}

exports.minify = minify
exports.clear = clear
const build = series(clear, parallel(style, see))
task('default', build)