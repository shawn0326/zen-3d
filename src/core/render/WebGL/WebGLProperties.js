(function() {
    var WebGLProperties = function() {
        this.properties = {};
    }

    WebGLProperties.prototype.get = function(object) {
        var uuid = object.uuid;
        var map = this.properties[uuid];
        if (map === undefined) {
            map = {};
            this.properties[uuid] = map;
        }
        return map;
    }

    WebGLProperties.prototype.delete = function(object) {
        delete this.properties[object.uuid];
    }

    WebGLProperties.prototype.clear = function() {
        this.properties = {};
    }

    zen3d.WebGLProperties = WebGLProperties;
})();