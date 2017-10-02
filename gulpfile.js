var gulp         = require('gulp'), // подключаем gulp в gulpfile
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq         = require('gulp-group-css-media-queries'),
    notify       = require('gulp-notify'),
    svgSprite    = require('gulp-svg-sprite');



//    (/*.sass) - берем все файлы с разрешение sass;
//    (/**/*.sass) - берем все файлы в папке, то есть даже во всех подпапках;
//    (['!app/sass/main.sass' , 'app/sass/**/*.sass']) можно выбирать масивом, и делать исключения через '!'
//    ('app/sass/**/*.+(scss│sass)') выбираем все файлы расзрешений scss и sass


 gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
  .pipe(deploy())
});

gulp.task('sass', function() { // Создаем таск Sass
  return gulp.src('app/sass/**/*.sass') // Берем источник
    .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError())) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(gcmq())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true }))
    .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
    .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});


gulp.task('svg', function() {
  var svgConfig = {
    svg: {
      namespaceClassnames: false
    },
    mode: {
      symbol: {
        dest: '.',
        sprite: 'sprite.svg'
      }
    }
  };

  return gulp.src('app/img/svg-source-gulp/*.svg')
  .pipe(svgSprite(svgConfig))
  .pipe(gulp.dest('app/img/svg-ready'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/owl.carousel/dist/owl.carousel.min.js',
    ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browserSync
    server: { // Определяем параметры сервера
      baseDir: 'app' // Директория для сервера - app
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() { // в квадратных скобках, то что делаем до watch
  gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass(если есть изменение выполняем sass)
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.min.css',
    ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});