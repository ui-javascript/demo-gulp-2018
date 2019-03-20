// 开发环境
const libsName = 'mumuy'

exports.dev = {

    // 设置监听
    stylesWatchFiles: [
        `./src/assets/css/components/**/*.less`,
    ],

    // 脚本库
    libsName: libsName,
    libsDevDir: `./src/assets/libs/${libsName}`,
    libsDevMods: '*',  // '{ajax,scroll}' 没空格
    libsOutputDir: './static/vendor/libs',

    copyHTMLExclude: [
        `!./_demo/**/*.{html,md,inc}`,
        `!./_demo/static/**`
    ],
}