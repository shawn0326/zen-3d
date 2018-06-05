zen3d.BlendShader = {

    uniforms: {

		"tDiffuse1": null,
		"tDiffuse2": null,
		"opacity1": 1.0,
		"opacity2": 1.0

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

		"uniform float opacity1;",
		"uniform float opacity2;",

		"uniform sampler2D tDiffuse1;",
		"uniform sampler2D tDiffuse2;",

		"varying vec2 v_Uv;",

		"void main() {",

            "vec4 texel = vec4(0.);",
			"texel += texture2D( tDiffuse1, v_Uv ) * opacity1;",
			"texel += texture2D( tDiffuse2, v_Uv ) * opacity2;",
			"gl_FragColor = texel;",

		"}"

    ].join( "\n" )
    
}