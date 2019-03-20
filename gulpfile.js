// 严格模式
/**
 * 主要内容参考 (NICE)https://www.cnblogs.com/zhangyuezhen/p/7896047.html
 *
 * 务必参考一下及作者其他repo
 * https://github.com/minguman/browsersync-gulp-demo
 *
 * eslint不做
 *
 * https://github.com/271626514/gulp-demo
 * https://segmentfault.com/a/1190000010138466
 *
 * 生产与开发环境的配置
 * https://github.com/vincentSea/gulp-cli
 *
 * 辅助功能参考 (NICE)https://github.com/mjzhang1993/gulp-template
 * @TODO PWA支持
 *
 * 2015年结合了webpack的，有一些可以参考一下
 * (@deprecated)https://github.com/fwon/gulp-webpack-demo
 *
 * @FIXME browserSync刷新不及时
 *
 * 前端基于gulp后端基于freemarker的工作流程总结
 * https://juejin.im/post/5ad3222d6fb9a028cd458a7e
 *
 * Gulp&Webpack搭建属于自己的特性化前端脚手架 (仅了解下实现细节)
 * https://juejin.im/post/5a77bfa96fb9a06351724e90
 */

'use strict';

const config = require('./build/config')

// 导入模块
const gulp = require('gulp')

// gulp-run-sequence -> run-sequence
// 控制task中的串行和并行
const runSequence = require('run-sequence')

// 引入所有任务
// https://www.gulpjs.com.cn/docs/recipes/split-tasks-across-multiple-files/
const requireDir = require('require-dir')

// 引入任务
requireDir('./build/tasks/')
requireDir('./build/tasks/extends/')

// 输出提示信息
console.log('=================================')
console.log(' (｡･∀･)ﾉﾞ嗨，帅哥')
console.log('当前系统: ' + config.common.sysName)
console.log('=================================')


// 清理生成文件
gulp.task('00-clean-dist', function () {
    runSequence(
        ['cleanDev', 'cleanDist']
    );
});

// 默认任务
gulp.task('default', function () {
    runSequence('01-build-dev');
});
gulp.task('01-build-dev', function () {

    runSequence(
        // 1.清理旧文件
        ['cleanDev', 'cleanDist'],

        // (如果后台配置了开发的资源路径，就不需要)
        // 2.拷贝资源
        ['copyHTMLLeft', 'copyCssLeft', 'copyGlobalImages'],

        // 是否需要生成常用工具
        'libsGenerate',

        // 'optimizeImages',
        'copyImages',

        // 3.文件编译
        ['compileHTML', 'compileLess', 'compileJS'],

        // 4.开启浏览器同步
        'devSync'
    );
});

gulp.task('02-css-job', function () {
    runSequence(
        // 清理旧CSS
        'cleanCSS',
        // 编译less
        'compileLess',
        // 监听
        'watchCSS'
    )
});

// 发布
gulp.task('03-build-dist', function () {
    runSequence(
        // 1.清理旧文件
        ['cleanDev', 'cleanDist'],
        // 2. 拷贝资源
        // 静态资源一般配成CDN，不搬运
        // 'copyCDN',
        ['copyHTMLLeft', 'copyCssLeft', 'copyGlobalImages'],

        // 'libsGenerate',
        'optimizeImages',
        // 'copyImages',

        // 3.文件编译
        ['distHTML', 'distLess'],
        // @fix 和distHTML任务不能并行 否则会MD5时间戳生成失败
        ['distJS'],

        // 不要忘记搬运cdn/静态资源部分 @todo

        // 'zip',
        // 'distSync',
        // ['sftp:static', 'sftp:templates']
    );
});

// 离线方案
// 暂时只考虑用在博客文章上
gulp.task('04-build-pwa', function () {
    runSequence(
        // 1.清理旧文件
        ['cleanDev', 'cleanDist'],
        // 2. 拷贝资源
        ['copyHTMLLeft', 'copyCssLeft', 'copyGlobalImages'],
        'libsGenerate',
        // 'optimizeImages',
        'copyImages',
        // 3.文件编译
        ['distHTML', 'distLess', 'distJS'],
        // 4.PWA workbox注册
        'generateServiceWorker',
        // 'zip',
        'PWASync'
    )
});


// 雪碧图
gulp.task('05-make-sprite', function () {
    runSequence('makeSprite');
});

// 图片优化
gulp.task('06-images-optimize', function () {
    runSequence('optimizeImages');
});

// 字体子集化
gulp.task('07-font-spider', function () {
    runSequence('fontSpider');
});

// 生成前端插件库
gulp.task('08-libs-generate', function () {
    runSequence('libsGenerate');
});
