/**
 * Base class for property track.
 * @constructor
 * @memberof zen3d
 * @abstract
 * @param {zen3d.Object3D} target
 * @param {string} propertyPath
 * @param {Array} times
 * @param {Array} values
 * @param {Boolean} interpolant
 */
function KeyframeTrack(target, propertyPath, times, values, interpolant) {

    this.target = target;
    this.propertyPath = propertyPath;

    this.name = this.target.uuid + "." + propertyPath;

    this.times = times;
    this.values = values;

    this.valueSize = values.length / times.length;

    this.interpolant = (interpolant === undefined) ? true : interpolant;

}

Object.assign(KeyframeTrack.prototype, {

    _getLastTimeIndex: function(t) {
        var lastTimeIndex = 0;
        var i, l = this.times.length;
        for (i = 0; i < l; i++) {
            if (t >= this.times[i]) {
                lastTimeIndex = i;
            }
        }
        return lastTimeIndex;
    },

    getValue: function(t, outBuffer) {

        var index = this._getLastTimeIndex(t),
            times = this.times,
            values = this.values,
            valueSize = this.valueSize;

        var key1 = times[index],
            key2 = times[index + 1],
            value1, value2;

        for (var i = 0; i < valueSize; i++) {

            value1 = values[index * valueSize + i];
            value2 = values[(index + 1) * valueSize + i];

            if (this.interpolant) {

                if (value1 !== undefined && value2 !== undefined) {
                    var ratio = (t - key1) / (key2 - key1);
                    outBuffer[i] = value1 * (1 - ratio) + value2 * ratio;
                } else {
                    outBuffer[i] = value1;
                }

            } else {
                outBuffer[i] = value1;
            }

        }

    }

});

export { KeyframeTrack };