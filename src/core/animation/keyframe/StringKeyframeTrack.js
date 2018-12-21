import { KeyframeTrack } from './KeyframeTrack.js';

/**
 * Used for string property track.
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Object3D} target
 * @param {string} propertyPath
 * @param {Array} times
 * @param {Array} values
 * @param {Boolean} interpolant
 */
function StringKeyframeTrack(target, propertyPath, times, values, interpolant) {
	KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

StringKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

	constructor: StringKeyframeTrack,

	valueTypeName: 'string',

	getValue: function(t, outBuffer) {
		var index = this._getLastTimeIndex(t),
			key = this.times[index];

		outBuffer[0] = this.values[key];
	}

});

export { StringKeyframeTrack };