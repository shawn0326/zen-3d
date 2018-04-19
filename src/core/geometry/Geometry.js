(function() {
    /**
     * Geometry data
     * @class
     */
    var Geometry = function() {
        Geometry.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.attributes = {};
        this.index = null;

        this.usageType = zen3d.WEBGL_BUFFER_USAGE.STATIC_DRAW;

        this.boundingBox = new zen3d.Box3();

        this.boundingSphere = new zen3d.Sphere();

        // if part dirty, update part of buffers
        this.dirtyRange = {enable: false, start: 0, count: 0};

        this.groups = [];
    }

    zen3d.inherit(Geometry, zen3d.EventDispatcher);

    Geometry.prototype.addAttribute = function(name, attribute) {
        this.attributes[name] = attribute;
    }

    Geometry.prototype.getAttribute = function(name) {
        return this.attributes[name];
    }

    Geometry.prototype.removeAttribute = function(name) {
        delete this.attributes[name];
    }

    Geometry.prototype.setIndex = function(index) {
        if(Array.isArray(index)) {
            this.index = new zen3d.BufferAttribute(new Uint16Array( index ), 1);
        } else {
            this.index = index;
        }
    }

    Geometry.prototype.addGroup = function(start, count, materialIndex) {
        this.groups.push({
			start: start,
			count: count,
			materialIndex: materialIndex !== undefined ? materialIndex : 0
		});
    }

    Geometry.prototype.clearGroups = function() {
        this.groups = [];
    }

    Geometry.prototype.computeBoundingBox = function() {
        var position = this.attributes["a_Position"];
        if(position.isInterleavedBufferAttribute) {
            var data = position.data;
            this.boundingBox.setFromArray(data.array, data.stride);
        } else {
            this.boundingBox.setFromArray(position.array, position.size);
        }
    }

    Geometry.prototype.computeBoundingSphere = function() {
        var position = this.attributes["a_Position"];
        if(position.isInterleavedBufferAttribute) {
            var data = position.data;
            this.boundingSphere.setFromArray(data.array, data.stride);
        } else {
            this.boundingSphere.setFromArray(position.array, position.size);
        }
    }

    Geometry.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});
    }

    zen3d.Geometry = Geometry;
})();
