(function() {

    var DeferredShaderChunk = {

        light_head: [

            "uniform sampler2D normalGlossinessTexture;",
            "uniform sampler2D depthTexture;",
            "uniform sampler2D albedoMetalnessTexture;",

            "uniform vec2 windowSize;",

            "uniform mat4 matProjViewInverse;",

        ].join( '\n' ),

        gbuffer_read: [
            // Extract
            // - N, z, position
            // - albedo, metalness, specularColor, diffuseColor

            "vec2 texCoord = gl_FragCoord.xy / windowSize;",

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

        ].join( '\n' ),

        light_equation: [

            "float D_Phong(in float g, in float ndh) {",
                // from black ops 2
                "float a = pow(8192.0, g);",
                "return (a + 2.0) / 8.0 * pow(ndh, a);",
            "}",
            
            "float D_GGX(in float g, in float ndh) {",
                "float r = 1.0 - g;",
                "float a = r * r;",
                "float tmp = ndh * ndh * (a - 1.0) + 1.0;",
                "return a / (3.1415926 * tmp * tmp);",
            "}",
            
            // Fresnel
            "vec3 F_Schlick(in float ndv, vec3 spec) {",
                "return spec + (1.0 - spec) * pow(1.0 - ndv, 5.0);",
            "}",
            
            "vec3 lightEquation(",
                "in vec3 lightColor, in vec3 diffuseColor, in vec3 specularColor,",
                "in float ndl, in float ndh, in float ndv, in float g",
            ")",
            "{",
                "return ndl * lightColor",
                    "* (diffuseColor + D_Phong(g, ndh) * F_Schlick(ndv, specularColor));",
            "}"

        ].join( '\n' )

    }

    zen3d.DeferredShader2 = {

        directionalLight: {

            defines: {

                "SHADOW": 0

            },

            uniforms: {

                normalGlossinessTexture: null,
                depthTexture: null,
                albedoMetalnessTexture: null,

                windowSize: [800, 600],

                matProjViewInverse: new Float32Array(16),

                lightColor: [0, 0, 0],
                lightDirection: [0, 1, 0],

                eyePosition: [0, 1, 0],

                shadowMatrix: new Float32Array(16),
                shadowMap: null,
                shadowBias: 0,
                shadowRadius: 1,
                shadowMapSize: [1024, 1024]

            },

            vertexShader: [

                DeferredShaderChunk.light_head,
                DeferredShaderChunk.light_equation,

                "uniform vec3 lightDirection;",
                "uniform vec3 lightColor;",

                "uniform vec3 eyePosition;",

                "#if SHADOW == 1",

                    "uniform sampler2D shadowMap;",
                    "uniform mat4 shadowMatrix;",

                    "uniform float shadowBias;",
                    "uniform float shadowRadius;",
                    "uniform vec2 shadowMapSize;",
                    
                    "#include <packing>",
                    "#include <shadow>",

                "#endif",

                "void main() {",

                    // todo

                "}"

            ].join( '\n' ),

            fragmentShader: [

                // todo

            ].join( '\n' )

        }

    };

})();