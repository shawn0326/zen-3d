var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

var geometry = new zen3d.CubeGeometry(40, 40, 40);
var plane_geometry = new zen3d.PlaneGeometry(300, 300);
var sphere_geometry = new zen3d.SphereGeometry(50, 20, 20);

var texture = new zen3d.Texture(renderer.gl);
texture.uploadCheckerboard(50, 50);

var texture2 = new zen3d.Texture(renderer.gl);
var image2 = new Image();
image2.src = "./resources/hi.png";
image2.onload = function() {
    texture2.uploadImage(image2, true);
}

var texture3 = new zen3d.Texture(renderer.gl);
var image3 = new Image();
image3.src = "./resources/earth.jpg";
image3.onload = function() {
    texture3.uploadImage(image3, true);
}

var material = new zen3d.TextureMaterial();
material.diffuseMap = texture2;

var material0 = new zen3d.TextureMaterial();
material0.diffuseMap = texture3;

var material1 = new zen3d.ColorMaterial();
material1.transparent = false;
material1.color = 0xff0000;

var material2 = new zen3d.ColorMaterial();
material2.transparent = false;
material2.color = 0xffffff;

var material3 = new zen3d.ColorMaterial();
material3.transparent = false;
material3.color = 0x0000ff;

var material4 = new zen3d.ColorMaterial();
material4.transparent = false;
material4.color = 0xff00ff;

var sphere = new zen3d.Mesh(sphere_geometry, material0);
sphere.position.z = 50;
sphere.position.x = -50;

var plane = new zen3d.Mesh(plane_geometry, material2);
// plane.position.z = 0;
plane.position.y = -80;

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
group.position.x = 300;
scene.add(group);

scene.add(sphere);
group.add(plane);
scene.add(mesh3);
scene.add(mesh4);

var ambientLight = new zen3d.AmbientLight();
ambientLight.intensity = 0.2;
// ambientLight.color = 0x00ff00;
scene.add(ambientLight);
// //
// var ambientLight = new zen3d.AmbientLight();
// ambientLight.intensity = 0.2;
// ambientLight.color = 0xff0000;
// scene.add(ambientLight);

// var directionalLight = new zen3d.DirectionalLight();
// directionalLight.intensity = 0.8;
// directionalLight.direction.x = -1;
// directionalLight.direction.y = -1;
// directionalLight.direction.z = 0;
// directionalLight.color = 0x00ff00;
// scene.add(directionalLight);
//
// var directionalLight = new zen3d.DirectionalLight();
// directionalLight.intensity = 0.8;
// directionalLight.direction.x = 1;
// directionalLight.direction.y = -1;
// directionalLight.direction.z = 0;
// directionalLight.color = 0xff0000;
// scene.add(directionalLight);

var pointLight1 = new zen3d.PointLight();
pointLight1.intensity = 1;
pointLight1.position.x = 0;
pointLight1.position.y = 50;
pointLight1.position.z = 0;
pointLight1.color = 0x00ff00;
scene.add(pointLight1);

var pointLight2 = new zen3d.PointLight();
pointLight2.intensity = 1;
pointLight2.position.x = 0;
pointLight2.position.y = 50;
pointLight2.position.z = 0;
pointLight2.color = 0xff0000;
scene.add(pointLight2);

var pointLight3 = new zen3d.PointLight();
pointLight3.intensity = 1;
pointLight3.position.x = 0;
pointLight3.position.y = 50;
pointLight3.position.z = 0;
pointLight3.color = 0x0000ff;
scene.add(pointLight3);

// mesh1.position.x = 20



var camera = new zen3d.Camera();
camera.position.z = -90;
// camera.position.x = 30;
camera.position.y = 90;
camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
// camera.setOrtho(-480/2, 480/2, -480/2, 480/2, 10, 500);
camera.setPerspective(90 / 180 * Math.PI, 480 / 480, 10, 500);
scene.add(camera);

// console.log(camera.projectionMatrix)

// frame render
var count = 0;
function loop() {

    requestAnimationFrame(loop);

    count++;

    rotation.y = Math.PI / 180 * count;
    // mesh1.rotation = rotation;
    sphere.rotation = rotation;
    mesh3.rotation = rotation;
    mesh4.rotation = rotation;

    // ambientLight.intensity = Math.cos(count * .05) * 0.5 + 1;

    // mesh4.position.x--;

    // camera.position.z = 90 * Math.cos(count * .01);
    // camera.position.x = 90 * Math.sin(count * .01);
    // camera.position.y = -20 * Math.cos(count * .01);

    pointLight1.position.x = 90 * Math.sin(count * .1);
    pointLight1.position.z = 90 * Math.cos(count * .1);

    pointLight2.position.x = 90 * Math.sin(count * .1 + Math.PI * 2 / 3);
    pointLight2.position.z = 90 * Math.cos(count * .1 + Math.PI * 2 / 3);

    pointLight3.position.x = 90 * Math.sin(count * .1 + Math.PI * 4 / 3);
    pointLight3.position.z = 90 * Math.cos(count * .1 + Math.PI * 4 / 3);

    // camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));

    group.position.x = 30 * Math.sin(count * .1);

    // console.log(camera.viewMatrix)

    renderer.render(scene, camera);

}

// start!!!
loop();
