const config = require('../../config/index')
const gulp = require('gulp')
const fontSpider = require('gulp-font-spider')
const notify = require('gulp-notify')

gulp.task('fontSpider', function() {
    //只要告诉它html文件所在的文件夹就可以了，超方便
    return gulp.src(`${config.dev.fontSpiderDir}/fontSpider.html`)
        .pipe(fontSpider())
        .pipe(notify({
            message: '字体子集化完毕'
        }));
});