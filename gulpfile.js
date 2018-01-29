var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var watch = require('gulp-watch');
var shaderCompile = require("./tools/shaderCompiler.js");
var qunit = require("gulp-qunit");
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
    "core/math/Matrix3.js",
    "core/math/Matrix4.js",
    "core/math/Vector2.js",
    "core/math/Vector3.js",
    "core/math/Vector4.js",
    "core/math/Quaternion.js",
    "core/math/Box2.js",
    "core/math/Box3.js",
    "core/math/Sphere.js",
    "core/math/Plane.js",
    "core/math/Frustum.js",
    "core/math/Color3.js",
    "core/math/Ray.js",
    "core/math/Triangle.js",
    "core/math/Curve.js",

    // event
    "core/EventDispatcher.js",

    // raycaster
    "core/Raycaster.js",

    // render
    "core/render/WebGL/WebGLCapabilities.js",
    "core/render/WebGL/WebGLState.js",
    "core/render/WebGL/WebGLProperties.js",
    "core/render/WebGL/WebGLTexture.js",
    "core/render/WebGL/WebGLGeometry.js",
    "core/render/WebGL/WebGLUniform.js",
    "core/render/WebGL/WebGLAttribute.js",
    "core/render/WebGL/WebGLProgram.js",
    "core/render/shader/ShaderChunk.js",
    "core/render/shader/ShaderLib.js",
    "core/render/shader/Program.js",
    "core/render/Renderer.js",
    "core/render/RenderCache.js",
    "core/render/RenderTargetBase.js",
    "core/render/RenderTarget2D.js",
    "core/render/RenderTargetCube.js",

    // geometry
    "core/geometry/Geometry.js",
    "core/geometry/CubeGeometry.js",
    "core/geometry/PlaneGeometry.js",
    "core/geometry/SphereGeometry.js",
    "core/geometry/CylinderGeometry.js",

    // texture
    "core/texture/TextureBase.js",
    "core/texture/Texture2D.js",
    "core/texture/TextureCube.js",
    "core/texture/TextureData.js",

    // material
    "core/material/Material.js",
    "core/material/BasicMaterial.js",
    "core/material/LambertMaterial.js",
    "core/material/PhongMaterial.js",
    "core/material/PBRMaterial.js",
    "core/material/CubeMaterial.js",
    "core/material/PointsMaterial.js",
    "core/material/LineMaterial.js",
    "core/material/LineLoopMaterial.js",
    "core/material/LineDashedMaterial.js",
    "core/material/SpriteMaterial.js",
    "core/material/ShaderMaterial.js",
    "core/material/DepthMaterial.js",
    "core/material/DistanceMaterial.js",
    "core/material/ParticleMaterial.js",

    // objects
    "core/objects/Object3D.js",

    // scene
    "core/objects/Scene.js",
    "core/objects/fog/Fog.js",
    "core/objects/fog/FogExp2.js",

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

    "core/objects/Mesh.js",
    "core/objects/SkinnedMesh.js",
    "core/objects/Points.js",
    "core/objects/Line.js",
    "core/objects/Sprite.js",

    "core/objects/particle/ParticleContainer.js",

    // armature
    "core/animation/armature/Bone.js",
    "core/animation/armature/Skeleton.js",

    // keyframe
    "core/animation/keyframe/KeyframeData.js",
    "core/animation/keyframe/KeyframeTrack.js",
    "core/animation/keyframe/QuaternionKeyframeTrack.js",
    "core/animation/keyframe/VectorKeyframeTrack.js",
    "core/animation/keyframe/ColorKeyframeTrack.js",
    "core/animation/keyframe/KeyframeClip.js",
    "core/animation/keyframe/KeyframeAnimation.js",

    //loader
    "core/loader/AssimpJsonLoader.js",
    "core/loader/FileLoader.js",
    "core/loader/ImageLoader.js",
    "core/loader/TGALoader.js",

    //performance
    "core/Performance.js",

    // controller
    "extension/controller/HoverController.js",
    "extension/controller/FreeController.js"
];

for(var i = 0, l = filesSrc.length; i < l; i++) {
    filesSrc[i] = baseDir + filesSrc[i];
}

var canvas2DSrc = [
    // canvas2d
    "src/extension/canvas2D/Canvas2D.js",
    "src/extension/canvas2D/Canvas2DMaterial.js",
    "src/extension/canvas2D/Object2D.js",
    "src/extension/canvas2D/Sprite2D.js"
];

var webVRSrc = [
    // webvr
    "src/extension/webvr/RendererVR.js",
    "src/extension/webvr/CameraVR.js"
];

var inspectorSrc = [
    // inspector
    "src/extension/inspector/Inspector.js"
];

var postprocessingSrc = [
    // postprocessing
    "src/extension/postprocessing/EffectComposer.js",
    "src/extension/postprocessing/Pass.js"
];

var inputSrc = [
    // input
    "src/extension/input/Keyboard.js",
    "src/extension/input/Mouse.js",
    "src/extension/input/Touch.js"
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

gulp.task('default', ["shader", 'build'], function() {
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

gulp.task("shader", function() {
    var root = "./src/core/render/shader/";
    shaderCompile.compileShader(root + "shaderLib/", root, "ShaderLib", "zen3d");
    shaderCompile.compileShader(root + "shaderChunk/", root, "ShaderChunk", "zen3d");
});

gulp.task("extension", function() {
    gulp.src(canvas2DSrc)
    .pipe(concat(outputName + '.canvas2d.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension canvas2d build success' }));

    gulp.src(webVRSrc)
    .pipe(concat(outputName + '.webvr.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension webvr build success' }));

    gulp.src(inspectorSrc)
    .pipe(concat(outputName + '.inspector.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension inspector build success' }));

    gulp.src(postprocessingSrc)
    .pipe(concat(outputName + '.postprocessing.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'extension postprocessing build success' }));

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

gulp.task('test', function() {
    return gulp.src('./tests/index.html')
        .pipe(qunit());
});
