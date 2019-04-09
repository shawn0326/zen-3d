import { WEBGL_TEXTURE_FILTER, WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE, ATTACHMENT, WEBGL_COMPARE_FUNC } from '../../const.js';
import { Texture2D } from '../../texture/Texture2D.js';
import { LightShadow } from './LightShadow.js';
import { RenderTarget2D } from '../../render/RenderTarget2D.js';
import { Vector3 } from '../../math/Vector3.js';

/**
 * This is used internally by SpotLights for calculating shadows.
 * @constructor
 * @hideconstructor
 * @memberof zen3d
 * @extends zen3d.LightShadow
 */
function SpotLightShadow() {
	LightShadow.call(this);

	this.renderTarget = new RenderTarget2D(this.mapSize.x, this.mapSize.y);

	var map = this.renderTarget.texture;
	map.generateMipmaps = false;
	map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
	this.map = map;

	this.depthMap = null;

	this._lookTarget = new Vector3();

	this._up = new Vector3(0, 1, 0);
}

SpotLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {

	constructor: SpotLightShadow,

	update: function(light) {
		this._updateCamera(light);
		this._updateMatrix();

		// TODO check size change, remove this from loop
		if (this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
			this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
		}
	},

	_updateCamera: function(light) {
		var camera = this.camera;
		var lookTarget = this._lookTarget;

		// set camera position and lookAt(rotation)
		light.getWorldDirection(this._lookTarget);
		camera.position.setFromMatrixPosition(light.worldMatrix);
		lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
		camera.lookAt(lookTarget, this._up);

		// update view matrix
		camera.updateMatrix();

		// update projection
		// TODO distance should be custom?
		camera.setPerspective(light.angle * 2, 1, this.cameraNear, this.cameraFar);
	},

	_updateMatrix: function() {
		var matrix = this.matrix;
		var camera = this.camera;

		// matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
		matrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);

		matrix.multiply(camera.projectionMatrix);
		matrix.multiply(camera.viewMatrix);
	},

	_initDepthMap: function() {
		var depthTexture = new Texture2D();
		depthTexture.type = WEBGL_PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV;
		depthTexture.format = WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
		depthTexture.internalformat = WEBGL_PIXEL_FORMAT.DEPTH32F_STENCIL8;
		depthTexture.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
		depthTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
		depthTexture.compare = WEBGL_COMPARE_FUNC.LESS;
		depthTexture.generateMipmaps = false;
		this.renderTarget.attach(
			depthTexture,
			ATTACHMENT.DEPTH_STENCIL_ATTACHMENT
		);
		this.depthMap = depthTexture;
	}

});

export { SpotLightShadow };