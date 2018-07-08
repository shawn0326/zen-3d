(function() {

    // imports
    var EventDispatcher = zen3d.EventDispatcher;
    var generateUUID = zen3d.generateUUID;
    var Box3 = zen3d.Box3;
    var Sphere = zen3d.Sphere;
    var WEBGL_BUFFER_USAGE = zen3d.WEBGL_BUFFER_USAGE;
    var BufferAttribute = zen3d.BufferAttribute;

    /**
     * Geometry data
     * @class
     */
    function Geometry() {
        EventDispatcher.call(this);

        this.uuid = generateUUID();

        this.attributes = {};
        this.index = null;

        this.usageType = WEBGL_BUFFER_USAGE.STATIC_DRAW;

        this.boundingBox = new Box3();

        this.boundingSphere = new Sphere();

        // if part dirty, update part of buffers
        this.dirtyRange = {enable: false, start: 0, count: 0};

        this.groups = [];
    }

    Geometry.prototype = Object.assign(Object.create(EventDispatcher.prototype), {

        constructor: Geometry,

        addAttribute: function(name, attribute) {
            this.attributes[name] = attribute;
        },

        getAttribute: function(name) {
            return this.attributes[name];
        },

        removeAttribute: function(name) {
            delete this.attributes[name];
        },

        setIndex: function(index) {
            if(Array.isArray(index)) {
                this.index = new BufferAttribute(new Uint16Array( index ), 1);
            } else {
                this.index = index;
            }
        },

        addGroup: function(start, count, materialIndex) {
            this.groups.push({
                start: start,
                count: count,
                materialIndex: materialIndex !== undefined ? materialIndex : 0
            });
        },

        clearGroups: function() {
            this.groups = [];
        },

        computeBoundingBox: function() {
            var position = this.attributes["a_Position"] || this.attributes["position"];
            if(position.isInterleavedBufferAttribute) {
                var data = position.data;
                this.boundingBox.setFromArray(data.array, data.stride);
            } else {
                this.boundingBox.setFromArray(position.array, position.size);
            }
        },

        computeBoundingSphere: function() {
            var position = this.attributes["a_Position"] || this.attributes["position"];
            if(position.isInterleavedBufferAttribute) {
                var data = position.data;
                this.boundingSphere.setFromArray(data.array, data.stride);
            } else {
                this.boundingSphere.setFromArray(position.array, position.size);
            }
        },

        dispose: function() {
            this.dispatchEvent({type: 'dispose'});
        }

    });

    // exports
    zen3d.Geometry = Geometry;

})();
