import { KeyframeTrack } from './KeyframeTrack.js';

/**
 * Used for number property track.
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Object3D} target
 * @param {string} propertyPath
 * @param {Array} times
 * @param {Array} values
 * @param {Boolean} interpolant
 */
function NumberKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

NumberKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: NumberKeyframeTrack,

    valueTypeName: 'number'

});

export { NumberKeyframeTrack };