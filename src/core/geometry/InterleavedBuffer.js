import { generateUUID } from '../base.js';

/**
 * "Interleaved" means that multiple attributes, possibly of different types, (e.g., position, normal, uv, color) are packed into a single array buffer.
 * An introduction into interleaved arrays can be found here: {@link https://blog.tojicode.com/2011/05/interleaved-array-basics.html Interleaved array basics}.
 * @constructor
 * @memberof zen3d
 * @param {TypedArray} array -- A typed array with a shared buffer. Stores the geometry data.
 * @param {Integer} stride -- The number of typed-array elements per vertex.
 */
function InterleavedBuffer(array, stride) {

    /**
     * UUID of this InterleavedBuffer instance.
     * This gets automatically assigned, so this shouldn't be edited.
     * @type {string}
     */
    this.uuid = generateUUID();

    /**
     * A typed array with a shared buffer.
     * Stores the geometry data.
     * @type {TypedArray}
     */
    this.array = array;

    /**
     * The number of typed-array elements per vertex.
     * @type {Integer}
     */
    this.stride = stride;

    /**
     * Gives the total number of elements in the array.
     * @type {Integer}
     */
    this.count = array !== undefined ? array.length / stride : 0;

    /**
     * @type {boolean}
     * @default false
     */
    this.dynamic = false;

    /**
     * Object containing offset and count.
     * @type {Object}
     * @default { offset: 0, count: - 1 }
     */
    this.updateRange = { offset: 0, count: -1 };

    /**
     * A version number, incremented every time the data is changed.
     * @type {Integer}
     * @default 0
     */
    this.version = 0;

}

Object.assign(InterleavedBuffer.prototype, /** @lends zen3d.InterleavedBuffer.prototype */{

    /**
     * @param {TypedArray} array
     */
    setArray: function(array) {
        this.count = array !== undefined ? array.length / this.stride : 0;
        this.array = array;
    }

});

export { InterleavedBuffer };