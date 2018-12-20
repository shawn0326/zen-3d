import { KeyframeTrack } from './KeyframeTrack.js';

/**
 * Used for vector property track.
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Object3D} target
 * @param {string} propertyPath
 * @param {Array} times
 * @param {Array} values
 * @param {Boolean} interpolant
 */
function VectorKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

VectorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: VectorKeyframeTrack,

    valueTypeName: 'vector'

});

export { VectorKeyframeTrack };