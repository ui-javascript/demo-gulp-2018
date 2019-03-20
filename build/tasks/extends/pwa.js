const config = require('../../config/index')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const workbox = require('workbox-build')

// 配置 service worker
gulp.task('generateServiceWorker', () => {
    return workbox
        .generateSW({
            cacheId: 'gulp-pwa-mpa', // 设置前缀
            globDirectory: `${config.dev.pwaDir}`,
            globPatterns: ['**/*.{html,js,css,png.jpg}'],
            globIgnores: ['sw.js'],

            // 输出到根目录
            swDest: `${config.dev.pwaDir}/sw.js`,
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: /.*\.js/,
                    handler: 'networkFirst', // 网络优先
                },
                {
                    urlPattern: /.*\.css/,
                    handler: 'staleWhileRevalidate', // 缓存优先同时后台更新
                    options: {
                        plugins: [
                            {
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        ]
                    }
                },
                {
                    urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
                    handler: 'cacheFirst', // 缓存优先
                    options: {
                        plugins: [
                            {
                                expiration: {
                                    maxAgeSeconds: 24 * 60 * 60, // 最长缓存时间,
                                    maxEntries: 50, // 最大缓存图片数量
                                }
                            }
                        ]
                    },

                },
                {
                    urlPattern: /.*\.html/,
                    handler: 'networkFirst',
                }
            ]
        })
        .then(() => {
            console.info('Service worker generation completed.');
        })
        .catch(error => {
            console.warn('Service worker generation failed: ' + error);
        });
});