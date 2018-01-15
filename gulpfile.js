const gulp = require('gulp');
const uglify = require('gulp-uglify'); // Minify JavaScript
const sass = require('gulp-ruby-sass'); // Sass → CSS
const prefix = require('gulp-autoprefixer'); // Parse CSS and add vendor prefixes to rules
const uncss = require('gulp-uncss'); // Remove unused CSS selectors
const babel = require('gulp-babel'); // ES6 → ES5 with babel
const concat = require('gulp-concat'); // Concatenate files
const htmlmin = require('gulp-htmlmin'); // Minify HTML
const imagemin = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images
const sourcemaps = require('gulp-sourcemaps'); // Sourcemaps
const browserSync = require('browser-sync').create(); // Keep browsers in sync

// Directories and paths
const dirs = {
    src: 'src',
    dest: 'build',
    img: 'assets'
};

const paths = {
    scssSrc: `${dirs.src}/scss/**/*.scss`,
    cssDest: `${dirs.dest}/css/`,
    jsSrc: `${dirs.src}/js/*.js`,
    jsDest: `${dirs.dest}/js/`,
    imgSrc: `${dirs.img}/images/*`,
    imgDesc: `${dirs.img}/images/`
}

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', () => {
    return sass(paths.scssSrc, {
            style: 'compressed'
        }).on('error', sass.logError) // Sass → CSS
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uncss({
            html: ['index.html'] // Remove unused CSS selectors ['./posts/**/*.html', 'http://example.com']]
        }))
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
        .pipe(imagemin([
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(paths.imgDesc));
});

// Minify HTML
gulp.task('html', () => {
    return gulp.src('*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(dirs.dest));
  });

// Watch
gulp.task('watch', () => {
    browserSync.init({
        server: "./"
    });
    gulp.watch(paths.jsSrc, ['scripts']);
    gulp.watch(paths.scssSrc, ['styles']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Default
gulp.task('default', ['scripts', 'styles', 'watch']);
