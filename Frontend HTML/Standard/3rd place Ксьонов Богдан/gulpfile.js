var gulp            = require('gulp');

var dirSep          = require('path').sep; //Hack for Windows & Linux

var runSequence     = require('run-sequence');
var rename          = require("gulp-rename");
var watch           = require('gulp-watch');
var clean           = require('gulp-clean');
var zip             = require('gulp-zip');

var include         = require("gulp-include");
var pug             = require('gulp-pug');
var sourcemaps      = require('gulp-sourcemaps');
var plumber         = require('gulp-plumber');

//MINIFY

var cleanCSS        = require('gulp-clean-css');
var uglify          = require('gulp-uglify');
var imagemin        = require('gulp-imagemin');
var pngquant        = require('imagemin-pngquant');

//PostCSS

var postcss         = require('gulp-postcss');
var autoprefixer    = require('autoprefixer');
var hexrgba         = require('postcss-hexrgba');
var precss          = require('precss');
var focus           = require('postcss-focus');

//BrowserSync

var browserSync     = require("browser-sync");
var reload          = browserSync.reload;

//paths

var paths = {
    build: {
        html: './build',
        styles: './build/css',
        js: './build/js',
        img: './build/img',
        fonts: './build/fonts'
    },
    dist: {
        html: './dist',
        styles: './dist/css',
        js: './dist/js',
        img: 'dist/img',
        fonts: './dist/fonts'
    },
    src: {
        html: 'src/pages/*/*.pug',
        styles: ['src/main.css', 'src/pages/*/*.css'],
        js: 'src/main.js',
        img: ['src/components/*/img/*.*', 'src/modules/*/img/*.*'], 
        fonts: ['src/fonts/**/*.*', '!src/fonts/**/*.css']
    },
    watch: {
        html: 'src/**/*.pug',
        styles: 'src/**/*.css',
        js: 'src/**/*.js',
        img: 'src/**/img/*.*',
        fonts: ['src/fonts/**/*.*', '!src/fonts/**/*.css']
    }
}

//browserSync config

var config = {
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    logPrefix: "UnnaturalBuilder"
};

gulp.task('server', function () {
    browserSync(config);
});

gulp.task('clean:build', function() {
    return gulp.src('./build')
        .pipe(clean({ force: true }));
});

gulp.task('clean:dist', function() {
    return gulp.src('./dist')
        .pipe(clean({ force: true }));
});

gulp.task('html:build', function buildHTML() {
    return gulp.src(paths.src.html)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(rename(function(path) {
            var dirs = path.dirname.split(dirSep);

            dirs.splice(0, 2);
            path.dirname = dirs.join(dirSep)
        }))
        .pipe(gulp.dest(paths.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function() {
    var processors = [autoprefixer(),
                      precss(),
                      focus(),
                      hexrgba()];
    return gulp.src(paths.src.styles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./'))
        .pipe(rename({suffix: '.min'}))
        .pipe(rename(function(path) {
            var dirs = path.dirname.split(dirSep);

            dirs.splice(0, 2);
            path.dirname = dirs.join(dirSep)
        }))
        .pipe(gulp.dest(paths.build.styles))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
    return gulp.src(paths.src.js)
        .pipe(include({
            extensions: "js"
            }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('img:build', function() {
    return gulp.src(paths.src.img)
        .pipe(rename(function(path) {
            var dirs = path.dirname.split(dirSep);

            dirs.splice(0, 2);
            path.dirname = dirs.join(dirSep)
        }))
        .pipe(gulp.dest(paths.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts))
        .pipe(reload({stream: true}));
});

gulp.task('build', function() {
    runSequence('clean:build',
                ['html:build',
                'css:build',
                'js:build',
                'img:build',
                'fonts:build']);
});

gulp.task('html:dist', function buildHTML() {
    return gulp.src(paths.src.html)
        .pipe(plumber())
        .pipe(pug())
        .pipe(rename(function(path) {
            var dirs = path.dirname.split(dirSep);

            dirs.splice(0, 2);
            path.dirname = dirs.join(dirSep)
        }))
        .pipe(gulp.dest(paths.dist.html))
});

gulp.task('css:dist', function() {
    var processors = [autoprefixer(),
                      precss(),
                      focus(),
                      hexrgba()];
    return gulp.src(paths.src.styles)
        .pipe(plumber())
        .pipe(postcss(processors))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(rename(function(path) {
            var dirs = path.dirname.split(dirSep);

            dirs.splice(0, 2);
            path.dirname = dirs.join(dirSep)
        }))
        .pipe(gulp.dest(paths.dist.styles))
});

gulp.task('js:dist', function() {
    return gulp.src(paths.src.js)
        .pipe(include({
            extensions: "js"
            }))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.js))
});

gulp.task('img:dist', function() {
    return gulp.src(paths.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(rename(function(path) {
            var dirs = path.dirname.split(dirSep);

            dirs.splice(0, 2);
            path.dirname = dirs.join(dirSep)
        }))
        .pipe(gulp.dest(paths.dist.img))
});

gulp.task('fonts:dist', function() {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dist.fonts))
});

gulp.task('dist', function () {
    runSequence('clean:dist',
                ['html:dist',
                'css:dist',
                'js:dist',
                'img:dist',
                'fonts:dist']);
});

gulp.task('watch', function() {
    watch(paths.watch.html, function() {
        gulp.start('html:build');
    });
    watch(paths.watch.styles, function() {
        gulp.start('css:build');
    });
    watch(paths.watch.js, function() {
        gulp.start('js:build');
    });
    watch(paths.watch.img, function() {
        gulp.start('img:build');
    });
    watch(paths.watch.fonts, function() {
        gulp.start('fonts:build');
    });
});

gulp.task('dev', ['server', 'watch']);

gulp.task('default', ['build', 'server', 'watch']);

gulp.task('zip', function() {
    gulp.src('./dist/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
});