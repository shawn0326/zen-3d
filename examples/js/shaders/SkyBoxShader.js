// sky shader

zen3d.SkyBoxShader = {

    uniforms: {
        "level": 4.
    },

    vertexShader: [
        "#include <common_vert>",
        "varying vec3 v_ModelPos;",
        "void main() {",
            "v_ModelPos = (u_Model * vec4(a_Position, 0.0)).xyz;",
            "gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);",
            "gl_Position.z = gl_Position.w;", // set z to camera.far
        "}"
    ].join( "\n" ),

    fragmentShader: [
        "#include <common_frag>",
        "uniform samplerCube cubeMap;",
        "uniform float level;",
        "varying vec3 v_ModelPos;",
        "void main() {",
            "#include <begin_frag>",

            "#ifdef TEXTURE_LOD_EXT",
                "outColor *= textureCubeLodEXT(cubeMap, v_ModelPos, level);",
            "#else",
                "outColor *= textureCube(cubeMap, v_ModelPos, level);",
            "#endif",
            // "outColor = vec4(1., 0., 0., 1.);",
            "#include <end_frag>",
        "}"
    ].join( "\n" )

};