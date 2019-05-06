import { Quaternion } from '../../math/Quaternion.js';

// // mix functions

function select(buffer, dstOffset, srcOffset, t, stride) {
	if (t >= 0.5) {
		for (var i = 0; i !== stride; ++i) {
			buffer[dstOffset + i] = buffer[srcOffset + i];
		}
	}
}

function slerp(buffer, dstOffset, srcOffset, t) {
	Quaternion.slerpFlat(buffer, dstOffset, buffer, dstOffset, buffer, srcOffset, t);
}

function lerp(buffer, dstOffset, srcOffset, t, stride) {
	var s = 1 - t;

	for (var i = 0; i !== stride; ++i) {
		var j = dstOffset + i;

		buffer[j] = buffer[j] * s + buffer[srcOffset + i] * t;
	}
}

// get array
function getArray(target, source, stride, count) {
	for (var i = 0; i < count; i++) {
		target[i] = source[stride + i];
	}
}

function setArray(target, source, stride, count) {
	for (var i = 0; i < count; i++) {
		target[stride + i] = source[i];
	}
}

/**
 * This holds a reference to a real property in the scene graph; used internally.
 * Binding property and value, mixer for multiple values.
 * @constructor
 * @memberof zen3d
 * @param {Object3D} target
 * @param {string} propertyPath
 * @param {string} typeName - vector/bool/string/quaternion/number/color
 * @param {Integer} valueSize
 */
function PropertyBindingMixer(target, propertyPath, typeName, valueSize) {
	this.target = null;

	this.property = "";

	this.parseBinding(target, propertyPath);

	this.valueSize = valueSize;

	var BufferType = Float64Array;
	var mixFunction;

	switch (typeName) {
	case 'quaternion':
		mixFunction = slerp;
		break;
	case 'string':
	case 'bool':
		BufferType = Array;
		mixFunction = select;
		break;
	default:
		mixFunction = lerp;
	}

	// [ incoming | accu | orig ]
	this.buffer = new BufferType(valueSize * 3);

	this._mixBufferFunction = mixFunction;

	this.cumulativeWeight = 0;

	this.referenceCount = 0;
	this.useCount = 0;
}

Object.assign(PropertyBindingMixer.prototype, /** @lends zen3d.PropertyBindingMixer.prototype */{

	parseBinding: function(target, propertyPath) {
		propertyPath = propertyPath.split(".");

		if (propertyPath.length > 1) {
			var property = target[propertyPath[0]];


			for (var index = 1; index < propertyPath.length - 1; index++) {
				property = property[propertyPath[index]];
			}

			this.property = propertyPath[propertyPath.length - 1];
			this.target = property;
		} else {
			this.property = propertyPath[0];
			this.target = target;
		}
	},

	// remember the state of the bound property and copy it to both accus
	saveOriginalState: function () {
		var buffer = this.buffer,
			stride = this.valueSize,
			originalValueOffset = stride * 2;

		// get value
		if (this.valueSize > 1) {
			if (this.target[this.property].toArray) {
				this.target[this.property].toArray(buffer, originalValueOffset);
			} else {
				setArray(buffer, this.target[this.property], originalValueOffset, this.valueSize);
			}
		} else {
			this.target[this.property] = buffer[originalValueOffset];
		}

		// accu[0..1] := orig -- initially detect changes against the original
		for (var i = stride, e = originalValueOffset; i !== e; ++i) {
			buffer[i] = buffer[originalValueOffset + (i % stride)];
		}

		this.cumulativeWeight = 0;
	},

	// apply the state previously taken via 'saveOriginalState' to the binding
	restoreOriginalState: function () {
		var buffer = this.buffer,
			stride = this.valueSize,
			originalValueOffset = stride * 2;

		// accu[0..1] := orig -- initially detect changes against the original
		for (var i = stride, e = originalValueOffset; i !== e; ++i) {
			buffer[i] = buffer[originalValueOffset + (i % stride)];
		}

		this.apply();
	},

	/**
     * Accumulate value.
     * @param {number} weight
     */
	accumulate: function(weight) {
		var buffer = this.buffer,
			stride = this.valueSize,
			offset = stride,

			currentWeight = this.cumulativeWeight;

		if (currentWeight === 0) {
			for (var i = 0; i !== stride; ++i) {
				buffer[offset + i] = buffer[i];
			}

			currentWeight = weight;
		} else {
			currentWeight += weight;
			var mix = weight / currentWeight;
			this._mixBufferFunction(buffer, offset, 0, mix, stride);
		}

		this.cumulativeWeight = currentWeight;
	},

	/**
     * Apply to scene graph.
     */
	apply: function() {
		var buffer = this.buffer,
			stride = this.valueSize,
			weight = this.cumulativeWeight;

		this.cumulativeWeight = 0;

		if (weight < 1) {
			// accuN := accuN + original * ( 1 - cumulativeWeight )

			var originalValueOffset = stride * 2;

			this._mixBufferFunction(buffer, stride, originalValueOffset, 1 - weight, stride);
		}

		// set value
		if (this.valueSize > 1) {
			if (this.target[this.property].fromArray) {
				this.target[this.property].fromArray(buffer, stride);
			} else {
				getArray(this.target[this.property], buffer, stride, this.valueSize);
			}
		} else {
			this.target[this.property] = buffer[stride];
		}
	}

});

export { PropertyBindingMixer };