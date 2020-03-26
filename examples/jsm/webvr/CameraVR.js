/**
 * CameraVR
 */

import {
	Camera,
	OBJECT_TYPE,
	Object3D,
	TEXEL_ENCODING_TYPE
} from "../../../build/zen3d.module.js";

var CameraVR = function() {
	Object3D.call(this);

	this.type = OBJECT_TYPE.CAMERA;

	this.cameraL = new Camera();
	this.cameraR = new Camera();

	this.cameraL.rect.set(0, 0, 0.5, 1);
	this.cameraR.rect.set(0.5, 0, 1, 1);

	this.near = 1;
	this.far = 1000;
}

CameraVR.prototype = Object.create(Object3D.prototype);
CameraVR.prototype.constructor = CameraVR;

Object.defineProperties(CameraVR.prototype, {
	gammaFactor: {
		get: function() {
			return this.cameraL.gammaFactor;
		},
		set: function(value) {
			this.cameraL.gammaFactor = value;
			this.cameraR.gammaFactor = value;
		}
	},
	gammaInput: {
		get: function() {
			console.warn("CameraVR: .gammaInput has been removed. Use texture.encoding instead.");
			return false;
		},
		set: function(value) {
			console.warn("CameraVR: .gammaInput has been removed. Use texture.encoding instead.");
		}
	},
	gammaOutput: {
		get: function() {
			console.warn("CameraVR: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			return this.cameraL.outputEncoding == TEXEL_ENCODING_TYPE.GAMMA;
		},
		set: function(value) {
			console.warn("CameraVR: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			if (value) {
				this.cameraL.outputEncoding = TEXEL_ENCODING_TYPE.GAMMA;
				this.cameraR.outputEncoding = TEXEL_ENCODING_TYPE.GAMMA;
			} else {
				this.cameraL.outputEncoding = TEXEL_ENCODING_TYPE.LINEAR;
				this.cameraR.outputEncoding = TEXEL_ENCODING_TYPE.LINEAR;
			}
		}
	},
	outputEncoding: {
		get: function() {
			return this.cameraL.outputEncoding;
		},
		set: function(value) {
			this.cameraL.outputEncoding = value;
			this.cameraR.outputEncoding = value;
		}
	}
});

export { CameraVR };