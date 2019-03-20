const config = require('../config/index')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const babel = require('gulp-babel')
const md5 = require('gulp-md5-assets')
const stripDebug = require('gulp-strip-debug')
const uglify = require('gulp-uglify')

// 缩编JS
gulp.task('compileJS', function () {
    return gulp.src(`${config.dev.scriptsDir}/**/*.js`)
        // 错误提示
        .pipe(plumber())
        // 合并同一目录下的所有文件
        // .pipe(concat({ext: '.js'}))
        // .pipe(babel())
        .pipe(gulp.dest(`${config.common.staticDir}/js`))
});

// 缩编JS
gulp.task('distJS', function () {
    return gulp.src(`${config.dev.scriptsDir}/**/*.js`)
        // 错误提示
        .pipe(plumber())
        // 合并同一目录下的所有文件
        // .pipe(concat({ext: '.js'}))
        .pipe(stripDebug())
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(`${config.common.staticDir}/js`))
        .pipe(md5(10, `${config.common.templatesDir}/*.html`))
});
