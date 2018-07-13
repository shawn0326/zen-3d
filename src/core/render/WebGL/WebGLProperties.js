(function() {

    function WebGLProperties() {
        this.properties = {};
    }

    WebGLProperties.prototype = Object.assign(WebGLProperties.prototype, {

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

    // exports
    zen3d.WebGLProperties = WebGLProperties;

})();