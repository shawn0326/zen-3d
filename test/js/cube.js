var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

var geometry = new zen3d.CubeGeometry(40, 40, 40);
var plane_geometry = new zen3d.PlaneGeometry(400, 400);
var sphere_geometry = new zen3d.SphereGeometry(30, 20, 20);

// var texture = new zen3d.Texture(renderer.gl);
// texture.uploadCheckerboard(50, 50);
var pixels = zen3d.createCheckerBoardPixels(50, 50);
var texture = zen3d.Texture2D.fromRes(renderer.gl, pixels, 50, 50);

var texture2 = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/hi.png");
// var texture2 = new zen3d.Texture(renderer.gl);
// var image2 = new Image();
// image2.src = "./resources/hi.png";
// image2.onload = function() {
//     texture2.uploadImage(image2, true);
// }

var texture3 = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/earth.jpg");
// var texture3 = new zen3d.Texture(renderer.gl);
// var image3 = new Image();
// image3.src = "./resources/earth.jpg";
// image3.onload = function() {
//     texture3.uploadImage(image3, true);
// }

var texture4 = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/normal/couch.jpg");
// var texture4 = new zen3d.Texture(renderer.gl);
// var image4 = new Image();
// image4.src = "./resources/normal/couch.jpg";
// image4.onload = function() {
//     texture4.uploadImage(image4, true);
// }

var texture5 = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/normal/counch_norm.jpg");
// var texture5 = new zen3d.Texture(renderer.gl);
// var image5 = new Image();
// image5.src = "./resources/normal/counch_norm.jpg";
// image5.onload = function() {
//     texture5.uploadImage(image5, true);
// }

var material = new zen3d.LambertMaterial();
material.map = texture2;

var material0 = new zen3d.PhoneMaterial();
material0.map = texture3;

var material1 = new zen3d.LambertMaterial();
material1.transparent = false;
material1.color = 0xff0000;

var material2 = new zen3d.LambertMaterial();
material2.map = texture4;
material2.normalMap = texture5;

var material3 = new zen3d.LambertMaterial();
material3.transparent = false;
material3.color = 0xcccccc;

var phone = new zen3d.PhoneMaterial();
// phone.transparent = true;
// phone.opacity = .6;
phone.color = 0xffffff;
phone.specular = 20;

var lambert = new zen3d.LambertMaterial();
lambert.transparent = false;
lambert.color = 0xffffff;

var basic = new zen3d.BasicMaterial();
basic.transparent = false;
basic.color = 0xffffff;

var material4 = new zen3d.LambertMaterial();
material4.transparent = false;
material4.color = 0xff00ff;

var sphere = new zen3d.Mesh(sphere_geometry, basic);
sphere.position.z = 10;
sphere.position.x = -80;

var sphere2 = new zen3d.Mesh(sphere_geometry, lambert);
sphere2.position.z = 10;
sphere2.position.x = 0;

var sphere3 = new zen3d.Mesh(sphere_geometry, phone);
sphere3.position.z = 10;
sphere3.position.x = 80;

var plane = new zen3d.Mesh(plane_geometry, material2);
// plane.position.z = 0;
plane.position.y = -80;

// var wall = new zen3d.Mesh(plane_geometry, material3);
// wall.position.z = 100;
// var rotation = wall.rotation;
// rotation.x = -Math.PI / 2;
// wall.rotation = rotation;

var mesh3 = new zen3d.Mesh(geometry, material3);
mesh3.position.z = 50;
mesh3.position.x = 50;

var mesh4 = new zen3d.Mesh(geometry, material);
mesh4.position.z = -50;
mesh4.position.x = 50;
var rotation = mesh4.rotation;
rotation.x = Math.PI;
mesh4.rotation = rotation;
// mesh4.rotation.x = Math.PI;
// console.log(mesh4.quaternion);

var scene = new zen3d.Scene();

var group = new zen3d.Group();
// group.position.x = 300;
scene.add(group);

scene.add(sphere);
scene.add(sphere2);
scene.add(sphere3);
group.add(plane);
// group.add(wall);
// scene.add(mesh3);
// scene.add(mesh4);

