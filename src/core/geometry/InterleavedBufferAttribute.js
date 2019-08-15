/**
 * @constructor
 * @memberof zen3d
 * @param {zen3d.InterleavedBuffer} interleavedBuffer
 * @param {Integer} size
 * @param {Integer} offset
 * @param {boolean} [normalized=false]
 */
function InterleavedBufferAttribute(interleavedBuffer, size, offset, normalized) {
	/**
     * The InterleavedBuffer instance passed in the constructor.
     * @type {zen3d.InterleavedBuffer}
     */
	this.data = interleavedBuffer;

	/**
     * How many values make up each item.
     * @type {Integer}
     */
	this.size = size;

	/**
     * The offset in the underlying array buffer where an item starts.
     * @type {Integer}
     */
	this.offset = offset;

	/**
     * @type {boolean}
     * @default false
     */
	this.normalized = normalized === true;
}

/**
 * @readonly
 * @type {boolean}
 * @default true
 */
InterleavedBufferAttribute.prototype.isInterleavedBufferAttribute = true;

Object.defineProperties(InterleavedBufferAttribute.prototype, {

	/**
     * The value of data.count.
     * If the buffer is storing a 3-component item (such as a position, normal, or color), then this will count the number of such items stored.
     * @memberof zen3d.InterleavedBufferAttribute#
     * @readonly
     * @type {Integer}
     */
	count: {
		get: function() {
			return this.data.count;
		}
	},

	/**
     * The value of data.array.
     * @memberof zen3d.InterleavedBufferAttribute#
     * @readonly
     * @type {TypedArray}
     */
	array: {
		get: function() {
			return this.data.array;
		}
	}

});

export { InterleavedBufferAttribute };