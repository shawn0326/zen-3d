var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
// var jsdoc = require('gulp-jsdoc');

// name of all in one file
var outputName = "zen3d";

var canvas2DSrc = [
    // canvas2d
    "src/extension/canvas2D/Canvas2D.js",
    "src/extension/canvas2D/Canvas2DMaterial.js",
    "src/extension/canvas2D/Object2D.js",
    "src/extension/canvas2D/Sprite2D.js"
];

var inputSrc = [
    // input
    "src/extension/input/Keyboard.js",
    "src/extension/input/Mouse.js",
    "src/extension/input/Touch.js",
    "src/extension/input/HoverController.js",
    "src/extension/input/FreeController.js"
];

var voxSrc = [
    // vox
    "src/extension/vox/md5.js",
    "src/extension/vox/VOXData.js",
    "src/extension/vox/VOXDefaultPalette.js",
    "src/extension/vox/VOXFace3.js",
    "src/extension/vox/VOXGeometry.js",
    "src/extension/vox/VOXLoader.js",
    "src/extension/vox/VOXMeshBuilder.js",
    "src/extension/vox/VOXTextureFactory.js"
];

gulp.task('default', ['extension'], function() {
    // do nothing
});

gulp.task("extension", function() {
    gulp.src(canvas2DSrc)
    .pipe(concat(outputName + '.canvas2d.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension canvas2d build success' }));

    gulp.src(inputSrc)
    .pipe(concat(outputName + '.input.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension input build success' }));

    gulp.src(voxSrc)
    .pipe(concat(outputName + '.vox.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension vox build success' }));
});
