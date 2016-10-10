var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

var pixels = zen3d.createCheckerBoardPixels(50, 50);
var texture = zen3d.Texture2D.fromRes(renderer.gl, pixels, 50, 50);

var scene = new zen3d.Scene();

var plane_geometry = new zen3d.PlaneGeometry(400, 400);
var material1 = new zen3d.BasicMaterial();
var plane = new zen3d.Mesh(plane_geometry, material1);
plane.position.y = -80;
scene.add(plane);

var sphere_geometry = new zen3d.SphereGeometry(30, 20, 20);
var material2 = new zen3d.PhongMaterial();
material2.map = texture;
var sphere = new zen3d.Mesh(sphere_geometry, material2);
sphere.position.z = 10;
sphere.position.x = -80;
scene.add(sphere);

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

var renderTexture = zen3d.Texture2D.createRenderTexture(renderer.gl, 480, 480);
var renderTarget = new zen3d.RenderTarget(renderer.gl, 480, 480);
renderTarget.bind().attachRenderBuffer("depth").bindTexture2D(renderTexture).unbind();

// frame render
var count = 0;
function loop() {

    requestAnimationFrame(loop);

    count++;

    directionalLight.euler.y = Math.sin(count * .03);

    // render target

    renderTarget.bind();

    var gl = renderer.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    material1.map = null;

    renderer.render(scene, camera);

    material1.map = renderTexture;

    renderTarget.unbind();

    // render target

    renderer.render(scene, camera);

}

// start!!!
loop();
