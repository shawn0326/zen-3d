import {generateUUID} from '../base.js';

/**
 * This class stores data for an attribute (such as vertex positions, face indices, normals, colors, UVs, and any custom attributes ) associated with a Geometry, which allows for more efficient passing of data to the GPU.
 * Data is stored as vectors of any length (defined by itemSize).
 * @constructor
 * @memberof zen3d
 * @param {TypedArray} array - Used to instantiate the buffer.
 * @param {Integer} size - the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3.
 * @param {boolean} [normalized=false] - Indicates how the underlying data in the buffer maps to the values in the GLSL code. For instance, if array is an instance of UInt16Array, and normalized is true, the values 0 - +65535 in the array data will be mapped to 0.0f - +1.0f in the GLSL attribute. An Int16Array (signed) would map from -32767 - +32767 to -1.0f - +1.0f. If normalized is false, the values will be converted to floats which contain the exact value, i.e. 32767 becomes 32767.0f.
 */
function BufferAttribute(array, size, normalized) {

    /**
     * UUID of this buffer attribute instance. 
     * This gets automatically assigned, so this shouldn't be edited.
     * @type {string}
     */
    this.uuid = generateUUID();

    /**
     * The array holding data stored in the buffer.
     * @type {TypedArray} 
     */
    this.array = array;

    /**
     * The length of vectors that are being stored in the array.
     * @type {Integer} 
     */
    this.size = size;

    /**
     * Stores the array's length divided by the size.
     * If the buffer is storing a 3-component vector (such as a position, normal, or color), then this will count the number of such vectors stored.
     * @type {Integer}  
     */
    this.count = array !== undefined ? array.length / size : 0;

    /**
     * Indicates how the underlying data in the buffer maps to the values in the GLSL shader code.
     * See the constructor above for details.
     * @type {boolean}  
     */
    this.normalized = normalized === true;

    /**
     * Whether the buffer is dynamic or not.
     * If false, the GPU is informed that contents of the buffer are likely to be used often and not change often. 
     * This corresponds to the gl.STATIC_DRAW flag.
     * If true, the GPU is informed that contents of the buffer are likely to be used often and change often. 
     * This corresponds to the gl.DYNAMIC_DRAW flag. 
     * @type {boolean}
     * @default false
     */
    this.dynamic = false;

    /**
     * Object containing:
     * offset: Default is 0. Position at whcih to start update.
     * count: Default is -1, which means don't use update ranges. 
     * This can be used to only update some components of stored vectors (for example, just the component related to color). 
     */
    this.updateRange = { offset: 0, count: - 1 };

    /**
     * A version number, incremented every time the data changes.
     * @type {Integer}
     * @default 0
     */
    this.version = 0;

}

Object.assign(BufferAttribute.prototype, /** @lends zen3d.BufferAttribute.prototype */{

    /**
     * Array to the TypedArray passed in here.
     * After setting the array, {@link zen3d.BufferAttribute#version} should be incremented.
     * @param {TypedArray} array
     */
    setArray: function(array) {
        this.count = array !== undefined ? array.length / this.size : 0;
        this.array = array;
    }

});

export {BufferAttribute};