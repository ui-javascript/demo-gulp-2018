const config = require('../config/index')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const fileInclude = require('gulp-file-include')
// const minifyHtml = require('gulp-minify-html')
const htmlmin = require('gulp-htmlmin')
const md5 = require('gulp-md5-assets')

// const basepath = '@file'
const _basePath = `./_${config.common.sysName}`

// 编译compileHTML
gulp.task('compileHTML', function () {
    return gulp.src(`${config.dev.pagesDir}/**/*.html`)
        .pipe(plumber())
        .pipe(fileInclude({
            prefix: '@@',
            basepath: _basePath,
        }))
        // .pipe(gulp.dest(PATHS.htmlDevFolder))
        .pipe(gulp.dest(`${config.common.templatesDir}`))
})

// 缩编HTML
gulp.task('distHTML', function () {
    const options = {
        //清除HTML注释
        removeComments: true,
        //压缩HTML
        collapseWhitespace: true,
        //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        collapseBooleanAttributes: true,
        //删除所有空格作属性值 <input id="" /> ==> <input />
        removeEmptyAttributes: true,
        //删除<script>的type="text/javascript"
        removeScriptTypeAttributes: true,
        //删除<style>和<link>的type="text/css"
        removeStyleLinkTypeAttributes: true,
        //压缩页面JS
        minifyJS: true,
        //压缩页面CSS
        minifyCSS: true
    };

    return gulp.src(`${config.dev.pagesDir}/**/*.html`)
        .pipe(plumber())
        .pipe(fileInclude({
            prefix: '@@',
            basepath: _basePath,
        }))
        // 压缩一波
        .pipe(htmlmin(options))
        .pipe(gulp.dest(`${config.common.templatesDir}`))
        .pipe(md5(10))
});