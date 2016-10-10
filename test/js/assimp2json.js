var canvas = document.getElementById("canvas");
var renderer = new zen3d.Renderer(canvas);

var texture2 = zen3d.Texture2D.fromSrc(renderer.gl, "./resources/earth.jpg");
var pixels = zen3d.createCheckerBoardPixels(50, 50);
var texture = zen3d.Texture2D.fromRes(renderer.gl, pixels, 50, 50);
var renderTexture = zen3d.TextureCube.createRenderTexture(renderer.gl, 480, 480);
var renderTarget = new zen3d.RenderTarget(renderer.gl, 480, 480);
renderTarget.bind().attachRenderBuffer("depth").unbind();

var scene = new zen3d.Scene();

// sky box
var sky_geom = new zen3d.CubeGeometry(500, 500, 500, false);
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

// assimp2json
var request = new XMLHttpRequest();
request.onreadystatechange = function(event) {
    if(event.target.readyState == 4) {
        var data = JSON.parse(event.target.response);
        console.log(data);

        var meshes = data.meshes;
        var mesh;
        for(var i = 0; i < meshes.length; i++) {
            if(meshes[i].name == "") {
                mesh = meshes[i];
            }
        }

        // console.log(mesh)

        var faces = mesh.faces;
        var vertices = mesh.vertices;
        var normals = mesh.normals;
        var texturecoords = mesh.texturecoords;
        var verticesCount = vertices.length / 3; // not need

        var geometry = new  zen3d.Geometry();
        geometry.verticesCount = verticesCount;

        var g_v = geometry.verticesArray;
        for(var i = 0; i < verticesCount; i++) {
            g_v.push(vertices[i * 3 + 0]);
            g_v.push(vertices[i * 3 + 1]);
            g_v.push(vertices[i * 3 + 2]);

            g_v.push(normals[i * 3 + 0]);
            g_v.push(normals[i * 3 + 1]);
            g_v.push(normals[i * 3 + 2]);

            g_v.push(0);
            g_v.push(0);
            g_v.push(0);

            g_v.push(1);
            g_v.push(1);
            g_v.push(1);
            g_v.push(1);

            // uv1
            if(texturecoords) {
                g_v.push(texturecoords[i * 2 + 0]);
                g_v.push(texturecoords[i * 2 + 1]);
            } else {
                g_v.push(0);
                g_v.push(0);
            }

            g_v.push(0);
            g_v.push(0);
        }

        var g_i = geometry.indicesArray;
        for(var i = 0; i < faces.length; i++) {
            g_i.push(faces[i][2]);
            g_i.push(faces[i][1]);
            g_i.push(faces[i][0]);
        }

        console.log(geometry);

        var material = new zen3d.LambertMaterial();
        var mesh = new zen3d.Mesh(geometry, material);
        scene.add(mesh);

    }
}.bind(this);
request.open("GET", "./resources/models/sofa/sofa.json", true);
request.send();


// var ambientLight = new zen3d.AmbientLight();
// ambientLight.intensity = 0.2;
// scene.add(ambientLight);

var directionalLight = new zen3d.DirectionalLight();
directionalLight.intensity = .8;
directionalLight.euler.set(Math.PI / 2, Math.PI / 4, 0);
directionalLight.color = 0xffffff;
scene.add(directionalLight);

var camera = new zen3d.Camera();
// camera.position.z = 700;
camera.position.y = 0;
camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
// camera.setOrtho(-480/2, 480/2, -480/2, 480/2, 10, 500);
camera.setPerspective(45 / 180 * Math.PI, 480 / 480, 1, 1000);
scene.add(camera);


// frame render
var count = 0;
function loop() {

    requestAnimationFrame(loop);

    count++;

    camera.position.x = Math.sin(count * 0.01) * 27;
    camera.position.z = Math.cos(count * 0.01) * 27;
    // camera.position.y = Math.cos(count * 0.01) * 23;
    camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));

    // directionalLight.direction.x = 2 * Math.cos(count * .03);
    // directionalLight.direction.z = Math.sin(count * .03);

    renderer.render(scene, camera);

}

// start!!!
loop();
