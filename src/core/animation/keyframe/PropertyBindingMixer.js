import {Quaternion} from '../../math/Quaternion.js';

//// mix functions

function select(buffer, dstOffset, srcOffset, t, stride) {

    if (t >= 0.5) {

        for (var i = 0; i !== stride; ++ i) {

            buffer[dstOffset + i] = buffer[srcOffset + i];

        }

    }

}

function slerp(buffer, dstOffset, srcOffset, t) {

    Quaternion.slerpFlat(buffer, dstOffset, buffer, dstOffset, buffer, srcOffset, t);

}

function lerp(buffer, dstOffset, srcOffset, t, stride) {

    var s = 1 - t;

    for (var i = 0; i !== stride; ++ i) {

        var j = dstOffset + i;

        buffer[j] = buffer[j] * s + buffer[srcOffset + i] * t;

    }

}

/**
 * This holds a reference to a real property in the scene graph; used internally.
 * Binding property and value, mixer for multiple values.
 * @constructor
 * @memberof zen3d
 * @param {Object3D} target
 * @param {string} propertyPath
 * @param {string} typeName - vector/bool/string/quaternion/number/color
 * @param {Integer} valueSize
 */
function PropertyBindingMixer(target, propertyPath, typeName, valueSize) {

    this.target = null;

    this.property = "";

    this.parseBinding(target, propertyPath);

    this.valueSize = valueSize;

    var BufferType = Float64Array;
    var mixFunction;

    switch (typeName) {

        case 'quaternion':
            mixFunction = slerp;
            break;
        case 'string':
        case 'bool':
            BufferType = Array;
            mixFunction = select;
            break;
        default:
            mixFunction = lerp;

    }

    // [result-value | new-value]
    this.buffer = new BufferType(valueSize * 2);

    this._mixBufferFunction = mixFunction;

    this.cumulativeWeight = 0;

    this.referenceCount = 0;
    this.useCount = 0;

}

Object.assign(PropertyBindingMixer.prototype, /** @lends zen3d.PropertyBindingMixer.prototype */{

    parseBinding: function(target, propertyPath) {
        propertyPath = propertyPath.split(".");

        if (propertyPath.length > 1) {
            var property = target[propertyPath[0]];


            for (var index = 1; index < propertyPath.length - 1; index++) {
                property = property[propertyPath[index]];
            }

            this.property = propertyPath[propertyPath.length - 1];
            this.target = property;
        } else {
            this.property = propertyPath[0];
            this.target = target;
        }
    },

    /**
     * Accumulate value.
     * @param {number} weight
     */
    accumulate: function(weight) {

        var buffer = this.buffer,
            stride = this.valueSize,
            offset = stride,

            currentWeight = this.cumulativeWeight;

        if (currentWeight === 0) {

            for (var i = 0; i !== stride; ++i) {

                buffer[offset + i] = buffer[i];

            }

            currentWeight = weight;

        } else {

            currentWeight += weight;
            var mix = weight / currentWeight;
            this._mixBufferFunction(buffer, offset, 0, mix, stride);

        }

        this.cumulativeWeight = currentWeight;

    },

    /**
     * Apply to scene graph.
     */
    apply: function() {

        var buffer = this.buffer,
            offset = this.valueSize,
            weight = this.cumulativeWeight;

        this.cumulativeWeight = 0;

        if (weight < 1) {

            // TODO blend with original value?

        }

        // set value
        if (this.valueSize > 1) {
            this.target[this.property].fromArray(buffer, offset);
        } else {
            this.target[this.property] = buffer[offset];
        }

    }

});

export {PropertyBindingMixer};