/**
 * StereoRenderer
 */

import {
	Renderer
} from "../../../build/zen3d.module.js";

var StereoRenderer = function(view, options) {
	Renderer.call(this, view, options);
}

StereoRenderer.prototype = Object.create(Renderer.prototype);
StereoRenderer.prototype.constructor = StereoRenderer;

StereoRenderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
	var cameraL = camera.cameraL;
	var cameraR = camera.cameraR;

	this.matrixAutoUpdate && scene.updateMatrix();
	this.lightsAutoUpdate && scene.updateLights();

	if (this.shadowAutoUpdate || this.shadowNeedsUpdate) {
		this.shadowMapPass.render(this.glCore, scene);

		this.shadowNeedsUpdate = false;
	}

	if (renderTarget === undefined || renderTarget === null || renderTarget.isRenderTarget) {
		if (renderTarget === undefined || renderTarget === null) {
			renderTarget = this.backRenderTarget;
		}
		this.glCore.renderTarget.setRenderTarget(renderTarget);
	} else {
		this.glCore.gl.bindFramebuffer(this.glCore.gl.FRAMEBUFFER, renderTarget);
		this.glCore.state.currentRenderTarget = null;
	}

	if (this.autoClear || forceClear) {
		this.glCore.clear(true, true, true);
	}

	this.glCore.render(scene, cameraL);
	this.glCore.render(scene, cameraR);

	if (!!renderTarget.texture) {
		this.glCore.renderTarget.updateRenderTargetMipmap(renderTarget);
	}
}

export { StereoRenderer };