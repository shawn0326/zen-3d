import {InterleavedBuffer} from './InterleavedBuffer.js';

/**
 * An instanced version of {@link zen3d.InterleavedBuffer}.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.InterleavedBuffer
 * @param {TypedArray} array -- A typed array with a shared buffer. Stores the geometry data.
 * @param {Integer} stride -- The number of typed-array elements per vertex.
 * @param {Integer} [meshPerAttribute=1]
 */
function InstancedInterleavedBuffer(array, itemSize, meshPerAttribute) {

    InterleavedBuffer.call(this, array, itemSize);

    /**
     * @type {Integer}
     */
    this.meshPerAttribute = meshPerAttribute || 1;

}

InstancedInterleavedBuffer.prototype = Object.assign(Object.create(InterleavedBuffer.prototype), /** @lends zen3d.InstancedInterleavedBuffer.prototype */{

    constructor: InstancedInterleavedBuffer,

    /**
     * @readonly
     * @type {boolean}
     * @default true
     */
    isInstancedInterleavedBuffer: true

});

export {InstancedInterleavedBuffer};