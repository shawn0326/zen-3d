var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

var plane_geometry = new zen3d.PlaneGeometry(400, 400);
var sphere_geometry = new zen3d.SphereGeometry(30, 20, 20);

var texture = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/earth.jpg");

var pixels = zen3d.createCheckerBoardPixels(50, 50);
var texture2 = zen3d.Texture2D.fromRes(renderer.gl, pixels, 50, 50);

var scene = new zen3d.Scene();

var basic = new zen3d.BasicMaterial();
basic.color = 0xffffff;
var sphere = new zen3d.Mesh(sphere_geometry, basic);
sphere.position.z = 10;
sphere.position.x = -80;
scene.add(sphere);

var lambert = new zen3d.LambertMaterial();
lambert.color = 0xffffff;
var sphere2 = new zen3d.Mesh(sphere_geometry, lambert);
sphere2.position.z = 10;
sphere2.position.x = 0;
scene.add(sphere2);

var phong = new zen3d.PhongMaterial();
phong.color = 0xffffff;
phong.specular = 20;
var sphere3 = new zen3d.Mesh(sphere_geometry, phong);
sphere3.position.z = 10;
sphere3.position.x = 80;
scene.add(sphere3);

var basic = new zen3d.BasicMaterial();
basic.color = 0xff0000;
var plane = new zen3d.Mesh(plane_geometry, basic);
plane.position.y = -80;
scene.add(plane);

var directionalLight = new zen3d.DirectionalLight();
directionalLight.intensity = 1;
directionalLight.euler.set(Math.PI / 2, Math.PI / 4, 0);
directionalLight.color = 0xffffff;
scene.add(directionalLight);

var camera = new zen3d.Camera();
camera.position.z = 300;
camera.position.y = 300;
camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
// camera.setOrtho(-480/2, 480/2, -480/2, 480/2, 10, 500);
camera.setPerspective(45 / 180 * Math.PI, 480 / 480, 10, 1000);
scene.add(camera);

// frame render
var count = 0;
function loop() {

    requestAnimationFrame(loop);

    count++;

    renderer.render(scene, camera);
}

// start!!!
loop();
