import { BUFFER_USAGE, TEXEL_ENCODING_TYPE } from './const.js';
import { BufferAttribute } from './geometry/BufferAttribute.js';
import { InstancedGeometry } from './geometry/InstancedGeometry.js';
import { InterleavedBuffer } from './geometry/InterleavedBuffer.js';
import { Vector3 } from './math/Vector3.js';
import { Camera } from './objects/camera/Camera.js';

// export function emptyLegacy() {}

Object.defineProperties(BufferAttribute.prototype, {
	dynamic: {
		get: function () {
			console.warn('zen3d.BufferAttribute: .dynamic has been deprecated. Use .usage instead.');
			return this.usage === BUFFER_USAGE.DYNAMIC_DRAW;
		},
		set: function (value) {
			console.warn('zen3d.BufferAttribute: .dynamic has been deprecated. Use .usage instead.');
			this.usage = value ? BUFFER_USAGE.DYNAMIC_DRAW : BUFFER_USAGE.STATIC_DRAW;
		}
	}
});

Object.defineProperties(InterleavedBuffer.prototype, {
	dynamic: {
		get: function () {
			console.warn('zen3d.InterleavedBuffer: .dynamic has been deprecated. Use .usage instead.');
			return this.usage === BUFFER_USAGE.DYNAMIC_DRAW;
		},
		set: function (value) {
			console.warn('zen3d.InterleavedBuffer: .dynamic has been deprecated. Use .usage instead.');
			this.usage = value ? BUFFER_USAGE.DYNAMIC_DRAW : BUFFER_USAGE.STATIC_DRAW;
		}
	}
});

Object.defineProperties(InstancedGeometry.prototype, {
	maxInstancedCount: {
		get: function () {
			console.warn('zen3d.InstancedGeometry: .maxInstancedCount has been renamed to .instanceCount.');
			return this.instanceCount;
		},
		set: function (value) {
			console.warn('zen3d.InstancedGeometry: .maxInstancedCount has been renamed to .instanceCount.');
			this.instanceCount = value;
		}
	}
});

Vector3.prototype.applyProjection = function(m) {
	console.error("zen3d.Vector3: .applyProjection has been removed. Use .applyMatrix4 instead.");
}

Object.defineProperties(Camera.prototype, {
	gammaInput: {
		get: function() {
			console.warn("zen3d.Camera: .gammaInput has been removed. Use texture.encoding instead.");
			return false;
		},
		set: function(value) {
			console.warn("zen3d.Camera: .gammaInput has been removed. Use texture.encoding instead.");
		}
	},
	gammaOutput: {
		get: function() {
			console.warn("zen3d.Camera: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			return this.outputEncoding == TEXEL_ENCODING_TYPE.GAMMA;
		},
		set: function(value) {
			console.warn("zen3d.Camera: .gammaOutput has been removed. Use .outputEncoding or renderTarget.texture.encoding instead.");
			if (value) {
				this.outputEncoding = TEXEL_ENCODING_TYPE.GAMMA;
			} else {
				this.outputEncoding = TEXEL_ENCODING_TYPE.LINEAR;
			}
		}
	}
});