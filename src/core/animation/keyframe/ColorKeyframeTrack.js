import { KeyframeTrack } from './KeyframeTrack.js';

/**
 * Used for color property track.
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Object3D} target
 * @param {string} propertyPath
 * @param {Array} times
 * @param {Array} values
 * @param {Boolean} interpolant
 */
function ColorKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

ColorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: ColorKeyframeTrack,

    valueTypeName: 'color'

});

export { ColorKeyframeTrack };