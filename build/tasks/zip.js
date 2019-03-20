const config = require('../config/index')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const zip = require('gulp-zip')

// 压缩
gulp.task('zip', function () {

    return gulp.src(config.prod.zipFiles)
        .pipe(plumber())
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'))
});
