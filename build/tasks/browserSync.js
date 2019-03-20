const config = require('../config/index')
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload


let _routes = {
    '/static/plugins': `${config.common.cdnDir}/plugins`,
    '/static/vendor': `${config.common.cdnDir}/vendor`,
    '/static/fonts': `${config.common.cdnDir}/fonts`,
    // '/static/tpl': `${config.common.cdnDir}/assets/tpl`,
    '/static': `${config.common.staticDir}`,
}


// 浏览器同步刷新
// http://www.browsersync.cn/docs/gulp/
gulp.task('devSync', function () {
    browserSync.init({
        port: config.dev.port,
        ui: {
            port: 3005
        },
        directory: true,
        browser: "chrome",
        server: {
            baseDir: `${config.common.templatesDir}`,
            routes: _routes
        },
        // startPath: "index.html"
    });

    // 注册监听时间 =========
    // fileInclude + browserSync https://www.cnblogs.com/yjzhu/archive/2017/02/27/6474854.html

    // 公共开发环境资源变动(不一定变动,需要优化 @todo)
    gulp.watch(`${config.dev.devDir}/**/*.{css,less,inc,js,json}`, ['compileHTML']).on('change', reload);

    // 相对路径资源变动
    gulp.watch(`${config.dev.pagesDir}/**/*.{html,inc}`,['compileHTML']).on('change', reload);
    gulp.watch(`${config.dev.pagesDir}/**/*.{css,js,json}`, ['copyHTMLLeftChanged']).on('change', reload);

    // js, less变动
    gulp.watch(`${config.dev.scriptsDir}/**/*.js`, ['compileJS']).on('change', reload);
    gulp.watch(config.dev.stylesWatchFiles, ['compileLess']).on('change', reload);
});

gulp.task('distSync', function () {
    browserSync.init({
        // proxy: "deva.dev",
        port: 80, //
        ui: false,
        directory: true,
        notify: false,
        codeSync: false, // 不要发送任何文件改变事件给浏览器
        logSnippet: false,
        logFileChanges: false,
        logConnections: false,
        ghostMode: false,
        server: {
            baseDir: `${config.common.templatesDir}`,
            // index: "index.html",
            routes: _routes
        },
        // startPath: "index.html"
    });
});


gulp.task('PWASync', function () {

    browserSync.init({
        // @FIXME 代理不知道怎么配置
        // proxy: "http://192.168.1.250",
        // serveStatic: [`${config.common.templatesDir}`],

        server: {
            baseDir: `${config.common.templatesDir}`,
            index: "index.html",
            routes: _routes
        },
        port: 8777, // 端口注意
        ui: false,
        directory: true,
        notify: false,
        codeSync: false, // 不要发送任何文件改变事件给浏览器
        logSnippet: false,
        logFileChanges: false,
        logConnections: false,
        ghostMode: false
    });
});
