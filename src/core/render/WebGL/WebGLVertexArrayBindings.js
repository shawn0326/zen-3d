export class WebGLVertexArrayBindings {

	constructor(gl, properties, capabilities) {
		this._gl = gl;
		this._properties = properties;
		this._capabilities = capabilities;

		this._isWebGL2 = capabilities.version >= 2;
		this._vaoExt = capabilities.getExtension("OES_vertex_array_object");

		this._currentGeometryProgram = "";
	}

	setup(object, geometry, program) {
		var geometryProperties = this._properties.get(geometry);

		if (object.morphTargetInfluences) {
			this._setupVertexAttributes(program, geometry);
			this._currentGeometryProgram = "";
		} else if (this._isWebGL2 || this._vaoExt) { // use VAO
			var vao;
			if (!geometryProperties._vaos[program.id]) {
				vao = geometryProperties._vaos[program.id] = { version: -1, object: this._createVAO() };
			} else {
				vao = geometryProperties._vaos[program.id];
			}
			this._bindVAO(vao.object);
			if (vao.version !== geometry.version) {
				this._setupVertexAttributes(program, geometry);
				vao.version = geometry.version;
			}
		} else {
			var geometryProgram = program.id + "_" + geometry.id + "_" + geometry.version;
			if (geometryProgram !== this._currentGeometryProgram) {
				this._setupVertexAttributes(program, geometry);
				this._currentGeometryProgram = geometryProgram;
			}
		}
	}

	_createVAO() {
		if (this._isWebGL2) {
			return this._gl.createVertexArray();
		} else if (this._vaoExt) {
			return this._vaoExt.createVertexArrayOES();
		}
		return null;
	}

	_bindVAO(vao) {
		if (this._isWebGL2) {
			return this._gl.bindVertexArray(vao);
		} else if (this._vaoExt) {
			return this._vaoExt.bindVertexArrayOES(vao);
		}
	}

	resetBinding() {
		if (this._isWebGL2) {
			this._gl.bindVertexArray(null);
		} else if (this._vaoExt) {
			this._vaoExt.bindVertexArrayOES(null);
		}
	}

	disposeVAO(vao) {
		if (this._isWebGL2) {
			this._gl.deleteVertexArray(vao);
		} else if (this._vaoExt) {
			this._vaoExt.deleteVertexArrayOES(vao);
		}
	}

	_setupVertexAttributes(program, geometry) {
		var gl = this._gl;
		var isWebGL2 = this._isWebGL2;
		var attributes = program.attributes;
		var properties = this._properties;
		var capabilities = this._capabilities;

		var geometryProperties = properties.get(geometry);
		geometryProperties._maxInstancedCount = Infinity;

		for (var key in attributes) {
			var programAttribute = attributes[key];
			var geometryAttribute = geometry.getAttribute(key);
			if (geometryAttribute) {
				var normalized = geometryAttribute.normalized;
				var size = geometryAttribute.size;
				if (programAttribute.count !== size) {
					console.warn("WebGLVertexArrayBindings: attribute " + key + " size not match! " + programAttribute.count + " : " + size);
				}

				var attribute;
				if (geometryAttribute.isInterleavedBufferAttribute) {
					attribute = properties.get(geometryAttribute.data);
				} else {
					attribute = properties.get(geometryAttribute);
				}
				var buffer = attribute.buffer;
				var type = attribute.type;
				if (programAttribute.format !== type) {
					// console.warn("WebGLVertexArrayBindings: attribute " + key + " type not match! " + programAttribute.format + " : " + type);
				}
				var bytesPerElement = attribute.bytesPerElement;

				if (geometryAttribute.isInterleavedBufferAttribute) {
					var data = geometryAttribute.data;
					var stride = data.stride;
					var offset = geometryAttribute.offset;

					gl.enableVertexAttribArray(programAttribute.location);

					if (data && data.isInstancedInterleavedBuffer) {
						if (isWebGL2) {
							gl.vertexAttribDivisor(programAttribute.location, data.meshPerAttribute);
						} else if (capabilities.getExtension('ANGLE_instanced_arrays')) {
							capabilities.getExtension('ANGLE_instanced_arrays').vertexAttribDivisorANGLE(programAttribute.location, data.meshPerAttribute);
						} else {
							console.warn("vertexAttribDivisor not supported");
						}

						geometryProperties._maxInstancedCount = Math.min(geometryProperties._maxInstancedCount, data.meshPerAttribute * data.count);
					}

					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, bytesPerElement * stride, bytesPerElement * offset);
				} else {
					gl.enableVertexAttribArray(programAttribute.location);

					if (geometryAttribute.isInstancedBufferAttribute) {
						if (isWebGL2) {
							gl.vertexAttribDivisor(programAttribute.location, geometryAttribute.meshPerAttribute);
						} else if (capabilities.getExtension('ANGLE_instanced_arrays')) {
							capabilities.getExtension('ANGLE_instanced_arrays').vertexAttribDivisorANGLE(programAttribute.location, geometryAttribute.meshPerAttribute);
						} else {
							console.warn("vertexAttribDivisor not supported");
						}

						geometryProperties._maxInstancedCount = Math.min(geometryProperties._maxInstancedCount, geometryAttribute.meshPerAttribute * geometryAttribute.count);
					}

					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, 0, 0);
				}
			} else {
				// console.warn("WebGLVertexArrayBindings: geometry attribute " + key + " not found!");
			}
		}

		// bind index if could
		if (geometry.index) {
			var indexProperty = properties.get(geometry.index);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexProperty.buffer);
		}
	}

}