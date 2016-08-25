(function() {
    /**
     * ColorShader
     * @class
     */
    var ColorShader = function(gl) {

        var vshader = [
            'attribute vec3 a_Position;',
            'attribute vec3 a_Normal;',
            'varying vec3 v_Normal;',
            'uniform mat4 u_Projection;',
            'uniform mat4 u_View;',
            'uniform mat4 u_Model;',
            'varying vec3 v_MPos;',
            'varying mat4 v_MvMat;',
            'varying mat4 v_View;',
            zen3d.transpose,
            zen3d.inverse,
            'void main() {',
                'gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);',
                'v_Normal = (transpose(inverse(u_View * u_Model)) * vec4(a_Normal, 1.0)).xyz;',
                'v_MPos = (u_View * u_Model * vec4(a_Position, 1.0)).xyz;',
                'v_MvMat = transpose(inverse(u_View));',
                'v_View = u_View;',
            '}'
        ].join("\n");

        var fshader = [
            'precision mediump float;',
            "uniform vec4 u_Color;",

            'uniform float u_Ambient;',
            'uniform vec4 u_AmbientColor;',
            'uniform vec4 u_Directional;',
            'uniform vec4 u_DirectionalColor;',
            'uniform vec4 u_Point;',
            'uniform vec4 u_PointColor;',

            'varying vec3 v_Normal;',
            'varying vec3 v_MPos;',
            'varying mat4 v_MvMat;',
            'varying mat4 v_View;',
            'void main() {',

                'vec3 normal = normalize(v_Normal);',

                'vec3 direction = (v_MvMat * vec4(-u_Directional.xyz, 0.0)).xyz;',
                'direction = normalize(direction);',
                'float dotL = dot(direction, normal);',
                'float dL = max(dotL * u_Directional.w, 0.);',

                'vec3 direction2 = ( v_View * vec4(u_Point.xyz, 1.0) ).xyz - v_MPos;',
                'float dist = max(1. - length(direction2) * .005, 0.0);',
                'direction2 = normalize(direction2);',
                'float dotL2 = dot(direction2, normal);',
                'float pL = max(dotL2 * dist * u_Point.w, 0.);',

                'gl_FragColor = u_Color * (u_AmbientColor * u_Ambient + u_DirectionalColor * dL + u_PointColor * pL);',
            '}'
        ].join("\n");

        ColorShader.superClass.constructor.call(this, gl, vshader, fshader);
    }

    zen3d.inherit(ColorShader, zen3d.Shader);

    zen3d.ColorShader = ColorShader;
})();
