import { WebGLUniforms } from './WebGLUniforms.js';
import { WebGLAttribute } from './WebGLAttribute.js';

function addLineNumbers(string) {
	var lines = string.split('\n');

	for (var i = 0; i < lines.length; i++) {
		lines[i] = (i + 1) + ': ' + lines[i];
	}

	return lines.join('\n');
}

// create a shader
function loadShader(gl, type, source) {
	// create a shader object
	var shader = gl.createShader(type);
	// bind the shader source, source must be string type?
	gl.shaderSource(shader, source);
	// compile shader
	gl.compileShader(shader);
	// if compile failed, log error
	var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!compiled) {
		console.warn("shader not compiled!", gl.getShaderInfoLog(shader), addLineNumbers(source));
	}

	return shader;
}

// create a WebGL program
function createWebGLProgram(gl, vertexShader, fragmentShader) {
	// create a program object
	var program = gl.createProgram();
	// attach shaders to program
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	// link vertex shader and fragment shader
	gl.linkProgram(program);
	// if link failed, log error
	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		console.warn("program not linked!", gl.getProgramInfoLog(program));
	}

	return program;
}

// extract attributes
function extractAttributes(gl, program) {
	var attributes = {};

	var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

	for (var i = 0; i < totalAttributes; i++) {
		var attribData = gl.getActiveAttrib(program, i);
		var name = attribData.name;
		var attribute = new WebGLAttribute(gl, program, attribData);
		attributes[name] = attribute;
	}

	return attributes;
}

var programIdCount = 0;

// WebGL Program Class
function WebGLProgram(gl, vshader, fshader) {
	this.id = programIdCount++;

	this.usedTimes = 1;

	this.code = "";

	this.gl = gl;

	// vertex shader source
	this.vshaderSource = vshader;

	// fragment shader source
	this.fshaderSource = fshader;

	// WebGL vertex shader
	var vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);

	// WebGL fragment shader
	var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);

	// program
	this.program = createWebGLProgram(gl, vertexShader, fragmentShader);

	this.uniforms = new WebGLUniforms(gl, this.program);

	this.attributes = extractAttributes(gl, this.program);

	// here we can delete shaders,
	// according to the documentation: https://www.opengl.org/sdk/docs/man/html/glLinkProgram.xhtml
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
}

WebGLProgram.prototype.dispose = function() {
	this.gl.deleteProgram(this.program);
	this.program = undefined;
}

export { WebGLProgram };