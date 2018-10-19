(function() {

    var DeferredShaderChunk = {

        light_vertex: [

            "attribute vec3 a_Position;",

            "uniform mat4 u_Projection;",
            "uniform mat4 u_View;",
            "uniform mat4 u_Model;",

            "void main() {",

                "gl_Position = u_Projection * u_View * u_Model * vec4( a_Position, 1.0 );",

            "}"

        ].join( '\n' ),

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

        calculate_attenuation: [

            "uniform float attenuationFactor;",

            "float lightAttenuation(float dist, float range)",
            "{",
                "float attenuation = 1.0;",
                "attenuation = dist*dist/(range*range+1.0);",
                "float att_s = attenuationFactor;",
                "attenuation = 1.0/(attenuation*att_s+1.0);",
                "att_s = 1.0/(att_s+1.0);",
                "attenuation = attenuation - att_s;",
                "attenuation /= 1.0 - att_s;",
                "return clamp(attenuation, 0.0, 1.0);",
            "}"

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

            vertexShader: DeferredShaderChunk.light_vertex,

            fragmentShader: [

                DeferredShaderChunk.light_head,
                DeferredShaderChunk.light_equation,

                "uniform vec3 lightDirection;",
                "uniform vec3 lightColor;",

                "uniform vec3 eyePosition;",

                "#if SHADOW == 1",

                    "uniform sampler2DShadow shadowMap;",
                    "uniform mat4 shadowMatrix;",

                    "uniform float shadowBias;",
                    "uniform float shadowRadius;",
                    "uniform vec2 shadowMapSize;",
                    
                    "#include <packing>",
                    "#include <shadow>",

                "#endif",

                "void main() {",

                    DeferredShaderChunk.gbuffer_read,

                    "vec3 L = -normalize(lightDirection);",
                    "vec3 V = normalize(eyePosition - position);",

                    "vec3 H = normalize(L + V);",
                    "float ndl = clamp(dot(N, L), 0.0, 1.0);",
                    "float ndh = clamp(dot(N, H), 0.0, 1.0);",
                    "float ndv = clamp(dot(N, V), 0.0, 1.0);",

                    "gl_FragColor.rgb = lightEquation(",
                        "lightColor, diffuseColor, specularColor, ndl, ndh, ndv, glossiness",
                    ");",

                    "#if SHADOW == 1",
                        "float shadowContrib = getShadow(shadowMap, shadowMatrix * vec4(position, 1.), shadowBias, shadowRadius, shadowMapSize);",
                        "gl_FragColor.rgb *= shadowContrib;",
                    "#endif",

                    "gl_FragColor.a = 1.0;",

                "}"

            ].join( '\n' )

        },

        pointLight: {
            
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
                lightPosition: [0, 1, 0],
                lightRange: 1,

                attenuationFactor: 5.0,

                eyePosition: [0, 1, 0],

                shadowMap: null,
                shadowBias: 0,
                shadowRadius: 1,
                shadowMapSize: [1024, 1024],
                shadowCameraNear: 1,
                shadowCameraFar: 100,

            },

            vertexShader: DeferredShaderChunk.light_vertex,

            fragmentShader: [

                DeferredShaderChunk.light_head,
                DeferredShaderChunk.calculate_attenuation,
                DeferredShaderChunk.light_equation,

                "uniform vec3 lightPosition;",
                "uniform vec3 lightColor;",
                "uniform float lightRange;",

                "uniform vec3 eyePosition;",

                "#if SHADOW == 1",

                    "uniform samplerCube shadowMap;",

                    "uniform float shadowBias;",
                    "uniform float shadowRadius;",
                    "uniform vec2 shadowMapSize;",

                    "uniform float shadowCameraNear;",
                    "uniform float shadowCameraFar;",
                    
                    "#include <packing>",
                    "#include <shadow>",

                "#endif",

                "void main() {",

                    DeferredShaderChunk.gbuffer_read,

                    "vec3 L = lightPosition - position;",
                    "vec3 V = normalize(eyePosition - position);",

                    "float dist = length(L);",
                    "L /= dist;",

                    "vec3 H = normalize(L + V);",

                    "float ndl = clamp(dot(N, L), 0.0, 1.0);",
                    "float ndh = clamp(dot(N, H), 0.0, 1.0);",
                    "float ndv = clamp(dot(N, V), 0.0, 1.0);",
                    "float attenuation = lightAttenuation(dist, lightRange);",
                    // Diffuse term
                    "gl_FragColor.rgb = attenuation * lightEquation(",
                        "lightColor, diffuseColor, specularColor, ndl, ndh, ndv, glossiness",
                    ");",

                    "#if SHADOW == 1",
                        "float shadowContrib = getPointShadow(shadowMap, -L * dist, shadowBias, shadowRadius, shadowMapSize, shadowCameraNear, shadowCameraFar);",
                        "gl_FragColor.rgb *= clamp(shadowContrib, 0.0, 1.0);",
                    "#endif",

                    "gl_FragColor.a = 1.0;",

                "}"

            ].join( '\n' )

        },

        spotLight: {

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
                lightPosition: [0, 1, 0],
                lightDirection: [0, 1, 0],
                lightConeCos: 1,
                lightPenumbraCos: 1,
                lightRange: 1,
                falloffFactor: 1.,

                attenuationFactor: 5.0,

                eyePosition: [0, 1, 0],

                shadowMatrix: new Float32Array(16),
                shadowMap: null,
                shadowBias: 0,
                shadowRadius: 1,
                shadowMapSize: [1024, 1024],

            },

            vertexShader: DeferredShaderChunk.light_vertex,

            fragmentShader: [

                DeferredShaderChunk.light_head,
                DeferredShaderChunk.calculate_attenuation,
                DeferredShaderChunk.light_equation,

                "uniform vec3 lightPosition;",
                "uniform vec3 lightDirection;",
                "uniform vec3 lightColor;",
                "uniform float lightConeCos;",
                "uniform float lightPenumbraCos;",
                "uniform float lightRange;",
                "uniform float falloffFactor;",

                "uniform vec3 eyePosition;",

                "#if SHADOW == 1",

                    "uniform sampler2DShadow shadowMap;",
                    "uniform mat4 shadowMatrix;",

                    "uniform float shadowBias;",
                    "uniform float shadowRadius;",
                    "uniform vec2 shadowMapSize;",
                    
                    "#include <packing>",
                    "#include <shadow>",

                "#endif",

                "void main() {",

                    DeferredShaderChunk.gbuffer_read,

                    "vec3 L = lightPosition - position;",
                    "vec3 V = normalize(eyePosition - position);",

                    "float dist = length(L);",
                    "L /= dist;",

                    "float attenuation = lightAttenuation(dist, lightRange);",
                    "float angleCos = dot( -normalize(lightDirection), L );",

                    "if ( angleCos <= lightConeCos ) discard;",
                    "if ( dist > lightRange ) discard;",

                    "float spotEffect = smoothstep( lightConeCos, lightPenumbraCos, angleCos );",

                    "vec3 H = normalize(L + V);",
                    "float ndl = clamp(dot(N, L), 0.0, 1.0);",
                    "float ndh = clamp(dot(N, H), 0.0, 1.0);",
                    "float ndv = clamp(dot(N, V), 0.0, 1.0);",

                    // Diffuse term
                    "gl_FragColor.rgb = spotEffect * attenuation * lightEquation(",
                        "lightColor, diffuseColor, specularColor, ndl, ndh, ndv, glossiness",
                    ");",

                    "#if SHADOW == 1",
                        "float shadowContrib = getShadow(shadowMap, shadowMatrix * vec4(position, 1.), shadowBias, shadowRadius, shadowMapSize);",
                        "gl_FragColor.rgb *= shadowContrib;",
                    "#endif",

                    "gl_FragColor.a = 1.0;",

                "}"

            ].join( '\n' )

        },

        ambientCubemapLight: {

            defines: {

            },

            uniforms: {

                normalGlossinessTexture: null,
                depthTexture: null,
                albedoMetalnessTexture: null,

                windowSize: [800, 600],

                matProjViewInverse: new Float32Array(16),

                cubeMap: null,
                intensity: 1.0,

                eyePosition: [0, 1, 0]

            },

            vertexShader: DeferredShaderChunk.light_vertex,

            fragmentShader: [

                DeferredShaderChunk.light_head,
                DeferredShaderChunk.light_equation,

                "uniform samplerCube cubeMap;",
                "uniform float intensity;",

                "uniform vec3 eyePosition;",

                "void main() {",

                    DeferredShaderChunk.gbuffer_read,

                    "vec3 V = normalize(eyePosition - position);",
                    "vec3 L = reflect(-V, N);",

                    "vec3 H = normalize(L + V);",

                    "float ndv = clamp(dot(N, V), 0.0, 1.0);",
                    "float ndh = clamp(dot(N, H), 0.0, 1.0);",
                    "float rough = clamp(1.0 - glossiness, 0.0, 1.0);",

                    // FIXME fixed maxMipmapLevel ?
                    "float level = rough * 5.0;",

                    "#ifdef TEXTURE_LOD_EXT",

                        "vec4 cubeMapColor1 = textureCubeLodEXT( cubeMap, L, 8. );",
                        "vec4 cubeMapColor2 = textureCubeLodEXT( cubeMap, L, level );",

                    "#else",

                        // force the bias high to get the last LOD level as it is the most blurred.
                        "vec4 cubeMapColor1 = textureCubeLodEXT( cubeMap, L, 8. );",
                        "vec4 cubeMapColor2 = textureCube( cubeMap, L, level );",

                    "#endif",

                    // Diffuse term
                    // TODO
                    "gl_FragColor.rgb = intensity * (cubeMapColor2.xyz * F_Schlick(ndv, specularColor) + cubeMapColor1.xyz * diffuseColor / PI);",

                    "gl_FragColor.a = 1.0;",

                "}"

            ].join( '\n' )

        }

    };

})();