function createBuffer(gl, data, attribute, bufferType) {
    var array = attribute.array;
    var usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    var buffer = gl.createBuffer();

    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, array, usage);

    var type = gl.FLOAT;

    if (array instanceof Float32Array) {
        type = gl.FLOAT;
    } else if (array instanceof Float64Array) {
        console.warn('Unsupported data buffer format: Float64Array.');
    } else if (array instanceof Uint16Array) {
        type = gl.UNSIGNED_SHORT;
    } else if (array instanceof Int16Array) {
        type = gl.SHORT;
    } else if (array instanceof Uint32Array) {
        type = gl.UNSIGNED_INT;
    } else if (array instanceof Int32Array) {
        type = gl.INT;
    } else if (array instanceof Int8Array) {
        type = gl.BYTE;
    } else if (array instanceof Uint8Array) {
        type = gl.UNSIGNED_BYTE;
    }

    data.buffer = buffer;
    data.type = type;
    data.bytesPerElement = array.BYTES_PER_ELEMENT;
    data.version = attribute.version;
}

function updateBuffer(gl, buffer, attribute, bufferType) {
    var array = attribute.array;
    var updateRange = attribute.updateRange;

    gl.bindBuffer(bufferType, buffer);

    if (attribute.dynamic === false) {
        gl.bufferData(bufferType, array, gl.STATIC_DRAW);
    } else if (updateRange.count === -1) {
        // Not using update ranges
        gl.bufferSubData(bufferType, 0, array);
    } else if (updateRange.count === 0) {
        console.error('updateBuffer: dynamic BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.');
    } else {
        gl.bufferSubData(bufferType, updateRange.offset * array.BYTES_PER_ELEMENT,
            array.subarray(updateRange.offset, updateRange.offset + updateRange.count));

        updateRange.count = -1; // reset range
    }
}

function updateAttribute(gl, properties, attribute, bufferType) {
    // if isInterleavedBufferAttribute, get InterleavedBuffer as data.
    // else get BufferAttribute as data
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = properties.get(attribute);

    if (data.buffer === undefined) {
        createBuffer(gl, data, attribute, bufferType);
    } else if (data.version < attribute.version) {
        updateBuffer(gl, data.buffer, attribute, bufferType);
        data.version = attribute.version;
    }
}

function removeAttribute(gl, properties, attribute) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = properties.get(attribute);

    if (data.buffer) {
        gl.deleteBuffer(data.buffer);
    }

    buffers.delete(attribute);
}

function WebGLGeometry(gl, state, properties, capabilities) {
    this.gl = gl;

    this.state = state;

    this.properties = properties;

    this.capabilities = capabilities;
}

Object.assign(WebGLGeometry.prototype, {

    // if need, create webgl buffers; but not bind
    setGeometry: function(geometry) {
        var gl = this.gl;
        var state = this.state;
        var properties = this.properties;

        var geometryProperties = this.properties.get(geometry);
        if (!geometryProperties.created) {
            geometry.addEventListener('dispose', this.onGeometryDispose2, this);
            geometryProperties.created = true;
            geometryProperties._vaos = {};
        }

        if (geometry.index !== null) {
            updateAttribute(gl, properties, geometry.index, gl.ELEMENT_ARRAY_BUFFER);
        }

        for (var name in geometry.attributes) {
            updateAttribute(gl, properties, geometry.attributes[name], gl.ARRAY_BUFFER);
        }

        return geometryProperties;
    },

    onGeometryDispose: function(event) {
        var gl = this.gl;
        var geometry = event.target;
        var geometryProperties = this.properties.get(geometry);

        geometry.removeEventListener('dispose', this.onGeometryDispose, this);

        if (geometry.index !== null) {
            removeAttribute(gl, properties, geometry.index);
        }

        for (var name in geometry.attributes) {
            removeAttribute(gl, properties, geometry.attributes[name]);
        }

        // dispose vaos
        for (var key in geometryProperties._vaos) {
            var vao = geometryProperties[key];
            if (vao) {
                if (this.capabilities.version >= 2) { 
                    gl.deleteVertexArray(vao);
                } else { 
                    gl.deleteVertexArrayOES(vao);
                }
            }
        }
        geometryProperties._vaos = {};
        
        geometryProperties.created = false;

        this.properties.delete(geometry);
    }

});

export {WebGLGeometry};