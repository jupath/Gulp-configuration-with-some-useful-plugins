const gulp = require('gulp');
const uglify = require('gulp-uglify'); // Minify JavaScript
const sass = require('gulp-ruby-sass'); // Sass → CSS
const prefix = require('gulp-autoprefixer'); // Parse CSS and add vendor prefixes to rules
const uncss = require('gulp-uncss'); // Remove unused CSS selectors
const babel = require('gulp-babel'); // ES6 → ES5 with babel
const concat = require('gulp-concat'); // Concatenate files
const htmlmin = require('gulp-htmlmin'); // Minify HTML
const pug = require('gulp-pug'); // PUG → HTML
const imagemin = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images
const sourcemaps = require('gulp-sourcemaps'); // Sourcemaps
const browserSync = require('browser-sync').create(); // Keep browsers in sync

// Directories and paths
const dirs = {
    src: 'src',
    dest: 'build',
};

const paths = {
    scssSrc: `${dirs.src}/scss/**/*.scss`,
    cssDest: `${dirs.dest}/css/`,

    jsSrc: `${dirs.src}/js/*.js`,
    jsDest: `${dirs.dest}/js/`,

    htmlSrc: `${dirs.src}/**/*.html`,
    htmlDest: `${dirs.dest}/`,

    pugSrc: `${dirs.src}/**/*.pug`,
    htmlDest: `${dirs.dest}/`,

    imgSrc: `${dirs.src}/images/*`,
    imgDest: `${dirs.dest}/images/`
}

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', () => {
    return sass(paths.scssSrc, {
            style: 'compressed'
        }).on('error', sass.logError) // Sass → CSS
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(prefix('last 2 versions')) // Add vendor prefixes
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.cssDest)) // Destination
        .pipe(browserSync.stream()); // Sync browser
});

// Scripts
gulp.task('scripts', () => {
    return gulp.src(paths.jsSrc) // Add source
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({
            presets: ['env'] // ES6 → ES5
        }))
        .pipe(concat('app.js')) // Concatenate files
        .pipe(uglify()) // Uglify JS
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.jsDest)) // Destination
        .pipe(browserSync.stream()); // Sync browser
});

// Compress images
gulp.task('images', () => {
    return gulp.src(paths.imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.imgDest))
        .pipe(browserSync.stream());;
});

// Minify HTML
gulp.task('html', () => {
    return gulp.src(paths.htmlSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.htmlDest))
        .pipe(browserSync.stream());
});

// PUG → HTML
gulp.task('pug', () => {
    return gulp.src(paths.pugSrc)
        .pipe(pug())
        .pipe(gulp.dest(paths.htmlDest))
        .pipe(browserSync.stream());
});

// Watch
gulp.task('watch', () => {
    browserSync.init({
        server: "./build/"
    });
    gulp.watch(paths.jsSrc, ['scripts']);
    gulp.watch(paths.scssSrc, ['styles']);
    gulp.watch(paths.htmlSrc, ['html']);
    gulp.watch(paths.imgSrc, ['images']);
});

// Default
gulp.task('default', ['scripts', 'styles', 'html', 'images', 'watch']);
