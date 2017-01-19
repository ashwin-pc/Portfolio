var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles'));
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./scripts/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('js:watch', function () {
  gulp.watch('./src/js/**/*.js', ['scripts']);
});

gulp.task('default', [ 'sass', 'scripts' ]);
gulp.task('watch', [ 'sass:watch', 'js:watch' ]);

gulp.task('dist', ['sass', 'scripts'], function() {
  gulp.src('./scripts/**/*')
    .pipe(gulp.dest('./dist/scripts/'));
  gulp.src('./styles/**/*')
    .pipe(gulp.dest('./dist/styles/'));
  gulp.src('./assets/**/*')
    .pipe(gulp.dest('./dist/assets/'));
  gulp.src('./index.html')
    .pipe(gulp.dest('./dist/'));
  return;
});