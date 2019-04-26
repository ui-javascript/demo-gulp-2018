const config = require('../config/index')
const gulp = require('gulp')
const changed = require('gulp-changed')

// 搬运图片
gulp.task('copyCDN', function () {
    // 搬运图片
    return gulp.src([
        `${config.common.cdnDir}/**/*.*`
    ])
        .pipe(gulp.dest(`${config.common.staticDir}`))
})

gulp.task('copyHTMLLeft', function () {

    console.log('=================================')
    console.log('以下范围的文件不搬运哦 \(￣︶￣*\))')
    console.log(...config.dev.copyHTMLExclude)
    console.log('=================================')

    return gulp.src([
        `${config.dev.pagesDir}/**/*.*`,
        // 排除
        ...config.dev.copyHTMLExclude
        ])
        .pipe(gulp.dest(`${config.common.templatesDir}`))
})

gulp.task('copyHTMLLeftChanged', function () {
    return gulp.src([
        `${config.dev.pagesDir}/**/*.*`,
        // 排除
        ...config.dev.copyHTMLExclude
    ])
    .pipe(changed(`${config.common.templatesDir}`))
    .pipe(gulp.dest(`${config.common.templatesDir}`))
})

// 搬运图片
gulp.task('copyGlobalImages', function () {
    // 搬运图片
    return gulp.src([
        // 全部照搬不误 文件夹最好下划线开头
        `${config.dev.devDir}/assets/**/*.*`
        ])
        .pipe(gulp.dest(`${config.common.staticDir}/images`))
})
gulp.task('copyImages', function () {
    // 搬运图片
    return gulp.src([
        `${config.dev.imagesDir}/**/*.*`
        ])
        .pipe(gulp.dest(`${config.common.staticDir}/images`))
})

// @deprecated
// 搬运 静态样式(css)和雪碧图
gulp.task('copyCssLeft', function () {
    return gulp.src([
        `${config.dev.spriteOutputDir}/**/*.{css,png}`
        ])
        .pipe(gulp.dest(`${config.common.staticDir}/css`))
})
