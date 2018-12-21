import { WEBGL_TEXTURE_FILTER } from '../../const.js';
import { LightShadow } from './LightShadow.js';
import { RenderTargetCube } from '../../render/RenderTargetCube.js';
import { Vector3 } from '../../math/Vector3.js';

/**
 * This is used internally by PointLights for calculating shadows.
 * @constructor
 * @hideconstructor
 * @memberof zen3d
 * @extends zen3d.LightShadow
 */
function PointLightShadow() {
	LightShadow.call(this);

	this.renderTarget = new RenderTargetCube(this.mapSize.x, this.mapSize.y);

	var map = this.renderTarget.texture;
	map.generateMipmaps = false;
	map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
	this.map = map;

	this._targets = [
		new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 1, 0),
		new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)
	];

	this._ups = [
		new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1),
		new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)
	];

	this._lookTarget = new Vector3();
}

PointLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {

	constructor: PointLightShadow,

	update: function(light, face) {
		this._updateCamera(light, face);
		this._updateMatrix();

		// TODO check size change, remove this from loop
		if (this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
			this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
		}
	},

	_updateCamera: function(light, face) {
		var camera = this.camera;
		var lookTarget = this._lookTarget;
		var targets = this._targets;
		var ups = this._ups;

		// set camera position and lookAt(rotation)
		camera.position.setFromMatrixPosition(light.worldMatrix);
		lookTarget.set(targets[face].x + camera.position.x, targets[face].y + camera.position.y, targets[face].z + camera.position.z);
		camera.lookAt(lookTarget, ups[face]);

		// update view matrix
		camera.updateMatrix();

		// update projection
		camera.setPerspective(90 / 180 * Math.PI, 1, this.cameraNear, this.cameraFar);
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
	}

});

export { PointLightShadow };