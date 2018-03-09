(function() {
    var BufferAttribute = function(array, size, normalized) {
        this.uuid = zen3d.generateUUID();

        this.array = array;
        this.size = size;
        this.count = array !== undefined ? array.length / size : 0;
        this.normalized = normalized === true;

        this.dynamic = false;
	    this.updateRange = { offset: 0, count: - 1 };

        this.version = 0;
    }

    BufferAttribute.prototype.setArray = function(array) {
        this.count = array !== undefined ? array.length / this.size : 0;
		this.array = array;
    }

    zen3d.BufferAttribute = BufferAttribute;
})();