(function() {

    var ShaderLib = {
        transpose: "mat4 transpose(mat4 inMatrix) { \n" +
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
        "} \n",
        inverse: "mat4 inverse(mat4 m) { \n" +
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
        "} \n",
        vertexBase: [
            'attribute vec3 a_Position;',

            'attribute vec3 a_Normal;',
            'varying vec3 v_Normal;',

            '#ifdef USE_DIFFUSE_MAP',
            'attribute vec2 a_Uv;',
            'varying vec2 v_Uv;',
            '#endif',

            'uniform mat4 u_Projection;',
            'uniform mat4 u_View;',
            'uniform mat4 u_Model;',

            '#ifdef USE_POINT_LIGHT',
            'varying vec3 v_VmPos;',
            '#endif',

            'void main() {',
                'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);',

                'v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;',

                '#ifdef USE_DIFFUSE_MAP',
                'v_Uv = a_Uv;',
                '#endif',

                '#ifdef USE_POINT_LIGHT',
                'v_VmPos = (u_View * u_Model * vec4(a_Position, 1.0)).xyz;',
                '#endif',
            '}'
        ].join("\n"),
        fragmentBase: [
            'precision mediump float;',

            '#ifdef USE_DIFFUSE_MAP',
            'varying vec2 v_Uv;',
            'uniform sampler2D texture;',
            '#endif',

            '#ifdef USE_DIFFUSE_COLOR',
            'uniform vec4 u_Color;',
            '#endif',

            '#ifdef USE_AMBIENT_LIGHT',
            'struct AmbientLight',
            '{',
                'vec4 color;',
                'float intensity;',
            '};',
            'uniform AmbientLight u_Ambient[USE_AMBIENT_LIGHT];',
            '#endif',

            '#ifdef USE_DIRECT_LIGHT',
            'struct DirectLight',
            '{',
                'vec3 direction;',
                'vec4 color;',
                'float intensity;',
            '};',
            'uniform DirectLight u_Directional[USE_DIRECT_LIGHT];',
            '#endif',

            '#ifdef USE_POINT_LIGHT',
            'struct PointLight',
            '{',
                'vec3 position;',
                'vec4 color;',
                'float intensity;',
            '};',
            'uniform PointLight u_Point[USE_POINT_LIGHT];',
            '#endif',

            'varying vec3 v_Normal;',

            '#ifdef USE_POINT_LIGHT',
            'varying vec3 v_VmPos;',
            'uniform mat4 u_ViewMat;',
            '#endif',

            '#ifdef USE_DIRECT_LIGHT',
            'uniform mat4 u_ViewITMat;',
            '#endif',

            'void main() {',

                '#ifdef USE_DIFFUSE_MAP',
                'vec4 color = texture2D(texture, v_Uv);',
                '#endif',

                '#ifdef USE_DIFFUSE_COLOR',
                'vec4 color = u_Color;',
                '#endif',

                '#ifdef USE_LIGHT',
                'vec3 normal = normalize(v_Normal);',
                '#endif',

                'gl_FragColor = vec4(0., 0., 0., 0.);',

                '#ifdef USE_AMBIENT_LIGHT',
                'for(int i = 0; i < USE_AMBIENT_LIGHT; i++) {',
                    'gl_FragColor += color * u_Ambient[i].color * u_Ambient[i].intensity;',
                '}',
                '#endif',

                '#ifdef USE_DIRECT_LIGHT',
                'for(int i = 0; i < USE_DIRECT_LIGHT; i++) {',
                    'vec3 direction = (u_ViewITMat * vec4(-u_Directional[i].direction, 0.0)).xyz;',
                    'direction = normalize(direction);',
                    'float dotL = dot(direction, normal);',
                    'float dL = max(dotL * u_Directional[i].intensity, 0.);',
                    'gl_FragColor += color * u_Directional[i].color * dL;',
                '}',
                '#endif',

                '#ifdef USE_POINT_LIGHT',
                'for(int i = 0; i < USE_POINT_LIGHT; i++) {',
                    'vec3 direction2 = ( u_ViewMat * vec4(u_Point[i].position, 1.0) ).xyz - v_VmPos;',
                    'float dist = max(1. - length(direction2) * .005, 0.0);',
                    'direction2 = normalize(direction2);',
                    'float dotL2 = dot(direction2, normal);',
                    'float pL = max(dotL2 * dist * u_Point[i].intensity, 0.);',
                    'gl_FragColor += color * u_Point[i].color * pL;',
                '}',
                '#endif',

            '}'
        ].join("\n")
    };

    zen3d.ShaderLib = ShaderLib;
})();
