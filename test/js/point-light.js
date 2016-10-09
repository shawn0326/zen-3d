var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

// scene
var scene = new zen3d.Scene();

// camera
var camera = new zen3d.Camera();
// camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
// camera.setOrtho(-480/2, 480/2, -480/2, 480/2, 10, 500);
camera.setPerspective(45 / 180 * Math.PI, 480 / 480, 10, 1000);
scene.add(camera);

// hover controller for camera
var controller = new zen3d.HoverController(camera, new zen3d.Vector3(0, 0, 0));
controller.panAngle = 0;
controller.tiltAngle = 45;
controller.distance = 300;
var pressed = false;
document.addEventListener("mousewheel", function(e) {
    controller.distance += e.deltaY;
}.bind(this));
document.addEventListener("mousedown", function(e) {
    pressed = true;
}.bind(this));
document.addEventListener("mouseup", function(e) {
    pressed = false;
}.bind(this));
document.addEventListener("mousemove", function(e) {
    if(pressed) {
        // TODO only works for chrome?
        var moveX = -e.movementX;
        var moveY = e.movementY;
        controller.panAngle += moveX;
        controller.tiltAngle += moveY;
    }
}.bind(this));

// plane
var plane_geometry = new zen3d.PlaneGeometry(800, 800);
var plane_material = new zen3d.PhongMaterial();
plane_material.color = 0xcccccc;
var plane = new zen3d.Mesh(plane_geometry, plane_material);
plane.position.y = -20;
scene.add(plane);

// cube
var cube_geometry = new zen3d.CubeGeometry(100, 40, 100);
var cube_material = new zen3d.PhongMaterial();
cube_material.color = 0xffffff;
var cube = new zen3d.Mesh(cube_geometry, cube_material);
scene.add(cube);

// ambient light
var light2 = new zen3d.AmbientLight();
light2.intensity = 0.2;
scene.add(light2);
// point light
var light1 = new zen3d.PointLight();
light1.intensity = 0.8;
light1.color = 0xffaaaa;
light1.distance = 400;
light1.decay = 2;
scene.add(light1);

// frame render
var count = 0;
function loop() {
    requestAnimationFrame(loop);

    count++;

    light1.position.x = 100 * Math.cos(count * .03);
    light1.position.y = 100;
    light1.position.z = 100 * Math.sin(count * .03);

    controller.update();

    renderer.render(scene, camera);
}

// start!!!
loop();
