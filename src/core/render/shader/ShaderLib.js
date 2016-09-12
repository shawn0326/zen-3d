(function() {

    var vertexCommon = [
        'attribute vec3 a_Position;',

        'uniform mat4 u_Projection;',
        'uniform mat4 u_View;',
        'uniform mat4 u_Model;'
    ].join("\n");

    var fragmentCommon = [
        '#extension GL_OES_standard_derivatives : enable',
        'precision mediump float;',

        'uniform float u_Opacity;',
        'uniform vec3 u_Color;',
    ].join("\n");

    var diffuseHandler = [
        'vec4 diffuseColor = vec4(u_Color, u_Opacity);',

        '#ifdef USE_DIFFUSE_MAP',
            'diffuseColor *= texture2D(texture, v_Uv);',
        '#endif',
    ].join("\n");

    var normalHandler = [
        '#ifdef USE_NORMAL',
            'vec3 N;',
            '#ifdef USE_NORMAL_MAP',
                'vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;',
                'mat3 tspace = tsn(normalize(v_Normal), -v_VmPos, v_Uv);',
                // 'mat3 tspace = tbn(normalize(v_Normal), v_VmPos, v_Uv);',
                'N = normalize(tspace * (normalMapColor * 2.0 - 1.0));',
            '#else',
                'N = normalize(v_Normal);',
            '#endif',
        '#endif',
    ].join("\n");

    var ambientLightPars = [
        'struct AmbientLight',
        '{',
            'vec4 color;',
            'float intensity;',
        '};',
        'uniform AmbientLight u_Ambient[USE_AMBIENT_LIGHT];',
    ].join("\n");

    var directLightPars = [
        'struct DirectLight',
        '{',
            'vec3 direction;',
            'vec4 color;',
            'float intensity;',
        '};',
        'uniform DirectLight u_Directional[USE_DIRECT_LIGHT];',
    ].join("\n");

    var pointLightPars = [
        'struct PointLight',
        '{',
            'vec3 position;',
            'vec4 color;',
            'float intensity;',
        '};',
        'uniform PointLight u_Point[USE_POINT_LIGHT];',
    ].join("\n");

    var lightPars = [
        '#ifdef USE_AMBIENT_LIGHT',
            ambientLightPars,
        '#endif',
        '#ifdef USE_DIRECT_LIGHT',
            directLightPars,
        '#endif',
        '#ifdef USE_POINT_LIGHT',
            pointLightPars,
        '#endif',
    ].join("\n");

    var lightHandler = [
        '#ifdef USE_LIGHT',
            'vec4 light;',
            'vec3 L;',
            '#ifdef USE_PHONE',
            'vec3 V;',
            '#endif',

            '#ifdef USE_AMBIENT_LIGHT',
            'for(int i = 0; i < USE_AMBIENT_LIGHT; i++) {',
                'gl_FragColor += diffuseColor * u_Ambient[i].color * u_Ambient[i].intensity;',
            '}',
            '#endif',

            '#ifdef USE_DIRECT_LIGHT',
            'for(int i = 0; i < USE_DIRECT_LIGHT; i++) {',
                'L = (u_ViewITMat * vec4(-u_Directional[i].direction, 1.0)).xyz;',
                'light = u_Directional[i].color * u_Directional[i].intensity;',
                'L = normalize(L);',

                'RE_Lambert(diffuseColor, light, N, L, gl_FragColor);',

                '#ifdef USE_PHONE',
                'V = normalize( ( u_ViewMat * vec4(u_Eye, 1.0) ).xyz - v_VmPos);',
                // 'RE_Phone(diffuseColor, light, N, L, V, 4., gl_FragColor);',
                'RE_BlinnPhone(diffuseColor, light, N, normalize(L), V, u_Specular, gl_FragColor);',
                '#endif',
            '}',
            '#endif',

            '#ifdef USE_POINT_LIGHT',
            'for(int i = 0; i < USE_POINT_LIGHT; i++) {',
                'L = ( u_ViewMat * vec4(u_Point[i].position, 1.0) ).xyz - v_VmPos;',
                'float dist = max(1. - length(L) * .005, 0.0);',
                'light = u_Point[i].color * u_Point[i].intensity * dist;',
                'L = normalize(L);',

                'RE_Lambert(diffuseColor, light, N, L, gl_FragColor);',

                '#ifdef USE_PHONE',
                'V = normalize( ( u_ViewMat * vec4(u_Eye, 1.0) ).xyz - v_VmPos);',
                // 'RE_Phone(diffuseColor, light, N, L, V, 4., gl_FragColor);',
                'RE_BlinnPhone(diffuseColor, light, N, normalize(L), V, u_Specular, gl_FragColor);',
                '#endif',
            '}',
            '#endif',
        '#endif',
    ].join("\n");

    var RE_Lambert = [
        'void RE_Lambert(vec4 k, vec4 light, vec3 N, vec3 L, inout vec4 reflectLight) {',
            'float dotNL = max(dot(N, L), 0.);',
            'reflectLight += k * light * dotNL;',
        '}'
    ].join("\n");

    var RE_Phone = [
        'void RE_Phone(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {',
            'vec3 R = max(dot(2.0 * N, L), 0.) * N - L;',
            'reflectLight += k * light * pow(max(dot(V, R), 0.), n_s);',
        '}'
    ].join("\n");

    var RE_BlinnPhone = [
        'void RE_BlinnPhone(vec4 k, vec4 light, vec3 N, vec3 L, vec3 V, float n_s, inout vec4 reflectLight) {',
            'vec3 H = normalize(L + V);',
            'reflectLight += k * light * pow(max(dot(N, H), 0.), n_s);',
        '}'
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
        'mat3 tsn(vec3 N, vec3 p, vec2 uv) {',

            'vec3 q0 = dFdx( p.xyz );',
            'vec3 q1 = dFdy( p.xyz );',
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
     * shader libs
     */
    var ShaderLib = {

        // basic shader
        basicVertex: [
            vertexCommon,

            '#ifdef USE_DIFFUSE_MAP',
                'attribute vec2 a_Uv;',
                'varying vec2 v_Uv;',
            '#endif',

            'void main() {',
                'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);',

                '#ifdef USE_DIFFUSE_MAP',
                    'v_Uv = a_Uv;',
                '#endif',
            '}'
        ].join("\n"),
        basicFragment: [
            fragmentCommon,

            '#ifdef USE_DIFFUSE_MAP',
                'varying vec2 v_Uv;',
                'uniform sampler2D texture;',
            '#endif',

            'void main() {',
                'gl_FragColor = vec4(0., 0., 0., 0.);',

                diffuseHandler,

                'gl_FragColor = diffuseColor;',
            '}'
        ].join("\n"),

        // lambert shader
        lambertVertex: [
            vertexCommon,

            '#ifdef USE_NORMAL',
                transpose,
                inverse,
            '#endif',

            '#ifdef USE_NORMAL',
                'attribute vec3 a_Normal;',
                'varying vec3 v_Normal;',
            '#endif',

            '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
                'attribute vec2 a_Uv;',
                'varying vec2 v_Uv;',
            '#endif',

            '#if defined(USE_POINT_LIGHT) || defined(USE_NORMAL_MAP)',
                'varying vec3 v_VmPos;',
            '#endif',

            'void main() {',
                'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);',

                '#ifdef USE_NORMAL',
                    'v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;',
                '#endif',

                '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
                    'v_Uv = a_Uv;',
                '#endif',

                '#if defined(USE_POINT_LIGHT) || defined(USE_NORMAL_MAP)',
                    'v_VmPos = (u_View * u_Model * vec4(a_Position, 1.0)).xyz;',
                '#endif',
            '}'
        ].join("\n"),
        lambertFragment: [
            fragmentCommon,

            '#ifdef USE_NORMAL_MAP',
                tsn,
                tbn,
            '#endif',

            '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
                'varying vec2 v_Uv;',
            '#endif',

            '#ifdef USE_DIFFUSE_MAP',
                'uniform sampler2D texture;',
            '#endif',

            '#ifdef USE_NORMAL_MAP',
                'uniform sampler2D normalMap;',
            '#endif',

            lightPars,

            '#ifdef USE_NORMAL',
                'varying vec3 v_Normal;',
            '#endif',

            '#if defined(USE_POINT_LIGHT) || defined(USE_NORMAL_MAP)',
                'varying vec3 v_VmPos;',
            '#endif',

            '#ifdef USE_POINT_LIGHT',
                'uniform mat4 u_ViewMat;',
            '#endif',

            '#ifdef USE_DIRECT_LIGHT',
                'uniform mat4 u_ViewITMat;',
            '#endif',

            RE_Lambert,

            'void main() {',
                'gl_FragColor = vec4(0., 0., 0., 0.);',

                diffuseHandler,

                // 'gl_FragColor += diffuseColor;',

                normalHandler,

                lightHandler,
            '}'
        ].join("\n"),

        // phone shader
        phoneVertex: [
            vertexCommon,

            '#ifdef USE_NORMAL',
                transpose,
                inverse,
            '#endif',

            '#ifdef USE_NORMAL',
                'attribute vec3 a_Normal;',
                'varying vec3 v_Normal;',
            '#endif',

            '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
                'attribute vec2 a_Uv;',
                'varying vec2 v_Uv;',
            '#endif',

            'varying vec3 v_VmPos;',

            'void main() {',
                'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);',

                '#ifdef USE_NORMAL',
                    'v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;',
                '#endif',

                '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
                    'v_Uv = a_Uv;',
                '#endif',

                'v_VmPos = (u_View * u_Model * vec4(a_Position, 1.0)).xyz;',
            '}'
        ].join("\n"),
        phoneFragment: [
            fragmentCommon,

            '#ifdef USE_NORMAL_MAP',
                tsn,
                tbn,
            '#endif',

            '#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP)',
                'varying vec2 v_Uv;',
            '#endif',

            '#ifdef USE_DIFFUSE_MAP',
                'uniform sampler2D texture;',
            '#endif',

            '#ifdef USE_NORMAL_MAP',
                'uniform sampler2D normalMap;',
            '#endif',

            lightPars,

            '#ifdef USE_NORMAL',
                'varying vec3 v_Normal;',
            '#endif',

            'varying vec3 v_VmPos;',

            'uniform mat4 u_ViewMat;',

            '#ifdef USE_DIRECT_LIGHT',
                'uniform mat4 u_ViewITMat;',
            '#endif',

            'uniform vec3 u_Eye;',
            'uniform float u_Specular;',

            RE_Lambert,
            RE_Phone,
            RE_BlinnPhone,

            'void main() {',
                'gl_FragColor = vec4(0., 0., 0., 0.);',

                diffuseHandler,

                // 'gl_FragColor += diffuseColor;',

                normalHandler,

                lightHandler,
            '}'
        ].join("\n")
    };

    zen3d.ShaderLib = ShaderLib;
})();
