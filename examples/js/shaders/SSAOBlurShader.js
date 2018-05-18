zen3d.SSAOBlurShader = {

    defines: {
        "NORMALTEX_ENABLED": 1,
		"DEPTHTEX_ENABLED": 1,
		'DEPTH_PACKING': 0
    },

    uniforms: {
		'tDiffuse': null,
		'textureSize': [512, 512],
		'direction': 0, // 0 horizontal, 1 vertical
		'blurSize': 1,
		'normalTex': null,
		'depthTex': null,
		'projection': new Float32Array(16),
        'viewInverseTranspose': new Float32Array(16),
		'depthRange': 0.05
	},

    vertexShader: [

        "attribute vec3 a_Position;",
        "attribute vec2 a_Uv;",

        "uniform mat4 u_Projection;",
        "uniform mat4 u_View;",
        "uniform mat4 u_Model;",

		"varying vec2 v_Uv;",

		"void main() {",

			"v_Uv = a_Uv;",
			"gl_Position = u_Projection * u_View * u_Model * vec4( a_Position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [
		"#include <packing>",

		"varying vec2 v_Uv;",

        "uniform sampler2D tDiffuse;",

		"uniform vec2 textureSize;",

        // 0 horizontal, 1 vertical
		"uniform int direction;",

		"uniform float blurSize;",

		"uniform sampler2D depthTex;",
		
		"uniform sampler2D normalTex;",

        "uniform mat4 projection;",

        "uniform mat4 viewInverseTranspose;",

        "uniform float depthRange;",

        "float getDepth( const in vec2 screenPosition ) {",
			"#if DEPTH_PACKING == 1",
				"return unpackRGBAToDepth( texture2D( depthTex, screenPosition ) );",
			"#else",
				"return texture2D( depthTex, screenPosition ).r;",
			"#endif",
        "}",

        "vec3 getViewNormal( const in vec2 screenPosition ) {",
            "vec3 normal = texture2D( normalTex, screenPosition ).xyz * 2.0 - 1.0;",
            // Convert to view space
			"return (viewInverseTranspose * vec4(normal, 0.0)).xyz;",
		"}",

        "float getLinearDepth(vec2 coord) {",
            "float depth = getDepth(coord) * 2.0 - 1.0;",
            "return projection[3][2] / (depth * projection[2][3] - projection[2][2]);",
        "}",

		"void main() {",

			"float kernel[5];",
			"kernel[0] = 0.122581;",
			"kernel[1] = 0.233062;",
			"kernel[2] = 0.288713;",
			"kernel[3] = 0.233062;",
			"kernel[4] = 0.122581;",

			"vec2 off = vec2(0.0);",
			"if (direction == 0) {",
				"off[0] = blurSize / textureSize.x;",
			"} else {",
				"off[1] = blurSize / textureSize.y;",
			"}",

			"float sum = 0.0;",
			"float weightAll = 0.0;",

			"#if NORMALTEX_ENABLED == 1",
				"vec3 centerNormal = getViewNormal(v_Uv);",
			"#endif",
			"#if DEPTHTEX_ENABLED == 1",
				"float centerDepth = getLinearDepth(v_Uv);",
			"#endif",

			"for (int i = 0; i < 5; i++) {",
				"vec2 coord = clamp(v_Uv + vec2(float(i) - 2.0) * off, vec2(0.0), vec2(1.0));",
				"float w = kernel[i];",

				"#if NORMALTEX_ENABLED == 1",
					"vec3 normal = getViewNormal(coord);",
					"w *= clamp(dot(normal, centerNormal), 0.0, 1.0);",
				"#endif",
				"#if DEPTHTEX_ENABLED == 1",
					"float d = getLinearDepth(coord);",
					// PENDING Better equation?
					"w *= (1.0 - smoothstep(abs(centerDepth - d) / depthRange, 0.0, 1.0));",
				"#endif",

				"weightAll += w;",
				"sum += w * texture2D(tDiffuse, coord).r;",
			"}",

			"gl_FragColor = vec4(vec3(sum / weightAll), 1.0);",

		"}"

	].join( "\n" )

};