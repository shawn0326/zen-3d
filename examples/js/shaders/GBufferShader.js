(function() {

    var GBufferShaderChunk = {

    };

    zen3d.GBufferShader = {

        normalGlossiness: {

            uniforms: {

                roughness: 0.5

            },

            vertexShader: [

                "#include <common_vert>",

                "#define USE_NORMAL",

                "#include <skinning_pars_vert>",
                "#include <normal_pars_vert>",
                "#include <uv_pars_vert>",
                "varying vec4 vPosition;",
                "void main() {",
                    "#include <uv_vert>",
                    "#include <begin_vert>",
                    "#include <skinning_vert>",
                    "#include <normal_vert>",
                    "#include <pvm_vert>",
                "}"

            ].join( "\n" ),

            fragmentShader: [
        
                "#include <common_frag>",
                "#include <diffuseMap_pars_frag>",

                "#include <uv_pars_frag>",

                "#define USE_NORMAL",

                "#include <packing>",
                "#include <normal_pars_frag>",

                "uniform float roughness;",

                "void main() {",
                    "#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)",
                        "vec4 texelColor = texture2D( texture, v_Uv );",

                        "float alpha = texelColor.a * u_Opacity;",
                        "if(alpha < ALPHATEST) discard;",
                    "#endif",

                    "vec3 normal = normalize(v_Normal);",

                    "vec4 packedNormalRoughness;",
                    "packedNormalRoughness.xyz = normal * 0.5 + 0.5;",
                    "packedNormalRoughness.w = roughness;",
                    
                    "gl_FragColor = packedNormalRoughness;",
                "}"
        
            ].join( "\n" )

        },

        albedoMetalness: {

            uniforms: {
        
                metalness: 0.5
        
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
                "uniform float metalness;",
        
                "#include <uv_pars_frag>",
                "#include <diffuseMap_pars_frag>",
        
                "void main() {",
        
                    "vec4 outColor = vec4( u_Color, 1.0 );",
                    "#include <diffuseMap_frag>",
                    "vec4 diffuseColor = outColor.xyz * outColor.a;",

                    "gl_FragColor = vec4( diffuseColor.xyz, metalness );",
        
                "}"
        
            ].join( "\n" )

        }


    };

})();