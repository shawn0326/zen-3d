(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.zen3d = {})));
}(this, (function (exports) { 'use strict';

    /**
     * generate uuid
     */
    var generateUUID = (function () {

        // http://www.broofa.com/Tools/Math.uuid.htm

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
        var uuid = new Array( 36 );
        var rnd = 0, r;

        return function generateUUID() {

            for ( var i = 0; i < 36; i ++ ) {

                if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                    uuid[ i ] = '-';

                } else if ( i === 14 ) {

                    uuid[ i ] = '4';

                } else {

                    if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

                }

            }

            return uuid.join( '' );

        };

    })();

    /**
     * is mobile
     */
    var isMobile = (function () {
        if (!win["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    })();

    /**
     * is web
     */
    var isWeb = (function () {
        return !!document;
    })();

    /**
     * create checker board pixels
     */
    function createCheckerBoardPixels(width, height, blockSize) {
        var pixelArray = new Uint8Array(width * height * 4);

        // white and blasck
        var colors = [[255, 255, 255, 255], [0, 0, 0, 255]];

        blockSize = blockSize || 5;

        var colorIndex = 0;

        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width; x++) {

                if(x == 0) {
                    colorIndex = 1;
                } else if((x % blockSize) == 0) {
                    colorIndex = (colorIndex + 1) % 2;
                }

                if ((y % blockSize) == 0 && x == 0) {
                    var tmp = colors[0];
                    colors[0] = colors[1];
                    colors[1] = tmp;
                }

                pixelArray[(y * (width * 4) + x * 4) + 0] = colors[colorIndex][0];
                pixelArray[(y * (width * 4) + x * 4) + 1] = colors[colorIndex][1];
                pixelArray[(y * (width * 4) + x * 4) + 2] = colors[colorIndex][2];
                pixelArray[(y * (width * 4) + x * 4) + 3] = colors[colorIndex][3];
            }
        }

        return pixelArray;
    }

    function isPowerOfTwo(value) {
        return ( value & ( value - 1 ) ) === 0 && value !== 0;
    }

    function nearestPowerOfTwo( value ) {
        return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );
    }

    function nextPowerOfTwo( value ) {
        value --;
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        value ++;

        return value;
    }

    function cloneUniforms(uniforms_src) {
        var uniforms_dst = {};

        for(var name in uniforms_src) {
            var uniform_src = uniforms_src[name];
            // TODO zen3d object clone
            if ( Array.isArray( uniform_src ) ) {
                uniforms_dst[name] = uniform_src.slice();
            } else {
                uniforms_dst[name] = uniform_src;
            }
        }

        return uniforms_dst;
    }

    // Generate halton sequence
    // https://en.wikipedia.org/wiki/Halton_sequence
    function halton(index, base) {
        var result = 0;
        var f = 1 / base;
        var i = index;
        while (i > 0) {
            result = result + f * (i % base);
            i = Math.floor(i / base);
            f = f / base;
        }
        return result;
    }

    /**
     * OBJECT_TYPE
     */
    var OBJECT_TYPE = {
        MESH: "mesh",
        SKINNED_MESH: "skinned_mesh",
        LIGHT: "light",
        CAMERA: "camera",
        SCENE: "scene",
        GROUP: "group",
        POINT: "point",
        LINE: "line",
        LINE_LOOP: "line_loop",
        LINE_SEGMENTS: "line_segments",
        CANVAS2D: "canvas2d",
        SPRITE: "sprite",
        PARTICLE: "particle"
    };

    /**
     * LIGHT_TYPE
     */
    var LIGHT_TYPE = {
        AMBIENT: "ambient",
        DIRECT: "direct",
        POINT: "point",
        SPOT: "spot"
    };

    /**
     * MATERIAL_TYPE
     */
    var MATERIAL_TYPE = {
        BASIC: "basic",
        LAMBERT: "lambert",
        PHONG: "phong",
        PBR: "pbr",
        CUBE: "cube",
        POINT: "point",
        LINE: "line",
        LINE_LOOP: "lineloop",
        LINE_DASHED: "linedashed",
        CANVAS2D: "canvas2d",
        SPRITE: "sprite",
        SHADER: "shader",
        DEPTH: "depth",
        DISTANCE: "distance",
        PARTICLE: "particle"
    };

    /**
     * FOG_TYPE
     */
    var FOG_TYPE = {
        NORMAL: "normal",
        EXP2: "exp2"
    };

    /**
     * BLEND_TYPE
     */
    var BLEND_TYPE = {
        NONE: "none",
        NORMAL: "normal",
        ADD: "add",
        CUSTOM: "custom"
    };

    /**
     * BLEND_EQUATION
     */
    var BLEND_EQUATION = {
        ADD: 0x8006,
        SUBTRACT: 0x800A,
        REVERSE_SUBTRACT: 0x800B
    };

    /**
     * BLEND_FACTOR
     */
    var BLEND_FACTOR = {
        ZERO: 0,
        ONE: 1,
        SRC_COLOR: 0x0300,
        ONE_MINUS_SRC_COLOR: 0x0301,
        SRC_ALPHA: 0x0302,
        ONE_MINUS_SRC_ALPHA: 0x0303,
        DST_ALPHA: 0x0304,
        ONE_MINUS_DST_ALPHA: 0x0305,
        DST_COLOR: 0x0306,
        ONE_MINUS_DST_COLOR: 0x0307
    };

    /**
     * CULL_FACE_TYPE
     */
    var CULL_FACE_TYPE = {
        NONE: "none",
        FRONT: "front",
        BACK: "back",
        FRONT_AND_BACK: "front_and_back"
    };

    /**
     * DRAW_SIDE
     */
    var DRAW_SIDE = {
        FRONT: "front",
        BACK: "back",
        DOUBLE: "double"
    };

    /**
     * SHADING_TYPE
     */
    var SHADING_TYPE = {
        SMOOTH_SHADING: "smooth_shading",
        FLAT_SHADING: "flat_shading"
    };

    /**
     * WEBGL_TEXTURE_TYPE
     */
    var WEBGL_TEXTURE_TYPE = {
        TEXTURE_2D: 0x0DE1,
        TEXTURE_CUBE_MAP: 0x8513
    };

    /**
     * WEBGL_PIXEL_FORMAT
     */
    var WEBGL_PIXEL_FORMAT = {
        DEPTH_COMPONENT: 0x1902,
        ALPHA: 0x1906,
        RGB: 0x1907,
        RGBA: 0x1908,
        LUMINANCE: 0x1909,
        LUMINANCE_ALPHA: 0x190A
    };

    /**
     * WEBGL_PIXEL_TYPE
     */
    var WEBGL_PIXEL_TYPE = {
        BYTE: 0x1400,
        UNSIGNED_BYTE: 0x1401,
        SHORT: 0x1402,
        UNSIGNED_SHORT: 0x1403,
        INT: 0x1404,
        UNSIGNED_INT: 0x1405,
        FLOAT: 0x1406,
        HALF_FLOAT: 0x140B,
        UNSIGNED_INT_24_8: 0x84FA,
        UNSIGNED_SHORT_4_4_4_4:	0x8033,
        UNSIGNED_SHORT_5_5_5_1: 0x8034,
        UNSIGNED_SHORT_5_6_5: 0x8363
    };

    /**
     * WEBGL_TEXTURE_FILTER
     */
    var WEBGL_TEXTURE_FILTER = {
        NEAREST: 0x2600,
        LINEAR: 0x2601,
        NEAREST_MIPMAP_NEAREST: 0x2700,
        LINEAR_MIPMAP_NEAREST: 0x2701,
        NEAREST_MIPMAP_LINEAR: 0x2702,
        LINEAR_MIPMAP_LINEAR: 0x2703
    };

    /**
     * WEBGL_TEXTURE_WRAP
     */
    var WEBGL_TEXTURE_WRAP = {
        REPEAT:	0x2901,
        CLAMP_TO_EDGE: 0x812F,
        MIRRORED_REPEAT: 0x8370
    };

    // Taken from the WebGl spec:
    // http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14
    var WEBGL_UNIFORM_TYPE = {
        FLOAT_VEC2: 0x8B50,
        FLOAT_VEC3: 0x8B51,
        FLOAT_VEC4: 0x8B52,
        INT_VEC2: 0x8B53,
        INT_VEC3: 0x8B54,
        INT_VEC4: 0x8B55,
        BOOL: 0x8B56,
        BOOL_VEC2: 0x8B57,
        BOOL_VEC3: 0x8B58,
        BOOL_VEC4: 0x8B59,
        FLOAT_MAT2: 0x8B5A,
        FLOAT_MAT3: 0x8B5B,
        FLOAT_MAT4: 0x8B5C,
        SAMPLER_2D: 0x8B5E,
        SAMPLER_CUBE: 0x8B60,
        BYTE: 0xffff,
        UNSIGNED_BYTE: 0x1401,
        SHORT: 0x1402,
        UNSIGNED_SHORT: 0x1403,
        INT: 0x1404,
        UNSIGNED_INT: 0x1405,
        FLOAT: 0x1406
    };

    var WEBGL_ATTRIBUTE_TYPE = {
        FLOAT_VEC2: 0x8B50,
        FLOAT_VEC3: 0x8B51,
        FLOAT_VEC4: 0x8B52,
        FLOAT: 0x1406,
        BYTE: 0xffff,
        UNSIGNED_BYTE: 0x1401,
        UNSIGNED_SHORT: 0x1403
    };

    var WEBGL_BUFFER_USAGE = {
        STREAM_DRAW: 0x88e0,
        STATIC_DRAW: 0x88E4,
        DYNAMIC_DRAW: 0x88E8
    };

    var SHADOW_TYPE = {
        HARD: "hard",
        PCF_SOFT: "pcf_soft"
    };

    var TEXEL_ENCODING_TYPE = {
        LINEAR: "linear",
        SRGB: "sRGB",
        RGBE: "RGBE",
        RGBM7: "RGBM7",
        RGBM16: "RGBM16",
        RGBD: "RGBD",
        GAMMA: "Gamma"
    };

    var ENVMAP_COMBINE_TYPE = {
        MULTIPLY: "ENVMAP_BLENDING_MULTIPLY",
        MIX: "ENVMAP_BLENDING_MIX",
        ADD: "ENVMAP_BLENDING_ADD"
    };

    var DRAW_MODE = {
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6
    };

    var RENDER_LAYER = {
        DEFAULT: "default",
        TRANSPARENT: "transparent",
        CANVAS2D: "canvas2d",
        SPRITE: "sprite",
        PARTICLE: "particle"
    };

    var LAYER_RENDER_LIST = [
        RENDER_LAYER.DEFAULT,
        RENDER_LAYER.TRANSPARENT,
        RENDER_LAYER.CANVAS2D,
        RENDER_LAYER.SPRITE,
        RENDER_LAYER.PARTICLE
    ];

    /**
     * EventDispatcher Class
     **/
    function EventDispatcher() {
        this.eventMap = {};
    }

    Object.assign(EventDispatcher.prototype, {

        /**
         * add a event listener
         **/
        addEventListener: function(type, listener, thisObject) {
            var list = this.eventMap[type];

            if(!list) {
                list = this.eventMap[type] = [];
            }

            list.push({listener: listener, thisObject: thisObject || this});
        },

        /**
         * remove a event listener
         **/
        removeEventListener: function(type, listener, thisObject) {
            var list = this.eventMap[type];

            if(!list) {
                return;
            }

            for(var i = 0, len = list.length; i < len; i++) {
                var bin = list[i];
                if(bin.listener == listener && bin.thisObject == (thisObject || this)) {
                    list.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * dispatch a event
         **/
        dispatchEvent: function(event) {
            event.target = this;
            this.notifyListener(event);
        },

        /**
         * notify listener
         **/
        notifyListener: function(event) {
            var list = this.eventMap[event.type];

            if(!list) {
                return;
            }

            for(var i = 0, len = list.length; i < len; i++) {
                var bin = list[i];
                bin.listener.call(bin.thisObject, event);
            }
        }

    });

    /**
     * a 4x4 matrix class
     * @class
     */
    function Matrix4() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    Object.assign(Matrix4.prototype, {

        identity: function() {
            this.set(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );

            return this;
        },

        set: function(n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44) {

            var ele = this.elements;
            ele[0] = n11;
            ele[4] = n12;
            ele[8] = n13;
            ele[12] = n14;
            ele[1] = n21;
            ele[5] = n22;
            ele[9] = n23;
            ele[13] = n24;
            ele[2] = n31;
            ele[6] = n32;
            ele[10] = n33;
            ele[14] = n34;
            ele[3] = n41;
            ele[7] = n42;
            ele[11] = n43;
            ele[15] = n44;

            return this;
        },

        copy: function(m) {
            this.elements.set(m.elements);

            return this;
        },

        makeTranslation: function(x, y, z) {
            this.set(
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1
            );

            return this;
        },

        multiply: function(m) {

            return this.multiplyMatrices(this, m);

        },

        premultiply: function(m) {

            return this.multiplyMatrices(m, this);

        },

        multiplyMatrices: function(a, b) {

            var ae = a.elements;
            var be = b.elements;
            var te = this.elements;

            var a11 = ae[0],
                a12 = ae[4],
                a13 = ae[8],
                a14 = ae[12];
            var a21 = ae[1],
                a22 = ae[5],
                a23 = ae[9],
                a24 = ae[13];
            var a31 = ae[2],
                a32 = ae[6],
                a33 = ae[10],
                a34 = ae[14];
            var a41 = ae[3],
                a42 = ae[7],
                a43 = ae[11],
                a44 = ae[15];

            var b11 = be[0],
                b12 = be[4],
                b13 = be[8],
                b14 = be[12];
            var b21 = be[1],
                b22 = be[5],
                b23 = be[9],
                b24 = be[13];
            var b31 = be[2],
                b32 = be[6],
                b33 = be[10],
                b34 = be[14];
            var b41 = be[3],
                b42 = be[7],
                b43 = be[11],
                b44 = be[15];

            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return this;

        },

        transpose: function() {

            var te = this.elements;
            var tmp;

            tmp = te[1];
            te[1] = te[4];
            te[4] = tmp;
            tmp = te[2];
            te[2] = te[8];
            te[8] = tmp;
            tmp = te[6];
            te[6] = te[9];
            te[9] = tmp;

            tmp = te[3];
            te[3] = te[12];
            te[12] = tmp;
            tmp = te[7];
            te[7] = te[13];
            te[13] = tmp;
            tmp = te[11];
            te[11] = te[14];
            te[14] = tmp;

            return this;
        },

        inverse: function() {
            return this.getInverse(this);
        },

        getInverse: function(m) {

            // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
            var te = this.elements,
                me = m.elements,

                n11 = me[0],
                n21 = me[1],
                n31 = me[2],
                n41 = me[3],
                n12 = me[4],
                n22 = me[5],
                n32 = me[6],
                n42 = me[7],
                n13 = me[8],
                n23 = me[9],
                n33 = me[10],
                n43 = me[11],
                n14 = me[12],
                n24 = me[13],
                n34 = me[14],
                n44 = me[15],

                t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
                t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
                t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
                t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

            var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

            if (det === 0) {

                console.warn("can't invert matrix, determinant is 0");

                return this.identity();

            }

            var detInv = 1 / det;

            te[0] = t11 * detInv;
            te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
            te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
            te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

            te[4] = t12 * detInv;
            te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
            te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
            te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

            te[8] = t13 * detInv;
            te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
            te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
            te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

            te[12] = t14 * detInv;
            te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
            te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
            te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

            return this;

        },

        /**
         * make transform from pos&scale&rotation(Quaternion)
         **/
        transform: function() {

            var matrix = new Matrix4();

            return function(pos, scale, rot) {

                var rotMatrix = rot.toMatrix4(matrix);
        
                var rele = rotMatrix.elements;
                var ele = this.elements;
        
                ele[0] = rele[0] * scale.x;
                ele[1] = rele[1] * scale.x;
                ele[2] = rele[2] * scale.x;
                ele[3] = 0;
        
                ele[4] = rele[4] * scale.y;
                ele[5] = rele[5] * scale.y;
                ele[6] = rele[6] * scale.y;
                ele[7] = 0;
        
                ele[8] = rele[8] * scale.z;
                ele[9] = rele[9] * scale.z;
                ele[10] = rele[10] * scale.z;
                ele[11] = 0;
        
                ele[12] = pos.x;
                ele[13] = pos.y;
                ele[14] = pos.z;
                ele[15] = 1;
        
                return this;
            }
        }(),

        makeRotationFromQuaternion: function(q) {

            var te = this.elements;

            var x = q.x,
                y = q.y,
                z = q.z,
                w = q.w;
            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;
            var xx = x * x2,
                xy = x * y2,
                xz = x * z2;
            var yy = y * y2,
                yz = y * z2,
                zz = z * z2;
            var wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            te[0] = 1 - (yy + zz);
            te[4] = xy - wz;
            te[8] = xz + wy;

            te[1] = xy + wz;
            te[5] = 1 - (xx + zz);
            te[9] = yz - wx;

            te[2] = xz - wy;
            te[6] = yz + wx;
            te[10] = 1 - (xx + yy);

            // last column
            te[3] = 0;
            te[7] = 0;
            te[11] = 0;

            // bottom row
            te[12] = 0;
            te[13] = 0;
            te[14] = 0;
            te[15] = 1;

            return this;

        },

        lookAtRH: function() {
            var x = new Vector3();
            var y = new Vector3();
            var z = new Vector3();
            
            return function lookAtRH(eye, target, up) {
                var te = this.elements;

                z.subVectors( eye, target );

                if(z.getLengthSquared() === 0) {

                    // eye and target are in the same position

                    z.z = 1;
                    
                }

                z.normalize();
                x.crossVectors( up, z );
                
                if ( x.getLengthSquared() === 0 ) {

                    // up and z are parallel

                    if ( Math.abs( up.z ) === 1 ) {

                        z.x += 0.0001;

                    } else {

                        z.z += 0.0001;

                    }

                    z.normalize();
                    x.crossVectors( up, z );

                }

                x.normalize();
                y.crossVectors( z, x );

                te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
                te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
                te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

                return this;
            }
            
        }(),

        decompose: function() {
        
            var vector = new Vector3(), matrix = new Matrix4();

            return function(position, quaternion, scale) {
        
                var te = this.elements;
        
                var sx = vector.set(te[0], te[1], te[2]).getLength();
                var sy = vector.set(te[4], te[5], te[6]).getLength();
                var sz = vector.set(te[8], te[9], te[10]).getLength();
        
                // if determine is negative, we need to invert one scale
                var det = this.determinant();
                if (det < 0) {
                    sx = -sx;
                }
        
                position.x = te[12];
                position.y = te[13];
                position.z = te[14];
        
                // scale the rotation part
        
                matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()
        
                var invSX = 1 / sx;
                var invSY = 1 / sy;
                var invSZ = 1 / sz;
        
                matrix.elements[0] *= invSX;
                matrix.elements[1] *= invSX;
                matrix.elements[2] *= invSX;
        
                matrix.elements[4] *= invSY;
                matrix.elements[5] *= invSY;
                matrix.elements[6] *= invSY;
        
                matrix.elements[8] *= invSZ;
                matrix.elements[9] *= invSZ;
                matrix.elements[10] *= invSZ;
        
                quaternion.setFromRotationMatrix(matrix);
        
                scale.x = sx;
                scale.y = sy;
                scale.z = sz;
        
                return this;
            }
        }(),

        determinant: function() {

            var te = this.elements;

            var n11 = te[0],
                n12 = te[4],
                n13 = te[8],
                n14 = te[12];
            var n21 = te[1],
                n22 = te[5],
                n23 = te[9],
                n24 = te[13];
            var n31 = te[2],
                n32 = te[6],
                n33 = te[10],
                n34 = te[14];
            var n41 = te[3],
                n42 = te[7],
                n43 = te[11],
                n44 = te[15];

            //TODO: make this more efficient
            //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

            return (
                n41 * (+n14 * n23 * n32 -
                    n13 * n24 * n32 -
                    n14 * n22 * n33 +
                    n12 * n24 * n33 +
                    n13 * n22 * n34 -
                    n12 * n23 * n34
                ) +
                n42 * (+n11 * n23 * n34 -
                    n11 * n24 * n33 +
                    n14 * n21 * n33 -
                    n13 * n21 * n34 +
                    n13 * n24 * n31 -
                    n14 * n23 * n31
                ) +
                n43 * (+n11 * n24 * n32 -
                    n11 * n22 * n34 -
                    n14 * n21 * n32 +
                    n12 * n21 * n34 +
                    n14 * n22 * n31 -
                    n12 * n24 * n31
                ) +
                n44 * (-n13 * n22 * n31 -
                    n11 * n23 * n32 +
                    n11 * n22 * n33 +
                    n13 * n21 * n32 -
                    n12 * n21 * n33 +
                    n12 * n23 * n31
                )

            );

        },

        fromArray: function(array, offset) {
            if (offset === undefined) offset = 0;

            for (var i = 0; i < 16; i++) {
                this.elements[i] = array[i + offset];
            }

            return this;
        },

        getMaxScaleOnAxis: function() {
            var te = this.elements;

            var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
            var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
            var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

            return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
        },

        toArray: function(array, offset) {
            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            var te = this.elements;

            array[offset] = te[0];
            array[offset + 1] = te[1];
            array[offset + 2] = te[2];
            array[offset + 3] = te[3];

            array[offset + 4] = te[4];
            array[offset + 5] = te[5];
            array[offset + 6] = te[6];
            array[offset + 7] = te[7];

            array[offset + 8] = te[8];
            array[offset + 9] = te[9];
            array[offset + 10] = te[10];
            array[offset + 11] = te[11];

            array[offset + 12] = te[12];
            array[offset + 13] = te[13];
            array[offset + 14] = te[14];
            array[offset + 15] = te[15];

            return array;
        }

    });

    /**
     * a vector 3 class
     * @class
     */
    function Vector3(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    Object.assign(Vector3.prototype, {

        lerpVectors: function(v1, v2, ratio) {
            return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
        },

        set: function(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;

            return this;
        },

        min: function(v) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z);

            return this;
        },

        max: function(v) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z);

            return this;
        },

        getLength: function() {
            return Math.sqrt(this.getLengthSquared());
        },

        getLengthSquared: function() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        },

        normalize: function(thickness) {
            thickness = thickness || 1;
            var length = this.getLength();
            if (length != 0) {
                var invLength = thickness / length;
                this.x *= invLength;
                this.y *= invLength;
                this.z *= invLength;
                return this;
            }
        },

        subtract: function(a, target) {
            if (!target) {
                target = new Vector3();
            }
            target.set(this.x - a.x, this.y - a.y, this.z - a.z);
            return target;
        },

        multiply: function ( v ) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;

            return this;
        },

        crossVectors: function(a, b) {
            var ax = a.x,
                ay = a.y,
                az = a.z;
            var bx = b.x,
                by = b.y,
                bz = b.z;

            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;

            return this;
        },

        cross: function(v) {
            var x = this.x,
                y = this.y,
                z = this.z;

            this.x = y * v.z - z * v.y;
            this.y = z * v.x - x * v.z;
            this.z = x * v.y - y * v.x;

            return this;
        },

        dot: function(a) {
            return this.x * a.x + this.y * a.y + this.z * a.z;
        },

        applyQuaternion: function(q) {

            var x = this.x,
                y = this.y,
                z = this.z;
            var qx = q._x,
                qy = q._y,
                qz = q._z,
                qw = q._w;

            // calculate quat * vector

            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;

            // calculate result * inverse quat

            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

            return this;
        },

        applyMatrix4: function(m) {

            // input: Matrix4 affine matrix

            var x = this.x,
                y = this.y,
                z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

            return this;

        },

        applyMatrix3: function ( m ) {

            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
            this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
            this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

            return this;

        },

        transformDirection: function(m) {

            // input: Matrix4 affine matrix
            // vector interpreted as a direction

            var x = this.x,
                y = this.y,
                z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z;
            this.y = e[1] * x + e[5] * y + e[9] * z;
            this.z = e[2] * x + e[6] * y + e[10] * z;

            return this.normalize();

        },

        setFromMatrixPosition: function(m) {

            return this.setFromMatrixColumn(m, 3);

        },

        setFromMatrixColumn: function(m, index) {

            return this.fromArray(m.elements, index * 4);

        },

        fromArray: function(array, offset) {

            if (offset === undefined) offset = 0;

            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];

            return this;

        },

        copy: function(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;
        },

        addVectors: function(a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;

            return this;
        },

        addScalar: function(s) {
            this.x += s;
            this.y += s;
            this.z += s;

            return this;
        },

        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;

            return this;
        },

        subVectors: function(a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;

            return this;
        },

        sub: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;

            return this;
        },

        multiplyScalar: function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;

            return this;
        },

        distanceToSquared: function(v) {
            var dx = this.x - v.x,
                dy = this.y - v.y,
                dz = this.z - v.z;

            return dx * dx + dy * dy + dz * dz;
        },

        distanceTo: function(v) {
            return Math.sqrt(this.distanceToSquared(v));
        },

        setFromSpherical: function (s) {
            var sinPhiRadius = Math.sin( s.phi ) * s.radius;

            this.x = sinPhiRadius * Math.sin( s.theta );
            this.y = Math.cos( s.phi ) * s.radius;
            this.z = sinPhiRadius * Math.cos( s.theta );

            return this;
        },

        unproject: function() {
            var matrix;

            return function unproject(camera) {
                if (matrix === undefined) matrix = new Matrix4();

                matrix.multiplyMatrices(camera.worldMatrix, matrix.getInverse(camera.projectionMatrix));
                return this.applyProjection(matrix);
            };
        }(),

        applyProjection: function(m) {
            // input: Matrix4 projection matrix
            var x = this.x,
                y = this.y,
                z = this.z;
            var e = m.elements;
            var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

            return this;
        },

        equals: function(v) {
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
        },

        clone: function() {
            return new Vector3(this.x, this.y, this.z);
        }

    });

    function Ray(origin, direction) {
        this.origin = (origin !== undefined) ? origin : new Vector3();
        this.direction = (direction !== undefined) ? direction : new Vector3();
    }

    Object.assign(Ray.prototype, {

        set: function(origin, direction) {
            this.origin.copy(origin);
            this.direction.copy(direction);
        },

        at: function(t, optionalTarget) {
            var result = optionalTarget || new Vector3();

            return result.copy(this.direction).multiplyScalar(t).add(this.origin);
        },

        intersectsSphere: function() {
            var v1 = new Vector3();

            return function intersectSphere(sphere, optionalTarget) {
                v1.subVectors(sphere.center, this.origin);
                var tca = v1.dot(this.direction);
                var d2 = v1.dot(v1) - tca * tca;
                var radius2 = sphere.radius * sphere.radius;
                if (d2 > radius2) {
                    return null;
                }

                var thc = Math.sqrt(radius2 - d2);

                // t0 = first intersect point - entrance on front of sphere
                var t0 = tca - thc;

                // t1 = second intersect point - exit point on back of sphere
                var t1 = tca + thc;
                // console.log(t0, t1);
                // test to see if both t0 and t1 are behind the ray - if so, return null
                if (t0 < 0 && t1 < 0) {
                    return null;
                }
                // test to see if t0 is behind the ray:
                // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
                // in order to always return an intersect point that is in front of the ray.
                if (t0 < 0) {
                    return this.at(t1, optionalTarget);
                }

                // else t0 is in front of the ray, so return the first collision point scaled by t0
                return this.at(t0, optionalTarget);
            };
        }(),

        intersectsBox: function(box, optionalTarget) {
            var tmin, tmax, tymin, tymax, tzmin, tzmax;

            var invdirx = 1 / this.direction.x,
                invdiry = 1 / this.direction.y,
                invdirz = 1 / this.direction.z;

            var origin = this.origin;

            if (invdirx >= 0) {

                tmin = (box.min.x - origin.x) * invdirx;
                tmax = (box.max.x - origin.x) * invdirx;

            } else {

                tmin = (box.max.x - origin.x) * invdirx;
                tmax = (box.min.x - origin.x) * invdirx;

            }

            if (invdiry >= 0) {

                tymin = (box.min.y - origin.y) * invdiry;
                tymax = (box.max.y - origin.y) * invdiry;

            } else {

                tymin = (box.max.y - origin.y) * invdiry;
                tymax = (box.min.y - origin.y) * invdiry;

            }

            if ((tmin > tymax) || (tymin > tmax)) return null;

            // These lines also handle the case where tmin or tmax is NaN
            // (result of 0 * Infinity). x !== x returns true if x is NaN

            if (tymin > tmin || tmin !== tmin) tmin = tymin;

            if (tymax < tmax || tmax !== tmax) tmax = tymax;

            if (invdirz >= 0) {

                tzmin = (box.min.z - origin.z) * invdirz;
                tzmax = (box.max.z - origin.z) * invdirz;

            } else {

                tzmin = (box.max.z - origin.z) * invdirz;
                tzmax = (box.min.z - origin.z) * invdirz;

            }

            if ((tmin > tzmax) || (tzmin > tmax)) return null;

            if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

            if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

            //return point closest to the ray (positive side)

            if (tmax < 0) return null;

            return this.at(tmin >= 0 ? tmin : tmax, optionalTarget);
        },

        intersectTriangle: function() {

            // Compute the offset origin, edges, and normal.
            var diff = new Vector3();
            var edge1 = new Vector3();
            var edge2 = new Vector3();
            var normal = new Vector3();

            return function intersectTriangle(a, b, c, backfaceCulling, optionalTarget) {
                // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

                edge1.subVectors(b, a);
                edge2.subVectors(c, a);
                normal.crossVectors(edge1, edge2);

                // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
                // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
                //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
                //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
                //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
                var DdN = this.direction.dot(normal);
                var sign;
                if (DdN > 0) {

                    if (backfaceCulling) return null;
                    sign = 1;

                } else if (DdN < 0) {

                    sign = -1;
                    DdN = -DdN;

                } else {

                    return null;

                }

                diff.subVectors(this.origin, a);
                var DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));

                // b1 < 0, no intersection
                if (DdQxE2 < 0) {

                    return null;

                }

                var DdE1xQ = sign * this.direction.dot(edge1.cross(diff));

                // b2 < 0, no intersection
                if (DdE1xQ < 0) {

                    return null;

                }

                // b1+b2 > 1, no intersection
                if (DdQxE2 + DdE1xQ > DdN) {

                    return null;

                }

                // Line intersects triangle, check if ray does.
                var QdN = -sign * diff.dot(normal);

                // t < 0, no intersection
                if (QdN < 0) {

                    return null;

                }

                // Ray intersects triangle.
                return this.at(QdN / DdN, optionalTarget);
            }
        }(),

        copy: function(ray) {
            this.origin.copy(ray.origin);
            this.direction.copy(ray.direction);

            return this;
        },

        applyMatrix4: function(matrix4) {
            this.direction.add(this.origin).applyMatrix4(matrix4);
            this.origin.applyMatrix4(matrix4);
            this.direction.sub(this.origin);
            this.direction.normalize();

            return this;
        }

    });

    function Raycaster(origin, direction, near, far) {
        this.ray = new Ray(origin, direction);

        this.near = near || 0;

        this.far = far || Infinity;
    }

    function ascSort(a, b) {
        return a.distance - b.distance;
    }

    function intersectObject(object, raycaster, intersects, recursive) {
        object.raycast(raycaster, intersects);

        if (recursive === true) {
            var children = object.children;

            for (var i = 0, l = children.length; i < l; i++) {
                intersectObject(children[i], raycaster, intersects, true);
            }
        }
    }

    Object.assign(Raycaster.prototype, {

        set: function(origin, direction) {
            this.ray.set(origin, direction);
        },

        setFromCamera: function(coords, camera) {
            // if ((camera && camera.isPerspectiveCamera)) {
                this.ray.origin.setFromMatrixPosition(camera.worldMatrix);
                this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
            // } else if ((camera && camera.isOrthographicCamera)) {
            //     this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
            //     this.ray.direction.set(0, 0, -1).transformDirection(camera.worldMatrix);
            // } else {
            //     console.error('Raycaster: Unsupported camera type.');
            // }
        },

        intersectObject: function(object, recursive) {
            var intersects = [];

            intersectObject(object, this, intersects, recursive);

            intersects.sort(ascSort);

            return intersects;
        },

        intersectObjects: function(objects, recursive) {
            var intersects = [];

            if (Array.isArray(objects) === false) {
                console.warn('Raycaster.intersectObjects: objects is not an Array.');
                return intersects;
            }

            for (var i = 0, l = objects.length; i < l; i++) {
                intersectObject(objects[i], this, intersects, recursive);
            }

            intersects.sort(ascSort);

            return intersects;
        }

    });

    /**
     * a Euler class
     * @class
     */
    function Euler(x, y, z, order) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._order = order || Euler.DefaultOrder;
    }

    Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

    Euler.DefaultOrder = 'XYZ';

    Object.defineProperties(Euler.prototype, {
        x: {
            get: function() {
                return this._x;
            },
            set: function(value) {
                this._x = value;
                this.onChangeCallback();
            }
        },
        y: {
            get: function() {
                return this._y;
            },
            set: function(value) {
                this._y = value;
                this.onChangeCallback();
            }
        },
        z: {
            get: function() {
                return this._z;
            },
            set: function(value) {
                this._z = value;
                this.onChangeCallback();
            }
        },
        order: {
            get: function() {
                return this._order;
            },
            set: function(value) {
                this._order = value;
                this.onChangeCallback();
            }
        }
    });

    Object.assign(Euler.prototype, {

        copyFrom: function(euler) {
            this._x = euler._x;
            this._y = euler._y;
            this._z = euler._z;
            this._order = euler._order;

            this.onChangeCallback();

            return this;
        },

        set: function(x, y, z, order) {
            this._x = x || 0;
            this._y = y || 0;
            this._z = z || 0;
            this._order = order || this._order;

            this.onChangeCallback();

            return this;
        },

        setFromRotationMatrix: function(m, order, update) {

            var clamp = function(value, min, max) {

                return Math.max( min, Math.min( max, value ) );

            };

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var te = m.elements;
            var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
            var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
            var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

            order = order || this._order;

            if ( order === 'XYZ' ) {

                this._y = Math.asin( clamp( m13, - 1, 1 ) );

                if ( Math.abs( m13 ) < 0.99999 ) {

                    this._x = Math.atan2( - m23, m33 );
                    this._z = Math.atan2( - m12, m11 );

                } else {

                    this._x = Math.atan2( m32, m22 );
                    this._z = 0;

                }

            } else if ( order === 'YXZ' ) {

                this._x = Math.asin( - clamp( m23, - 1, 1 ) );

                if ( Math.abs( m23 ) < 0.99999 ) {

                    this._y = Math.atan2( m13, m33 );
                    this._z = Math.atan2( m21, m22 );

                } else {

                    this._y = Math.atan2( - m31, m11 );
                    this._z = 0;

                }

            } else if ( order === 'ZXY' ) {

                this._x = Math.asin( clamp( m32, - 1, 1 ) );

                if ( Math.abs( m32 ) < 0.99999 ) {

                    this._y = Math.atan2( - m31, m33 );
                    this._z = Math.atan2( - m12, m22 );

                } else {

                    this._y = 0;
                    this._z = Math.atan2( m21, m11 );

                }

            } else if ( order === 'ZYX' ) {

                this._y = Math.asin( - clamp( m31, - 1, 1 ) );

                if ( Math.abs( m31 ) < 0.99999 ) {

                    this._x = Math.atan2( m32, m33 );
                    this._z = Math.atan2( m21, m11 );

                } else {

                    this._x = 0;
                    this._z = Math.atan2( - m12, m22 );

                }

            } else if ( order === 'YZX' ) {

                this._z = Math.asin( clamp( m21, - 1, 1 ) );

                if ( Math.abs( m21 ) < 0.99999 ) {

                    this._x = Math.atan2( - m23, m22 );
                    this._y = Math.atan2( - m31, m11 );

                } else {

                    this._x = 0;
                    this._y = Math.atan2( m13, m33 );

                }

            } else if ( order === 'XZY' ) {

                this._z = Math.asin( - clamp( m12, - 1, 1 ) );

                if ( Math.abs( m12 ) < 0.99999 ) {

                    this._x = Math.atan2( m32, m22 );
                    this._y = Math.atan2( m13, m11 );

                } else {

                    this._x = Math.atan2( - m23, m33 );
                    this._y = 0;

                }

            } else {

                console.warn( 'given unsupported order: ' + order );

            }

            this._order = order;

            if ( update !== false ) this.onChangeCallback();

            return this;

        },

        setFromQuaternion: function() {

            var matrix = new Matrix4();

            return function(q, order, update) {
        
                q.toMatrix4(matrix);
        
                return this.setFromRotationMatrix(matrix, order, update);
        
            };

        }(),

        onChange: function(callback) {
            this.onChangeCallback = callback;

            return this;
        },

        onChangeCallback: function() {}

    });

    /**
     * a vector 2 class
     * @class
     */
    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Object.assign(Vector2.prototype, {

        set: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;

            return this;
        },

        lerpVectors: function(v1, v2, ratio) {
            return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
        },

        min: function(v) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);

            return this;
        },

        max: function(v) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);

            return this;
        },

        getLength: function() {
            return Math.sqrt(this.getLengthSquared());
        },

        getLengthSquared: function() {
            return this.x * this.x + this.y * this.y;
        },

        normalize: function(thickness) {
            thickness = thickness || 1;
            var length = this.getLength();
            if (length != 0) {
                var invLength = thickness / length;
                this.x *= invLength;
                this.y *= invLength;
                return this;
            }
        },

        subtract: function(a, target) {
            if (!target) {
                target = new Vector2();
            }
            target.set(this.x - a.x, this.y - a.y);
            return target;
        },

        copy: function(v) {
            this.x = v.x;
            this.y = v.y;

            return this;
        },

        addVectors: function(a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;

            return this;
        },

        subVectors: function(a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;

            return this;
        },

        multiplyScalar: function(scalar) {
            this.x *= scalar;
            this.y *= scalar;

            return this;
        },

        distanceToSquared: function(v) {
            var dx = this.x - v.x,
                dy = this.y - v.y;

            return dx * dx + dy * dy;
        },

        distanceTo: function(v) {
            return Math.sqrt(this.distanceToSquared(v));
        },

        fromArray: function(array, offset) {
            if (offset === undefined) offset = 0;

            this.x = array[offset];
            this.y = array[offset + 1];

            return this;
        },

        add: function(v) {
            this.x += v.x;
            this.y += v.y;

            return this;
        },

        clone: function() {
            return new Vector2(this.x, this.y);
        }

    });

    /**
     * a vector 4 class
     * @class
     */
    function Vector4(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;
    }

    Object.assign(Vector4.prototype, {

        lerpVectors: function(v1, v2, ratio) {
            return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
        },

        set: function(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = ( w !== undefined ) ? w : 1;

            return this;
        },

        normalize: function () {

            return this.multiplyScalar( 1 / (this.getLength() || 1) );

        },

        multiplyScalar: function ( scalar ) {

            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            this.w *= scalar;

            return this;

        },

        getLengthSquared: function () {

            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

        },

        getLength: function () {

            return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

        },

        applyMatrix4: function(m) {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var e = m.elements;

            this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
            this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
            this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
            this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

            return this;
        },

        equals: function(v) {
            return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );
        },

        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += v.w;

            return this;
        },

        multiply: function ( v ) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            this.w *= v.w;

            return this;
        },

        multiplyScalar: function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            this.w *= scalar;

            return this;
        },

        subVectors: function(a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;

            return this;
        },

        copy: function(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = ( v.w !== undefined ) ? v.w : 1;

            return this;
        }

    });

    /**
     * a 3x3 matrix class
     * @class
     */
    function Matrix3() {
        this.elements = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    Object.assign(Matrix3.prototype, {

        identity: function() {
            this.set(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );

            return this;
        },

        inverse: function() {
            return this.getInverse(this);
        },

        getInverse: function ( matrix ) {

            var me = matrix.elements,
                te = this.elements,

                n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ],
                n12 = me[ 3 ], n22 = me[ 4 ], n32 = me[ 5 ],
                n13 = me[ 6 ], n23 = me[ 7 ], n33 = me[ 8 ],

                t11 = n33 * n22 - n32 * n23,
                t12 = n32 * n13 - n33 * n12,
                t13 = n23 * n12 - n22 * n13,

                det = n11 * t11 + n21 * t12 + n31 * t13;

            if ( det === 0 ) {

                var msg = "zen3d.Matrix3: .getInverse() can't invert matrix, determinant is 0";
                console.warn( msg );
                return this.identity();

            }

            var detInv = 1 / det;

            te[ 0 ] = t11 * detInv;
            te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
            te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

            te[ 3 ] = t12 * detInv;
            te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
            te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

            te[ 6 ] = t13 * detInv;
            te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
            te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

            return this;

        },

        transpose: function () {

            var tmp, m = this.elements;

            tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
            tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
            tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

            return this;

        },

        set: function(n11, n12, n13,
            n21, n22, n23,
            n31, n32, n33) {

            var ele = this.elements;
            ele[0] = n11;
            ele[3] = n12;
            ele[6] = n13;

            ele[1] = n21;
            ele[4] = n22;
            ele[7] = n23;

            ele[2] = n31;
            ele[5] = n32;
            ele[8] = n33;

            return this;
        },

        copy: function(m) {
            this.elements.set(m.elements);

            return this;
        },

        multiply: function(m) {

            return this.multiplyMatrices(this, m);

        },

        premultiply: function(m) {

            return this.multiplyMatrices(m, this);

        },

        multiplyMatrices: function(a, b) {

            var ae = a.elements;
            var be = b.elements;
            var te = this.elements;

            var a11 = ae[0],
                a12 = ae[3],
                a13 = ae[6];
            var a21 = ae[1],
                a22 = ae[4],
                a23 = ae[7];
            var a31 = ae[2],
                a32 = ae[5],
                a33 = ae[8];

            var b11 = be[0],
                b12 = be[3],
                b13 = be[6];
            var b21 = be[1],
                b22 = be[4],
                b23 = be[7];
            var b31 = be[2],
                b32 = be[5],
                b33 = be[8];

            te[0] = a11 * b11 + a12 * b21 + a13 * b31;
            te[3] = a11 * b12 + a12 * b22 + a13 * b32;
            te[6] = a11 * b13 + a12 * b23 + a13 * b33;

            te[1] = a21 * b11 + a22 * b21 + a23 * b31;
            te[4] = a21 * b12 + a22 * b22 + a23 * b32;
            te[7] = a21 * b13 + a22 * b23 + a23 * b33;

            te[2] = a31 * b11 + a32 * b21 + a33 * b31;
            te[5] = a31 * b12 + a32 * b22 + a33 * b32;
            te[8] = a31 * b13 + a32 * b23 + a33 * b33;

            return this;

        },

        // transform 2d
        transform: function(x, y, scaleX, scaleY, rotation, anchorX, anchorY) {
            var te = this.elements;

            var cr = 1;
            var sr = 0;
            if (rotation % 360) {
                var r = rotation;
                cr = Math.cos(r);
                sr = Math.sin(r);
            }

            te[0] = cr * scaleX;
            te[3] = -sr * scaleY;
            te[6] = x;

            te[1] = sr * scaleX;
            te[4] = cr * scaleY;
            te[7] = y;

            te[2] = 0;
            te[5] = 0;
            te[8] = 1;

            if (anchorX || anchorY) {
                // prepend the anchor offset:
                te[6] -= anchorX * te[0] + anchorY * te[3];
                te[7] -= anchorX * te[1] + anchorY * te[4];
            }

            return this;
        },

        setUvTransform: function ( tx, ty, sx, sy, rotation, cx, cy ) {

            var c = Math.cos( rotation );
            var s = Math.sin( rotation );

            this.set(
                sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
                - sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
                0, 0, 1
            );

        },

        setFromMatrix4: function ( m ) {

            var me = m.elements;

            this.set(

                me[ 0 ], me[ 4 ], me[ 8 ],
                me[ 1 ], me[ 5 ], me[ 9 ],
                me[ 2 ], me[ 6 ], me[ 10 ]

            );

            return this;

        }

    });

    /**
     * a Quaternion class
     * @class
     */
    function Quaternion(x, y, z, w) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = ( w !== undefined ) ? w : 1;
    }

    Object.defineProperties(Quaternion.prototype, {
        x: {
            get: function() {
                return this._x;
            },
            set: function(value) {
                this._x = value;
                this.onChangeCallback();
            }
        },
        y: {
            get: function() {
                return this._y;
            },
            set: function(value) {
                this._y = value;
                this.onChangeCallback();
            }
        },
        z: {
            get: function() {
                return this._z;
            },
            set: function(value) {
                this._z = value;
                this.onChangeCallback();
            }
        },
        w: {
            get: function() {
                return this._w;
            },
            set: function(value) {
                this._w = value;
                this.onChangeCallback();
            }
        }
    });

    Quaternion.prototype = Object.assign(Quaternion.prototype, {

        normalize: function(thickness) {
            var l = this.length();

            if ( l === 0 ) {

                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._w = 1;

            } else {

                l = 1 / l;

                this._x = this._x * l;
                this._y = this._y * l;
                this._z = this._z * l;
                this._w = this._w * l;

            }

            this.onChangeCallback();

            return this;
        },

        length: function () {
            return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );
        },

        /*
        * Linearly interpolates between two quaternions.
        */
        lerpQuaternions: function(q1, q2, ratio) {
            var w1 = q1._w, x1 = q1._x, y1 = q1._y, z1 = q1._z;
            var w2 = q2._w, x2 = q2._x, y2 = q2._y, z2 = q2._z;
            var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

            // shortest direction
            if (dot < 0) {
                dot = -dot;
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }

            this._w = w1 + ratio * (w2 - w1);
            this._x = x1 + ratio * (x2 - x1);
            this._y = y1 + ratio * (y2 - y1);
            this._z = z1 + ratio * (z2 - z1);
            var len = 1.0 / Math.sqrt(this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z);
            this._w *= len;
            this._x *= len;
            this._y *= len;
            this._z *= len;

            this.onChangeCallback();

            return this;
        },

        /*
        * Spherically interpolates between two quaternions
        * providing an interpolation between rotations with constant angle change rate.
        */
        slerpQuaternions: function(q1, q2, ratio) {
            var w1 = q1._w, x1 = q1._x, y1 = q1._y, z1 = q1._z;
            var w2 = q2._w, x2 = q2._x, y2 = q2._y, z2 = q2._z;
            var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

            // shortest direction
            if (dot < 0) {
                dot = -dot;
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }

            if (dot < 0.95) {
                var angle = Math.acos(dot);
                var s = 1 / Math.sin(angle);
                var s1 = Math.sin(angle * (1 - ratio)) * s;
                var s2 = Math.sin(angle * ratio) * s;
                this._w = w1 * s1 + w2 * s2;
                this._x = x1 * s1 + x2 * s2;
                this._y = y1 * s1 + y2 * s2;
                this._z = z1 * s1 + z2 * s2;
            } else {
                // nearly identical angle, interpolate linearly
                this._w = w1 + ratio * (w2 - w1);
                this._x = x1 + ratio * (x2 - x1);
                this._y = y1 + ratio * (y2 - y1);
                this._z = z1 + ratio * (z2 - z1);
                var len = 1.0 / Math.sqrt(this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z);
                this._w *= len;
                this._x *= len;
                this._y *= len;
                this._z *= len;
            }

            this.onChangeCallback();

            return this;
        },

        set: function(x, y, z, w) {
            this._x = x || 0;
            this._y = y || 0;
            this._z = z || 0;
            this._w = ( w !== undefined ) ? w : 1;

            this.onChangeCallback();

            return this;
        },

        copy: function(v) {
            this._x = v.x;
            this._y = v.y;
            this._z = v.z;
            this._w = ( v.w !== undefined ) ? v.w : 1;

            this.onChangeCallback();

            return this;
        },

        setFromEuler: function(euler, update) {
            var c1 = Math.cos( euler._x / 2 );
            var c2 = Math.cos( euler._y / 2 );
            var c3 = Math.cos( euler._z / 2 );
            var s1 = Math.sin( euler._x / 2 );
            var s2 = Math.sin( euler._y / 2 );
            var s3 = Math.sin( euler._z / 2 );

            var order = euler._order;

            if ( order === 'XYZ' ) {

                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;

            } else if ( order === 'YXZ' ) {

                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;

            } else if ( order === 'ZXY' ) {

                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;

            } else if ( order === 'ZYX' ) {

                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;

            } else if ( order === 'YZX' ) {

                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;

            } else if ( order === 'XZY' ) {

                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;

            }

            if ( update !== false ) this.onChangeCallback();

            return this;

        },

        setFromRotationMatrix: function ( m ) {

            var te = m.elements,

                m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
                m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
                m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

                trace = m11 + m22 + m33,
                s;

            if ( trace > 0 ) {

                s = 0.5 / Math.sqrt( trace + 1.0 );

                this._w = 0.25 / s;
                this._x = ( m32 - m23 ) * s;
                this._y = ( m13 - m31 ) * s;
                this._z = ( m21 - m12 ) * s;

            } else if ( m11 > m22 && m11 > m33 ) {

                s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

                this._w = ( m32 - m23 ) / s;
                this._x = 0.25 * s;
                this._y = ( m12 + m21 ) / s;
                this._z = ( m13 + m31 ) / s;

            } else if ( m22 > m33 ) {

                s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

                this._w = ( m13 - m31 ) / s;
                this._x = ( m12 + m21 ) / s;
                this._y = 0.25 * s;
                this._z = ( m23 + m32 ) / s;

            } else {

                s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

                this._w = ( m21 - m12 ) / s;
                this._x = ( m13 + m31 ) / s;
                this._y = ( m23 + m32 ) / s;
                this._z = 0.25 * s;

            }

            this.onChangeCallback();

            return this;

        },

        setFromUnitVectors: function () {

            // http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

            // assumes direction vectors vFrom and vTo are normalized

            var v1 = new Vector3();
            var r;

            var EPS = 0.000001;

            return function setFromUnitVectors( vFrom, vTo ) {

                if ( v1 === undefined ) v1 = new Vector3();

                r = vFrom.dot( vTo ) + 1;

                if ( r < EPS ) {

                    r = 0;

                    if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

                        v1.set( - vFrom.y, vFrom.x, 0 );

                    } else {

                        v1.set( 0, - vFrom.z, vFrom.y );

                    }

                } else {

                    v1.crossVectors( vFrom, vTo );

                }

                this._x = v1.x;
                this._y = v1.y;
                this._z = v1.z;
                this._w = r;

                return this.normalize();

            };

        }(),

        multiply: function ( q ) {

            return this.multiplyQuaternions( this, q );

        },

        premultiply: function ( q ) {

            return this.multiplyQuaternions( q, this );

        },

        multiplyQuaternions: function ( a, b ) {

            // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

            var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
            var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

            this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            this.onChangeCallback();

            return this;

        },

        toMatrix4: function(target) {
            if(!target) {
                target = new Matrix4();
            }
            var ele = target.elements;

            var xy2 = 2.0 * this._x * this._y, xz2 = 2.0 * this._x * this._z, xw2 = 2.0 * this._x * this._w;
            var yz2 = 2.0 * this._y * this._z, yw2 = 2.0 * this._y * this._w, zw2 = 2.0 * this._z * this._w;
            var xx = this._x * this._x, yy = this._y * this._y, zz = this._z * this._z, ww = this._w * this._w;

            ele[0] = xx - yy - zz + ww;
            ele[4] = xy2 - zw2;
            ele[8] = xz2 + yw2;
            ele[12] = 0;
            ele[1] = xy2 + zw2;
            ele[5] = -xx + yy - zz + ww;
            ele[9] = yz2 - xw2;
            ele[13] = 0;
            ele[2] = xz2 - yw2;
            ele[6] = yz2 + xw2;
            ele[10] = -xx - yy + zz + ww;
            ele[14] = 0;
            ele[3] = 0.0;
            ele[7] = 0.0;
            ele[11] = 0;
            ele[15] = 1;

            return target;
        },

        dot: function ( v ) {

            return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

        },

        /**
         * set quaternion from axis angle
         **/
        setFromAxisAngle: function(axis, angle) {

            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

            // assumes axis is normalized

            var halfAngle = angle / 2, s = Math.sin( halfAngle );

            this._x = axis.x * s;
            this._y = axis.y * s;
            this._z = axis.z * s;
            this._w = Math.cos( halfAngle );

            this.onChangeCallback();

            return this;
        },

        fromArray: function ( array, offset ) {
            if ( offset === undefined ) offset = 0;

            this._x = array[ offset ];
            this._y = array[ offset + 1 ];
            this._z = array[ offset + 2 ];
            this._w = array[ offset + 3 ];

            this.onChangeCallback();

            return this;
        },

        onChange: function(callback) {
            this.onChangeCallback = callback;

            return this;
        },

        onChangeCallback: function() {}

    });

    function Box2(min, max) {
        this.min = (min !== undefined) ? min : new Vector2(+Infinity, +Infinity);
        this.max = (max !== undefined) ? max : new Vector2(-Infinity, -Infinity);
    }

    Object.assign(Box2.prototype, {

        set: function(x1, y1, x2, y2) {
            this.min.set(x1, y1);
            this.max.set(x2, y2);
        },

        copy: function(box) {
            this.min.copy(box.min);
            this.max.copy(box.max);

            return this;
        }

    });

    function Box3(min, max) {
        this.min = (min !== undefined) ? min : new Vector3(+Infinity, +Infinity, +Infinity);
        this.max = (max !== undefined) ? max : new Vector3(-Infinity, -Infinity, -Infinity);
    }

    Object.assign(Box3.prototypes, {

        set: function(min, max) {
            this.min.copy(min);
            this.max.copy(max);
        },

        setFromPoints: function(points) {
            this.makeEmpty();

            for (var i = 0, il = points.length; i < il; i++) {
                this.expandByPoint(points[i]);
            }

            return this;
        },

        makeEmpty: function() {
            this.min.x = this.min.y = this.min.z = +Infinity;
            this.max.x = this.max.y = this.max.z = -Infinity;

            return this;
        },

        expandByPoint: function(point) {
            this.min.min(point);
            this.max.max(point);

            return this;
        },

        expandByScalar: function(scalar) {
            this.min.addScalar(-scalar);
            this.max.addScalar(scalar);

            return this;
        },

        setFromArray: function(array, gap) {
            var minX = +Infinity;
            var minY = +Infinity;
            var minZ = +Infinity;

            var maxX = -Infinity;
            var maxY = -Infinity;
            var maxZ = -Infinity;

            var _gap = (gap !== undefined ? gap : 3);

            for (var i = 0, l = array.length; i < l; i += _gap) {

                var x = array[i];
                var y = array[i + 1];
                var z = array[i + 2];

                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (z < minZ) minZ = z;

                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
                if (z > maxZ) maxZ = z;

            }

            this.min.set(minX, minY, minZ);
            this.max.set(maxX, maxY, maxZ);

            return this;
        },

        isEmpty: function() {
            // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
            return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
        },

        equals: function(box) {
            return box.min.equals(this.min) && box.max.equals(this.max);
        },

        getCenter: function(optionalTarget) {
            var result = optionalTarget || new Vector3();
            return this.isEmpty() ? result.set(0, 0, 0) : result.addVectors(this.min, this.max).multiplyScalar(0.5);
        },

        applyMatrix4: function() {
            var points = [
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3(),
                new Vector3()
            ];

            return function applyMatrix4(matrix) {
                // transform of empty box is an empty box.
                if (this.isEmpty()) return this;

                // NOTE: I am using a binary pattern to specify all 2^3 combinations below
                points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
                points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
                points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
                points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
                points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
                points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
                points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
                points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

                this.setFromPoints(points);

                return this;
            };
        }(),

        copy: function(box) {
            this.min.copy(box.min);
            this.max.copy(box.max);

            return this;
        }

    });

    function Sphere(center, radius) {
        this.center = (center !== undefined) ? center : new Vector3();
        this.radius = (radius !== undefined) ? radius : 0;
    }

    Object.assign(Sphere.prototype, {

        set: function(center, radius) {
            this.center.copy(center);
            this.radius = radius;

            return this;
        },

        setFromArray: function() {
            var box = new Box3();
            var point = new Vector3();

            return function setFromArray(array, gap) {
                var _gap = (gap !== undefined ? gap : 3);

                var center = this.center;

                box.setFromArray(array, _gap).getCenter(center);

                var maxRadiusSq = 0;

                for (var i = 0, l = array.length; i < l; i += _gap) {
                    var x = array[i];
                    var y = array[i + 1];
                    var z = array[i + 2];

                    point.set(x, y, z);

                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(point));
                }

                this.radius = Math.sqrt(maxRadiusSq);

                return this;
            }
        }(),

        applyMatrix4: function(matrix) {
            this.center.applyMatrix4(matrix);
            this.radius = this.radius * matrix.getMaxScaleOnAxis();

            return this;
        },

        getBoundingBox: function(optionalTarget) {
            var box = optionalTarget || new Box3();

            box.set(this.center, this.center);
            box.expandByScalar(this.radius);

            return box;
        },

        clone: function() {
            return new Sphere().copy(this);
        },

        copy: function(sphere) {
            this.center.copy(sphere.center);
            this.radius = sphere.radius;

            return this;
        }

    });

    function Plane(normal, constant) {
        this.normal = (normal !== undefined) ? normal : new Vector3(1, 0, 0);
        this.constant = (constant !== undefined) ? constant : 0;
    }

    Object.assign(Plane.prototype, {

        set: function(normal, constant) {
            this.normal.copy(normal);
            this.constant = constant;

            return this;
        },

        setComponents: function(x, y, z, w) {
            this.normal.set(x, y, z);
            this.constant = w;

            return this;
        },

        normalize: function() {
            // Note: will lead to a divide by zero if the plane is invalid.

            var inverseNormalLength = 1.0 / this.normal.getLength();
            this.normal.multiplyScalar(inverseNormalLength);
            this.constant *= inverseNormalLength;

            return this;
        },

        distanceToPoint: function(point) {
            return this.normal.dot(point) + this.constant;
        },

        coplanarPoint: function ( optionalTarget ) {
            var result = optionalTarget || new Vector3();

            return result.copy( this.normal ).multiplyScalar( - this.constant );
        },

        copy: function(plane) {
            this.normal.copy(plane.normal);
            this.constant = plane.constant;
            return this;
        },

        applyMatrix4: function() {

            var v1 = new Vector3();
            var m1 = new Matrix3();

            return function applyMatrix4(matrix, optionalNormalMatrix) {
                var normalMatrix = optionalNormalMatrix || m1.setFromMatrix4( matrix ).inverse().transpose();

                var referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );

                var normal = this.normal.applyMatrix3( normalMatrix ).normalize();

                this.constant = - referencePoint.dot( normal );

                return this;
            }

        }()

    });

    function Frustum(p0, p1, p2, p3, p4, p5) {
        this.planes = [
            (p0 !== undefined) ? p0 : new Plane(),
            (p1 !== undefined) ? p1 : new Plane(),
            (p2 !== undefined) ? p2 : new Plane(),
            (p3 !== undefined) ? p3 : new Plane(),
            (p4 !== undefined) ? p4 : new Plane(),
            (p5 !== undefined) ? p5 : new Plane()
        ];
    }

    Object.assign(Frustum.prototype, {

        set: function(p0, p1, p2, p3, p4, p5) {
            var planes = this.planes;

            planes[0].copy(p0);
            planes[1].copy(p1);
            planes[2].copy(p2);
            planes[3].copy(p3);
            planes[4].copy(p4);
            planes[5].copy(p5);

            return this;
        },

        setFromMatrix: function(m) {
            var planes = this.planes;
            var me = m.elements;
            var me0 = me[0],
                me1 = me[1],
                me2 = me[2],
                me3 = me[3];
            var me4 = me[4],
                me5 = me[5],
                me6 = me[6],
                me7 = me[7];
            var me8 = me[8],
                me9 = me[9],
                me10 = me[10],
                me11 = me[11];
            var me12 = me[12],
                me13 = me[13],
                me14 = me[14],
                me15 = me[15];

            planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
            planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
            planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
            planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
            planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
            planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

            return this;
        },

        intersectsSphere: function(sphere) {
            var planes = this.planes;
            var center = sphere.center;
            var negRadius = -sphere.radius;

            for (var i = 0; i < 6; i++) {
                var distance = planes[i].distanceToPoint(center);

                if (distance < negRadius) {
                    return false;
                }
            }

            return true;
        },

        intersectsBox: function() {
            var p1 = new Vector3();
            var p2 = new Vector3();

            return function intersectsBox(box) {
                var planes = this.planes;

                for (var i = 0; i < 6; i++) {
                    var plane = planes[i];

                    p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
                    p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
                    p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
                    p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
                    p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
                    p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

                    var d1 = plane.distanceToPoint(p1);
                    var d2 = plane.distanceToPoint(p2);

                    // if both outside plane, no intersection

                    if (d1 < 0 && d2 < 0) {
                        return false;
                    }
                }

                return true;
            }
        }()

    });

    function Color3(r, g, b) {
        this.r = 0;
        this.g = 0;
        this.b = 0;

        if(g === undefined && b === undefined) {
            return this.setHex(r);
        }

        return this.setRGB(r, g, b);
    }

    Object.assign(Color3.prototype, {
        
        lerpColors: function(c1, c2, ratio) {
            this.r = ratio * (c2.r - c1.r) + c1.r;
            this.g = ratio * (c2.g - c1.g) + c1.g;
            this.b = ratio * (c2.b - c1.b) + c1.b;

            this.r = this.r;
            this.g = this.g;
            this.b = this.b;
        },

        copy: function(v) {
            this.r = v.r;
            this.g = v.g;
            this.b = v.b;

            return this;
        },

        // set from hex
        setHex: function(hex) {
            hex = Math.floor(hex);

            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;

            return this;
        },

        // set from RGB
        setRGB: function(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;

            return this;
        },

        // set from HSL
        setHSL: function() {

            function euclideanModulo(n, m) {
                return ((n % m) + m) % m;
            }

            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
                return p;
            }

            return function setHSL(h, s, l) {
                // h,s,l ranges are in 0.0 - 1.0
                h = euclideanModulo(h, 1);
                s = Math.max(0, Math.min(1, s));
                l = Math.max(0, Math.min(1, l));

                if (s === 0) {
                    this.r = this.g = this.b = l;
                } else {
                    var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
                    var q = (2 * l) - p;

                    this.r = hue2rgb(q, p, h + 1 / 3);
                    this.g = hue2rgb(q, p, h);
                    this.b = hue2rgb(q, p, h - 1 / 3);
                }
                return this;
            };

        }(),

        fromArray: function( array, offset ) {
            if ( offset === undefined ) offset = 0;

            this.r = array[ offset ];
            this.g = array[ offset + 1 ];
            this.b = array[ offset + 2 ];

            return this;
        },

        toArray: function ( array, offset ) {

            if ( array === undefined ) array = [];
            if ( offset === undefined ) offset = 0;

            array[ offset ] = this.r;
            array[ offset + 1 ] = this.g;
            array[ offset + 2 ] = this.b;

            return array;

        }

    });

    function Triangle(a, b, c) {
        this.a = (a !== undefined) ? a : new Vector3();
        this.b = (b !== undefined) ? b : new Vector3();
        this.c = (c !== undefined) ? c : new Vector3();
    }

    Object.assign(Triangle.prototype, {

        set: function(a, b, c) {
            this.a.copy(a);
            this.b.copy(b);
            this.c.copy(c);

            return this;
        }

    });

    Triangle.normal = function() {
        var v0 = new Vector3();

        return function normal(a, b, c, optionalTarget) {
            var result = optionalTarget || new Vector3();

            result.subVectors(c, b);
            v0.subVectors(a, b);
            result.cross(v0);

            var resultLengthSq = result.getLengthSquared();
            if (resultLengthSq > 0) {
                return result.multiplyScalar(1 / Math.sqrt(resultLengthSq));
            }

            return result.set(0, 0, 0);
        };
    }();

    // static/instance method to calculate barycentric coordinates
    // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
    Triangle.barycoordFromPoint = function() {
        var v0 = new Vector3();
        var v1 = new Vector3();
        var v2 = new Vector3();

        return function barycoordFromPoint(point, a, b, c, optionalTarget) {
            v0.subVectors(c, a);
            v1.subVectors(b, a);
            v2.subVectors(point, a);

            var dot00 = v0.dot(v0);
            var dot01 = v0.dot(v1);
            var dot02 = v0.dot(v2);
            var dot11 = v1.dot(v1);
            var dot12 = v1.dot(v2);

            var denom = (dot00 * dot11 - dot01 * dot01);

            var result = optionalTarget || new Vector3();

            // collinear or singular triangle
            if (denom === 0) {
                // arbitrary location outside of triangle?
                // not sure if this is the best idea, maybe should be returning undefined
                return result.set(-2, -1, -1);
            }

            var invDenom = 1 / denom;
            var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

            // barycentric coordinates must always sum to 1
            return result.set(1 - u - v, v, u);
        };
    }();

    Triangle.containsPoint = function() {
        var v1 = new Vector3();

        return function containsPoint(point, a, b, c) {
            var result = Triangle.barycoordFromPoint(point, a, b, c, v1);

            return (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1);
        };
    }();

    function Curve(posPoints, ctrlPoints) {
        this.posPoints = undefined;
        this.ctrlPoints = undefined;

        this.segCount = 0;

        this.set(posPoints, ctrlPoints);
    }

    Object.assign(Curve.prototype, {

        set: function (posPoints, ctrlPoints) {
            this.posPoints = posPoints;
            this.ctrlPoints = ctrlPoints;

            if(posPoints.length !== ctrlPoints.length) {
                console.warn("Curve: posPoints and ctrlPoints's length not equal!");
            }

            this.segCount = posPoints.length - 1;
        },

        calc: function () {
            var A0 = new Vector2();
            var B0 = new Vector2();
            var A1 = new Vector2();
            var B1 = new Vector2();

            return function calc(t) {
                for(var i = 0; i < this.segCount; i++) {
                    if(t >= this.posPoints[i].x && t <= this.posPoints[i + 1].x) {
                        A0.copy(this.posPoints[i]);
                        A1.copy(this.posPoints[i + 1]);
                        B0.copy(this.ctrlPoints[i]);
                        B1.copy(this.ctrlPoints[i + 1]);
                        break;
                    }
                }

                if (!A0) {
                    A0.copy(this.posPoints[this.posPoints.length - 1]);
                }
                if (!B0) {
                    B0.copy(this.ctrlPoints[this.ctrlPoints.length - 1]);
                }
                A1.copy(A1 || A0);
                B1.copy(B1 || B0);

                t = (t - A0.x) / (A1.x - A0.x);
                return this._cubic_bezier(A0.y, B0.y, B1.y, A1.y, t);
            }
        }(),

        // TODO: a smarter curve sampler?????

        // average x sampler
        // first x and last x must in result
        // samplerNum can't less than 2
        // result: [t0, value0, t1, value1, ...]
        averageXSampler: function(samplerNum) {
            if(samplerNum < 2) {
                console.warn("Curve: sampler num less than 2!");
            }

            var sampler = [];

            var firstT = this.posPoints[0].x;
            var lastT = this.posPoints[this.posPoints.length - 1].x;
            var tempT = (lastT - firstT) / (samplerNum - 1);
            var t = 0;
            for(var i = 0; i < samplerNum; i++) {
                if(i === samplerNum - 1) {
                    t = lastT;// fix
                } else {
                    t = firstT + i * tempT;
                }

                sampler.push(t, this.calc(t));
            }

            return sampler;
        },

        _cubic_bezier: function(p0, p1, p2, p3, t) {
            p0 = this._mix(p0, p1, t);
            p1 = this._mix(p1, p2, t);
            p2 = this._mix(p2, p3, t);

            p0 = this._mix(p0, p1, t);
            p1 = this._mix(p1, p2, t);

            p0 = this._mix(p0, p1, t);

            return p0;
        },

        _mix: function(value0, value1, t) {
            return value0 * (1 - t) + value1 * t;
        }

    });

    /**
     * @author bhouston / http://clara.io
     * @author WestLangley / http://github.com/WestLangley
     * @author shawn0326 / http://halflab.me
     *
     * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
     *
     * The poles (phi) are at the positive and negative y axis.
     * The equator starts at positive z.
     */

    function Spherical(radius, phi, theta) {
        this.radius = ( radius !== undefined ) ? radius : 1.0;
        this.phi = ( phi !== undefined ) ? phi : 0; // up / down towards top and bottom pole
        this.theta = ( theta !== undefined ) ? theta : 0; // around the equator of the sphere
    }

    Object.assign(Spherical.prototype, {

        set: function(radius, phi, theta) {
            this.radius = radius;
            this.phi = phi;
            this.theta = theta;

            return this;
        },

        copy: function(other) {
            this.radius = other.radius;
            this.phi = other.phi;
            this.theta = other.theta;

            return this;
        },

        clone: function() {
            return new this.constructor().copy(this);
        },

        // restrict phi to be betwee EPS and PI-EPS
        makeSafe: function() {
            var EPS = 0.000001;
            this.phi = Math.max( EPS, Math.min( Math.PI - EPS, this.phi ) );

            return this;
        },

        setFromVector3: function(vec3) {
            this.radius = vec3.getLength();

            if ( this.radius === 0 ) {

                this.theta = 0;
                this.phi = 0;

            } else {

                this.theta = Math.atan2( vec3.x, vec3.z ); // equator angle around y-up axis
                this.phi = Math.acos( Math.min(1, Math.max(-1, vec3.y / this.radius)) ); // polar angle

            }

            return this;
        }

    });

    /**
     * TextureBase
     * @class
     */
    function TextureBase() {
        EventDispatcher.call(this);

        this.uuid = generateUUID();

        this.textureType = "";

        this.border = 0;

        this.pixelFormat = WEBGL_PIXEL_FORMAT.RGBA;

        this.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

        this.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
        this.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;

        this.wrapS = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;
        this.wrapT = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

        this.anisotropy = 1;

        this.generateMipmaps = true;

        this.encoding = TEXEL_ENCODING_TYPE.LINEAR;

        this.flipY = true;

        this.version = 0;
    }

    Object.assign(TextureBase.prototype, {

        dispose: function() {
            this.dispatchEvent({type: 'dispose'});

            this.version = 0;
        }

    });

    /**
     * Texture2D
     * @class
     */
    function Texture2D() {
        TextureBase.call(this);

        this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_2D;

        this.image = null;
        this.mipmaps = [];

        // uv transform
        this.offset = new Vector2();
        this.repeat = new Vector2(1, 1);
        this.center = new Vector2();
        this.rotation = 0;

        this.matrix = new Matrix3();

        this.matrixAutoUpdate = true;
    }

    Texture2D.prototype = Object.assign(Object.create(TextureBase.prototype), {

        constructor: Texture2D,

        updateMatrix: function() {
            this.matrix.setUvTransform( this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y );
        }

    });

    Texture2D.fromImage = function(image) {
        var texture = new Texture2D();

        texture.image = image;
        texture.version++;

        return texture;
    };

    Texture2D.fromSrc = function(src) {
        var texture = new Texture2D();

        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
        var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

        var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

        var loader = isTGA ? new zen3d.TGALoader() : new zen3d.ImageLoader();
        loader.load(src, function(image) {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.image = image;
            texture.version++;

            texture.dispatchEvent({type: 'onload'});
        });

        return texture;
    };

    /**
     * TextureCube
     * @class
     */
    function TextureCube() {
        TextureBase.call(this);

        this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_CUBE_MAP;

        this.images = [];

        this.flipY = false;
    }

    TextureCube.prototype = Object.assign(Object.create(TextureBase.prototype), {

        constructor: TextureCube

    });

    TextureCube.fromImage = function(imageArray) {
        var texture = new TextureCube();
        var images = texture.images;

        for(var i = 0; i < 6; i++) {
            images[i] = imageArray[i];
        }

        texture.version++;

        return texture;
    };

    TextureCube.fromSrc = function(srcArray) {
        var texture = new TextureCube();
        var images = texture.images;

        var src = srcArray[0];
        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
        var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

        var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

        var count = 0;
        function next(image) {
            if(image) {
                images.push(image);
                count++;
            }
            if(count >= 6) {
                loaded();
                return;
            }
            var loader = isTGA ? new zen3d.TGALoader() : new zen3d.ImageLoader();
            loader.load(srcArray[count], next);
        }
        next();

        function loaded() {
            texture.pixelFormat = isJPEG ? zen3d.WEBGL_PIXEL_FORMAT.RGB : zen3d.WEBGL_PIXEL_FORMAT.RGBA;
            texture.version++;
            texture.dispatchEvent({type: 'onload'});
        }

        return texture;
    };

    function TextureData(data, width, height) {
        Texture2D.call(this);

        this.image = {data: data, width: width, height: height};

        // default pixel type set to float
        this.pixelType = WEBGL_PIXEL_TYPE.FLOAT;

        this.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;

        this.flipY = false;
    }

    TextureData.prototype = Object.assign(Object.create(Texture2D.prototype), {

        constructor: TextureData,

        isDataTexture: true

    });

    function TextureDepth(width, height) {
        Texture2D.call(this);

        this.image = {width: width, height: height};

        // DEPTH_ATTACHMENT set to unsigned_short or unsigned_int
        // DEPTH_STENCIL_ATTACHMENT set to UNSIGNED_INT_24_8
        this.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_SHORT;

        // don't change
        this.pixelFormat = WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT;   

        this.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
        this.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

        this.generateMipmaps = false;

        this.flipY = false;
    }

    TextureDepth.prototype = Object.assign(Object.create(Texture2D.prototype), {

        constructor: TextureDepth,

        isDepthTexture: true

    });

    /**
     * Object3D
     * @class
     */
    function Object3D() {

        this.uuid = generateUUID();

        // a custom name for this object
        this.name = "";

        // type of this object, set by subclass
        this.type = "";

        // position
        this.position = new Vector3();
        // scale
        this.scale = new Vector3(1, 1, 1);

        // euler rotate
        var euler = this.euler = new Euler();
        // quaternion rotate
        var quaternion = this.quaternion = new Quaternion();

        // bind euler and quaternion
        euler.onChange(function() {
            quaternion.setFromEuler(euler, false);
        });
        quaternion.onChange(function() {
            euler.setFromQuaternion(quaternion, undefined, false);
        });

        // transform matrix
        this.matrix = new Matrix4();
        // world transform matrix
        this.worldMatrix = new Matrix4();

        // children
        this.children = new Array();
        // parent
        this.parent = null;

        // shadow
        this.castShadow = false;
        this.receiveShadow = false;
        this.shadowType = SHADOW_TYPE.PCF_SOFT;

        // frustum test
        this.frustumCulled = true;

        this.userData = {};
    }

    Object.defineProperties(Object3D.prototype, {
        /**
         * rotation set by euler
         **/
        rotation: {
            get: function() {
                return this.euler;
            },
            set: function(euler) {
                var _euler = this.euler;
                _euler.copyFrom(euler);

                this.quaternion.setFromEuler(euler);
            }
        }
    });

    Object.assign(Object3D.prototype, {

        /**
         * add child to object3d
         */
        add: function(object) {
            this.children.push(object);
            object.parent = this;
        },

        /**
         * remove child from object3d
         */
        remove: function(object) {
            var index = this.children.indexOf(object);
            if (index !== -1) {
                this.children.splice(index, 1);
            }
            object.parent = null;
        },

        /**
         * get object by name
         */
        getObjectByName: function(name) {
            return this.getObjectByProperty('name', name);
        },

        /**
         * get object by property
         */
        getObjectByProperty: function(name, value) {
            if (this[name] === value) return this;

            for (var i = 0, l = this.children.length; i < l; i++) {

                var child = this.children[i];
                var object = child.getObjectByProperty(name, value);

                if (object !== undefined) {

                    return object;

                }

            }

            return undefined;
        },

        /**
         * update matrix
         */
        updateMatrix: function() {
            var matrix = this.matrix.transform(this.position, this.scale, this.quaternion);

            this.worldMatrix.copy(matrix);

            if (this.parent) {
                var parentMatrix = this.parent.worldMatrix;
                this.worldMatrix.premultiply(parentMatrix);
            }

            var children = this.children;
            for (var i = 0, l = children.length; i < l; i++) {
                children[i].updateMatrix();
            }
        },

        /*
            * get world direction
            * must call after world matrix updated
            */
        getWorldDirection: function() {

            var position = new Vector3();
            var quaternion = new Quaternion();
            var scale = new Vector3();

            return function getWorldDirection(optionalTarget) {

                var result = optionalTarget || new Vector3();

                this.worldMatrix.decompose(position, quaternion, scale);

                result.set(0, 0, 1).applyQuaternion(quaternion);

                return result;

            };
        }(),

        /**
         * set view by look at, this func will set quaternion of this object
         */
        lookAt: function() {

            var m = new Matrix4();

            return function lookAt(target, up) {

                m.lookAtRH(target, this.position, up);
                this.quaternion.setFromRotationMatrix(m);

            };

        }(),

        /**
         * raycast
         */
        raycast: function() {
            // implemental by subclass
        },

        traverse: function ( callback ) {
            callback( this );

            var children = this.children;
            for ( var i = 0, l = children.length; i < l; i ++ ) {
                children[ i ].traverse( callback );
            }
        },

        clone: function ( recursive ) {
            return new this.constructor().copy( this, recursive );
        },

        copy: function( source, recursive ) {
            if ( recursive === undefined ) recursive = true;

            this.name = source.name;

            this.type = source.type;

            this.position.copy( source.position );
            this.quaternion.copy( source.quaternion );
            this.scale.copy( source.scale );

            this.matrix.copy( source.matrix );
            this.worldMatrix.copy( source.worldMatrix );

            this.castShadow = source.castShadow;
            this.receiveShadow = source.receiveShadow;

            this.frustumCulled = source.frustumCulled;

            this.userData = JSON.parse( JSON.stringify( source.userData ) );

            if ( recursive === true ) {

                for ( var i = 0; i < source.children.length; i ++ ) {

                    var child = source.children[ i ];
                    this.add( child.clone() );

                }

            }

            return this;
        }

    });

    // Bone acturely is a joint
    // the position means joint position
    // mesh transform is based this joint space
    function Bone() {

        Object3D.call(this);

        this.type = "bone";

        // the origin offset matrix
        // the inverse matrix of origin transform matrix
        this.offsetMatrix = new Matrix4();

    }

    Bone.prototype = Object.create(Object3D.prototype);
    Bone.prototype.constructor = Bone;

    // extends from Object3D only for use the updateMatrix method
    // so all bones should be the children of skeleton
    // like this:
    // Skeleton
    //    |-- Bone
    //    |    |-- Bone
    //    |    |-- Bone
    //    |         |
    //    |         |--Bone
    //    |         |--Bone
    //    |
    //    |-- Bone
    //    |-- Bone
    function Skeleton(bones) {

        Object3D.call(this);

        this.type = "skeleton";

        // bones in array
        this.bones = bones || [];

        // bone matrices data
        this.boneMatrices = new Float32Array(16 * this.bones.length);

        // use vertex texture to update boneMatrices
        // by that way, we can use more bones on phone
        this.boneTexture = undefined;
        this.boneTextureSize = 0;

    }

    Skeleton.prototype = Object.assign(Object.create(Object3D.prototype), {

        constructor: Skeleton,

        updateBones: function() {

            var offsetMatrix = new Matrix4();

            return function updateBones() {

                // the world matrix of bones, is based skeleton
                this.updateMatrix();

                for(var i = 0; i < this.bones.length; i++) {
                    var bone = this.bones[i];
                    offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);
                    offsetMatrix.toArray(this.boneMatrices, i * 16);
                }

                if (this.boneTexture !== undefined) {
                    this.boneTexture.version++;
                }

            }

        }()

    });

    function KeyframeData() {
        this._keys = [];
        this._values = [];
    }

    Object.assign(KeyframeData.prototype, {

        addFrame: function(key, value) {
            this._keys.push(key);
            this._values.push(value);
        },

        removeFrame: function(key) {
            var index = this.keys.indexOf(key);
            if (index > -1) {
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
            }
        },

        clearFrame: function() {
            this._keys.length = 0;
            this._values.length = 0;
        },

        sortFrame: function() {
            // TODO
        },

        // return a frame range between two key frames
        // return type: {key1: 0, value1: 0, key2: 0, value2: 0}
        getRange: function(t, result) {
            var lastIndex = this._getLastKeyIndex(t);

            var key1 = this._keys[lastIndex];
            var key2 = this._keys[lastIndex + 1];
            var value1 = this._values[lastIndex];
            var value2 = this._values[lastIndex + 1];

            result = result || {key1: 0, value1: 0, key2: 0, value2: 0};

            result.key1 = key1;
            result.key2 = key2;
            result.value1 = value1;
            result.value2 = value2;

            return result;
        },

        _getLastKeyIndex: function(t) {
            var lastKeyIndex = 0;
            var i, l = this._keys.length;
            for(i = 0; i < l; i++) {
                if(t >= this._keys[i]) {
                    lastKeyIndex = i;
                }
            }
            return lastKeyIndex;
        }

    });

    var range = {key1: 0, value1: 0, key2: 0, value2: 0};

    /*
        * KeyframeTrack
        * used for number property track
        */
    function KeyframeTrack(target, propertyPath) {

        this.target = undefined;
        this.path = undefined;

        this.bind(target, propertyPath);

        this.data = new KeyframeData();

        this._frame = 0;

        this.interpolant = true;
    }

    Object.assign(KeyframeTrack.prototype, {

        bind: function(target, propertyPath) {
            propertyPath = propertyPath.split(".");

            if (propertyPath.length > 1) {
                var property = target[propertyPath[0]];


                for (var index = 1; index < propertyPath.length - 1; index++) {
                    property = property[propertyPath[index]];
                }

                this.path = propertyPath[propertyPath.length - 1];
                this.target = property;
            } else {
                this.path = propertyPath[0];
                this.target = target;
            }
        },

        _updateValue: function(t) {
            this.data.getRange(t, range);

            var key1 = range.key1;
            var key2 = range.key2;
            var value1 = range.value1;
            var value2 = range.value2;

            if(this.interpolant) {
                if(value1 !== undefined && value2 !== undefined) {
                    var ratio = (t - key1) / (key2 - key1);
                    this.target[this.path] = (value2 - value1) * ratio + value1;
                } else {
                    this.target[this.path] = value1;
                }
            } else {
                this.target[this.path] = value1;
            }
        }

    });

    Object.defineProperties(KeyframeTrack.prototype, {
        frame: {
            get: function() {
                return this._frame;
            },
            set: function(t) {
                // TODO should not out of range
                this._frame = t;
                this._updateValue(t);
            }
        }
    });

    var range$1 = {key1: 0, value1: 0, key2: 0, value2: 0};

    /**
     * ColorKeyframeTrack
     * used for color property track
     */
    function ColorKeyframeTrack(target, propertyPath) {
        KeyframeTrack.call(this, target, propertyPath);
    }

    ColorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

        constructor: ColorKeyframeTrack,

        _updateValue: function(t) {
            this.data.getRange(t, range$1);

            var key1 = range$1.key1;
            var key2 = range$1.key2;
            var value1 = range$1.value1;
            var value2 = range$1.value2;

            if(this.interpolant) {
                if(value1 !== undefined && value2 !== undefined) {
                    var ratio = (t - key1) / (key2 - key1);
                    this.target[this.path].lerpColors(value1, value2, ratio);
                } else {
                    this.target[this.path].copy(value1);
                }
            } else {
                this.target[this.path].copy(value1);
            }
        }

    });

    function KeyframeAnimation() {

        this._clips = {};

        this._currentClipName = "";

    }

    Object.defineProperties(KeyframeAnimation.prototype, {
        currentClipName: {
            get: function() {
                return this._currentClipName;
            }
        },
        currentClip: {
            get: function() {
                return this._clips[this._currentClipName];
            }
        }
    });

    Object.assign(KeyframeAnimation.prototype, {

        add: function(clip) {
            this._clips[clip.name] = clip;
        },

        remove: function(clip) {
            delete this._clips[clip.name];
        },

        update: function(t) {
            var currentClip = this._clips[this._currentClipName];
            if(currentClip) {
                currentClip.update(t);
            }
        },

        active: function(name) {
            var clip = this._clips[name];
            if(clip) {
                this._currentClipName = name;
                clip.setFrame(clip.startFrame);// restore
            } else {
                console.warn("KeyframeAnimation: try to active a undefind clip!");
            }
        },

        // return all clip names of this animation
        getAllClipNames: function() {
            var array = [];
            for(var key in this._clips) {
                array.push(key);
            }
            return array;
        }

    });

    function KeyframeClip(name) {

        this.name = name || "";

        this.tracks = [];

        this.loop = true;

        this.startFrame = 0;

        this.endFrame = 0;

        this.frame = 0;

    }

    Object.assign(KeyframeClip.prototype, {

        update: function(t) {
            this.frame += t;

            if(this.frame > this.endFrame) {
                if(this.loop) {
                    this.frame = this.startFrame;
                } else {
                    this.frame = this.endFrame;
                }
            }

            this.setFrame(this.frame);
        },

        setFrame: function(frame) {
            for(var i = 0, l = this.tracks.length; i < l; i++) {
                this.tracks[i].frame = frame;
            }

            this.frame = frame;
        }

    });

    var range$2 = {key1: 0, value1: 0, key2: 0, value2: 0};

    /**
     * QuaternionKeyframeTrack
     * used for vector property track
     */
    function QuaternionKeyframeTrack(target, propertyPath) {
        KeyframeTrack.call(this, target, propertyPath);
    }

    QuaternionKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

        constructor: QuaternionKeyframeTrack,

        _updateValue: function(t) {
            this.data.getRange(t, range$2);

            var key1 = range$2.key1;
            var key2 = range$2.key2;
            var value1 = range$2.value1;
            var value2 = range$2.value2;

            if(this.interpolant) {
                if(value1 !== undefined && value2 !== undefined) {
                    var ratio = (t - key1) / (key2 - key1);
                    this.target[this.path].slerpQuaternions(value1, value2, ratio);
                } else {
                    this.target[this.path].copy(value1);
                }
            } else {
                this.target[this.path].copy(value1);
            }
        }

    });

    var range$3 = {key1: 0, value1: 0, key2: 0, value2: 0};

    /**
     * VectorKeyframeTrack
     * used for vector property track
     */
    function VectorKeyframeTrack(target, propertyPath) {
        KeyframeTrack.call(this, target, propertyPath);
    }

    VectorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

        constructor: VectorKeyframeTrack,

        _updateValue: function(t) {
            this.data.getRange(t, range$3);

            var key1 = range$3.key1;
            var key2 = range$3.key2;
            var value1 = range$3.value1;
            var value2 = range$3.value2;

            if(this.interpolant) {
                if(value1 !== undefined && value2 !== undefined) {
                    var ratio = (t - key1) / (key2 - key1);
                    this.target[this.path].lerpVectors(value1, value2, ratio);
                } else {
                    this.target[this.path].copy(value1);
                }
            } else {
                this.target[this.path].copy(value1);
            }
        }

    });

    function BufferAttribute(array, size, normalized) {
        this.uuid = generateUUID();

        this.array = array;
        this.size = size;
        this.count = array !== undefined ? array.length / size : 0;
        this.normalized = normalized === true;

        this.dynamic = false;
        this.updateRange = { offset: 0, count: - 1 };

        this.version = 0;
    }

    Object.assign(BufferAttribute.prototype, {

        setArray: function(array) {
            this.count = array !== undefined ? array.length / this.size : 0;
            this.array = array;
        }

    });

    /**
     * Geometry data
     * @class
     */
    function Geometry() {
        EventDispatcher.call(this);

        this.uuid = generateUUID();

        this.attributes = {};
        this.index = null;

        this.usageType = WEBGL_BUFFER_USAGE.STATIC_DRAW;

        this.boundingBox = new Box3();

        this.boundingSphere = new Sphere();

        // if part dirty, update part of buffers
        this.dirtyRange = {enable: false, start: 0, count: 0};

        this.groups = [];
    }

    Geometry.prototype = Object.assign(Object.create(EventDispatcher.prototype), {

        constructor: Geometry,

        addAttribute: function(name, attribute) {
            this.attributes[name] = attribute;
        },

        getAttribute: function(name) {
            return this.attributes[name];
        },

        removeAttribute: function(name) {
            delete this.attributes[name];
        },

        setIndex: function(index) {
            if(Array.isArray(index)) {
                this.index = new BufferAttribute(new Uint16Array( index ), 1);
            } else {
                this.index = index;
            }
        },

        addGroup: function(start, count, materialIndex) {
            this.groups.push({
                start: start,
                count: count,
                materialIndex: materialIndex !== undefined ? materialIndex : 0
            });
        },

        clearGroups: function() {
            this.groups = [];
        },

        computeBoundingBox: function() {
            var position = this.attributes["a_Position"] || this.attributes["position"];
            if(position.isInterleavedBufferAttribute) {
                var data = position.data;
                this.boundingBox.setFromArray(data.array, data.stride);
            } else {
                this.boundingBox.setFromArray(position.array, position.size);
            }
        },

        computeBoundingSphere: function() {
            var position = this.attributes["a_Position"] || this.attributes["position"];
            if(position.isInterleavedBufferAttribute) {
                var data = position.data;
                this.boundingSphere.setFromArray(data.array, data.stride);
            } else {
                this.boundingSphere.setFromArray(position.array, position.size);
            }
        },

        dispose: function() {
            this.dispatchEvent({type: 'dispose'});
        }

    });

    /**
     * CubeGeometry data
     * @class
     */
    function CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
    	Geometry.call(this);

    	this.buildGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
    }

    CubeGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

    	constructor: CubeGeometry,

    	buildGeometry: function(width, height, depth, widthSegments, heightSegments, depthSegments) {

    		var scope = this;

    		width = width || 1;
    		height = height || 1;
    		depth = depth || 1;

    		// segments

    		widthSegments = Math.floor( widthSegments ) || 1;
    		heightSegments = Math.floor( heightSegments ) || 1;
    		depthSegments = Math.floor( depthSegments ) || 1;

    		// buffers

    		var indices = [];
    		var vertices = [];
    		var normals = [];
    		var uvs = [];

    		// helper variables

    		var numberOfVertices = 0;
    		var groupStart = 0;

    		// build each side of the box geometry

    		buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
    		buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
    		buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
    		buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
    		buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
    		buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

    		// build geometry

    		this.setIndex(indices);
    		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
    		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
    		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

    		function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

    			var segmentWidth = width / gridX;
    			var segmentHeight = height / gridY;

    			var widthHalf = width / 2;
    			var heightHalf = height / 2;
    			var depthHalf = depth / 2;

    			var gridX1 = gridX + 1;
    			var gridY1 = gridY + 1;

    			var vertexCounter = 0;
    			var groupCount = 0;

    			var ix, iy;

    			var vector = new Vector3();

    			// generate vertices, normals and uvs

    			for ( iy = 0; iy < gridY1; iy ++ ) {

    				var y = iy * segmentHeight - heightHalf;

    				for ( ix = 0; ix < gridX1; ix ++ ) {

    					var x = ix * segmentWidth - widthHalf;

    					// set values to correct vector component

    					vector[ u ] = x * udir;
    					vector[ v ] = y * vdir;
    					vector[ w ] = depthHalf;

    					// now apply vector to vertex buffer

    					vertices.push( vector.x, vector.y, vector.z );

    					// set values to correct vector component

    					vector[ u ] = 0;
    					vector[ v ] = 0;
    					vector[ w ] = depth > 0 ? 1 : - 1;

    					// now apply vector to normal buffer

    					normals.push( vector.x, vector.y, vector.z );

    					// uvs

    					uvs.push( ix / gridX );
    					uvs.push( 1 - ( iy / gridY ) );

    					// counters

    					vertexCounter += 1;

    				}

    			}

    			// indices

    			// 1. you need three indices to draw a single face
    			// 2. a single segment consists of two faces
    			// 3. so we need to generate six (2*3) indices per segment

    			for ( iy = 0; iy < gridY; iy ++ ) {

    				for ( ix = 0; ix < gridX; ix ++ ) {

    					var a = numberOfVertices + ix + gridX1 * iy;
    					var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
    					var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
    					var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

    					// faces

    					indices.push( a, b, d );
    					indices.push( b, c, d );

    					// increase counter

    					groupCount += 6;

    				}

    			}

    			// add a group to the geometry. this will ensure multi material support

    			scope.addGroup( groupStart, groupCount, materialIndex );

    			// calculate new start value for groups

    			groupStart += groupCount;

    			// update total number of vertices

    			numberOfVertices += vertexCounter;

    		}

    		this.computeBoundingBox();
    		this.computeBoundingSphere();
    	}

    });

    /**
     * CylinderGeometry data
     * same as CylinderGeometry of three.js
     * @class
     */
    function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
    	Geometry.call(this);

    	this.buildGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
    }

    CylinderGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

    	constructor: CylinderGeometry,

    	buildGeometry: function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
    		var scope = this;

    		radiusTop = radiusTop !== undefined ? radiusTop : 1;
    		radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
    		height = height || 1;

    		radialSegments = Math.floor( radialSegments ) || 8;
    		heightSegments = Math.floor( heightSegments ) || 1;

    		openEnded = openEnded !== undefined ? openEnded : false;
    		thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
    		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

    		// buffers

    		var indices = [];
    		var vertices = [];
    		var normals = [];
    		var uvs = [];

    		// helper variables

    		var index = 0;
    		var indexArray = [];
    		var halfHeight = height / 2;
    		var groupStart = 0;

    		// generate geometry

    		generateTorso();

    		if ( openEnded === false ) {

    			if ( radiusTop > 0 ) generateCap( true );
    			if ( radiusBottom > 0 ) generateCap( false );

    		}

    		// build geometry

    		this.setIndex(indices);
    		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
    		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
    		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

    		function generateTorso() {

    			var x, y;
    			var normal = new Vector3();
    			var vertex = new Vector3();

    			var groupCount = 0;

    			// this will be used to calculate the normal
    			var slope = ( radiusBottom - radiusTop ) / height;

    			// generate vertices, normals and uvs

    			for ( y = 0; y <= heightSegments; y ++ ) {

    				var indexRow = [];

    				var v = y / heightSegments;

    				// calculate the radius of the current row

    				var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

    				for ( x = 0; x <= radialSegments; x ++ ) {

    					var u = x / radialSegments;

    					var theta = u * thetaLength + thetaStart;

    					var sinTheta = Math.sin( theta );
    					var cosTheta = Math.cos( theta );

    					// vertex

    					vertex.x = radius * sinTheta;
    					vertex.y = - v * height + halfHeight;
    					vertex.z = radius * cosTheta;
    					vertices.push( vertex.x, vertex.y, vertex.z );

    					// normal

    					normal.set( sinTheta, slope, cosTheta ).normalize();
    					normals.push( normal.x, normal.y, normal.z );

    					// uv

    					uvs.push( u, 1 - v );

    					// save index of vertex in respective row

    					indexRow.push( index ++ );

    				}

    				// now save vertices of the row in our index array

    				indexArray.push( indexRow );

    			}

    			// generate indices

    			for ( x = 0; x < radialSegments; x ++ ) {

    				for ( y = 0; y < heightSegments; y ++ ) {

    					// we use the index array to access the correct indices

    					var a = indexArray[ y ][ x ];
    					var b = indexArray[ y + 1 ][ x ];
    					var c = indexArray[ y + 1 ][ x + 1 ];
    					var d = indexArray[ y ][ x + 1 ];

    					// faces

    					indices.push( a, b, d );
    					indices.push( b, c, d );

    					// update group counter

    					groupCount += 6;

    				}

    			}

    			// add a group to the geometry. this will ensure multi material support

    			scope.addGroup( groupStart, groupCount, 0 );

    			// calculate new start value for groups

    			groupStart += groupCount;

    		}

    		function generateCap( top ) {

    			var x, centerIndexStart, centerIndexEnd;

    			var uv = new Vector2();
    			var vertex = new Vector3();

    			var groupCount = 0;

    			var radius = ( top === true ) ? radiusTop : radiusBottom;
    			var sign = ( top === true ) ? 1 : - 1;

    			// save the index of the first center vertex
    			centerIndexStart = index;

    			// first we generate the center vertex data of the cap.
    			// because the geometry needs one set of uvs per face,
    			// we must generate a center vertex per face/segment

    			for ( x = 1; x <= radialSegments; x ++ ) {

    				// vertex

    				vertices.push( 0, halfHeight * sign, 0 );

    				// normal

    				normals.push( 0, sign, 0 );

    				// uv

    				uvs.push( 0.5, 0.5 );

    				// increase index

    				index ++;

    			}

    			// save the index of the last center vertex

    			centerIndexEnd = index;

    			// now we generate the surrounding vertices, normals and uvs

    			for ( x = 0; x <= radialSegments; x ++ ) {

    				var u = x / radialSegments;
    				var theta = u * thetaLength + thetaStart;

    				var cosTheta = Math.cos( theta );
    				var sinTheta = Math.sin( theta );

    				// vertex

    				vertex.x = radius * sinTheta;
    				vertex.y = halfHeight * sign;
    				vertex.z = radius * cosTheta;
    				vertices.push( vertex.x, vertex.y, vertex.z );

    				// normal

    				normals.push( 0, sign, 0 );

    				// uv

    				uv.x = ( cosTheta * 0.5 ) + 0.5;
    				uv.y = ( sinTheta * 0.5 * sign ) + 0.5;
    				uvs.push( uv.x, uv.y );

    				// increase index

    				index ++;

    			}

    			// generate indices

    			for ( x = 0; x < radialSegments; x ++ ) {

    				var c = centerIndexStart + x;
    				var i = centerIndexEnd + x;

    				if ( top === true ) {

    					// face top

    					indices.push( i, i + 1, c );

    				} else {

    					// face bottom

    					indices.push( i + 1, i, c );

    				}

    				groupCount += 3;

    			}

    			// add a group to the geometry. this will ensure multi material support

    			scope.addGroup( groupStart, groupCount, top === true ? 1 : 2 );

    			// calculate new start value for groups

    			groupStart += groupCount;

    		}

    		this.computeBoundingBox();
    		this.computeBoundingSphere();
    	}

    });

    function InstancedBufferAttribute(array, itemSize, meshPerAttribute) {

        BufferAttribute.call( this, array, itemSize );

        this.meshPerAttribute = meshPerAttribute || 1;

    }

    InstancedBufferAttribute.prototype = Object.assign( Object.create( BufferAttribute.prototype ), {

        constructor: InstancedBufferAttribute,

        isInstancedBufferAttribute: true

    });

    function InstancedGeometry() {

        Geometry.call( this );

        this.maxInstancedCount = undefined;

    }

    InstancedGeometry.prototype = Object.assign( Object.create( Geometry.prototype ), {

        constructor: InstancedGeometry,

        isInstancedGeometry: true

    });

    function InterleavedBuffer(array, stride) {
        this.uuid = generateUUID();

        this.array = array;
        this.stride = stride;
        this.count = array !== undefined ? array.length / stride : 0;

        this.dynamic = false;
        this.updateRange = { offset: 0, count: - 1 };

        this.version = 0;
    }

    Object.assign(InterleavedBuffer.prototype, {

        setArray: function(array) {
            this.count = array !== undefined ? array.length / this.stride : 0;
            this.array = array;
        }

    });

    function InstancedInterleavedBuffer(array, itemSize, meshPerAttribute) {

        InterleavedBuffer.call( this, array, itemSize );

        this.meshPerAttribute = meshPerAttribute || 1;

    }

    InstancedInterleavedBuffer.prototype = Object.assign( Object.create( InterleavedBuffer.prototype ), {

        constructor: InstancedInterleavedBuffer,

        isInstancedInterleavedBuffer: true

    });

    function InterleavedBufferAttribute(interleavedBuffer, size, offset, normalized) {
        this.uuid = generateUUID();

        this.data = interleavedBuffer;
        this.size = size;
        this.offset = offset;

        this.normalized = normalized === true;
    }

    InterleavedBufferAttribute.prototype.isInterleavedBufferAttribute = true;

    Object.defineProperties(InterleavedBufferAttribute.prototype, {
        count: {
            get: function() {
                return this.data.count;
            }
        },
        array: {
            get: function() {
                return this.data.array;
            }
        }
    });

    /**
     * PlaneGeometry data
     * @class
     */
    function PlaneGeometry(width, height, widthSegments, heightSegments) {
    	Geometry.call(this);

    	this.buildGeometry(width, height, widthSegments, heightSegments);
    }

    PlaneGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

    	constructor: PlaneGeometry,

    	buildGeometry: function(width, height, widthSegments, heightSegments) {
    		width = width || 1;
    		height = height || 1;

    		var width_half = width / 2;
    		var height_half = height / 2;

    		var gridX = Math.floor( widthSegments ) || 1;
    		var gridY = Math.floor( heightSegments ) || 1;

    		var gridX1 = gridX + 1;
    		var gridY1 = gridY + 1;

    		var segment_width = width / gridX;
    		var segment_height = height / gridY;

    		var ix, iy;

    		// buffers

    		var indices = [];
    		var vertices = [];
    		var normals = [];
    		var uvs = [];

    		// generate vertices, normals and uvs

    		for ( iy = 0; iy < gridY1; iy ++ ) {

    			var y = iy * segment_height - height_half;

    			for ( ix = 0; ix < gridX1; ix ++ ) {

    				var x = ix * segment_width - width_half;

    				vertices.push( x, 0, y );

    				normals.push( 0, 1, 0 );

    				uvs.push( ix / gridX );
    				uvs.push( 1 - ( iy / gridY ) );

    			}

    		}

    		// indices

    		for ( iy = 0; iy < gridY; iy ++ ) {

    			for ( ix = 0; ix < gridX; ix ++ ) {

    				var a = ix + gridX1 * iy;
    				var b = ix + gridX1 * ( iy + 1 );
    				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
    				var d = ( ix + 1 ) + gridX1 * iy;

    				// faces

    				indices.push( a, b, d );
    				indices.push( b, c, d );

    			}

    		}

    		// build geometry

    		this.setIndex(indices);
    		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
    		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
    		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

    		this.computeBoundingBox();
    		this.computeBoundingSphere();
    	}

    });

    /**
     * SphereGeometry data
     * @class
     */
    function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        Geometry.call(this);

        this.buildGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
    }

    SphereGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

        constructor: SphereGeometry,

        buildGeometry: function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
            radius = radius || 1;

            widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
            heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

            phiStart = phiStart !== undefined ? phiStart : 0;
            phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

            var thetaEnd = thetaStart + thetaLength;

            var ix, iy;

            var index = 0;
            var grid = [];

            var vertex = new Vector3();
            var normal = new Vector3();

            // buffers

            var indices = [];
            var vertices = [];
            var normals = [];
            var uvs = [];

            // generate vertices, normals and uvs

            for (iy = 0; iy <= heightSegments; iy++) {

                var verticesRow = [];

                var v = iy / heightSegments;

                for (ix = 0; ix <= widthSegments; ix++) {

                    var u = ix / widthSegments;

                    // vertex

                    vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

                    vertices.push(vertex.x, vertex.y, vertex.z);

                    // normal

                    normal.set(vertex.x, vertex.y, vertex.z).normalize();
                    normals.push(normal.x, normal.y, normal.z);

                    // uv

                    uvs.push(u, 1 - v);

                    verticesRow.push(index++);

                }

                grid.push(verticesRow);

            }

            // indices

            for (iy = 0; iy < heightSegments; iy++) {

                for (ix = 0; ix < widthSegments; ix++) {

                    var a = grid[iy][ix + 1];
                    var b = grid[iy][ix];
                    var c = grid[iy + 1][ix];
                    var d = grid[iy + 1][ix + 1];

                    if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
                    if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);

                }

            }

            this.setIndex(indices);
            this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
            this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
            this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

            this.computeBoundingBox();
            this.computeBoundingSphere();
        }
    });

    exports.EventDispatcher = EventDispatcher;
    exports.Raycaster = Raycaster;
    exports.Euler = Euler;
    exports.Vector2 = Vector2;
    exports.Vector3 = Vector3;
    exports.Vector4 = Vector4;
    exports.Matrix3 = Matrix3;
    exports.Matrix4 = Matrix4;
    exports.Quaternion = Quaternion;
    exports.Box2 = Box2;
    exports.Box3 = Box3;
    exports.Sphere = Sphere;
    exports.Plane = Plane;
    exports.Frustum = Frustum;
    exports.Color3 = Color3;
    exports.Ray = Ray;
    exports.Triangle = Triangle;
    exports.Curve = Curve;
    exports.Spherical = Spherical;
    exports.Texture2D = Texture2D;
    exports.TextureCube = TextureCube;
    exports.TextureData = TextureData;
    exports.TextureDepth = TextureDepth;
    exports.Bone = Bone;
    exports.Skeleton = Skeleton;
    exports.ColorKeyframeTrack = ColorKeyframeTrack;
    exports.KeyframeAnimation = KeyframeAnimation;
    exports.KeyframeClip = KeyframeClip;
    exports.KeyframeData = KeyframeData;
    exports.KeyframeTrack = KeyframeTrack;
    exports.QuaternionKeyframeTrack = QuaternionKeyframeTrack;
    exports.VectorKeyframeTrack = VectorKeyframeTrack;
    exports.BufferAttribute = BufferAttribute;
    exports.CubeGeometry = CubeGeometry;
    exports.CylinderGeometry = CylinderGeometry;
    exports.Geometry = Geometry;
    exports.InstancedBufferAttribute = InstancedBufferAttribute;
    exports.InstancedGeometry = InstancedGeometry;
    exports.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
    exports.InterleavedBuffer = InterleavedBuffer;
    exports.InterleavedBufferAttribute = InterleavedBufferAttribute;
    exports.PlaneGeometry = PlaneGeometry;
    exports.SphereGeometry = SphereGeometry;
    exports.generateUUID = generateUUID;
    exports.isMobile = isMobile;
    exports.isWeb = isWeb;
    exports.createCheckerBoardPixels = createCheckerBoardPixels;
    exports.isPowerOfTwo = isPowerOfTwo;
    exports.nearestPowerOfTwo = nearestPowerOfTwo;
    exports.nextPowerOfTwo = nextPowerOfTwo;
    exports.cloneUniforms = cloneUniforms;
    exports.halton = halton;
    exports.OBJECT_TYPE = OBJECT_TYPE;
    exports.LIGHT_TYPE = LIGHT_TYPE;
    exports.MATERIAL_TYPE = MATERIAL_TYPE;
    exports.FOG_TYPE = FOG_TYPE;
    exports.BLEND_TYPE = BLEND_TYPE;
    exports.BLEND_EQUATION = BLEND_EQUATION;
    exports.BLEND_FACTOR = BLEND_FACTOR;
    exports.CULL_FACE_TYPE = CULL_FACE_TYPE;
    exports.DRAW_SIDE = DRAW_SIDE;
    exports.SHADING_TYPE = SHADING_TYPE;
    exports.WEBGL_TEXTURE_TYPE = WEBGL_TEXTURE_TYPE;
    exports.WEBGL_PIXEL_FORMAT = WEBGL_PIXEL_FORMAT;
    exports.WEBGL_PIXEL_TYPE = WEBGL_PIXEL_TYPE;
    exports.WEBGL_TEXTURE_FILTER = WEBGL_TEXTURE_FILTER;
    exports.WEBGL_TEXTURE_WRAP = WEBGL_TEXTURE_WRAP;
    exports.WEBGL_UNIFORM_TYPE = WEBGL_UNIFORM_TYPE;
    exports.WEBGL_ATTRIBUTE_TYPE = WEBGL_ATTRIBUTE_TYPE;
    exports.WEBGL_BUFFER_USAGE = WEBGL_BUFFER_USAGE;
    exports.SHADOW_TYPE = SHADOW_TYPE;
    exports.TEXEL_ENCODING_TYPE = TEXEL_ENCODING_TYPE;
    exports.ENVMAP_COMBINE_TYPE = ENVMAP_COMBINE_TYPE;
    exports.DRAW_MODE = DRAW_MODE;
    exports.RENDER_LAYER = RENDER_LAYER;
    exports.LAYER_RENDER_LIST = LAYER_RENDER_LIST;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
