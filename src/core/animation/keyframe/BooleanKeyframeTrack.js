import { KeyframeTrack } from './KeyframeTrack.js';

/**
 * Used for boolean property track.
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Object3D} target
 * @param {string} propertyPath
 * @param {Array} times
 * @param {Array} values
 * @param {Boolean} interpolant
 */
function BooleanKeyframeTrack(target, propertyPath, times, values, interpolant) {
	KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

BooleanKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

	constructor: BooleanKeyframeTrack,

	valueTypeName: 'bool',

	getValue: function(t, outBuffer) {
		var index = this._getLastTimeIndex(t),
			key = this.times[index];

		outBuffer[0] = this.values[key];
	}

});

export { BooleanKeyframeTrack };