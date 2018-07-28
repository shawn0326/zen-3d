/**
 * Color Shader
 */
zen3d.ColorShader = {

    uniforms: {

        specular: [1, 1, 1],
        shininess: 30

    },

    vertexShader: [
        "#include <common_vert>",
        "#include <uv_pars_vert>",
        "#include <color_pars_vert>",
        "#include <envMap_pars_vert>",
        "#include <skinning_pars_vert>",
        "void main() {",
            "#include <begin_vert>",
            "#include <skinning_vert>",
            "#include <pvm_vert>",
            "#include <uv_vert>",
            "#include <color_vert>",
        "}"
    ].join( "\n" ),

    fragmentShader: [

        "uniform vec3 u_Color;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",

        "#include <uv_pars_frag>",
        "#include <diffuseMap_pars_frag>",
        
        "float vec3_to_float( vec3 data ) {",

		    "const float unit = 255.0/256.0;",
		    "highp float compressed = fract( data.x * unit ) + floor( data.y * unit * 255.0 ) + floor( data.z * unit * 255.0 ) * 255.0;",
		    "return compressed;",

		"}",

        "void main() {",

            "vec4 outColor = vec4( u_Color, 1.0 );",
            "vec3 emissiveColor = emissive;",
            "vec3 specularColor = specular;",

            "#include <diffuseMap_frag>",
            
            "vec4 packedColor;",
            "packedColor.x = vec3_to_float( outColor.rgb );",
            "packedColor.y = vec3_to_float( emissiveColor );",
            "packedColor.z = vec3_to_float( specularColor );",
            "packedColor.w = shininess;",

            "gl_FragColor = packedColor;",

        "}"

    ].join( "\n" )

};