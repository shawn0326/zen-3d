import {KeyframeTrack} from './KeyframeTrack.js';

/**
 * ColorKeyframeTrack
 * used for vector property track
 */
function ColorKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

ColorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: ColorKeyframeTrack,
    
    valueTypeName: 'color'

});

export {ColorKeyframeTrack};