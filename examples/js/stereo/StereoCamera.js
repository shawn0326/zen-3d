/**
 * StereoCamera
 */

zen3d.StereoCamera = function() {
	zen3d.Object3D.call(this);

	this.type = zen3d.OBJECT_TYPE.CAMERA;

	this.cameraL = new zen3d.Camera();
	this.cameraR = new zen3d.Camera();

	this.near = 1;
	this.far = 1000;
}

zen3d.StereoCamera.prototype = Object.create(zen3d.Object3D.prototype);
zen3d.StereoCamera.prototype.constructor = zen3d.StereoCamera;

Object.defineProperties(zen3d.StereoCamera.prototype, {
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
			console.warn("zen3d.StereoCamera: .gammaInput has been removed. Use texture.encoding instead.");
			return false;
		},
		set: function(value) {
			console.warn("zen3d.StereoCamera: .gammaInput has been removed. Use texture.encoding instead.");
		}
	},
	gammaOutput: {
		get: function() {
			console.warn("zen3d.StereoCamera: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			return this.cameraL.outputEncoding == zen3d.TEXEL_ENCODING_TYPE.GAMMA;
		},
		set: function(value) {
			console.warn("zen3d.StereoCamera: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			if (value) {
				this.cameraL.outputEncoding = zen3d.TEXEL_ENCODING_TYPE.GAMMA;
				this.cameraR.outputEncoding = zen3d.TEXEL_ENCODING_TYPE.GAMMA;
			} else {
				this.cameraL.outputEncoding = zen3d.TEXEL_ENCODING_TYPE.LINEAR;
				this.cameraR.outputEncoding = zen3d.TEXEL_ENCODING_TYPE.LINEAR;
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