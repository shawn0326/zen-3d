import {KeyframeTrack} from './KeyframeTrack.js';

/**
 * NumberKeyframeTrack
 * used for vector property track
 */
function NumberKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

NumberKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: NumberKeyframeTrack,
    
    valueTypeName: 'number'

});

export {NumberKeyframeTrack};