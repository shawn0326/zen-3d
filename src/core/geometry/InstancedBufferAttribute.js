import { BufferAttribute }  from './BufferAttribute.js';

/**
 * An instanced version of {@link zen3d.BufferAttribute}.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.BufferAttribute
 * @param {TypedArray} array - Used to instantiate the buffer.
 * @param {Integer} size - the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3.
 * @param {boolean} [normalized=false] - Indicates how the underlying data in the buffer maps to the values in the GLSL code. For instance, if array is an instance of UInt16Array, and normalized is true, the values 0 - +65535 in the array data will be mapped to 0.0f - +1.0f in the GLSL attribute. An Int16Array (signed) would map from -32767 - +32767 to -1.0f - +1.0f. If normalized is false, the values will be converted to floats which contain the exact value, i.e. 32767 becomes 32767.0f.
 * @param {Integer} [meshPerAttribute=1]
 */
function InstancedBufferAttribute(array, itemSize, normalized, meshPerAttribute) {

    BufferAttribute.call(this, array, itemSize, normalized);

    /**
     * @type {Integer}
     */
    this.meshPerAttribute = meshPerAttribute || 1;

}

InstancedBufferAttribute.prototype = Object.assign(Object.create(BufferAttribute.prototype), /** @lends zen3d.InstancedBufferAttribute.prototype */{

    constructor: InstancedBufferAttribute,

    /**
     * @readonly
     * @type {boolean}
     * @default true
     */
    isInstancedBufferAttribute: true

});

export { InstancedBufferAttribute };