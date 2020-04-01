/**
 * CameraXR
 */

import {
	Camera,
	OBJECT_TYPE,
	Object3D,
	TEXEL_ENCODING_TYPE
} from "../../../build/zen3d.module.js";

var CameraXR = function() {
	Object3D.call(this);

	this.type = OBJECT_TYPE.CAMERA;

	this.cameraL = new Camera();
	this.cameraR = new Camera();

	this.near = 1;
	this.far = 1000;
}

CameraXR.prototype = Object.create(Object3D.prototype);
CameraXR.prototype.constructor = CameraXR;

Object.defineProperties(CameraXR.prototype, {
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
			console.warn("CameraXR: .gammaInput has been removed. Use texture.encoding instead.");
			return false;
		},
		set: function(value) {
			console.warn("CameraXR: .gammaInput has been removed. Use texture.encoding instead.");
		}
	},
	gammaOutput: {
		get: function() {
			console.warn("CameraXR: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			return this.cameraL.outputEncoding == TEXEL_ENCODING_TYPE.GAMMA;
		},
		set: function(value) {
			console.warn("CameraXR: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
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

export { CameraXR };