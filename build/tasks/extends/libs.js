/**
 * 前端插件库生成
 */

const config = require('../../config/index')
const gulp = require('gulp')

// 管合并，可以合并同一目录下的所有文件，好处是可以减少网络请求
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const uglify = require('gulp-uglify')


gulp.task('libsGenerate', function () {

    const src = [
        `${config.dev.libsDevDir}/**/${config.dev.libsDevMods}.js`,
        // ,'!./src/**/mobile/*.js'
    ]

    console.log('=================================')
    console.log('插件库: ' + config.dev.libsName + '.js')
    console.log('包含模块 (。>︿<)_θ')
    console.log(src)
    console.log('=================================')

    return gulp.src(src)
        .pipe(uglify())
        .pipe(concat(`${config.dev.libsName}.min.js`, {newLine: ''}))
        .pipe(gulp.dest(`${config.dev.libsOutputDir}`));
});