/**
 * SkyBox
 */

import {
	CubeGeometry,
	DRAW_SIDE,
	Mesh,
	ShaderMaterial,
	WEBGL_TEXTURE_TYPE
} from "../../../build/zen3d.module.js";

var SkyBox = function(texture) {
	var geometry = new CubeGeometry(1, 1, 1);

	var material = new ShaderMaterial(SkyBox.SkyBoxShader);
	material.side = DRAW_SIDE.BACK;

	this.material = material;

	if (texture) {
		this.texture = texture;
	}

	Mesh.call(this, geometry, material);

	this.frustumCulled = false;
}

SkyBox.prototype = Object.create(Mesh.prototype);
SkyBox.prototype.constructor = SkyBox;

Object.defineProperties(SkyBox.prototype, {
	level: {
		get: function() {
			return this.material.uniforms.level;
		},
		set: function(val) {
			this.material.uniforms.level = val;
		}
	},
	gamma: {
		get: function() {
			return this.material.defines.GAMMA;
		},
		set: function(val) {
			this.material.defines.GAMMA = val;
			this.material.needsUpdate = true;
		}
	},
	texture: {
		get: function() {
			return this.material.diffuseMap || this.material.cubeMap;
		},
		set: function(val) {
			if (val.textureType === WEBGL_TEXTURE_TYPE.TEXTURE_CUBE_MAP) {
				this.material.cubeMap = val;
				this.material.defines['PANORAMA'] = false;
			} else {
				this.material.diffuseMap = val;
				this.material.defines['PANORAMA'] = "";
			}
			val.addEventListener("onload", () => this.material.needsUpdate = true);
			this.material.needsUpdate = true;
		}
	}
});

SkyBox.SkyBoxShader = {

	defines: {
		"GAMMA": false,
		"PANORAMA": false
	},

	uniforms: {
		"level": 0.
	},

	vertexShader: [
		"#include <common_vert>",
		"varying vec3 v_ModelPos;",
		"void main() {",
		"	v_ModelPos = (u_Model * vec4(a_Position, 0.0)).xyz;",
		"	gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);",
		"	gl_Position.z = gl_Position.w;", // set z to camera.far
		"}"
	].join("\n"),

	fragmentShader: [
		"#include <common_frag>",

		"#ifdef PANORAMA",
		"	uniform sampler2D diffuseMap;",
		"#else",
		"	uniform samplerCube cubeMap;",
		"#endif",

		"uniform float level;",
		"varying vec3 v_ModelPos;",

		"void main() {",

		"	#include <begin_frag>",

		"	vec3 V = normalize(v_ModelPos);",

		"	#ifdef PANORAMA",

		"		float phi = acos(V.y);",
		// consistent with cubemap.
		// atan(y, x) is same with atan2 ?
		"		float theta = atan(V.x, V.z) + PI * 0.5;",
		"		vec2 uv = vec2(theta / 2.0 / PI, -phi / PI);",

		"		#ifdef TEXTURE_LOD_EXT",
		"			outColor *= mapTexelToLinear(texture2DLodEXT(diffuseMap, fract(uv), level));",
		"		#else",
		"			outColor *= mapTexelToLinear(texture2D(diffuseMap, fract(uv), level));",
		"		#endif",

		"	#else",

		"		#ifdef TEXTURE_LOD_EXT",
		"			outColor *= mapTexelToLinear(textureCubeLodEXT(cubeMap, V, level));",
		"		#else",
		"			outColor *= mapTexelToLinear(textureCube(cubeMap, V, level));",
		"		#endif",

		"	#endif",

		"	#include <end_frag>",
		"	#ifdef GAMMA",
		"		#include <encodings_frag>",
		"	#endif",
		"}"
	].join("\n")

};

export { SkyBox };