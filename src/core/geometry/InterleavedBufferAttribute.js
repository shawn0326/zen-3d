(function() {
    var InterleavedBufferAttribute = function(interleavedBuffer, size, offset, normalized) {
        this.uuid = zen3d.generateUUID();

        this.data = interleavedBuffer;
        this.size = size;
        this.offset = offset;

        this.normalized = normalized === true;
    }

    InterleavedBufferAttribute.prototype.isInterleavedBufferAttribute = true;

    Object.defineProperties(InterleavedBufferAttribute.prototype, {
        count: {
            get: function() {
                return this.data.count;
            }
        },
        array: {
            get: function() {
                return this.data.array;
            }
        }
    });

    zen3d.InterleavedBufferAttribute = InterleavedBufferAttribute;
})();