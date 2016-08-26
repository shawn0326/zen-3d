var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var watch = require('gulp-watch');
// var jsdoc = require('gulp-jsdoc');

// base dir of src
var baseDir = "src/";

// name of all in one file
var outputName = "zen3d";

// src of files
var filesSrc = [

    "base.js",
    "const.js",

    // math
    "core/math/Euler.js",
    "core/math/Matrix4.js",
    "core/math/Quaternion.js",
    "core/math/Vector3.js",

    // render
    "core/render/shader/ShaderLib.js",
    "core/render/shader/Program.js",
    "core/render/Renderer.js",

    // objects
    "core/objects/Object3D.js",
    // scene
    "core/objects/Scene.js",
    // group
    "core/objects/Group.js",

    // light
    "core/objects/lights/Light.js",
    "core/objects/lights/AmbientLight.js",
    "core/objects/lights/DirectionalLight.js",
    "core/objects/lights/PointLight.js",

    // camera
    "core/objects/camera/Camera.js",

    // mesh
    "core/objects/mesh/geometry/Geometry.js",
    "core/objects/mesh/geometry/CubeGeometry.js",
    "core/objects/mesh/geometry/PlaneGeometry.js",
    "core/objects/mesh/geometry/SphereGeometry.js",

    "core/objects/mesh/material/texture/Texture.js",

    "core/objects/mesh/material/Material.js",
    "core/objects/mesh/material/BasicMaterial.js",
    "core/objects/mesh/material/LambertMaterial.js",
    "core/objects/mesh/material/PhoneMaterial.js",

    "core/objects/mesh/Mesh.js"

];

for(var i = 0, l = filesSrc.length; i < l; i++) {
    filesSrc[i] = baseDir + filesSrc[i];
}

gulp.task('default', ['build'], function() {
    // do nothing
});

gulp.task("build", function() {
    gulp.src(filesSrc)
    .pipe(concat(outputName + '.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'build success' }));
});

gulp.task("watch", ['build'], function() {
    gulp.watch(filesSrc, ['build']);
});
