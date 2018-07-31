/**
 * shaders for deferred renderer
 */

(function() {

    var DeferredShaderChunk = {

        packVector3: [

            "float vec3_to_float( vec3 data ) {",
    
            "	const float unit = 254.0/256.0;", // todo 255.0 / 256.0 error, why ?
            "	highp float compressed = fract( data.x * unit ) + floor( data.y * unit * 255.0 ) + floor( data.z * unit * 255.0 ) * 255.0;",
            "	return compressed;",
    
            "}"
    
        ].join( "\n" ),
    
        unpackFloat: [
    
            "vec3 float_to_vec3( float data ) {",
    
            "	const float unit = 255.0;",
            "	vec3 uncompressed;",
            "	uncompressed.x = fract( data );",
            "	float zInt = floor( data / unit );",
            "	uncompressed.z = fract( zInt / unit );",
            "	uncompressed.y = fract( floor( data - ( zInt * unit ) ) / unit );",
            "	return uncompressed;",
    
            "}"
    
        ].join( "\n" ),

        computeTextureCoord: [

            "vec2 texCoord = gl_FragCoord.xy / vec2( viewWidth, viewHeight );"
    
        ].join( "\n" ),

        packNormalDepth: [

            "vec4 packedNormalDepth;",
            "packedNormalDepth.xyz = normal * 0.5 + 0.5;",
            "packedNormalDepth.w = position.z / position.w;"
    
        ].join( "\n" ),
    
        unpackNormalDepth: [
    
            "vec4 normalDepthMap = texture2D( samplerNormalDepth, texCoord );",
            "float depth = normalDepthMap.w;",
    
            "if ( depth == 0.0 ) discard;",
    
            "vec3 normal = normalDepthMap.xyz * 2.0 - 1.0;"
    
        ].join( "\n" ),

        packColor: [

            "vec4 packedColor;",
            "packedColor.x = vec3_to_float( diffuseColor.rgb );",
            "packedColor.y = vec3_to_float( emissiveColor );",
            "packedColor.z = vec3_to_float( specularColor );",
            "packedColor.w = shininess;"
    
        ].join( "\n" ),
    
        unpackColor: [
    
            "vec4 colorMap = texture2D( samplerColor, texCoord );",
            "vec3 diffuseColor = float_to_vec3( colorMap.x );",
            "vec3 emissiveColor = float_to_vec3( colorMap.y );",
            "vec3 specularColor = float_to_vec3( colorMap.z );",
            "float shininess = colorMap.w;"
    
        ].join( "\n" ),

        computeVertexPositionVS: [

            "vec2 xy = texCoord * 2.0 - 1.0;",
            "vec4 vertexPositionProjected = vec4( xy, depth, 1.0 );",
            "vec4 vertexPositionVS = matProjViewInverse * vertexPositionProjected;",
            "vertexPositionVS.xyz /= vertexPositionVS.w;",
            "vertexPositionVS.w = 1.0;"
    
        ].join( "\n" ),

        // TODO: calculate schlick
        computeSpecular: [

            "vec3 halfVector = normalize( lightVector + viewVector );",
            "float dotNormalHalf = max( dot( normal, halfVector ), 0.0 );",
            "float specular = 0.31830988618 * ( shininess * 0.5 + 1.0 ) * pow( dotNormalHalf, shininess );"

        ].join( "\n" ),

        combine: [

            "gl_FragColor = vec4( lightIntensity * lightColor * max( dot( lightVector, normal ), 0.0 ) * ( diffuseColor + specular * specularColor ) * attenuation, 1.0 );"

        ].join( "\n" )

    };

    zen3d.DeferredShader = {

        // rgb: normal, a: depth
        normalDepth: {

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
                    "vPosition = gl_Position;", // need this, but not gl_FragCoord.z / gl_FragCoord.w ?
                "}"

            ].join( "\n" ),

            fragmentShader: [
        
                "#include <common_frag>",
                "#include <diffuseMap_pars_frag>",

                "#include <uv_pars_frag>",

                "#define USE_NORMAL",

                "#include <packing>",
                "#include <normal_pars_frag>",

                "varying vec4 vPosition;",

                "void main() {",
                    "#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)",
                        "vec4 texelColor = texture2D( texture, v_Uv );",

                        "float alpha = texelColor.a * u_Opacity;",
                        "if(alpha < ALPHATEST) discard;",
                    "#endif",

                    "vec3 normal = normalize(v_Normal);",
                    "vec4 position = vPosition;",

                    DeferredShaderChunk.packNormalDepth,
                    
                    "gl_FragColor = packedNormalDepth;",
                "}"
        
            ].join( "\n" )

        },

        // r: diffuse, g: emissive, b: speculer, a: shininess
        color: {

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
                
                DeferredShaderChunk.packVector3,
        
                "void main() {",
        
                    "vec4 outColor = vec4( u_Color, 1.0 );",
                    "#include <diffuseMap_frag>",
                    "vec4 diffuseColor = outColor;",
                    "vec3 emissiveColor = emissive;",
                    "vec3 specularColor = specular;",
                    
                    DeferredShaderChunk.packColor,
        
                    "gl_FragColor = packedColor;",
        
                "}"
        
            ].join( "\n" )
        
        },

        emissiveLight: {

            uniforms: {
                samplerColor: null,

                viewWidth: 800,
                viewHeight: 600
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
    
                "uniform sampler2D samplerColor;",
    
                "uniform float viewHeight;",
                "uniform float viewWidth;",
    
                DeferredShaderChunk.unpackFloat,
    
                "void main() {",
    
                    DeferredShaderChunk.computeTextureCoord,
                    DeferredShaderChunk.unpackColor,
    
                    "gl_FragColor = vec4( emissiveColor, 1.0 );",
    
                "}"
    
            ].join( '\n' )
    
        },

        directionalLight: {

            uniforms: {

                samplerNormalDepth: null,
                samplerColor: null,

                lightColor: [0, 0, 0],
                lightDirectionVS: [0, 1, 0],
                lightIntensity: 1,

                viewWidth: 800,
                viewHeight: 600,

                matProjViewInverse: new Float32Array(16),
                cameraPos: [0, 0, 0]

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
    
                "uniform sampler2D samplerNormalDepth;",
                "uniform sampler2D samplerColor;",

                "uniform float viewHeight;",
                "uniform float viewWidth;",

                "uniform vec3 lightColor;",
                "uniform vec3 lightDirectionVS;",
                "uniform float lightIntensity;",

                "uniform mat4 matProjViewInverse;",
                "uniform vec3 cameraPos;",

                DeferredShaderChunk.unpackFloat,

                "void main() {",

                    DeferredShaderChunk.computeTextureCoord,
                    DeferredShaderChunk.unpackNormalDepth,
                    DeferredShaderChunk.computeVertexPositionVS,
                    DeferredShaderChunk.unpackColor,

                    "vec3 lightVector = normalize( lightDirectionVS );",
                    "vec3 viewVector = normalize( cameraPos - vertexPositionVS.xyz );",

                    DeferredShaderChunk.computeSpecular,

                    "const float attenuation = 1.0 / PI;",

                    DeferredShaderChunk.combine,

                "}"
    
            ].join( '\n' )

        },

        pointLight: {

            uniforms: {

                samplerNormalDepth: null,
                samplerColor: null,

                lightColor: [0, 0, 0],
                lightPositionVS: [0, 1, 0],
                lightIntensity: 1,
                lightRadius: 1,

                viewWidth: 800,
                viewHeight: 600,

                matProjViewInverse: new Float32Array(16),
                cameraPos: [0, 0, 0]

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

                "uniform sampler2D samplerNormalDepth;",
                "uniform sampler2D samplerColor;",
    
                "uniform float viewHeight;",
                "uniform float viewWidth;",
    
                "uniform vec3 lightColor;",
                "uniform vec3 lightPositionVS;",
                "uniform float lightIntensity;",
                "uniform float lightRadius;",

                "uniform mat4 matProjViewInverse;",
                "uniform vec3 cameraPos;",

                DeferredShaderChunk.unpackFloat,

                "void main() {",

                    DeferredShaderChunk.computeTextureCoord,
                    DeferredShaderChunk.unpackNormalDepth,
                    DeferredShaderChunk.computeVertexPositionVS,

                    "vec3 lightVector = lightPositionVS - vertexPositionVS.xyz;",
                    "float distance = length( lightVector );",

                    "if ( distance > lightRadius ) discard;",

                    "lightVector = normalize( lightVector );",
                    "vec3 viewVector = normalize( cameraPos - vertexPositionVS.xyz );",

                    DeferredShaderChunk.unpackColor,
                    DeferredShaderChunk.computeSpecular,

                    "float attenuation = saturate( -distance / lightRadius + 1.0 ) / PI;",

                    DeferredShaderChunk.combine,

                "}"

            ].join( '\n' )

        }

    };
    
})();

