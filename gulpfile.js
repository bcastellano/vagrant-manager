const gulp  = require('gulp');
const babel = require('gulp-babel');

/**
 * General compile task
 */
gulp.task(
  'compile',
  [
    'compile-es6',
    'compile-html',
    'compile-css',
    'compile-fonts',
  ]
);

// compile es6 syntax
gulp.task('compile-es6', () => {
  return gulp.
  src('src/**/*.js').
  pipe(
    babel({
      presets: ['es2015', 'react'],
    })
  ).
  pipe(gulp.dest('app'));
});

// compile html files (only move)
gulp.task('compile-html', () => {
  return gulp.
  src('src/**/*.html').
  pipe(gulp.dest('app'));
});

// compile css files (only move)
gulp.task('compile-css', () => {
  return gulp.
  src('src/**/*.css').
  pipe(gulp.dest('app'));
});

// compile fonts files (only move)
gulp.task('compile-fonts', () => {
  return gulp.
  src('src/fonts/*').
  pipe(gulp.dest('app/fonts'));
});
