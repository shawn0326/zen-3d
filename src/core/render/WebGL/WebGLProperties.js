function WebGLProperties() {
    this.properties = {};
}

Object.assign(WebGLProperties.prototype, {

    get: function(object) {
        var uuid = object.uuid;
        var map = this.properties[uuid];
        if (map === undefined) {
            map = {};
            this.properties[uuid] = map;
        }
        return map;
    },

    delete: function(object) {
        delete this.properties[object.uuid];
    },

    clear: function() {
        this.properties = {};
    }

});

export {WebGLProperties};