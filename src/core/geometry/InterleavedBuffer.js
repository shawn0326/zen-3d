(function() {

    // imports
    var generateUUID = zen3d.generateUUID;

    function InterleavedBuffer(array, stride) {
        this.uuid = generateUUID();

        this.array = array;
        this.stride = stride;
        this.count = array !== undefined ? array.length / stride : 0;

        this.dynamic = false;
        this.updateRange = { offset: 0, count: - 1 };

        this.version = 0;
    }

    InterleavedBuffer.prototype = Object.assign(InterleavedBuffer.prototype, {

        setArray: function(array) {
            this.count = array !== undefined ? array.length / this.stride : 0;
            this.array = array;
        }

    });

    // exports
    zen3d.InterleavedBuffer = InterleavedBuffer;

})();