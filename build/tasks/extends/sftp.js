const config = require('../../config/index')
const gulp = require('gulp')
const sftp = require('gulp-sftp')
// const flatten = require('gulp-flatten')

gulp.task('sftp:static', function () {
    return gulp.src(['./static/**', './public/**'])
        .pipe(sftp({
            host: config.prod.host,
            user: config.prod.username,
            pass: config.prod.password,
            remotePath: config.prod.remotePath + '/static'
        }));
})

gulp.task('sftp:templates', function () {
    return gulp.src(['./templates/**'])
        .pipe(sftp({
            host: config.prod.host,
            user: config.prod.username,
            pass: config.prod.password,
            remotePath: config.prod.remotePath
        }));
})
