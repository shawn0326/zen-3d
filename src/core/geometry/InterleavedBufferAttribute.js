(function() {

    // imports
    var generateUUID = zen3d.generateUUID;

    function InterleavedBufferAttribute(interleavedBuffer, size, offset, normalized) {
        this.uuid = generateUUID();

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

    // exports
    zen3d.InterleavedBufferAttribute = InterleavedBufferAttribute;

})();