zen-3d
========

[![NPM Package][npm]][npm-url]
[![Build Size][build-size]][build-size-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![License][license-badge]][license-badge-url]
[![Issues][issues-badge]][issues-badge-url]

[![devDependencies Status](https://status.david-dm.org/gh/shawn0326/zen-3d.svg?type=dev)](https://david-dm.org/shawn0326/zen-3d?type=dev)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/shawn0326/zen-3d.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/shawn0326/zen-3d/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/shawn0326/zen-3d.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/shawn0326/zen-3d/alerts/)

### Moved ###

This project has moved and is now available at [t3d.js](https://github.com/UINOSOFT/t3d.js).

### JavaScript 3D library ###

The aim of the project is to create an easy to use, lightweight, 3D/2D library. The library only provides WebGL renderers.

[Examples](https://shawn0326.github.io/zen-3d/examples/) &mdash;
[RoadMap](https://trello.com/b/7Ie3DDBP) &mdash;
[Documentation](https://shawn0326.github.io/zen-3d/docs/) &mdash;
[Tests](https://shawn0326.github.io/zen-3d/tests/)

### Usage ###

Use `zen3d.js` or `zen3d.min.js` in your page:

````html
<script src="zen3d.min.js"></script>
````

or import as es6 module:

````javascript
import * as zen3d from 'js/zen3d.module.js';
````

draw a simple cube:

````javascript
var width = window.innerWidth || 2;
var height = window.innerHeight || 2;

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var gl = canvas.getContext("webgl2", {
	antialias: true,
	alpha: false,
	stencil: true
});
var glCore = new zen3d.WebGLCore(gl);
glCore.state.colorBuffer.setClear(0.1, 0.1, 0.1, 1);
var backRenderTarget = new zen3d.RenderTargetBack(canvas);

var scene = new zen3d.Scene();

var geometry = new zen3d.CubeGeometry(8, 8, 8);
var material = new zen3d.PBRMaterial();
var mesh = new zen3d.Mesh(geometry, material);
scene.add(mesh);

var ambientLight = new zen3d.AmbientLight(0xffffff);
scene.add(ambientLight);

var directionalLight = new zen3d.DirectionalLight(0xffffff);
directionalLight.position.set(-5, 5, 5);
directionalLight.lookAt(new zen3d.Vector3(), new zen3d.Vector3(0, 1, 0));
scene.add(directionalLight);

var camera = new zen3d.Camera();
camera.position.set(0, 10, 30);
camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
camera.setPerspective(45 / 180 * Math.PI, width / height, 1, 1000);
scene.add(camera);

function loop(count) {
	requestAnimationFrame(loop);
	
	mesh.euler.y = count / 1000 * .5; // rotate cube

	scene.updateMatrix();
	scene.updateLights();

	glCore.renderTarget.setRenderTarget(backRenderTarget);

	glCore.clear(true, true, false);

	glCore.render(scene, camera);
}
requestAnimationFrame(loop);
````

### WebGL2 Support ###

* [Multiple Render Targets](https://shawn0326.github.io/zen-3d/examples/#custompass_gbuffer). (WebGL 1.0 extension / WebGL 2.0)
* [Instancing](https://shawn0326.github.io/zen-3d/examples/#webgl_instanced_draw). (WebGL 1.0 extension / WebGL 2.0)
* Vertex Array Object. (WebGL 1.0 extension / WebGL 2.0)
* [Shader Texture LOD](https://shawn0326.github.io/zen-3d/examples/#material_cubetexture_skybox). (WebGL 1.0 extension / WebGL 2.0)
* [Shadow Sampler](https://shawn0326.github.io/zen-3d/examples/#light_softshadow). (WebGL 2.0)
* Fragment Depth. (TODO)
* Transform Feedback. (TODO)
* Sampler Objects. (TODO)
* [3D Texture](https://shawn0326.github.io/zen-3d/examples/#material_texture3d). (WebGL 2.0)
* [Multisampled Renderbuffers](https://shawn0326.github.io/zen-3d/examples/#custompass_msaa). (WebGL 2.0)

### Projects ###

* [zen-viewer](https://shawn0326.github.io/zen-viewer/)

### Change log ###

[Releases](https://github.com/shawn0326/zen-3d/releases)


[npm]: https://img.shields.io/npm/v/zen-3d
[npm-url]: https://www.npmjs.com/package/zen-3d
[build-size]: https://badgen.net/bundlephobia/minzip/zen-3d
[build-size-url]: https://bundlephobia.com/result?p=zen-3d
[npm-downloads]: https://img.shields.io/npm/dw/zen-3d
[npmtrends-url]: https://www.npmtrends.com/zen-3d
[license-badge]: https://img.shields.io/npm/l/zen-3d.svg
[license-badge-url]: ./LICENSE
[issues-badge]: https://img.shields.io/github/issues/shawn0326/zen-3d.svg
[issues-badge-url]: https://github.com/shawn0326/zen-3d/issues
