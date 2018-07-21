import {KeyframeTrack} from './KeyframeTrack.js';

/**
 * StringKeyframeTrack
 * used for boolean property track
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

export {StringKeyframeTrack};