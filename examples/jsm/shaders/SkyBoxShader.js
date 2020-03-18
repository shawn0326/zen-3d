/**
 * SkyBox Shader
 */



var SkyBoxShader = {

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

export { SkyBoxShader };