(function() {

    var packing = [
        "const float PackUpscale = 256. / 255.;", // fraction -> 0..1 (including 1)
        "const float UnpackDownscale = 255. / 256.;", // 0..1 -> fraction (excluding 1)

        "const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );",
        "const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );",

        "const float ShiftRight8 = 1. / 256.;",

        "vec4 packDepthToRGBA( const in float v ) {",

            "vec4 r = vec4( fract( v * PackFactors ), v );",
            "r.yzw -= r.xyz * ShiftRight8;", // tidy overflow
            "return r * PackUpscale;",

        "}",

        "float unpackRGBAToDepth( const in vec4 v ) {",

            "return dot( v, UnpackFactors );",

        "}"
    ].join("\n");

    var transpose = "mat4 transpose(mat4 inMatrix) { \n" +
        "vec4 i0 = inMatrix[0]; \n" +
        "vec4 i1 = inMatrix[1]; \n" +
        "vec4 i2 = inMatrix[2]; \n" +
        "vec4 i3 = inMatrix[3]; \n" +
        "mat4 outMatrix = mat4( \n" +
            "vec4(i0.x, i1.x, i2.x, i3.x), \n" +
            "vec4(i0.y, i1.y, i2.y, i3.y), \n" +
            "vec4(i0.z, i1.z, i2.z, i3.z), \n" +
            "vec4(i0.w, i1.w, i2.w, i3.w) \n" +
        "); \n" +
        "return outMatrix; \n" +
    "} \n";

    var inverse = "mat4 inverse(mat4 m) { \n" +
        "float \n" +
        "a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3], \n" +
        "a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3], \n" +
        "a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3], \n" +
        "a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3], \n" +
        "b00 = a00 * a11 - a01 * a10, \n" +
        "b01 = a00 * a12 - a02 * a10, \n" +
        "b02 = a00 * a13 - a03 * a10, \n" +
        "b03 = a01 * a12 - a02 * a11, \n" +
        "b04 = a01 * a13 - a03 * a11, \n" +
        "b05 = a02 * a13 - a03 * a12, \n" +
        "b06 = a20 * a31 - a21 * a30, \n" +
        "b07 = a20 * a32 - a22 * a30, \n" +
        "b08 = a20 * a33 - a23 * a30, \n" +
        "b09 = a21 * a32 - a22 * a31, \n" +
        "b10 = a21 * a33 - a23 * a31, \n" +
        "b11 = a22 * a33 - a23 * a32, \n" +
        "det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; \n" +
        "return mat4( \n" +
            "a11 * b11 - a12 * b10 + a13 * b09, \n" +
            "a02 * b10 - a01 * b11 - a03 * b09, \n" +
            "a31 * b05 - a32 * b04 + a33 * b03, \n" +
            "a22 * b04 - a21 * b05 - a23 * b03, \n" +
            "a12 * b08 - a10 * b11 - a13 * b07, \n" +
            "a00 * b11 - a02 * b08 + a03 * b07, \n" +
            "a32 * b02 - a30 * b05 - a33 * b01, \n" +
            "a20 * b05 - a22 * b02 + a23 * b01, \n" +
            "a10 * b10 - a11 * b08 + a13 * b06, \n" +
            "a01 * b08 - a00 * b10 - a03 * b06, \n" +
            "a30 * b04 - a31 * b02 + a33 * b00, \n" +
            "a21 * b02 - a20 * b04 - a23 * b00, \n" +
            "a11 * b07 - a10 * b09 - a12 * b06, \n" +
            "a00 * b09 - a01 * b07 + a02 * b06, \n" +
            "a31 * b01 - a30 * b03 - a32 * b00, \n" +
            "a20 * b03 - a21 * b01 + a22 * b00) / det; \n" +
    "} \n";

    var tsn = [
        'mat3 tsn(vec3 N, vec3 V, vec2 uv) {',

            'vec3 q0 = dFdx( V.xyz );',
            'vec3 q1 = dFdy( V.xyz );',
            'vec2 st0 = dFdx( uv.st );',
            'vec2 st1 = dFdy( uv.st );',

            'vec3 S = normalize( q0 * st1.t - q1 * st0.t );',
            'vec3 T = normalize( -q0 * st1.s + q1 * st0.s );',
            // 'vec3 N = normalize( N );',

            'mat3 tsn = mat3( S, T, N );',
            'return tsn;',
        '}'
    ].join("\n");

    var tbn = "mat3 tbn(vec3 N, vec3 p, vec2 uv) { \n" +
        "vec3 dp1 = dFdx(p.xyz); \n" +
        "vec3 dp2 = dFdy(p.xyz); \n" +
        "vec2 duv1 = dFdx(uv.st); \n" +
        "vec2 duv2 = dFdy(uv.st); \n" +
        "vec3 dp2perp = cross(dp2, N); \n" +
        "vec3 dp1perp = cross(N, dp1); \n" +
        "vec3 T = dp2perp * duv1.x + dp1perp * duv2.x; \n" +
        "vec3 B = dp2perp * duv1.y + dp1perp * duv2.y; \n" +
        "float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B))); \n" +
        "return mat3(T * invmax, B * invmax, N); \n" +
    "} \n";

    /**
     * common parts
     */

    var vertexCommon = [
        'attribute vec3 a_Position;',
        'attribute vec3 a_Normal;',

        transpose,
        inverse,

        'uniform mat4 u_Projection;',
        'uniform mat4 u_View;',
        'uniform mat4 u_Model;',

        'uniform vec3 u_CameraPosition;'
    ].join("\n");

    var fragmentCommon = [
        'uniform mat4 u_View;',

        'uniform float u_Opacity;',
        'uniform vec3 u_Color;',

        'uniform vec3 u_CameraPosition;'
    ].join("\n");

    /**
     * frag
     */

    var frag_begin = [
        'vec4 outColor = vec4(u_Color, u_Opacity);'
    ].join("\n");

    var frag_end = [
        'gl_FragColor = outColor;'
    ].join("\n");

    /**
     * pvm
     */

    var pvm_vert = [
        'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);'
    ].join("\n");

    /**
     * uv
     */

    var uv_pars_vert = [
        '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
            'attribute vec2 a_Uv;',
            'varying vec2 v_Uv;',
        '#endif',
    ].join("\n");

    var uv_vert = [
        '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
            'v_Uv = a_Uv;',
        '#endif',
    ].join("\n");

    var uv_pars_frag = [
        '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
            'varying vec2 v_Uv;',
        '#endif',
    ].join("\n");

    /**
     * normal
     */

    var normal_pars_vert = [
        '#ifdef USE_NORMAL',
            //'attribute vec3 a_Normal;',
            'varying vec3 v_Normal;',
        '#endif',
    ].join("\n");

    var normal_vert = [
        '#ifdef USE_NORMAL',
            'v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;',
        '#endif',
    ].join("\n");

    var normal_pars_frag = [
        '#ifdef USE_NORMAL',
            'varying vec3 v_Normal;',
        '#endif',
    ].join("\n");

    var normal_frag = [
        '#ifdef USE_NORMAL',
            'vec3 N;',
            '#ifdef USE_NORMAL_MAP',
                'vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;',
                // for now, uv coord is flip Y
                'mat3 tspace = tsn(normalize(v_Normal), -v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));',
                // 'mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));',
                'N = normalize(tspace * (normalMapColor * 2.0 - 1.0));',
            '#else',
                'N = normalize(v_Normal);',
            '#endif',
        '#endif',
    ].join("\n");

    /**
     * diffuse map
     */

    var diffuseMap_pars_frag = [
        '#ifdef USE_DIFFUSE_MAP',
            'uniform sampler2D texture;',
        '#endif',
    ].join("\n");

    var diffuseMap_frag = [
        '#ifdef USE_DIFFUSE_MAP',
            'outColor *= texture2D(texture, v_Uv);',
        '#endif',
    ].join("\n");

    /**
     * normal map
     */

    var normalMap_pars_frag = [
        tsn,
        tbn,
        'uniform sampler2D normalMap;',
    ].join("\n");

    /**
     * env map
     */

    var envMap_pars_vert = [
        '#ifdef USE_ENV_MAP',
            'varying vec3 v_EnvPos;',
        '#endif',
    ].join("\n");

    var envMap_vert = [
        '#ifdef USE_ENV_MAP',
            'v_EnvPos = reflect(normalize((u_Model * vec4(a_Position, 1.0)).xyz - u_CameraPosition), (transpose(inverse(u_Model)) * vec4(a_Normal, 1.0)).xyz);',
        '#endif',
    ].join("\n");

    var envMap_pars_frag = [
        '#ifdef USE_ENV_MAP',
            'varying vec3 v_EnvPos;',
            'uniform samplerCube envMap;',
            'uniform float u_EnvMap_Intensity;',
        '#endif',
    ].join("\n");

    var envMap_frag = [
        '#ifdef USE_ENV_MAP',
            'vec4 envColor = textureCube(envMap, v_EnvPos);',
            // TODO add? mix? or some other method?
            // 'outColor = mix(outColor, envColor, u_EnvMap_Intensity);',
            'outColor += envColor * u_EnvMap_Intensity;',
            // 'outColor = mix(outColor, envColor * outColor, u_EnvMap_Intensity);',
        '#endif',
    ].join("\n");

    /**
     * shadow map
     */

    var shadowMap_pars_vert = [
        '#ifdef USE_SHADOW',

            '#ifdef USE_DIRECT_LIGHT',

                'uniform mat4 directionalShadowMatrix[ USE_DIRECT_LIGHT ];',
                'varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];',

            '#endif',

            '#ifdef USE_POINT_LIGHT',

                // nothing

            '#endif',

            '#ifdef USE_SPOT_LIGHT',

                'uniform mat4 spotShadowMatrix[ USE_SPOT_LIGHT ];',
                'varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];',

            '#endif',

        '#endif'
    ].join("\n");

    var shadowMap_vert = [
        '#ifdef USE_SHADOW',

            'vec4 worldPosition = u_Model * vec4(a_Position, 1.0);',

            '#ifdef USE_DIRECT_LIGHT',

                'for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {',

                    'vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;',

                '}',

            '#endif',

            '#ifdef USE_POINT_LIGHT',

                // nothing

            '#endif',

            '#ifdef USE_SPOT_LIGHT',

                'for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {',

                    'vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;',

                '}',

            '#endif',

        '#endif'
    ].join("\n");

    var shadowMap_pars_frag = [
        '#ifdef USE_SHADOW',

            packing,

            '#ifdef USE_DIRECT_LIGHT',

                'uniform sampler2D directionalShadowMap[ USE_DIRECT_LIGHT ];',
                'varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];',

            '#endif',

            '#ifdef USE_POINT_LIGHT',

                'uniform samplerCube pointShadowMap[ USE_POINT_LIGHT ];',

            '#endif',

            '#ifdef USE_SPOT_LIGHT',

                'uniform sampler2D spotShadowMap[ USE_SPOT_LIGHT ];',
                'varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];',

            '#endif',

            'float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {',

        		'return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );',

        	'}',

            'float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {',

        		'return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );',

        	'}',

            'float getShadow( sampler2D shadowMap, vec4 shadowCoord ) {',
                'shadowCoord.xyz /= shadowCoord.w;',
                'shadowCoord.z += 0.0003;', // shadow bias

                'bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );',
        		'bool inFrustum = all( inFrustumVec );',

        		'bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );',

        		'bool frustumTest = all( frustumTestVec );',

        		'if ( frustumTest ) {',
                    'return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );',
                '}',

                'return 1.0;',

            '}',

            'float getPointShadow( samplerCube shadowMap, vec3 V ) {',
                'return textureCubeCompare( shadowMap, normalize(V), length(V) / 1000.);',
            '}',

            'float getShadowMask() {',
                'float shadow = 1.0;',

                '#ifdef USE_DIRECT_LIGHT',
                    'for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {',
                        'shadow *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ] ) : 1.0;',
                    '}',
                '#endif',

                '#ifdef USE_POINT_LIGHT',
                    'for ( int i = 0; i < USE_POINT_LIGHT; i ++ ) {',
                        'vec3 worldV = (vec4(v_ViewModelPos, 1.) * u_View - vec4(u_Point[i].position, 1.) * u_View).xyz;',
                        'shadow *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV ) : 1.0;',
                    '}',
                '#endif',

                '#ifdef USE_SPOT_LIGHT',
                    'for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {',
                        'shadow *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ] ) : 1.0;',
                    '}',
                '#endif',

                'return shadow;',
            '}',

        '#endif'
    ].join("\n");

    var shadowMap_frag = [
        '#ifdef USE_SHADOW',
            'outColor *= getShadowMask();',
        '#endif'
    ].join("\n");

    /**
     * light
     */

    var ambientlight_pars_frag = [
        'struct AmbientLight',
        '{',
            'vec4 color;',
            'float intensity;',
        '};',
        'uniform AmbientLight u_Ambient[USE_AMBIENT_LIGHT];',
    ].join("\n");

    var directlight_pars_frag = [
        'struct DirectLight',
        '{',
            'vec3 direction;',
            'vec4 color;',
            'float intensity;',

            'int shadow;',
        '};',
        'uniform DirectLight u_Directional[USE_DIRECT_LIGHT];',
    ].join("\n");

    var pointlight_pars_frag = [
        'struct PointLight',
        '{',
            'vec3 position;',
            'vec4 color;',
            'float intensity;',
            'float distance;',
            'float decay;',

            'int shadow;',
        '};',
        'uniform PointLight u_Point[USE_POINT_LIGHT];',
    ].join("\n");

    var spotlight_pars_frag = [
        'struct SpotLight',
        '{',
            'vec3 position;',
            'vec4 color;',
            'float intensity;',
            'float distance;',
            'float decay;',
            'float coneCos;',
            'float penumbraCos;',
            'vec3 direction;',

            'int shadow;',
        '};',
        'uniform SpotLight u_Spot[USE_SPOT_LIGHT];',
    ].join("\n");

    var light_pars_frag = [
        '#ifdef USE_AMBIENT_LIGHT',
            ambientlight_pars_frag,
        '#endif',
        '#ifdef USE_DIRECT_LIGHT',
            directlight_pars_frag,
        '#endif',
        '#ifdef USE_POINT_LIGHT',
            pointlight_pars_frag,
        '#endif',
        '#ifdef USE_SPOT_LIGHT',
            spotlight_pars_frag,
        '#endif',
    ].join("\n");

    var light_frag = [
        '#ifdef USE_LIGHT',
            'vec4 light;',
            'vec3 L;',
            'vec4 reflectLight = vec4(0., 0., 0., 0.);',
            'vec4 diffuseColor = outColor.xyzw;',

            '#ifdef USE_AMBIENT_LIGHT',
            'for(int i = 0; i < USE_AMBIENT_LIGHT; i++) {',
                'reflectLight += diffuseColor * u_Ambient[i].color * u_Ambient[i].intensity;',
            '}',
            '#endif',

            '#if defined(USE_PHONG) && ( defined(USE_DIRECT_LIGHT) || defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) )',
                'vec3 V = normalize( (u_View * vec4(u_CameraPosition, 1.)).xyz - v_ViewModelPos);',
            '#endif',

            '#ifdef USE_DIRECT_LIGHT',
            'for(int i = 0; i < USE_DIRECT_LIGHT; i++) {',
                'L = -u_Directional[i].direction;',
                'light = u_Directional[i].color * u_Directional[i].intensity;',
                'L = normalize(L);',

                'RE_Lambert(diffuseColor, light, N, L, reflectLight);',

                '#ifdef USE_PHONG',
                // 'RE_Phong(diffuseColor, light, N, L, V, 4., reflectLight);',
                'RE_BlinnPhong(diffuseColor, light, N, normalize(L), V, u_Specular, reflectLight);',
                '#endif',
            '}',
            '#endif',

            '#ifdef USE_POINT_LIGHT',
            'for(int i = 0; i < USE_POINT_LIGHT; i++) {',
                'L = u_Point[i].position - v_ViewModelPos;',
                'float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);',
                'light = u_Point[i].color * u_Point[i].intensity * dist;',
                'L = normalize(L);',

                'RE_Lambert(diffuseColor, light, N, L, reflectLight);',

                '#ifdef USE_PHONG',
                // 'RE_Phong(diffuseColor, light, N, L, V, 4., reflectLight);',
                'RE_BlinnPhong(diffuseColor, light, N, normalize(L), V, u_Specular, reflectLight);',
                '#endif',
            '}',
            '#endif',

            '#ifdef USE_SPOT_LIGHT',
            'for(int i = 0; i < USE_SPOT_LIGHT; i++) {',
                'L = u_Spot[i].position - v_ViewModelPos;',
                'float lightDistance = length(L);',
                'L = normalize(L);',
                'float angleCos = dot( L, -normalize(u_Spot[i].direction) );',

                'if( all( bvec2(angleCos > u_Spot[i].coneCos, lightDistance < u_Spot[i].distance) ) ) {',

                    'float spotEffect = smoothstep( u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos );',
                    'float dist = pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);',
                    'light = u_Spot[i].color * u_Spot[i].intensity * dist * spotEffect;',

                    'RE_Lambert(diffuseColor, light, N, L, reflectLight);',

                    '#ifdef USE_PHONG',
                    // 'RE_Phong(diffuseColor, light, N, L, V, 4., reflectLight);',
                    'RE_BlinnPhong(diffuseColor, light, N, normalize(L), V, u_Specular, reflectLight);',
                    '#endif',

                '}',

            '}',
            '#endif',

            'outColor = reflectLight.xyzw;',
        '#endif'
    ].join("\n");

    var RE_Lambert = [
        'void RE_Lambert(vec4 k, vec4 light, vec3 N, vec3 L, inout vec4 reflectLight) {',
            'float dotNL = max(dot(N, L), 0.);',
            'reflectLight += k * light * dotNL;',
        '}'
    ].join("\n");

    var RE_Phong = [
        'void RE_Phong(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {',
            'vec3 R = max(dot(2.0 * N, L), 0.) * N - L;',
            'reflectLight += k * light * pow(max(dot(V, R), 0.), n_s);',
        '}'
    ].join("\n");

    var RE_BlinnPhong = [
        'void RE_BlinnPhong(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {',
            'vec3 H = normalize(L + V);',
            'reflectLight += k * light * pow(max(dot(N, H), 0.), n_s);',
        '}'
    ].join("\n");

    /**
     * view model pos
     */

    var viewModelPos_pars_vert =[
        '#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )',
            'varying vec3 v_ViewModelPos;',
        '#endif'
    ].join("\n");

    var viewModelPos_vert =[
        '#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )',
            'v_ViewModelPos = (u_View * u_Model * vec4(a_Position, 1.0)).xyz;',
        '#endif'
    ].join("\n");

    var viewModelPos_pars_frag =[
        '#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || ( defined(USE_PHONG) && defined(USE_DIRECT_LIGHT) )',
            'varying vec3 v_ViewModelPos;',
        '#endif'
    ].join("\n");

    /**
     * shader libs
     */
    var ShaderLib = {

        // basic shader
        basicVertex: [
            vertexCommon,
            uv_pars_vert,
            envMap_pars_vert,
            'void main() {',
                pvm_vert,
                uv_vert,
                envMap_vert,
            '}'
        ].join("\n"),
        basicFragment: [
            fragmentCommon,
            uv_pars_frag,
            diffuseMap_pars_frag,
            envMap_pars_frag,
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                envMap_frag,
                frag_end,
            '}'
        ].join("\n"),

        // lambert shader
        lambertVertex: [
            vertexCommon,
            normal_pars_vert,
            uv_pars_vert,
            viewModelPos_pars_vert,
            envMap_pars_vert,
            shadowMap_pars_vert,
            'void main() {',
                pvm_vert,
                normal_vert,
                uv_vert,
                viewModelPos_vert,
                envMap_vert,
                shadowMap_vert,
            '}'
        ].join("\n"),
        lambertFragment: [
            fragmentCommon,
            uv_pars_frag,
            diffuseMap_pars_frag,
            normalMap_pars_frag,
            light_pars_frag,
            normal_pars_frag,
            viewModelPos_pars_frag,
            RE_Lambert,
            envMap_pars_frag,
            shadowMap_pars_frag,
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                normal_frag,
                light_frag,
                envMap_frag,
                shadowMap_frag,
                frag_end,
            '}'
        ].join("\n"),

        // phong shader
        phongVertex: [
            vertexCommon,
            normal_pars_vert,
            uv_pars_vert,
            viewModelPos_pars_vert,
            envMap_pars_vert,
            shadowMap_pars_vert,
            'void main() {',
                pvm_vert,
                normal_vert,
                uv_vert,
                viewModelPos_vert,
                envMap_vert,
                shadowMap_vert,
            '}'
        ].join("\n"),
        phongFragment: [
            fragmentCommon,
            'uniform float u_Specular;',
            uv_pars_frag,
            diffuseMap_pars_frag,
            normalMap_pars_frag,
            light_pars_frag,
            normal_pars_frag,
            viewModelPos_pars_frag,
            RE_Lambert,
            RE_Phong,
            RE_BlinnPhong,
            envMap_pars_frag,
            shadowMap_pars_frag,
            'void main() {',
                frag_begin,
                diffuseMap_frag,
                normal_frag,
                light_frag,
                envMap_frag,
                shadowMap_frag,
                frag_end,
            '}'
        ].join("\n"),

        // cube shader
        cubeVertex: [
            vertexCommon,
            'varying vec3 v_ModelPos;',
            'void main() {',
                pvm_vert,
                'v_ModelPos = (u_Model * vec4(a_Position, 1.0)).xyz;',
            '}'
        ].join("\n"),
        cubeFragment: [
            fragmentCommon,
            'uniform samplerCube cubeMap;',
            'varying vec3 v_ModelPos;',
            'void main() {',
                frag_begin,
                'outColor *= textureCube(cubeMap, v_ModelPos);',
                frag_end,
            '}'
        ].join("\n"),

        // depth shader
        depthVertex: [
            vertexCommon,
            'varying vec3 v_ModelPos;',
            'void main() {',
                pvm_vert,
                'v_ModelPos = (u_Model * vec4(a_Position, 1.0)).xyz;',
            '}'
        ].join("\n"),
        depthFragment: [
            fragmentCommon,
            'uniform vec3 lightPos;',
            'varying vec3 v_ModelPos;',
            packing,
            'void main() {',
                'gl_FragColor = packDepthToRGBA(length(v_ModelPos - lightPos) / 1000.);',
            '}'
        ].join("\n")

    };

    zen3d.ShaderLib = ShaderLib;
})();
