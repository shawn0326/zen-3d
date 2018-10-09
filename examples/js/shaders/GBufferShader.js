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

                "#ifdef USE_ROUGHNESSMAP",
                    "uniform sampler2D roughnessMap;",
                "#endif",

                "void main() {",
                    "#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)",
                        "vec4 texelColor = texture2D( diffuseMap, v_Uv );",

                        "float alpha = texelColor.a * u_Opacity;",
                        "if(alpha < ALPHATEST) discard;",
                    "#endif",

                    "vec3 normal = normalize(v_Normal);",

                    "float roughnessFactor = roughness;",
                    "#ifdef USE_ROUGHNESSMAP",
                        "roughnessFactor *= texture2D( roughnessMap, v_Uv ).g;",
                    "#endif",

                    "vec4 packedNormalGlossiness;",
                    "packedNormalGlossiness.xyz = normal * 0.5 + 0.5;",
                    "packedNormalGlossiness.w = clamp(1. - roughnessFactor, 0., 1.);",
                    
                    "gl_FragColor = packedNormalGlossiness;",
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

                "#ifdef USE_METALNESSMAP",
                    "uniform sampler2D metalnessMap;",
                "#endif",
        
                "void main() {",
        
                    "vec4 outColor = vec4( u_Color, 1.0 );",
                    "#include <diffuseMap_frag>",
                    "vec3 diffuseColor = outColor.xyz * outColor.a;",

                    "float metalnessFactor = metalness;",
                    "#ifdef USE_METALNESSMAP",
                        "metalnessFactor *= texture2D( metalnessMap, v_Uv ).b;",
                    "#endif",

                    "gl_FragColor = vec4( diffuseColor.xyz, metalnessFactor );",
        
                "}"
        
            ].join( "\n" )

        },

        MRT: {

            uniforms: {

                roughness: 0.5,
                metalness: 0.5

            },

            vertexShader: [
                "#define USE_NORMAL",
                "#include <common_vert>",
                "#include <uv_pars_vert>",
                "#include <normal_pars_vert>",
                "#include <color_pars_vert>",
                "#include <envMap_pars_vert>",
                "#include <skinning_pars_vert>",
                "void main() {",
                    "#include <begin_vert>",
                    "#include <skinning_vert>",
                    "#include <pvm_vert>",
                    "#include <uv_vert>",
                    "#include <normal_vert>",
                    "#include <color_vert>",
                "}"
            ].join( "\n" ),

            fragmentShader: [

                "#extension GL_EXT_draw_buffers : require",
        
                "#include <common_frag>",
                "#include <diffuseMap_pars_frag>",

                "#include <uv_pars_frag>",

                "#define USE_NORMAL",

                "#include <packing>",
                "#include <normal_pars_frag>",

                "uniform float roughness;",
                "uniform float metalness;",

                "#ifdef USE_ROUGHNESSMAP",
                    "uniform sampler2D roughnessMap;",
                "#endif",

                "#ifdef USE_METALNESSMAP",
                    "uniform sampler2D metalnessMap;",
                "#endif",

                "void main() {",
                    "vec4 outColor = vec4( u_Color, 1.0 );",
                    "#include <diffuseMap_frag>",
                    "vec3 diffuseColor = outColor.xyz * outColor.a;",

                    "float metalnessFactor = metalness;",
                    "#ifdef USE_METALNESSMAP",
                        "metalnessFactor *= texture2D( metalnessMap, v_Uv ).b;",
                    "#endif",

                    "gl_FragData[1] = vec4( outColor.xyz, metalnessFactor );",

                    "#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)",
                        "float alpha = outColor.a * u_Opacity;",
                        "if(alpha < ALPHATEST) discard;",
                    "#endif",

                    "vec3 normal = normalize(v_Normal);",

                    "float roughnessFactor = roughness;",
                    "#ifdef USE_ROUGHNESSMAP",
                        "roughnessFactor *= texture2D( roughnessMap, v_Uv ).g;",
                    "#endif",

                    "vec4 packedNormalGlossiness;",
                    "packedNormalGlossiness.xyz = normal * 0.5 + 0.5;",
                    "packedNormalGlossiness.w = clamp(1. - roughnessFactor, 0., 1.);",
                    
                    "gl_FragData[0] = packedNormalGlossiness;",
                "}"
        
            ].join( "\n" )

        },

        debug: {

            uniforms: {

                normalGlossinessTexture: null,
                depthTexture: null,
                albedoMetalnessTexture: null,

                debug: 0,

                viewWidth: 800,
                viewHeight: 600,

                matProjViewInverse: new Float32Array(16)

            },

            vertexShader: [

                "attribute vec3 a_Position;",

                "uniform mat4 u_Projection;",
                "uniform mat4 u_View;",
                "uniform mat4 u_Model;",

                "void main() {",

                    "gl_Position = u_Projection * u_View * u_Model * vec4( a_Position, 1.0 );",

                "}"
    
            ].join( '\n' ),

            fragmentShader: [

                "uniform sampler2D normalGlossinessTexture;",
                "uniform sampler2D depthTexture;",
                "uniform sampler2D albedoMetalnessTexture;",

                // DEBUG
                // - 0: normal
                // - 1: depth
                // - 2: position
                // - 3: glossiness
                // - 4: metalness
                // - 5: albedo
                // - 6: velocity
                "uniform int debug;",

                "uniform float viewHeight;",
                "uniform float viewWidth;",

                "uniform mat4 matProjViewInverse;",

                "void main() {",

                    "vec2 texCoord = gl_FragCoord.xy / vec2( viewWidth, viewHeight );",

                    "vec4 texel1 = texture2D(normalGlossinessTexture, texCoord);",
                    "vec4 texel3 = texture2D(albedoMetalnessTexture, texCoord);",

                    // Is empty
                    "if (dot(texel1.rgb, vec3(1.0)) == 0.0) {",
                        "discard;",
                    "}",

                    "float glossiness = texel1.a;",
                    "float metalness = texel3.a;",

                    "vec3 N = texel1.rgb * 2.0 - 1.0;",

                    // Depth buffer range is 0.0 - 1.0
                    "float z = texture2D(depthTexture, texCoord).r * 2.0 - 1.0;",

                    "vec2 xy = texCoord * 2.0 - 1.0;",

                    "vec4 projectedPos = vec4(xy, z, 1.0);",
                    "vec4 p4 = matProjViewInverse * projectedPos;",

                    "vec3 position = p4.xyz / p4.w;",

                    "vec3 albedo = texel3.rgb;",

                    "vec3 diffuseColor = albedo * (1.0 - metalness);",
                    "vec3 specularColor = mix(vec3(0.04), albedo, metalness);",

                    "if (debug == 0) {",
                        "gl_FragColor = vec4(N, 1.0);",
                    "} else if (debug == 1) {",
                        "gl_FragColor = vec4(vec3(z), 1.0);",
                    "} else if (debug == 2) {",
                        "gl_FragColor = vec4(position, 1.0);",
                    "} else if (debug == 3) {",
                        "gl_FragColor = vec4(vec3(glossiness), 1.0);",
                    "} else if (debug == 4) {",
                        "gl_FragColor = vec4(vec3(metalness), 1.0);",
                    "} else {",
                        "gl_FragColor = vec4(albedo, 1.0);",
                    "}",

                "}"

            ].join( '\n' )

        }


    };

})();