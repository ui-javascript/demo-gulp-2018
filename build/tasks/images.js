/*
 * 图片优化
 */
const config = require('../config/index')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const cache = require('gulp-cache')

// 压缩图片
const imagemin = require('gulp-imagemin')
const imageminJpegRecompress = require('imagemin-jpeg-recompress')
const imageminOptipng = require('imagemin-optipng')
const pngquant = require('imagemin-pngquant')


// 图片压缩
gulp.task('optimizeImages', function () {
    const jpgmin = imageminJpegRecompress({
            accurate: true,//高精度模式
            quality: "low",//图像质量:low, medium, high and veryhigh;
            method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 70,//最低质量
            loops: 0,//循环尝试次数, 默认为6;
            progressive: false,//基线优化
            subsample: "default"//子采样:default, disable;
        })

    const pngmin = imageminOptipng({
            optimizationLevel: 3
        });

    return gulp.src([
        `${config.dev.imagesDir}/**/*.{png,jpg,jpeg,ico,gif,svg}`,
        // 雪碧图下面的图片忽略
        `!${config.dev.spriteDevDir}/*`
        ])
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 7, //默认：3  取值范围：0-7（优化等级）
            progressive: true, // 无损压缩jpg图片
            interlaced: true, // 隔行扫描gif进行渲染
            multipass: true, //多次优化svg直到完全优化
            use: [pngquant()] // 使用 pngquant 深度压缩 png 图片
        }))
        // .pipe(cache(imagemin({
        //     // progressive: true, // 无损压缩JPG图片
        //     svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
        //     use: [pngquant()] // 使用pngquant插件进行深度压缩
        // })))

        // .pipe(imagemin({
        //     use: [jpgmin, pngmin]
        // }))
        .pipe(gulp.dest(`${config.common.staticDir}/images`))
    // .pipe(md5(10, './**/*.{css,js,html,json}'))
    // .pipe(browserSync.reload({stream:true}))

    console.log('图片压缩完毕========')
});