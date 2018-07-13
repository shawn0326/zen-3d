(function() {

    // imports
    var WEBGL_ATTRIBUTE_TYPE = zen3d.WEBGL_ATTRIBUTE_TYPE;

    function WebGLAttribute(gl, program, attributeData) {
        this.gl = gl;

        this.name = attributeData.name;

        // WEBGL_ATTRIBUTE_TYPE
        this.type = attributeData.type;

        this.size = attributeData.size;

        this.location = gl.getAttribLocation(program, this.name);

        this.count = 0;
        this.initCount(gl);

        this.format = gl.FLOAT;
        this.initFormat(gl);
    }

    WebGLAttribute.prototype = Object.assign(WebGLAttribute.prototype, {

        initCount: function(gl) {
            var type = this.type;
    
            switch (type) {
                case WEBGL_ATTRIBUTE_TYPE.FLOAT:
                case WEBGL_ATTRIBUTE_TYPE.BYTE:
                case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                    this.count = 1;
                    break;
                case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                    this.count = 2;
                    break;
                case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                    this.count = 3;
                    break;
                case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                    this.count = 4;
                    break;
            }
        },

        initFormat: function(gl) {
            var type = this.type;
    
            switch (type) {
                case WEBGL_ATTRIBUTE_TYPE.FLOAT:
                case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                    this.format = gl.FLOAT;
                    break;
                case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                    this.format = gl.UNSIGNED_BYTE;
                    break;
                case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                    this.format = gl.UNSIGNED_SHORT;
                    break;
                case WEBGL_ATTRIBUTE_TYPE.BYTE:
                    this.format = gl.BYTE;
                    break;
            }
        }

    });

    // exports
    zen3d.WebGLAttribute = WebGLAttribute;

})();