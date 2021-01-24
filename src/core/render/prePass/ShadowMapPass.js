import { DepthMaterial } from '../../material/DepthMaterial.js';
import { DistanceMaterial } from '../../material/DistanceMaterial.js';
import { LIGHT_TYPE, DRAW_SIDE } from '../../const.js';
import { Vector4 } from '../../math/Vector4.js';

var shadowSide = { "front": DRAW_SIDE.BACK, "back": DRAW_SIDE.FRONT, "double": DRAW_SIDE.DOUBLE };

var defaultDepthMaterial = new DepthMaterial();
defaultDepthMaterial.packToRGBA = true;

var defaultDistanceMaterial = new DistanceMaterial();
defaultDistanceMaterial.uniforms = {};

function _getDepthMaterial(renderable, light) {
	defaultDepthMaterial.side = shadowSide[renderable.material.side];
	return defaultDepthMaterial;
}

function _getDistanceMaterial(renderable, light) {
	defaultDistanceMaterial.side = shadowSide[renderable.material.side];
	defaultDistanceMaterial.uniforms["nearDistance"] = light.shadow.cameraNear;
	defaultDistanceMaterial.uniforms["farDistance"] = light.shadow.cameraFar;
	return defaultDistanceMaterial;
}

var oldClearColor = new Vector4();

/**
 * Shadow map pre pass.
 * @constructor
 * @memberof zen3d
 */
function ShadowMapPass() {
	/**
	 * Get depth material function.
	 * Override this to use custom depth material.
	 * @type {Function}
	 */
	this.getDepthMaterial = _getDepthMaterial;

	/**
	 * Get distance material function.
	 * Override this to use custom distance material.
	 * @type {Function}
	 */
	this.getDistanceMaterial = _getDistanceMaterial;
}

/**
 * Render shadow map.
 * @param {zen3d.WebGLCore} glCore
 * @param {zen3d.Scene} scene
 */
ShadowMapPass.prototype.render = function(glCore, scene) {
	var gl = glCore.gl;
	var state = glCore.state;

	var getDepthMaterial = this.getDepthMaterial;
	var getDistanceMaterial = this.getDistanceMaterial;

	// force disable stencil
	var useStencil = state.states[gl.STENCIL_TEST];
	if (useStencil) {
		state.stencilBuffer.setTest(false);
	}

	oldClearColor.copy(state.colorBuffer.getClear());
	state.colorBuffer.setClear(1, 1, 1, 1);

	var lights = scene.lights.shadows;
	for (var i = 0; i < lights.length; i++) {
		var light = lights[i];

		var shadow = light.shadow;

		if (shadow.autoUpdate === false && shadow.needsUpdate === false) continue;

		var camera = shadow.camera;
		var shadowTarget = shadow.renderTarget;
		var isPointLight = light.lightType == LIGHT_TYPE.POINT ? true : false;
		var faces = isPointLight ? 6 : 1;

		if (glCore.capabilities.version >= 2) {
			if (!isPointLight && !shadow.depthMap && !glCore.disableShadowSampler) {
				shadow._initDepthMap();
			}
		}

		for (var j = 0; j < faces; j++) {
			if (isPointLight) {
				shadow.update(light, j);
				shadowTarget.activeCubeFace = j;
			} else {
				shadow.update(light);
			}

			var renderList = scene.updateRenderList(camera);

			glCore.renderTarget.setRenderTarget(shadowTarget);

			glCore.clear(true, true);

			glCore.renderPass(renderList.opaque, camera, {
				getMaterial: function(renderable) {
					return isPointLight ? getDistanceMaterial(renderable, light) : getDepthMaterial(renderable, light);
				},
				ifRender: function(renderable) {
					return renderable.object.castShadow;
				}
			});

			// ignore transparent objects?
		}

		// set generateMipmaps false
		// glCore.renderTarget.updateRenderTargetMipmap(shadowTarget);

		shadow.needsUpdate = false;
	}

	if (useStencil) {
		state.stencilBuffer.setTest(true);
	}

	state.colorBuffer.setClear(oldClearColor.x, oldClearColor.y, oldClearColor.z, oldClearColor.w);
}

export { ShadowMapPass };