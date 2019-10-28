// Initialize modules
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const fs = require('fs');
const imagemin = require('gulp-imagemin');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const merge = require('merge-stream');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const config = require('./config.json');

const entry = config.entry;
const output = config.output;
const path = config.path;

// ENV
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist',
    },
    port: 3000,
  });
  done();
}

// Views task
function viewsTask() {
  return gulp
    .src(path.src.pug)
    .pipe(plumber())
    .pipe(
      gulpIf(
        isDevelopment,
        pug({ pretty: true }),
      ),
    )
    .pipe(
      gulpIf(
        isProduction,
        pug(),
      ),
    )
    .pipe(gulp.dest(path.dist.base))
    .pipe(browsersync.reload({ stream: true }));
}

// Pug lint task
function pugLinterTask() {
  return gulp
    .src(path.src.pug)
    .pipe(plumber())
    .pipe(
      gulpIf(
        isDevelopment,
        pugLinter({
          reporter(errors) {
            fs.writeFileSync('reports/pug-lint.txt', errors);
          },
          failAfterError: false,
        }),
      ),
    )
    .pipe(
      gulpIf(
        isProduction,
        pugLinter({
          reporter: 'default',
          failAfterError: true,
        }),
      ),
    );
}

// Sass task
function scssTask() {
  const tasks = entry.scss.map(stylesheet => gulp
    .src(stylesheet)
    .pipe(plumber())
    .pipe(
      gulpIf(
        isDevelopment,
        sourcemaps.init(),
      ),
    )
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }),
    )
    .pipe(
      gulpIf(
        isProduction,
        postcss([
          autoprefixer(),
          cssnano(),
        ]),
      ),
    )
    .pipe(
      gulpIf(
        isDevelopment,
        sourcemaps.write('.'),
      ),
    )
    .pipe(gulp.dest(path.dist.css))
    .pipe(browsersync.reload({ stream: true })));

  return merge(tasks);
}

// Stylelint task
function stylelintTask() {
  return gulp
    .src(path.src.scss)
    .pipe(plumber())
    .pipe(
      gulpIf(
        isDevelopment,
        stylelint({
          reportOutputDir: config.reports.path,
          failAfterError: false,
          reporters: [
            { formatter: 'string', console: true },
            { formatter: 'json', save: config.reports.output.stylelint },
          ],
          debug: true,
        }),
      ),
    )
    .pipe(
      gulpIf(
        isProduction,
        stylelint({
          failAfterError: true,
          reporters: [
            { formatter: 'string', console: true },
          ],
        }),
      ),
    );
}

// JS task
function jsTask() {
  return gulp
    .src(path.src.js)
    .pipe(plumber())
    .pipe(webpack(webpackConfig))
    .pipe(rename(output.js))
    .pipe(gulp.dest(path.dist.js))
    .pipe(browsersync.reload({ stream: true }));
}

// Images task
function imgTask() {
  return gulp
    .src(path.src.img)
    .pipe(newer(path.dist.img))
    .pipe(plumber())
    .pipe(
      gulpIf(
        isProduction,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
        ]),
      ),
    )
    .pipe(gulp.dest(path.dist.img))
    .pipe(browsersync.reload({ stream: true }));
}

// Icons task
function iconsTask() {
  return gulp
    .src(path.src.icons)
    .pipe(newer(path.dist.icons))
    .pipe(plumber())
    .pipe(
      gulpIf(
        isProduction,
        imagemin([
          imagemin([
            imagemin.svgo({
              plugins: [
                {
                  removeViewBox: false,
                  collapseGroups: true,
                },
              ],
            }),
          ]),
        ]),
      ),
    )
    .pipe(gulp.dest(path.dist.icons))
    .pipe(browsersync.reload({ stream: true }));
}

// Empty dist folder
function emptyDist() {
  return del([
    `${path.dist.base}**/*`,
  ]);
}

// Watch task
function watchTask() {
  gulp.watch(path.src.pug, viewsTask);
  gulp.watch(path.src.scss, gulp.series(stylelintTask, scssTask));
  gulp.watch(path.src.js, gulp.series(jsTask));
  gulp.watch(path.src.img, imgTask);
  gulp.watch(path.src.icons, iconsTask);
}

// Build
const build = gulp.series(
  gulp.parallel(emptyDist, stylelintTask),
  gulp.parallel(viewsTask),
  gulp.parallel(scssTask, jsTask),
  gulp.parallel(scssTask, jsTask, imgTask, iconsTask),
  gulp.parallel(pugLinterTask),
);

const buildStyles = gulp.series(
  scssTask,
);

const buildScripts = gulp.series(
  jsTask,
);

const buildViews = gulp.series(
  viewsTask,
);

const buildImages = gulp.series(
  imgTask,
);

const buildIcons = gulp.series(
  iconsTask,
);

// Lint
const lint = gulp.series(
  gulp.parallel(stylelintTask, pugLinterTask),
);

const lintStyles = gulp.series(
  gulp.parallel(stylelintTask),
);

const lintViews = gulp.series(
  gulp.parallel(pugLinterTask),
);

// Watch
const watch = gulp.series(
  build,
  browserSync,
  watchTask,
);

// Export tasks
exports.build = build;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.buildViews = buildViews;
exports.buildImages = buildImages;
exports.buildIcons = buildIcons;
exports.lint = lint;
exports.lintStyles = lintStyles;
exports.lintViews = lintViews;
exports.watch = watch;
exports.default = build;
