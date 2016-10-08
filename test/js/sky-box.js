var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

var plane_geometry = new zen3d.PlaneGeometry(400, 400);
var cube_geometry = new zen3d.CubeGeometry(130, 130, 130);
var sphere_geometry = new zen3d.SphereGeometry(80, 80, 20);
var sphere_geometry2 = new zen3d.SphereGeometry(30, 30, 10);

var texture2 = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/earth.jpg");
var pixels = zen3d.createCheckerBoardPixels(50, 50);
var texture = zen3d.Texture2D.fromRes(renderer.gl, pixels, 50, 50);
var renderTexture = zen3d.TextureCube.createRenderTexture(renderer.gl, 480, 480);
var renderTarget = new zen3d.RenderTarget(renderer.gl, 480, 480);
renderTarget.bind().attachRenderBuffer("depth").unbind();

var scene = new zen3d.Scene();

// sky box
var sky_geom = new zen3d.CubeGeometry(5000, 5000, 5000, false);
var sky_material = new zen3d.CubeMaterial();
var cube_texture = zen3d.TextureCube.fromSrc(renderer.gl, [
    "./resources/skybox/right.jpg",
    "./resources/skybox/left.jpg",
    "./resources/skybox/up.jpg",
    "./resources/skybox/down.jpg",
    "./resources/skybox/back.jpg",
    "./resources/skybox/front.jpg"
]);
sky_material.cubeMap = cube_texture;
var sky_box = new zen3d.Mesh(sky_geom, sky_material);
scene.add(sky_box);


// var group = new zen3d.Group();
// var material = new zen3d.BasicMaterial();
// material.map = texture;
// var plane = new zen3d.Mesh(plane_geometry, material);
// plane.position.y = -130;
// group.add(plane);
//
// scene.add(group);

var material2 = new zen3d.PhongMaterial();
material2.color = 0xffffff;
material2.map = texture2;
var sphere2 = new zen3d.Mesh(sphere_geometry2, material2);
sphere2.position.z = 0;
sphere2.position.x = 40;
scene.add(sphere2);

var material3 = new zen3d.PhongMaterial();
material3.color = 0xffffff;
material3.map = texture2;
var sphere3 = new zen3d.Mesh(sphere_geometry2, material3);
sphere3.position.z = 40;
sphere3.position.x = 0;
scene.add(sphere3);

var material2 = new zen3d.PhongMaterial();
material2.color = 0xffffff;
material2.envMap = renderTexture;
material2.envMapIntensity = .8;
material2.specular = 30;
var sphere = new zen3d.Mesh(sphere_geometry, material2);
scene.add(sphere);

// var ambientLight = new zen3d.AmbientLight();
// ambientLight.intensity = 0.2;
// scene.add(ambientLight);

var directionalLight = new zen3d.DirectionalLight();
directionalLight.intensity = .8;
directionalLight.direction.x = -2;
directionalLight.direction.y = -1;
directionalLight.direction.z = 0;
directionalLight.color = 0xffffff;
scene.add(directionalLight);

var camera = new zen3d.Camera();
camera.position.z = 700;
camera.position.y = -200;
camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
// camera.setOrtho(-480/2, 480/2, -480/2, 480/2, 10, 500);
camera.setPerspective(45 / 180 * Math.PI, 480 / 480, 10, 10000);
scene.add(camera);

var helpCamera = new zen3d.Camera();
var targets = [
    new zen3d.Vector3( 1, 0, 0 ), new zen3d.Vector3( -1, 0, 0 ), new zen3d.Vector3( 0, 1, 0 ),
	new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, 0, 1 ), new zen3d.Vector3( 0, 0, -1 )
];
var ups = [
    new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, 0, 1 ),
    new zen3d.Vector3( 0, 0, -1 ), new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, -1, 0 )
];
helpCamera.setPerspective(90 / 180 * Math.PI, 480 / 480, 50, 10000);
scene.add(helpCamera);
var lookTarget = new zen3d.Vector3();
// helpCamera.setOrtho(-480/2, 480/2, -480/2, 480/2, 1, 1000);

// frame render
var count = 0;
function loop() {

    requestAnimationFrame(loop);

    count++;

    sphere.position.x = Math.sin(count * 0.04) * 80;

    sphere2.position.x = Math.sin(count * 0.05) * 160 + sphere.position.x;
    sphere2.position.y = sphere.position.y;
    sphere2.position.z = Math.cos(count * 0.05) * 160 + sphere.position.z;
    // var rotation = sphere2.rotation;
    // rotation.y += 0.05;
    // sphere2.rotation = rotation;

    sphere3.position.x = sphere.position.x;
    sphere3.position.y = Math.sin(count * 0.05) * 120 + sphere.position.y;
    sphere3.position.z = Math.cos(count * 0.05) * 120 + sphere.position.z;
    // var rotation = sphere3.rotation;
    // rotation.y += 0.05;
    // sphere3.rotation = rotation;

    camera.position.x = Math.sin(count * 0.01) * 700;
    camera.position.z = Math.cos(count * 0.01) * 700;
    camera.position.y = Math.cos(count * 0.01) * 300;
    camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));

    // directionalLight.direction.x = 2 * Math.cos(count * .03);
    // directionalLight.direction.z = Math.sin(count * .03);

    helpCamera.position.set(sphere.position.x, sphere.position.y, sphere.position.z);

    renderTarget.bind();
    var gl = renderer.gl;

    material2.envMap = null;
    for(var i = 0; i < 6; i++) {
        lookTarget.set(targets[i].x + helpCamera.position.x, targets[i].y + helpCamera.position.y, targets[i].z + helpCamera.position.z);
        renderTarget.bindTextureCube(renderTexture, i);
        helpCamera.setLookAt(lookTarget, ups[i]);

        gl.clearColor(0., 0., 0., 0.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        renderer.render(scene, helpCamera);
    }
    material2.envMap = renderTexture;
    renderTarget.unbind();

    renderer.render(scene, camera);

}

// start!!!
loop();
