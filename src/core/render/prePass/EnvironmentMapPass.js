import { Camera } from '../../objects/camera/Camera.js';
import { Vector3 } from '../../math/Vector3.js';
import { RenderTargetCube } from '../RenderTargetCube.js';
import { WEBGL_TEXTURE_FILTER } from '../../const.js';

/**
 * environment map pre pass.
 * @constructor
 * @memberof zen3d
 */
function EnvironmentMapPass(renderTarget) {
	this.camera = new Camera();

	this.targets = [
		new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 1, 0),
		new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)
	];
	this.ups = [
		new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1),
		new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)
	];

	this.camera.setPerspective(90 / 180 * Math.PI, 1, 1, 1000);

	this.position = new Vector3();
	this.lookTarget = new Vector3();

	this.renderTarget = renderTarget || new RenderTargetCube(512, 512);
	this.renderTexture = this.renderTarget.texture;
	this.renderTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;
}

/**
 * Render environment map.
 * @param {zen3d.WebGLCore} glCore
 * @param {zen3d.Scene} scene
 */
EnvironmentMapPass.prototype.render = function(glCore, scene) {
	this.camera.position.copy(this.position);

	for (var i = 0; i < 6; i++) {
		this.lookTarget.set(this.targets[i].x + this.camera.position.x, this.targets[i].y + this.camera.position.y, this.targets[i].z + this.camera.position.z);
		this.camera.lookAt(this.lookTarget, this.ups[i]);

		this.camera.updateMatrix();

		this.renderTarget.activeCubeFace = i;

		glCore.renderTarget.setRenderTarget(this.renderTarget);

		glCore.clear(true, true, true);

		glCore.render(scene, this.camera);

		glCore.renderTarget.updateRenderTargetMipmap(this.renderTarget);
	}
}

export { EnvironmentMapPass };