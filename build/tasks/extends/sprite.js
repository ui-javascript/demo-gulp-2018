// 雪碧图
const config = require('../../config/index')
const gulp = require('gulp')
const spritesmith = require('gulp.spritesmith')

gulp.task('makeSprite', function () {

    return gulp.src(`${config.dev.spriteDevDir}/!(_sprite.png|*.css|*.less)`)
        .pipe(spritesmith({
            imgName: `_sprite.png`,
            cssName: `sprite.less`
        }))
        .pipe(gulp.dest(`${config.dev.spriteOutputDir}`));
});