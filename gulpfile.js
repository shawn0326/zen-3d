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
    "core/math/Vector4.js",
    "core/math/Box3.js",
    "core/math/Sphere.js",
    "core/math/Plane.js",
    "core/math/Frustum.js",
    "core/math/Color3.js",

    // event
    "core/EventDispatcher.js",

    // render
    "core/render/WebGL/WebGLCapabilities.js",
    "core/render/WebGL/WebGLState.js",
    "core/render/WebGL/WebGLProperties.js",
    "core/render/WebGL/WebGLTexture.js",
    "core/render/shader/ShaderLib.js",
    "core/render/shader/Program.js",
    "core/render/Renderer.js",
    "core/render/RenderCache.js",
    "core/render/RenderTargetBase.js",
    "core/render/RenderTarget2D.js",
    "core/render/RenderTargetCube.js",

    // objects
    "core/objects/Object3D.js",
    // scene
    "core/objects/Scene.js",
    "core/objects/Fog.js",
    "core/objects/FogExp2.js",
    // group
    "core/objects/Group.js",

    // light
    "core/objects/lights/Light.js",
    "core/objects/lights/AmbientLight.js",
    "core/objects/lights/DirectionalLight.js",
    "core/objects/lights/PointLight.js",
    "core/objects/lights/SpotLight.js",
    "core/objects/lights/DirectionalLightShadow.js",
    "core/objects/lights/SpotLightShadow.js",
    "core/objects/lights/PointLightShadow.js",

    // camera
    "core/objects/camera/Camera.js",

    // mesh
    "core/objects/mesh/geometry/Geometry.js",
    "core/objects/mesh/geometry/CubeGeometry.js",
    "core/objects/mesh/geometry/PlaneGeometry.js",
    "core/objects/mesh/geometry/SphereGeometry.js",

    // texture
    "core/texture/TextureBase.js",
    "core/texture/Texture2D.js",
    "core/texture/TextureCube.js",

    "core/objects/mesh/material/Material.js",
    "core/objects/mesh/material/BasicMaterial.js",
    "core/objects/mesh/material/LambertMaterial.js",
    "core/objects/mesh/material/PhongMaterial.js",
    "core/objects/mesh/material/CubeMaterial.js",
    "core/objects/mesh/material/PointsMaterial.js",

    "core/objects/mesh/Mesh.js",
    "core/objects/mesh/Points.js",

    //loader
    "core/loader/AssimpJsonLoader.js",

    // controller
    "extension/controller/HoverController.js"

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