// var ambientLight = new zen3d.AmbientLight();
// ambientLight.intensity = 0.2;
// // ambientLight.color = 0x00ff00;
// scene.add(ambientLight);
// //
// var ambientLight = new zen3d.AmbientLight();
// ambientLight.intensity = 0.2;
// // ambientLight.color = 0xff0000;
// scene.add(ambientLight);

var directionalLight = new zen3d.DirectionalLight();
directionalLight.intensity = 1;
directionalLight.direction.x = -2;
directionalLight.direction.y = -1;
directionalLight.direction.z = 0;
directionalLight.color = 0xffffff;
scene.add(directionalLight);
//
// var directionalLight = new zen3d.DirectionalLight();
// directionalLight.intensity = 0.8;
// directionalLight.direction.x = 1;
// directionalLight.direction.y = -1;
// directionalLight.direction.z = 0;
// directionalLight.color = 0xff0000;
// scene.add(directionalLight);

// var pointLight1 = new zen3d.PointLight();
// pointLight1.intensity = 4;
// pointLight1.position.x = 0;
// pointLight1.position.y = 30;
// pointLight1.position.z = 0;
// pointLight1.color = 0xffffff;
// scene.add(pointLight1);
// //
// var pointLight2 = new zen3d.PointLight();
// pointLight2.intensity = 1;
// pointLight2.position.x = 0;
// pointLight2.position.y = 30;
// pointLight2.position.z = 0;
// pointLight2.color = 0xff0000;
// scene.add(pointLight2);
// // //
// var pointLight3 = new zen3d.PointLight();
// pointLight3.intensity = 1;
// pointLight3.position.x = 0;
// pointLight3.position.y = 30;
// pointLight3.position.z = 0;
// pointLight3.color = 0x0000ff;
// scene.add(pointLight3);

// mesh1.position.x = 20



var camera = new zen3d.Camera();
camera.position.z = -300;
// camera.position.x = 30;
camera.position.y = 300;
camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
// camera.setOrtho(-480/2, 480/2, -480/2, 480/2, 10, 500);
camera.setPerspective(45 / 180 * Math.PI, 480 / 480, 10, 1000);
scene.add(camera);

// console.log(camera.projectionMatrix)
var renderTarget = new zen3d.RenderTarget(renderer.gl, 480, 480);

renderTarget.bind();

renderTarget.bindTexture2D();

renderTarget.attachRenderBuffer(undefined, "depth");



// frame render
var count = 0;
function loop() {

    requestAnimationFrame(loop);

    count++;

    if(count%2 == 0) {
        material3.map = null;
        renderTarget.bind();
        var gl = renderer.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    } else {
        material3.map = renderTarget.texture;
        renderTarget.unbind();
    }

    // rotation.y = Math.PI / 180 * count;
    // mesh1.rotation = rotation;
    // sphere.rotation = rotation;
    // mesh3.rotation = rotation;
    // mesh4.rotation = rotation;

    // ambientLight.intensity = Math.cos(count * .05) * 0.5 + 1;

    // mesh4.position.x--;

    // sphere.position.x = 190 * Math.cos(count * .01);

    // camera.position.z = 300 * Math.cos(count * .01);
    // camera.position.x = 300 * Math.sin(count * .01);
    // camera.position.y = -20 * Math.cos(count * .01);

    directionalLight.direction.x = 2 * Math.cos(count * .03);
    directionalLight.direction.z = Math.sin(count * .03);

    // pointLight1.position.x = 210 * Math.sin(count * .01);
    // pointLight1.position.z = 210 * Math.cos(count * .01);
    //
    // pointLight2.position.x = 90 * Math.sin(count * .1 + Math.PI * 2 / 3);
    // pointLight2.position.z = 90 * Math.cos(count * .1 + Math.PI * 2 / 3);
    //
    // pointLight3.position.x = 90 * Math.sin(count * .1 + Math.PI * 4 / 3);
    // pointLight3.position.z = 90 * Math.cos(count * .1 + Math.PI * 4 / 3);

    // camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));

    // group.position.x = 30 * Math.sin(count * .1);

    // console.log(camera.viewMatrix)

    renderer.render(scene, camera);

}

// start!!!
loop();
