import {KeyframeTrack} from './KeyframeTrack.js';

/**
 * BooleanKeyframeTrack
 * used for boolean property track
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

export {BooleanKeyframeTrack};