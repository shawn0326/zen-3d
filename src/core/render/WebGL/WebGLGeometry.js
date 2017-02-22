(function() {
    var WebGLGeometry = function(gl, state, properties, capabilities) {
        this.gl = gl;

        this.state = state;

        this.properties = properties;

        this.capabilities = capabilities;
    }

    WebGLGeometry.prototype.setGeometry = function(geometry) {
        var gl = this.gl;
        var state = this.state;

        var geometryProperties = this.properties.get(geometry);

        if(geometry.dirty) {

            if(geometryProperties.__webglVAO === undefined) {
                geometry.addEventListener('dispose', this.onGeometryDispose, this);
                geometryProperties.__webglVAO = gl.createBuffer();
                geometry.dirtyRange.enable = false;
            }

            state.bindBuffer(gl.ARRAY_BUFFER, geometryProperties.__webglVAO);

            // geometry.dirtyRange.enable = false;
            if(geometry.dirtyRange.enable) {
                var vertices = new Float32Array(geometry.verticesArray);
                vertices = vertices.subarray(geometry.dirtyRange.start, geometry.dirtyRange.start + geometry.dirtyRange.count);
                gl.bufferSubData(gl.ARRAY_BUFFER, geometry.dirtyRange.start * 4, vertices)
                geometry.dirtyRange.enable = false;
                geometry.dirtyRange.start = 0;
                geometry.dirtyRange.count = 0;
            } else {
                var vertices = new Float32Array(geometry.verticesArray);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            }

            if(geometry.indicesArray.length > 0) {
                if(geometryProperties.__webglEAO === undefined) {
                    geometryProperties.__webglEAO = gl.createBuffer();
                }

                state.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryProperties.__webglEAO);

                var indices = new Uint16Array(geometry.indicesArray);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            }

            geometry.dirty = false;

            return;
        }

        state.bindBuffer(gl.ARRAY_BUFFER, geometryProperties.__webglVAO);
        if(geometry.indicesArray.length > 0) {
            state.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryProperties.__webglEAO);
        }
    }

    WebGLGeometry.prototype.onGeometryDispose = function(event) {
        var gl = this.gl;
        var geometry = event.target;
        var geometryProperties = this.properties.get(geometry);

        geometry.removeEventListener('dispose', this.onGeometryDispose, this);

        if(geometryProperties.__webglVAO) {
            gl.deleteBuffer(geometryProperties.__webglVAO);
        }

        if(geometryProperties.__webglEAO) {
            gl.deleteBuffer(geometryProperties.__webglEAO);
        }

        this.properties.delete(geometry);
    }

    zen3d.WebGLGeometry = WebGLGeometry;
})();