(function() {
    var InterleavedBuffer = function(array, stride) {
        this.uuid = zen3d.generateUUID();

        this.array = array;
        this.stride = stride;
        this.count = array !== undefined ? array.length / stride : 0;

        this.dynamic = false;
        this.updateRange = { offset: 0, count: - 1 };

        this.version = 0;
    }

    InterleavedBuffer.prototype.setArray = function(array) {
        this.count = array !== undefined ? array.length / this.stride : 0;
        this.array = array;
    }

    zen3d.InterleavedBuffer = InterleavedBuffer;
})();