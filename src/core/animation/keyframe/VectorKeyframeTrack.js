import {KeyframeTrack} from './KeyframeTrack.js';

/**
 * VectorKeyframeTrack
 * used for vector property track
 */
function VectorKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

VectorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: VectorKeyframeTrack,
    
    valueTypeName: 'vector'

});

export {VectorKeyframeTrack};