import { WEBGL_UNIFORM_TYPE } from '../../const.js';

import { Texture2D } from '../../texture/Texture2D.js';
import { TextureCube } from '../../texture/TextureCube.js';
import { Texture3D } from '../../texture/Texture3D.js';

var emptyTexture = new Texture2D();
var emptyTexture3d = new Texture3D();
var emptyCubeTexture = new TextureCube();

// --- Base for inner nodes (including the root) ---

function UniformContainer() {
	this.seq = [];
	this.map = {};
}

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;

	for (var i = 0, l = a.length; i < l; i++) {
		if (a[i] !== b[i]) return false;
	}

	return true;
}

function copyArray(a, b) {
	for (var i = 0, l = b.length; i < l; i++) {
		a[i] = b[i];
	}
}

// Texture unit allocation

var arrayCacheI32 = [];

function allocTexUnits(glCore, n) {
	var r = arrayCacheI32[n];

	if (r === undefined) {
		r = new Int32Array(n);
		arrayCacheI32[n] = r;
	}

	for (var i = 0; i !== n; ++i) { r[i] = glCore.allocTexUnit(); }

	return r;
}

// Helper to pick the right setter for uniform

function generateSetter(uniform, pureArray) {
	var gl = uniform.gl;
	var type = uniform.type;
	var location = uniform.location;
	var cache = uniform.cache;

	switch (type) {
	case WEBGL_UNIFORM_TYPE.FLOAT:
		uniform.setValue = function(value) {
			if (cache[0] === value) return;
			gl.uniform1f(location, value);
			cache[0] = value;
		}
		if (pureArray) {
			uniform.set = function(value) {
				if (arraysEqual(cache, value)) return;
				gl.uniform1fv(location, value);
				copyArray(cache, value);
			}
		} else {
			uniform.set = uniform.setValue;
		}
		break;
	case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
	case WEBGL_UNIFORM_TYPE.SAMPLER_2D_SHADOW:
		uniform.setValue = function(value, glCore) {
			var unit = glCore.allocTexUnit();
			glCore.texture.setTexture2D(value || emptyTexture, unit);
			if (cache[0] === unit) return;
			gl.uniform1i(location, unit);
			cache[0] = unit;
		}
		if (pureArray) {
			uniform.set = function(value, glCore) {
				var n = value.length;
				var units = allocTexUnits(glCore, n);
				for (var i = 0; i !== n; ++i) {
					glCore.texture.setTexture2D(value[i] || emptyTexture, units[i]);
				}
				if (arraysEqual(cache, units)) return;
				gl.uniform1iv(location, units);
				copyArray(cache, units);
			}
		} else {
			uniform.set = uniform.setValue;
		}
		break;
	case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
	case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE_SHADOW:
		uniform.setValue = function(value, glCore) {
			var unit = glCore.allocTexUnit();
			glCore.texture.setTextureCube(value || emptyCubeTexture, unit);
			if (cache[0] === unit) return;
			gl.uniform1i(location, unit);
			cache[0] = unit;
		}
		if (pureArray) {
			uniform.set = function(value, glCore) {
				var n = value.length;
				var units = allocTexUnits(glCore, n);
				for (var i = 0; i !== n; ++i) {
					glCore.texture.setTextureCube(value[i] || emptyCubeTexture, units[i]);
				}
				if (arraysEqual(cache, units)) return;
				gl.uniform1iv(location, units);
				copyArray(cache, units);
			}
		} else {
			uniform.set = uniform.setValue;
		}
		break;
	case WEBGL_UNIFORM_TYPE.SAMPLER_3D:
		uniform.setValue = function(value, glCore) {
			var unit = glCore.allocTexUnit();
			glCore.texture.setTexture3D(value || emptyTexture3d, unit);
			if (cache[0] === unit) return;
			gl.uniform1i(location, unit);
			cache[0] = unit;
		}
		if (pureArray) {
			uniform.set = function(value, glCore) {
				var n = value.length;
				var units = allocTexUnits(glCore, n);
				for (var i = 0; i !== n; ++i) {
					glCore.texture.setTexture3D(value[i] || emptyTexture3d, units[i]);
				}
				if (arraysEqual(cache, units)) return;
				gl.uniform1iv(location, units);
				copyArray(cache, units);
			}
		} else {
			uniform.set = uniform.setValue;
		}
		break;
	case WEBGL_UNIFORM_TYPE.BOOL:
	case WEBGL_UNIFORM_TYPE.INT:
		uniform.setValue = function(value) {
			if (cache[0] === value) return;
			gl.uniform1i(location, value);
			cache[0] = value;
		}
		if (pureArray) {
			uniform.set = function(value) {
				if (arraysEqual(cache, value)) return;
				gl.uniform1iv(location, value);
				copyArray(cache, value);
			}
		} else {
			uniform.set = uniform.setValue;
		}
		break;
	case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
		uniform.setValue = function(p1, p2) {
			if (cache[0] !== p1 || cache[1] !== p2) {
				gl.uniform2f(location, p1, p2);
				cache[0] = p1;
				cache[1] = p2;
			}
		}
		uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniform2fv(location, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
	case WEBGL_UNIFORM_TYPE.INT_VEC2:
		uniform.setValue = function(p1, p2) {
			if (cache[0] !== p1 || cache[1] !== p2) {
				gl.uniform2i(location, p1, p2);
				cache[0] = p1;
				cache[1] = p2;
			}
		}
		uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniform2iv(location, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
		uniform.setValue = function(p1, p2, p3) {
			if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3) {
				gl.uniform3f(location, p1, p2, p3);
				cache[0] = p1;
				cache[1] = p2;
				cache[2] = p3;
			}
		}
		uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniform3fv(location, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
	case WEBGL_UNIFORM_TYPE.INT_VEC3:
		uniform.setValue = function(p1, p2, p3) {
			if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3) {
				gl.uniform3i(location, p1, p2, p3);
				cache[0] = p1;
				cache[1] = p2;
				cache[2] = p3;
			}
		}
		uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniform3iv(location, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
		uniform.setValue = function(p1, p2, p3, p4) {
			if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3 || cache[3] !== p4) {
				gl.uniform4f(location, p1, p2, p3, p4);
				cache[0] = p1;
				cache[1] = p2;
				cache[2] = p3;
				cache[3] = p4;
			}
		}
		uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniform4fv(location, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
	case WEBGL_UNIFORM_TYPE.INT_VEC4:
		uniform.setValue = function(p1, p2, p3, p4) {
			if (cache[0] !== p1 || cache[1] !== p2 || cache[2] !== p3 || cache[3] !== p4) {
				gl.uniform4i(location, p1, p2, p3, p4);
				cache[0] = p1;
				cache[1] = p2;
				cache[2] = p3;
				cache[3] = p4;
			}
		}
		uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniform4iv(location, value);
			copyArray(cache, value);
		}
		break;

	case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
		uniform.setValue = uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniformMatrix2fv(location, false, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
		uniform.setValue = uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniformMatrix3fv(location, false, value);
			copyArray(cache, value);
		}
		break;
	case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
		uniform.setValue = uniform.set = function(value) {
			if (arraysEqual(cache, value)) return;
			gl.uniformMatrix4fv(location, false, value);
			copyArray(cache, value);
		}
		break;
	}
}

// --- Uniform Classes ---

function SingleUniform(gl, id, activeInfo, location) {
	this.gl = gl;

	this.id = id;

	// WEBGL_UNIFORM_TYPE
	this.type = activeInfo.type;

	// this.size = activeInfo.size; // always be 1

	this.location = location;

	this.setValue = undefined;
	this.set = undefined;
	this.cache = [];

	generateSetter(this);
}

function PureArrayUniform(gl, id, activeInfo, location) {
	this.gl = gl;

	this.id = id;

	// WEBGL_UNIFORM_TYPE
	this.type = activeInfo.type;

	this.size = activeInfo.size;

	this.location = location;

	this.setValue = undefined;
	this.set = undefined;
	this.cache = [];

	generateSetter(this, true);
}

function StructuredUniform(id) {
	this.id = id;

	UniformContainer.call(this); // mix-in
}

StructuredUniform.prototype.set = function (value, glCore) {
	var seq = this.seq;

	for (var i = 0, n = seq.length; i !== n; ++i) {
		var u = seq[i];
		u.set(value[u.id], glCore);
	}
};

// --- Top-level ---

// Parser - builds up the property tree from the path strings

var RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;

// extracts
// 	- the identifier (member name or array index)
//  - followed by an optional right bracket (found when array index)
//  - followed by an optional left bracket or dot (type of subscript)
//
// Note: These portions can be read in a non-overlapping fashion and
// allow straightforward parsing of the hierarchy that WebGL encodes
// in the uniform names.

function addUniform(container, uniformObject) {
	container.seq.push(uniformObject);
	container.map[uniformObject.id] = uniformObject;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveUniform
function parseUniform(gl, activeInfo, location, container) {
	var path = activeInfo.name,
		pathLength = path.length;

	// reset RegExp object, because of the early exit of a previous run
	RePathPart.lastIndex = 0;

	while (true) {
		var match = RePathPart.exec(path),
			matchEnd = RePathPart.lastIndex,

			id = match[1],
			idIsIndex = match[2] === ']',
			subscript = match[3];

		if (idIsIndex) id = id | 0; // convert to integer

		if (subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength) {
			// bare name or "pure" bottom-level array "[0]" suffix

			addUniform(container, subscript === undefined ?
				new SingleUniform(gl, id, activeInfo, location) :
				new PureArrayUniform(gl, id, activeInfo, location));

			break;
		} else {
			// step into inner node / create it in case it doesn't exist

			var map = container.map, next = map[id];

			if (next === undefined) {
				next = new StructuredUniform(id);
				addUniform(container, next);
			}

			container = next;
		}
	}
}

// Root Container

function WebGLUniforms(gl, program) {
	UniformContainer.call(this);

	var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

	for (var i = 0; i < n; ++i) {
		var info = gl.getActiveUniform(program, i),
			addr = gl.getUniformLocation(program, info.name);

		parseUniform(gl, info, addr, this);
	}
}

WebGLUniforms.prototype.set = function(name, value, glCore) {
	var u = this.map[name];
	if (u !== undefined) u.set(value, glCore);
}

WebGLUniforms.prototype.has = function(name) {
	return !!this.map[name];
}

export { WebGLUniforms };