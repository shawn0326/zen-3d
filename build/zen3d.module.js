/* github.com/shawn0326/zen-3d */
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
    if (!window.navigator) {
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
    CANVAS2D: "canvas2d"
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
    POINT: "point",
    LINE: "line",
    LINE_LOOP: "lineloop",
    LINE_DASHED: "linedashed",
    CANVAS2D: "canvas2d",
    SHADER: "shader",
    DEPTH: "depth",
    DISTANCE: "distance"
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
    DEPTH_STENCIL: 0x84F9,
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
    HALF_FLOAT: 36193, // WebGL2 0x140B
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

Object.assign(Quaternion.prototype, {

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

Object.assign( Quaternion, {

    slerpFlat: function ( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

		// fuzz-free, array-based Quaternion SLERP operation

		var x0 = src0[ srcOffset0 + 0 ],
			y0 = src0[ srcOffset0 + 1 ],
			z0 = src0[ srcOffset0 + 2 ],
			w0 = src0[ srcOffset0 + 3 ],

			x1 = src1[ srcOffset1 + 0 ],
			y1 = src1[ srcOffset1 + 1 ],
			z1 = src1[ srcOffset1 + 2 ],
			w1 = src1[ srcOffset1 + 3 ];

		if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

			var s = 1 - t,

				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

				dir = ( cos >= 0 ? 1 : - 1 ),
				sqrSin = 1 - cos * cos;

			// Skip the Slerp for tiny steps to avoid numeric problems:
			if ( sqrSin > Number.EPSILON ) {

				var sin = Math.sqrt( sqrSin ),
					len = Math.atan2( sin, cos * dir );

				s = Math.sin( s * len ) / sin;
				t = Math.sin( t * len ) / sin;

			}

			var tDir = t * dir;

			x0 = x0 * s + x1 * tDir;
			y0 = y0 * s + y1 * tDir;
			z0 = z0 * s + z1 * tDir;
			w0 = w0 * s + w1 * tDir;

			// Normalize in case we just did a lerp:
			if ( s === 1 - t ) {

				var f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

				x0 *= f;
				y0 *= f;
				z0 *= f;
				w0 *= f;

			}

		}

		dst[ dstOffset ] = x0;
		dst[ dstOffset + 1 ] = y0;
		dst[ dstOffset + 2 ] = z0;
		dst[ dstOffset + 3 ] = w0;

	}

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

Object.assign(Box3.prototype, {

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

TextureBase.prototype = Object.assign(Object.create(EventDispatcher.prototype), {

    constructor: TextureBase,

    clone: function() {
        return new this.constructor().copy( this );
    },

    copy: function( source ) {
        this.textureType = source.textureType;
        this.border = source.border;
        this.pixelFormat = source.pixelFormat;
        this.pixelType = source.pixelType;
        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;
        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;
        this.anisotropy = source.anisotropy;
        this.generateMipmaps = source.generateMipmaps;
        this.encoding = source.encoding;
        this.flipY = source.flipY;

        this.version = source.version;

        return this;
    },

    dispose: function() {
        this.dispatchEvent({type: 'dispose'});

        this.version = 0;
    }

});

/**
 * ImageLoader
 * @class
 * Loader for image
 */
function ImageLoader() {
    this.crossOrigin = undefined;
    this.path = undefined;
}

Object.assign(ImageLoader.prototype, {

    load: function(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path !== undefined) url = this.path + url;

        var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

        image.addEventListener('load', function() {
            if (onLoad) onLoad(this);
        }, false);

        // image.addEventListener('progress', function(event) {
        //     if (onProgress) onProgress(event);
        // }, false);

        image.addEventListener('error', function(event) {
            if (onError) onError(event);
        }, false);

        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
        }

        image.src = url;

        return image;
    },

    setCrossOrigin: function(value) {
        this.crossOrigin = value;
        return this;
    },

    setPath: function(value) {
        this.path = value;
        return this;
    }

});

/**
 * FileLoader
 * @class
 * Loader for file
 */
function FileLoader() {
    this.path = undefined;
    this.responseType = undefined;
    this.withCredentials = undefined;
    this.mimeType = undefined;
    this.requestHeader = undefined;
}

Object.assign(FileLoader.prototype, {

    load: function(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path != undefined) url = this.path + url;

        // Check for data: URI
        var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
        var dataUriRegexResult = url.match(dataUriRegex);

        if (dataUriRegexResult) { // Safari can not handle Data URIs through XMLHttpRequest so process manually
            var mimeType = dataUriRegexResult[1];
            var isBase64 = !!dataUriRegexResult[2];
            var data = dataUriRegexResult[3];
            data = window.decodeURIComponent(data);
            if (isBase64) data = window.atob(data); // decode base64
            try {
                var response;
                var responseType = (this.responseType || '').toLowerCase();
                switch (responseType) {
                    case 'arraybuffer':
                    case 'blob':
                        response = new ArrayBuffer(data.length);
                        var view = new Uint8Array(response);
                        for (var i = 0; i < data.length; i++) {
                            view[i] = data.charCodeAt(i);
                        }
                        if (responseType === 'blob') {
                            response = new Blob([response], {
                                type: mimeType
                            });
                        }
                        break;
                    case 'document':
                        var parser = new DOMParser();
                        response = parser.parseFromString(data, mimeType);
                        break;
                    case 'json':
                        response = JSON.parse(data);
                        break;
                    default: // 'text' or other
                        response = data;
                        break;
                }

                // Wait for next browser tick
                window.setTimeout(function() {
                    if (onLoad) onLoad(response);
                }, 0);
            } catch (error) {
                // Wait for next browser tick
                window.setTimeout(function() {
                    onError && onError(error);
                }, 0);
            }
        } else {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.addEventListener('load', function(event) {
                var response = event.target.response;
                if (this.status === 200) {
                    if (onLoad) onLoad(response);
                } else if (this.status === 0) {
                    // Some browsers return HTTP Status 0 when using non-http protocol
                    // e.g. 'file://' or 'data://'. Handle as success.
                    console.warn('THREE.FileLoader: HTTP Status 0 received.');
                    if (onLoad) onLoad(response);
                } else {
                    if (onError) onError(event);
                }
            }, false);

            if (onProgress !== undefined) {
                request.addEventListener('progress', function(event) {
                    onProgress(event);
                }, false);
            }

            if (onError !== undefined) {
                request.addEventListener('error', function(event) {
                    onError(event);
                }, false);
            }

            if (this.responseType !== undefined) request.responseType = this.responseType;
            if (this.withCredentials !== undefined) request.withCredentials = this.withCredentials;
            if (request.overrideMimeType) request.overrideMimeType(this.mimeType !== undefined ? this.mimeType : 'text/plain');
            for (var header in this.requestHeader) {
                request.setRequestHeader(header, this.requestHeader[header]);
            }

            request.send(null);
        }
    },

    setPath: function(value) {
        this.path = value;
        return this;
    },

    setResponseType: function(value) {
        this.responseType = value;
        return this;
    },

    // Access-Control-Allow-Credentials: true
    setWithCredentials: function(value) {
        this.withCredentials = value;
        return this;
    },

    setMimeType: function(value) {
        this.mimeType = value;
        return this;
    },

    setRequestHeader: function(value) {
        this.requestHeader = value;
        return this;
    }

});

function TGALoader() {

}

Object.assign(TGALoader.prototype, {

	load: function(url, onLoad, onProgress, onError) {
		var that = this;

		var loader = new FileLoader();
		loader.setResponseType('arraybuffer');
		loader.load(url, function(buffer) {
			if (onLoad !== undefined) {
				onLoad(that.parse(buffer));
			}
		}, onProgress, onError);
	},

	// reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js
	parse: function(buffer) {
		// TGA Constants
		var TGA_TYPE_NO_DATA = 0,
		TGA_TYPE_INDEXED = 1,
		TGA_TYPE_RGB = 2,
		TGA_TYPE_GREY = 3,
		TGA_TYPE_RLE_INDEXED = 9,
		TGA_TYPE_RLE_RGB = 10,
		TGA_TYPE_RLE_GREY = 11,

		TGA_ORIGIN_MASK = 0x30,
		TGA_ORIGIN_SHIFT = 0x04,
		TGA_ORIGIN_BL = 0x00,
		TGA_ORIGIN_BR = 0x01,
		TGA_ORIGIN_UL = 0x02,
		TGA_ORIGIN_UR = 0x03;


		if ( buffer.length < 19 )
			console.error( 'TGALoader.parse: Not enough data to contain header.' );

		var content = new Uint8Array( buffer ),
			offset = 0,
			header = {
				id_length:       content[ offset ++ ],
				colormap_type:   content[ offset ++ ],
				image_type:      content[ offset ++ ],
				colormap_index:  content[ offset ++ ] | content[ offset ++ ] << 8,
				colormap_length: content[ offset ++ ] | content[ offset ++ ] << 8,
				colormap_size:   content[ offset ++ ],

				origin: [
					content[ offset ++ ] | content[ offset ++ ] << 8,
					content[ offset ++ ] | content[ offset ++ ] << 8
				],
				width:      content[ offset ++ ] | content[ offset ++ ] << 8,
				height:     content[ offset ++ ] | content[ offset ++ ] << 8,
				pixel_size: content[ offset ++ ],
				flags:      content[ offset ++ ]
			};

		function tgaCheckHeader( header ) {

			switch ( header.image_type ) {

				// Check indexed type
				case TGA_TYPE_INDEXED:
				case TGA_TYPE_RLE_INDEXED:
					if ( header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1 ) {

						console.error( 'TGALoader.parse.tgaCheckHeader: Invalid type colormap data for indexed type' );

					}
					break;

				// Check colormap type
				case TGA_TYPE_RGB:
				case TGA_TYPE_GREY:
				case TGA_TYPE_RLE_RGB:
				case TGA_TYPE_RLE_GREY:
					if ( header.colormap_type ) {

						console.error( 'TGALoader.parse.tgaCheckHeader: Invalid type colormap data for colormap type' );

					}
					break;

				// What the need of a file without data ?
				case TGA_TYPE_NO_DATA:
					console.error( 'TGALoader.parse.tgaCheckHeader: No data' );

				// Invalid type ?
				default:
					console.error( 'TGALoader.parse.tgaCheckHeader: Invalid type " ' + header.image_type + '"' );

			}

			// Check image width and height
			if ( header.width <= 0 || header.height <= 0 ) {

				console.error( 'TGALoader.parse.tgaCheckHeader: Invalid image size' );

			}

			// Check image pixel size
			if ( header.pixel_size !== 8  &&
				header.pixel_size !== 16 &&
				header.pixel_size !== 24 &&
				header.pixel_size !== 32 ) {

				console.error( 'TGALoader.parse.tgaCheckHeader: Invalid pixel size "' + header.pixel_size + '"' );

			}

		}

		// Check tga if it is valid format
		tgaCheckHeader( header );

		if ( header.id_length + offset > buffer.length ) {

			console.error( 'TGALoader.parse: No data' );

		}

		// Skip the needn't data
		offset += header.id_length;

		// Get targa information about RLE compression and palette
		var use_rle = false,
			use_pal = false,
			use_grey = false;

		switch ( header.image_type ) {

			case TGA_TYPE_RLE_INDEXED:
				use_rle = true;
				use_pal = true;
				break;

			case TGA_TYPE_INDEXED:
				use_pal = true;
				break;

			case TGA_TYPE_RLE_RGB:
				use_rle = true;
				break;

			case TGA_TYPE_RGB:
				break;

			case TGA_TYPE_RLE_GREY:
				use_rle = true;
				use_grey = true;
				break;

			case TGA_TYPE_GREY:
				use_grey = true;
				break;

		}

		// Parse tga image buffer
		function tgaParse( use_rle, use_pal, header, offset, data ) {

			var pixel_data,
				pixel_size,
				pixel_total,
				palettes;

			pixel_size = header.pixel_size >> 3;
			pixel_total = header.width * header.height * pixel_size;

				// Read palettes
				if ( use_pal ) {

					palettes = data.subarray( offset, offset += header.colormap_length * ( header.colormap_size >> 3 ) );

				}

				// Read RLE
				if ( use_rle ) {

					pixel_data = new Uint8Array( pixel_total );

				var c, count, i;
				var shift = 0;
				var pixels = new Uint8Array( pixel_size );

				while ( shift < pixel_total ) {

					c     = data[ offset ++ ];
					count = ( c & 0x7f ) + 1;

					// RLE pixels.
					if ( c & 0x80 ) {

						// Bind pixel tmp array
						for ( i = 0; i < pixel_size; ++ i ) {

							pixels[ i ] = data[ offset ++ ];

						}

						// Copy pixel array
						for ( i = 0; i < count; ++ i ) {

							pixel_data.set( pixels, shift + i * pixel_size );

						}

						shift += pixel_size * count;

					} else {

						// Raw pixels.
						count *= pixel_size;
						for ( i = 0; i < count; ++ i ) {

							pixel_data[ shift + i ] = data[ offset ++ ];

						}
						shift += count;

					}

				}

				} else {

				// RAW Pixels
				pixel_data = data.subarray(
						offset, offset += ( use_pal ? header.width * header.height : pixel_total )
				);

				}

				return {
				pixel_data: pixel_data,
				palettes: palettes
				};

		}

		function tgaGetImageData8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes ) {

			var colormap = palettes;
			var color, i = 0, x, y;
			var width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

					color = image[ i ];
					imageData[ ( x + width * y ) * 4 + 3 ] = 255;
					imageData[ ( x + width * y ) * 4 + 2 ] = colormap[ ( color * 3 ) + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = colormap[ ( color * 3 ) + 1 ];
					imageData[ ( x + width * y ) * 4 + 0 ] = colormap[ ( color * 3 ) + 2 ];

				}

			}

			return imageData;

		}

		function tgaGetImageData16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			var color, i = 0, x, y;
			var width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

					color = image[ i + 0 ] + ( image[ i + 1 ] << 8 ); // Inversed ?
					imageData[ ( x + width * y ) * 4 + 0 ] = ( color & 0x7C00 ) >> 7;
					imageData[ ( x + width * y ) * 4 + 1 ] = ( color & 0x03E0 ) >> 2;
					imageData[ ( x + width * y ) * 4 + 2 ] = ( color & 0x001F ) >> 3;
					imageData[ ( x + width * y ) * 4 + 3 ] = ( color & 0x8000 ) ? 0 : 255;

				}

			}

			return imageData;

		}

		function tgaGetImageData24bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			var i = 0, x, y;
			var width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 3 ) {

					imageData[ ( x + width * y ) * 4 + 3 ] = 255;
					imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
					imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];

				}

			}

			return imageData;

		}

		function tgaGetImageData32bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			var i = 0, x, y;
			var width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 4 ) {

					imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
					imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];
					imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 3 ];

				}

			}

			return imageData;

		}

		function tgaGetImageDataGrey8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			var color, i = 0, x, y;
			var width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

					color = image[ i ];
					imageData[ ( x + width * y ) * 4 + 0 ] = color;
					imageData[ ( x + width * y ) * 4 + 1 ] = color;
					imageData[ ( x + width * y ) * 4 + 2 ] = color;
					imageData[ ( x + width * y ) * 4 + 3 ] = 255;

				}

			}

			return imageData;

		}

		function tgaGetImageDataGrey16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			var i = 0, x, y;
			var width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

					imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 1 ];

				}

			}

			return imageData;

		}

		function getTgaRGBA( data, width, height, image, palette ) {

			var x_start,
				y_start,
				x_step,
				y_step,
				x_end,
				y_end;

			switch ( ( header.flags & TGA_ORIGIN_MASK ) >> TGA_ORIGIN_SHIFT ) {
				default:
				case TGA_ORIGIN_UL:
					x_start = 0;
					x_step = 1;
					x_end = width;
					y_start = 0;
					y_step = 1;
					y_end = height;
					break;

				case TGA_ORIGIN_BL:
					x_start = 0;
					x_step = 1;
					x_end = width;
					y_start = height - 1;
					y_step = - 1;
					y_end = - 1;
					break;

				case TGA_ORIGIN_UR:
					x_start = width - 1;
					x_step = - 1;
					x_end = - 1;
					y_start = 0;
					y_step = 1;
					y_end = height;
					break;

				case TGA_ORIGIN_BR:
					x_start = width - 1;
					x_step = - 1;
					x_end = - 1;
					y_start = height - 1;
					y_step = - 1;
					y_end = - 1;
					break;

			}

			if ( use_grey ) {

				switch ( header.pixel_size ) {
					case 8:
						tgaGetImageDataGrey8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;
					case 16:
						tgaGetImageDataGrey16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;
					default:
						console.error( 'TGALoader.parse.getTgaRGBA: not support this format' );
						break;
				}

			} else {

				switch ( header.pixel_size ) {
					case 8:
						tgaGetImageData8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette );
						break;

					case 16:
						tgaGetImageData16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					case 24:
						tgaGetImageData24bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					case 32:
						tgaGetImageData32bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					default:
						console.error( 'TGALoader.parse.getTgaRGBA: not support this format' );
						break;
				}

			}

			// Load image data according to specific method
			// var func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
			// func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
			return data;

		}

		var canvas = document.createElement( 'canvas' );
		canvas.width = header.width;
		canvas.height = header.height;

		var context = canvas.getContext( '2d' );
		var imageData = context.createImageData( header.width, header.height );

		var result = tgaParse( use_rle, use_pal, header, offset, content );
		var rgbaData = getTgaRGBA( imageData.data, header.width, header.height, result.pixel_data, result.palettes );

		context.putImageData( imageData, 0, 0 );

		return canvas;
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

    copy: function(source) {
        TextureBase.prototype.copy.call(this, source);

        this.image = source.image;
        this.mipmaps = source.mipmaps.slice(0);
        
        this.offset.copy( source.offset );
		this.repeat.copy( source.repeat );
		this.center.copy( source.center );
        this.rotation = source.rotation;
        
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy( source.matrix );

        return this;
    },

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

    var loader = isTGA ? new TGALoader() : new ImageLoader();
    loader.load(src, function(image) {
        texture.pixelFormat = isJPEG ? WEBGL_PIXEL_FORMAT.RGB : WEBGL_PIXEL_FORMAT.RGBA;
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

    constructor: TextureCube,

    copy: function(source) {

        TextureBase.prototype.copy.call(this, source);

        this.images = source.images.slice(0);

        return this;

    }

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
        var loader = isTGA ? new TGALoader() : new ImageLoader();
        loader.load(srcArray[count], next);
    }
    next();

    function loaded() {
        texture.pixelFormat = isJPEG ? WEBGL_PIXEL_FORMAT.RGB : WEBGL_PIXEL_FORMAT.RGBA;
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

    this.visible = true;

    this.userData = {};

    // render from lowest to highest
    this.renderOrder = 0;
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

    onBeforeRender: function () {},
	onAfterRender: function () {},

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

function Skeleton(bones) {

    // bones in array
    bones = bones || [];
    this.bones = bones.slice( 0 );

    // bone matrices data
    this.boneMatrices = new Float32Array(16 * this.bones.length);

    // use vertex texture to update boneMatrices
    // by that way, we can use more bones on phone
    this.boneTexture = undefined;
    this.boneTextureSize = 0;

}

Object.assign(Skeleton.prototype, {

    updateBones: function() {

        var offsetMatrix = new Matrix4();

        return function updateBones() {

            for(var i = 0; i < this.bones.length; i++) {
                var bone = this.bones[i];
                offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);
                offsetMatrix.toArray(this.boneMatrices, i * 16);
            }

            if (this.boneTexture !== undefined) {
                this.boneTexture.version++;
            }

        }

    }(),

    getBoneByName: function(name) {
        for ( var i = 0, il = this.bones.length; i < il; i ++ ) {
			var bone = this.bones[ i ];
			if ( bone.name === name ) {
				return bone;
			}
		}

		return undefined;
    }

});

//// mix functions

function select(buffer, dstOffset, srcOffset, t, stride) {

    if ( t >= 0.5 ) {

        for ( var i = 0; i !== stride; ++ i ) {

            buffer[ dstOffset + i ] = buffer[ srcOffset + i ];

        }

    }

}

function slerp(buffer, dstOffset, srcOffset, t) {

    Quaternion.slerpFlat( buffer, dstOffset, buffer, dstOffset, buffer, srcOffset, t );

}

function lerp(buffer, dstOffset, srcOffset, t, stride) {

    var s = 1 - t;

    for ( var i = 0; i !== stride; ++ i ) {

        var j = dstOffset + i;

        buffer[ j ] = buffer[ j ] * s + buffer[ srcOffset + i ] * t;

    }

}

/**
 * bind property and value, mixer for multiple values
 */
function PropertyBindingMixer(target, propertyPath, typeName, valueSize) {

    this.target = null;

    this.property = "";

    this.parseBinding(target, propertyPath);

    this.valueSize = valueSize;

    var bufferType = Float64Array;
    var mixFunction;

    switch ( typeName ) {

        case 'quaternion':
            mixFunction = slerp;
            break;
        case 'string':
        case 'bool':
            bufferType = Array;
            mixFunction = select;
            break;
        default:
            mixFunction = lerp;

    }

    // [result-value | new-value]
    this.buffer = new bufferType(valueSize * 2);

    this._mixBufferFunction = mixFunction;

    this.cumulativeWeight = 0;

    this.referenceCount = 0;
    this.useCount = 0;

}

Object.assign(PropertyBindingMixer.prototype, {

    parseBinding: function(target, propertyPath) {
        propertyPath = propertyPath.split(".");
    
        if (propertyPath.length > 1) {
            var property = target[propertyPath[0]];
    
    
            for (var index = 1; index < propertyPath.length - 1; index++) {
                property = property[propertyPath[index]];
            }
    
            this.property = propertyPath[propertyPath.length - 1];
            this.target = property;
        } else {
            this.property = propertyPath[0];
            this.target = target;
        }
    },

    /**
     * accumulate value 
     */
    accumulate: function(weight) {

        var buffer = this.buffer,
            stride = this.valueSize,
            offset = stride,

            currentWeight = this.cumulativeWeight;

        if (currentWeight === 0) {

            for (var i = 0; i !== stride; ++i) {

                buffer[ offset + i ] = buffer[ i ];

            }

            currentWeight = weight;

        } else {

            currentWeight += weight;
            var mix = weight / currentWeight;
            this._mixBufferFunction(buffer, offset, 0, mix, stride);

        }

        this.cumulativeWeight = currentWeight;

    },

    /**
     * update scene graph
     */
    apply: function() {

        var buffer = this.buffer,
            offset = this.valueSize,
            weight = this.cumulativeWeight;

        this.cumulativeWeight = 0;

        // set value
        if(this.valueSize > 1) {
            this.target[this.property].fromArray(buffer, offset);
        } else {
            this.target[this.property] = buffer[offset];
        }

    }

});

function AnimationMixer() {

    this._clips = {};

    this._bindings = {};

    this._activeClips = {};

}

Object.assign(AnimationMixer.prototype, {

    add: function(clip) {

        if(this._clips[clip.name] !== undefined) {
            console.warn("AnimationMixer.add: already has clip: " + clip.name);
            return;
        } 

        var tracks = clip.tracks;

        for (var i = 0; i < tracks.length; i++) {

            var track = tracks[i];
            var trackName = track.name;
            var binding;

            if(!this._bindings[trackName]) {
                binding = new PropertyBindingMixer(track.target, track.propertyPath, track.valueTypeName, track.valueSize);
                this._bindings[trackName] = binding;
            } else {
                binding = this._bindings[trackName];
            }

            binding.referenceCount++;

        }

        this._clips[clip.name] = clip;

    },

    remove: function(clip) {

        if(!this._clips[clip.name]) {
            console.warn("AnimationMixer.remove: has no clip: " + clip.name);
            return;
        }

        var tracks = clip.tracks;

        for (var i = 0; i < tracks.length; i++) {

            var track = tracks[i];
            var trackName = track.name;
            var binding = this._bindings[trackName];

            if ( binding ) {

                binding.referenceCount--;

            }

            if (binding.referenceCount <= 0) {

                delete this._bindings[trackName];

            }

        }

        delete this._clips[clip.name];

    },

    play: function(name, weight) {

        if (this._activeClips[name] !== undefined) {
            console.warn("AnimationMixer.play: clip " + name + " is playing.");
            return;
        }

        this._activeClips[name] = (weight === undefined) ? 1 : weight;

        var clip = this._clips[name];

        if (!clip) {
            console.warn("AnimationMixer.stop: clip " + name + " is not found.");
            return;
        }

        clip.frame = 0;

        var tracks = clip.tracks;

        for (var i = 0; i < tracks.length; i++) {

            var track = tracks[i];
            var trackName = track.name;
            var binding = this._bindings[trackName];

            if ( binding ) {

                binding.useCount++;

            }

        }

    },

    stop: function(name) {

        if (this._activeClips[name] === undefined) {
            console.warn("AnimationMixer.stop: clip " + name + " is not playing.");
            return;
        }

        delete this._activeClips[name];

        var clip = this._clips[name];

        if (!clip) {
            console.warn("AnimationMixer.stop: clip " + name + " is not found.");
            return;
        }

        var tracks = clip.tracks;

        for (var i = 0; i < tracks.length; i++) {

            var track = tracks[i];
            var trackName = track.name;
            var binding = this._bindings[trackName];

            if ( binding && binding.useCount > 0) {

                binding.useCount--;

            }

        }

    },

    update: function(t) {
        
        for (var name in this._activeClips) {

            var clip = this._clips[name];
            var weight = this._activeClips[name];

            clip.update(t, this._bindings, weight);

        }

        for (var key in this._bindings) {

            if ( this._bindings[key].useCount > 0 ) {

                this._bindings[key].apply();

            }
            
        }

    },

    // set clip weight
    // this method can be used for cross fade
    setClipWeight: function(name, weight) {

        if (this._activeClips[name] === undefined) {
            console.warn("AnimationMixer.stop: clip " + name + " is not playing.");
            return;
        }

        this._activeClips[name] = weight;

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

/**
 * KeyframeTrack
 * base class for property track
 */
function KeyframeTrack(target, propertyPath, times, values, interpolant) {

    this.target = target;
    this.propertyPath = propertyPath;

    this.name = this.target.uuid + "." + propertyPath;

    this.times = times;
    this.values = values;
    
    this.valueSize = values.length / times.length;

    this.interpolant = ( interpolant === undefined ) ? true : interpolant;

}

Object.assign(KeyframeTrack.prototype, {

    _getLastTimeIndex: function(t) {
        var lastTimeIndex = 0;
        var i, l = this.times.length;
        for(i = 0; i < l; i++) {
            if(t >= this.times[i]) {
                lastTimeIndex = i;
            }
        }
        return lastTimeIndex;
    },

    getValue: function(t, outBuffer) {

        var index = this._getLastTimeIndex(t),
            times = this.times,
            values = this.values,
            valueSize = this.valueSize;

        var key1 = times[index],
            key2 = times[index + 1],
            value1, value2;
        
        for (var i = 0; i < valueSize; i++) {

            value1 = values[index * valueSize + i];
            value2 = values[(index + 1) * valueSize + i];

            if (this.interpolant) {

                if ( value1 !== undefined && value2 !== undefined ) {
                    var ratio = (t - key1) / (key2 - key1);
                    outBuffer[i] = value1 * (1 - ratio) + value2 * ratio;
                } else {
                    outBuffer[i] = value1;
                }

            } else {
                outBuffer[i] = value1;
            }

        }

    }

});

/**
 * BooleanKeyframeTrack
 * used for boolean property track
 */
function BooleanKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

BooleanKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: BooleanKeyframeTrack,
    
    valueTypeName: 'bool',

    getValue: function(t, outBuffer) {

        var index = this._getLastTimeIndex(t),
            key = this.times[index];
        
        outBuffer[0] = this.values[key];

    }

});

/**
 * ColorKeyframeTrack
 * used for vector property track
 */
function ColorKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

ColorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: ColorKeyframeTrack,
    
    valueTypeName: 'color'

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

    update: function(t, bindings, weight) {

        this.frame += t;

        if(this.frame > this.endFrame) {
            if(this.loop) {
                this.frame = this.startFrame;
            } else {
                this.frame = this.endFrame;
            }
        }
        
        for(var i = 0, l = this.tracks.length; i < l; i++) {

            var track = this.tracks[i];

            var bind = bindings[track.name];

            track.getValue(this.frame, bind.buffer);
            bind.accumulate(weight);

        }

    }

});

/**
 * NumberKeyframeTrack
 * used for vector property track
 */
function NumberKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

NumberKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: NumberKeyframeTrack,
    
    valueTypeName: 'number'

});

/**
 * QuaternionKeyframeTrack
 * used for quaternion property track
 */
function QuaternionKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

QuaternionKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: QuaternionKeyframeTrack,

    valueTypeName: 'quaternion',

    getValue: function(t, outBuffer) {

        var index = this._getLastTimeIndex(t),
            times = this.times,
            values = this.values,
            key1 = times[index],
            key2 = times[index + 1];

        if (this.interpolant) {
            if (key2 !== undefined) {
                var ratio = (t - key1) / (key2 - key1);
                Quaternion.slerpFlat( outBuffer, 0, values, index * 4, values, (index + 1) * 4,  ratio );
            } else {
                // just copy
                for(var i = 0; i < 4; i++) {
                    outBuffer[i] = values[index * 4 + i];
                }
            }
        } else {
            // just copy
            for(var i = 0; i < 4; i++) {
                outBuffer[i] = values[index * 4 + i];
            }
        }

    }

});

/**
 * StringKeyframeTrack
 * used for boolean property track
 */
function StringKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

StringKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: StringKeyframeTrack,
    
    valueTypeName: 'string',

    getValue: function(t, outBuffer) {

        var index = this._getLastTimeIndex(t),
            key = this.times[index];
        
        outBuffer[0] = this.values[key];

    }

});

/**
 * VectorKeyframeTrack
 * used for vector property track
 */
function VectorKeyframeTrack(target, propertyPath, times, values, interpolant) {
    KeyframeTrack.call(this, target, propertyPath, times, values, interpolant);
}

VectorKeyframeTrack.prototype = Object.assign(Object.create(KeyframeTrack.prototype), {

    constructor: VectorKeyframeTrack,
    
    valueTypeName: 'vector'

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

/**
 * base material class
 * @class
 */
function Material() {

    // material type
    this.type = "";

    this.opacity = 1;

    this.transparent = false;

    //blending
    this.blending = BLEND_TYPE.NORMAL;

    this.blendSrc = BLEND_FACTOR.SRC_ALPHA;
    this.blendDst = BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
    this.blendEquation = BLEND_EQUATION.ADD;
    this.blendSrcAlpha = null;
    this.blendDstAlpha = null;
    this.blendEquationAlpha = null;

    this.premultipliedAlpha = false;

    // use vertex colors
    this.vertexColors = false;

    // diffuse
    this.diffuse = new Color3(0xffffff);
    this.diffuseMap = null;

    // normal
    this.normalMap = null;

    // aoMap
    this.aoMap = null;
    this.aoMapIntensity = 1.0;

    // bump
    this.bumpMap = null;
    this.bumpScale = 1;

    // env
    this.envMap = null;
    this.envMapIntensity = 1;
    this.envMapCombine = ENVMAP_COMBINE_TYPE.MULTIPLY;

    // emissive
    this.emissive = new Color3(0x000000);
    this.emissiveMap = null;
    this.emissiveIntensity = 1;

    // depth test
    this.depthTest = true;
    this.depthWrite = true;

    this.colorWrite = true;

    // alpha test
    this.alphaTest = 0;

    // draw side
    this.side = DRAW_SIDE.FRONT;

    // shading type: SMOOTH_SHADING, FLAT_SHADING
    this.shading = SHADING_TYPE.SMOOTH_SHADING;

    // use light
    // if use light, renderer will try to upload light uniforms
    this.acceptLight = false;

    // draw mode
    this.drawMode = DRAW_MODE.TRIANGLES;

}

Object.assign(Material.prototype, {

    copy: function(source) {
        this.type = source.type;
        this.opacity = source.opacity;
        this.transparent = source.transparent;
        this.premultipliedAlpha = source.premultipliedAlpha;
        this.vertexColors = source.vertexColors;
        this.diffuse.copy(source.diffuse);
        this.diffuseMap = source.diffuseMap;
        this.normalMap = source.normalMap;
        this.bumpMap = source.bumpMap;
        this.bumpScale = source.bumpScale;
        this.envMap = source.envMap;
        this.envMapIntensity = source.envMapIntensity;
        this.envMapCombine = source.envMapCombine;
        this.emissive.copy(source.emissive);
        this.emissiveMap = source.emissiveMap;
        this.emissiveIntensity = source.emissiveIntensity;
        this.blending = source.blending;
        this.depthTest = source.depthTest;
        this.depthWrite = source.depthWrite;
        this.alphaTest = source.alphaTest;
        this.side = source.side;
        this.shading = source.shading;
        this.acceptLight = source.acceptLight;
        this.drawMode = source.drawMode;

        return this;
    },

    clone: function() {
        return new this.constructor().copy( this );
    }

});

/**
 * BasicMaterial
 * @class
 */
function BasicMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.BASIC;
}

BasicMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: BasicMaterial

});

/**
 * LambertMaterial
 * @class
 */
function LambertMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LAMBERT;

    this.acceptLight = true;
}

LambertMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LambertMaterial

});

/**
 * PhongMaterial
 * @class
 */
function PhongMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.PHONG;

    // specular
    this.shininess = 30;
    this.specular = new Color3(0x666666);
    this.specularMap = null;

    this.acceptLight = true;
}

PhongMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: PhongMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.shininess = source.shininess;
        this.specular.copy(source.specular);
        this.specularMap = source.specularMap;

        return this;
    }

});

/**
 * PBRMaterial
 * @class
 */
function PBRMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.PBR;

    this.roughness = 0.5;
    this.metalness = 0.5;

    this.roughnessMap = null;
    this.metalnessMap = null;

    this.acceptLight = true;
}

PBRMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: PBRMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.roughness = source.roughness;
        this.metalness = source.metalness;

        return this;
    }

});

/**
 * PointsMaterial
 * @class
 */
function PointsMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.POINT;

    this.size = 1;

    this.sizeAttenuation = true;

    this.drawMode = DRAW_MODE.POINTS;
}

PointsMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: PointsMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;

        return this;
    }

});

/**
 * LineMaterial
 * @class
 */
function LineMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE;

    // chrome bug on MacOS: gl.lineWidth no effect
    this.lineWidth = 1;

    this.drawMode = DRAW_MODE.LINES;
}

LineMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LineMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.lineWidth = source.lineWidth;

        return this;
    }

});

/**
 * LineLoopMaterial
 * @class
 */
function LineLoopMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE_LOOP;

    // chrome bug on MacOS: gl.lineWidth no effect
    this.lineWidth = 1;

    this.drawMode = DRAW_MODE.LINE_LOOP;
}

LineLoopMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LineLoopMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.lineWidth = source.lineWidth;

        return this;
    }

});

/**
 * LineDashedMaterial
 * @class
 */
function LineDashedMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE_DASHED;

    // chrome bug on MacOS: gl.lineWidth no effect
    this.lineWidth = 1;

    this.scale = 1;
    this.dashSize = 3;
    this.gapSize = 1;

    this.drawMode = DRAW_MODE.LINE_STRIP;
}

LineDashedMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LineDashedMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.lineWidth = source.lineWidth;
        this.scale = source.scale;
        this.dashSize = source.dashSize;
        this.gapSize = source.gapSize;

        return this;
    }

});

/**
 * ShaderMaterial
 * @class
 */
function ShaderMaterial(shader) {
    Material.call(this);

    this.type = MATERIAL_TYPE.SHADER;

    this.vertexShader = shader.vertexShader || "";

    this.fragmentShader = shader.fragmentShader || "";

    this.defines = {};
    // copy defines
    Object.assign( this.defines, shader.defines ); 

    // uniforms should match fragment shader
    this.uniforms = cloneUniforms(shader.uniforms);
}

ShaderMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: ShaderMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.vertexShader = source.vertexShader;
        this.fragmentShader = source.fragmentShader;

        return this;
    }

});

/**
 * DepthMaterial
 * @class
 */
function DepthMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.DEPTH;

    this.blending = BLEND_TYPE.NONE;

    this.packToRGBA = false;
}

DepthMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: DepthMaterial

});

/**
 * DistanceMaterial
 * @class
 */
function DistanceMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.DISTANCE;

    this.blending = BLEND_TYPE.NONE;
}

DistanceMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: DistanceMaterial

});

/**
 * WebGL capabilities
 * @constructor
 */
function WebGLCapabilities(gl) {

    var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
    var _extensions = {};

    /**
     * webgl get extension
     */
    function getExtension(name) {
    
        if(_extensions[name]) {
            return _extensions[name];
        }
    
        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) {
                break;
            }
        }
        _extensions[name] = ext;
    
        return ext;
    
    }

    // use dfdx and dfdy must enable OES_standard_derivatives
    getExtension("OES_standard_derivatives");
    // GL_OES_standard_derivatives
    getExtension("GL_OES_standard_derivatives");
    // WEBGL_depth_texture
    getExtension("WEBGL_depth_texture");
    // draw elements support uint
    getExtension('OES_element_index_uint');
    // use half float
    getExtension('OES_texture_half_float');
    
    var targetPrecision = "highp";

    /**
     * get max precision
     * @param gl
     * @param precision {string} the expect precision, can be: "highp"|"mediump"|"lowp"
     */
    function getMaxPrecision(gl, precision) {
        if (precision === 'highp') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
                return 'highp';
            }
            precision = 'mediump';
        }
        if (precision === 'mediump') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
                return 'mediump';
            }
        }
        return 'lowp';
    }

    var anisotropyExt = getExtension('EXT_texture_filter_anisotropic');

    return {
        version: parseFloat(/^WebGL\ ([0-9])/.exec(gl.getParameter(gl.VERSION))[1]),
        maxPrecision: getMaxPrecision(gl, targetPrecision),
        maxTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
        maxVertexTextures: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxCubemapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
        maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        floatTextures: !!getExtension('OES_texture_float'),
        shaderTextureLOD: getExtension('EXT_shader_texture_lod'),
        angleInstancedArraysExt: getExtension('ANGLE_instanced_arrays'),
        anisotropyExt: anisotropyExt,
        maxAnisotropy: (anisotropyExt !== null) ? gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0,
        getExtension: getExtension
    }

}

function createTexture(gl, type, target, count) {
    var data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
    var texture = gl.createTexture();

    gl.bindTexture(type, texture);
    gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    for (var i = 0; i < count; i++) {
        gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }

    return texture;
}

function WebGLState(gl, capabilities) {
    this.gl = gl;
    this.capabilities = capabilities;

    this.states = {};

    this.currentBlending = null;

    this.currentBlendEquation = null;
    this.currentBlendSrc = null;
    this.currentBlendDst = null;
    this.currentBlendEquationAlpha = null;
    this.currentBlendSrcAlpha = null;
    this.currentBlendDstAlpha = null;
        
    this.currentPremultipliedAlpha = null;

    this.currentCullFace = null;

    this.currentViewport = new Vector4();

    this.currentColorMask = null;

    this.currentClearColor = new Vector4();

    this.currentTextureSlot = null;
    this.currentBoundTextures = {};

    this.currentBoundBuffers = {};

    this.emptyTextures = {};
    this.emptyTextures[gl.TEXTURE_2D] = createTexture(gl, gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
    this.emptyTextures[gl.TEXTURE_CUBE_MAP] = createTexture(gl, gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);

    this.currentFlipSided = false;

    this.currentDepthMask = true;

    this.currentLineWidth = null;

    this.currentProgram = null;

    this.currentStencilMask = null;

    this.currentStencilFunc = null;
    this.currentStencilRef = null;
    this.currentStencilFuncMask = null;

    this.currentStencilFail = null;
    this.currentStencilZFail = null;
    this.currentStencilZPass = null;

    this.currentStencilClear = null;

    this.currentRenderTarget = null;
}

Object.assign(WebGLState.prototype, {

    setBlend: function(blend, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {
        var gl = this.gl;

        if (blend !== BLEND_TYPE.NONE) {
            this.enable(gl.BLEND);
        } else {
            this.disable(gl.BLEND);
        }

        if(blend !== BLEND_TYPE.CUSTOM) {
            if (blend !== this.currentBlending || premultipliedAlpha !== this.currentPremultipliedAlpha) {

                if (blend === BLEND_TYPE.NORMAL) {
                    if (premultipliedAlpha) {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    } else {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    }
                }
    
                if (blend === BLEND_TYPE.ADD) {
                    if (premultipliedAlpha) {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                    } else {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    }
                }
        
            }

            this.currentBlendEquation = null;
            this.currentBlendSrc = null;
            this.currentBlendDst = null;
            this.currentBlendEquationAlpha = null;
            this.currentBlendSrcAlpha = null;
            this.currentBlendDstAlpha = null;
        } else {
            blendEquationAlpha = blendEquationAlpha || blendEquation;
            blendSrcAlpha = blendSrcAlpha || blendSrc;
            blendDstAlpha = blendDstAlpha || blendDst;
            
            if ( blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha ) {

                gl.blendEquationSeparate( blendEquation, blendEquationAlpha );

                this.currentBlendEquation = blendEquation;
                this.currentBlendEquationAlpha = blendEquationAlpha;

            }

            if ( blendSrc !== this.currentBlendSrc || blendDst !== this.currentBlendDst || blendSrcAlpha !== this.currentBlendSrcAlpha || blendDstAlpha !== this.currentBlendDstAlpha ) {

                gl.blendFuncSeparate( blendSrc, blendDst, blendSrcAlpha, blendDstAlpha );

                this.currentBlendSrc = blendSrc;
                this.currentBlendDst = blendDst;
                this.currentBlendSrcAlpha = blendSrcAlpha;
                this.currentBlendDstAlpha = blendDstAlpha;

            }
        }

        this.currentBlending = blend;
        this.currentPremultipliedAlpha = premultipliedAlpha;
    },

    setFlipSided: function(flipSided) {
        var gl = this.gl;

        if (this.currentFlipSided !== flipSided) {
            if (flipSided) {
                gl.frontFace(gl.CW);
            } else {
                gl.frontFace(gl.CCW);
            }

            this.currentFlipSided = flipSided;
        }
    },

    setCullFace: function(cullFace) {
        var gl = this.gl;

        if (cullFace !== CULL_FACE_TYPE.NONE) {
            this.enable(gl.CULL_FACE);

            if (cullFace !== this.currentCullFace) {

                if (cullFace === CULL_FACE_TYPE.BACK) {
                    gl.cullFace(gl.BACK);
                } else if (cullFace === CULL_FACE_TYPE.FRONT) {
                    gl.cullFace(gl.FRONT);
                } else {
                    gl.cullFace(gl.FRONT_AND_BACK);
                }

            }
        } else {
            this.disable(gl.CULL_FACE);
        }

        this.currentCullFace = cullFace;
    },

    viewport: function(x, y, width, height) {
        var currentViewport = this.currentViewport;
        if (currentViewport.x !== x ||
            currentViewport.y !== y ||
            currentViewport.z !== width ||
            currentViewport.w !== height
        ) {
            var gl = this.gl;
            gl.viewport(x, y, width, height);
            currentViewport.set(x, y, width, height);
        }
    },

    colorMask: function(colorMask) {
        if ( this.currentColorMask !== colorMask ) {

            this.gl.colorMask( colorMask, colorMask, colorMask, colorMask );
            this.currentColorMask = colorMask;

        }
    },

    clearColor: function(r, g, b, a) {
        var currentClearColor = this.currentClearColor;
        if (currentClearColor.x !== r ||
            currentClearColor.y !== g ||
            currentClearColor.z !== b ||
            currentClearColor.w !== a
        ) {
            var gl = this.gl;
            gl.clearColor(r, g, b, a);
            currentClearColor.set(r, g, b, a);
        }
    },

    activeTexture: function(slot) {
        var gl = this.gl;

        if (slot === undefined) {
            slot = gl.TEXTURE0 + this.capabilities.maxTextures - 1;
        }

        if (this.currentTextureSlot !== slot) {
            gl.activeTexture(slot);
            this.currentTextureSlot = slot;
        }
    },

    bindTexture: function(type, texture) {
        var gl = this.gl;

        if (this.currentTextureSlot === null) {
            this.activeTexture();
        }

        var boundTexture = this.currentBoundTextures[this.currentTextureSlot];

        if (boundTexture === undefined) {
            boundTexture = {
                type: undefined,
                texture: undefined
            };
            this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
        }

        if (boundTexture.type !== type || boundTexture.texture !== texture) {
            gl.bindTexture(type, texture || this.emptyTextures[type]);
            boundTexture.type = type;
            boundTexture.texture = texture;
        }
    },

    bindBuffer: function(type, buffer) {
        var gl = this.gl;

        var boundBuffer = this.currentBoundBuffers[type];

        if (boundBuffer !== buffer) {
            gl.bindBuffer(type, buffer);
            this.currentBoundBuffers[type] = buffer;
        }
    },

    enable: function(id) {
        if (this.states[id] !== true) {
            this.gl.enable(id);
            this.states[id] = true;
        }
    },

    disable: function(id) {
        if (this.states[id] !== false) {
            this.gl.disable(id);
            this.states[id] = false;
        }
    },

    // depth mask should attach to a frame buffer???
    depthMask: function(flag) {
        if(flag !== this.currentDepthMask) {
            this.gl.depthMask(flag);
            this.currentDepthMask = flag;
        }
    },

    setLineWidth: function(width) {
        if(width !== this.currentLineWidth) {
            if(this.capabilities.version >= 1.0) {
                this.gl.lineWidth(width);
            }
            this.currentLineWidth = width;
        }
    },

    setProgram: function(program) {
        if(this.currentProgram !== program) {
            this.gl.useProgram(program.id);
            this.currentProgram = program;
        }
    },

    stencilMask: function(stencilMask) {
        if(this.currentStencilMask !== stencilMask) {
            this.gl.stencilMask( stencilMask );
            this.currentStencilMask = stencilMask;
        }
    },

    stencilFunc: function(stencilFunc, stencilRef, stencilMask) {
        if ( this.currentStencilFunc !== stencilFunc ||
                this.currentStencilRef 	!== stencilRef 	||
                this.currentStencilFuncMask !== stencilMask ) {

            this.gl.stencilFunc( stencilFunc, stencilRef, stencilMask );

            this.currentStencilFunc = stencilFunc;
            this.currentStencilRef = stencilRef;
            this.currentStencilFuncMask = stencilMask;

        }
    },

    stencilOp: function(stencilFail, stencilZFail, stencilZPass) {
        if ( this.currentStencilFail	 !== stencilFail 	||
                this.currentStencilZFail !== stencilZFail ||
                this.currentStencilZPass !== stencilZPass ) {

            this.gl.stencilOp( stencilFail, stencilZFail, stencilZPass );

            this.currentStencilFail = stencilFail;
            this.currentStencilZFail = stencilZFail;
            this.currentStencilZPass = stencilZPass;

        }
    },

    clearStencil: function(stencil) {
        if ( this.currentStencilClear !== stencil ) {

            this.gl.clearStencil( stencil );
            this.currentStencilClear = stencil;

        }
    }

});

function WebGLProperties() {
    this.properties = {};
}

Object.assign(WebGLProperties.prototype, {

    get: function(object) {
        var uuid = object.uuid;
        var map = this.properties[uuid];
        if (map === undefined) {
            map = {};
            this.properties[uuid] = map;
        }
        return map;
    },

    delete: function(object) {
        delete this.properties[object.uuid];
    },

    clear: function() {
        this.properties = {};
    }

});

function textureNeedsPowerOfTwo(texture) {
    if (texture.wrapS !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE) return true;
    if (texture.minFilter !== WEBGL_TEXTURE_FILTER.NEAREST && texture.minFilter !== WEBGL_TEXTURE_FILTER.LINEAR) return true;

    return false;
}

function filterFallback(filter) {
    if (filter === WEBGL_TEXTURE_FILTER.NEAREST || filter === WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR || filter === WEBGL_TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST) {
        return WEBGL_TEXTURE_FILTER.NEAREST;
    }

    return WEBGL_TEXTURE_FILTER.LINEAR;
}

function _isPowerOfTwo(image) {
    return isPowerOfTwo(image.width) && isPowerOfTwo(image.height);
}

function makePowerOf2(image) {
    if (isWeb && (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement)) {

        var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        canvas.width = nearestPowerOfTwo(image.width);
        canvas.height = nearestPowerOfTwo(image.height);

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        console.warn('image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

        return canvas;

    }

    return image;
}

function clampToMaxSize(image, maxSize) {
    if (image.width > maxSize || image.height > maxSize) {

        if (!isWeb) {
            console.warn('image is too big (' + image.width + 'x' + image.height + '). max size is ' + maxSize + 'x' + maxSize, image);
            return image;
        }
        // Warning: Scaling through the canvas will only work with images that use
        // premultiplied alpha.

        var scale = maxSize / Math.max(image.width, image.height);

        var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        canvas.width = Math.floor(image.width * scale);
        canvas.height = Math.floor(image.height * scale);

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

        console.warn('image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

        return canvas;
    }

    return image;
}

function WebGLTexture(gl, state, properties, capabilities) {
    this.gl = gl;

    this.state = state;

    this.properties = properties;

    this.capabilities = capabilities;
}

Object.assign(WebGLTexture.prototype, {

    setTexture2D: function(texture, slot) {
        var gl = this.gl;
        var state = this.state;
    
        var textureProperties = this.properties.get(texture);
    
        if (texture.version > 0 && textureProperties.__version !== texture.version) {
    
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    
            var image = clampToMaxSize(texture.image, this.capabilities.maxTextureSize);
    
            if (textureNeedsPowerOfTwo(texture) && _isPowerOfTwo(image) === false) {
                image = makePowerOf2(image);
            }
    
            var isPowerOfTwoImage = _isPowerOfTwo(image);
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, isPowerOfTwoImage);
    
            var mipmap, mipmaps = texture.mipmaps,
                pixelFormat = texture.pixelFormat,
                pixelType = texture.pixelType;
    
            if(texture.isDataTexture) {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {
    
                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, mipmap.width, mipmap.height, texture.border, pixelFormat, pixelType, mipmap.data);
                    }
    
                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, image.width, image.height, texture.border, pixelFormat, pixelType, image.data);
                }
            } else {
                if (mipmaps.length > 0 && isPowerOfTwoImage) {
    
                    for (var i = 0, il = mipmaps.length; i < il; i++) {
                        mipmap = mipmaps[i];
                        gl.texImage2D(gl.TEXTURE_2D, i, pixelFormat, pixelFormat, pixelType, mipmap);
                    }
    
                    texture.generateMipmaps = false;
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, pixelFormat, pixelType, image);
                }
            }
    
            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
    
            textureProperties.__version = texture.version;
    
            return;
        }
    
        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    },

    setTextureCube: function(texture, slot) {
        var gl = this.gl;
        var state = this.state;
    
        var textureProperties = this.properties.get(texture);
    
        if (texture.version > 0 && textureProperties.__version !== texture.version) {
    
            if (textureProperties.__webglTexture === undefined) {
                texture.addEventListener('dispose', this.onTextureDispose, this);
                textureProperties.__webglTexture = gl.createTexture();
            }
    
            state.activeTexture(gl.TEXTURE0 + slot);
            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    
            var images = [];
    
            for (var i = 0; i < 6; i++) {
                images[i] = clampToMaxSize(texture.images[i], this.capabilities.maxCubemapSize);
            }
    
            var image = images[0];
            var isPowerOfTwoImage = _isPowerOfTwo(image);
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            this.setTextureParameters(texture, isPowerOfTwoImage);
    
            var pixelFormat = texture.pixelFormat,
                pixelType = texture.pixelType;
    
            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, pixelFormat, pixelFormat, pixelType, images[i]);
            }
    
            if (texture.generateMipmaps && isPowerOfTwoImage) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
    
            textureProperties.__version = texture.version;
    
            return;
        }
    
        state.activeTexture(gl.TEXTURE0 + slot);
        state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    },

    setTextureParameters: function(texture, isPowerOfTwoImage) {
        var gl = this.gl;
        var textureType = texture.textureType;
    
        if (isPowerOfTwoImage) {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, texture.wrapT);
    
            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, texture.minFilter);
        } else {
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
            if (texture.wrapS !== gl.CLAMP_TO_EDGE || texture.wrapT !== gl.CLAMP_TO_EDGE) {
                console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to zen3d.TEXTURE_WRAP.CLAMP_TO_EDGE.', texture);
            }
    
            gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter));
            gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter));
    
            if (
                (texture.minFilter !== gl.NEAREST && texture.minFilter !== gl.LINEAR) ||
                (texture.magFilter !== gl.NEAREST && texture.magFilter !== gl.LINEAR)
            ) {
                console.warn('Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to zen3d.TEXTURE_FILTER.NEAREST or zen3d.TEXTURE_FILTER.LINEAR.', texture);
            }
        }
    
        // EXT_texture_filter_anisotropic
        var extension = this.capabilities.anisotropyExt;
        if(extension && texture.anisotropy > 1) {
            gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, this.capabilities.maxAnisotropy));
        }
    },

    setRenderTarget2D: function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
    
        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);
    
        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            textureProperties.__webglTexture = gl.createTexture();
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
    
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    
            state.bindTexture(gl.TEXTURE_2D, textureProperties.__webglTexture);
    
            var isTargetPowerOfTwo = _isPowerOfTwo(renderTarget);
    
            this.setTextureParameters(renderTarget.texture, isTargetPowerOfTwo);
    
            var pixelFormat = renderTarget.texture.pixelFormat,
                pixelType = renderTarget.texture.pixelType;
            gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureProperties.__webglTexture, 0);
    
            if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
    
            state.bindTexture(gl.TEXTURE_2D, null);
    
            if (renderTarget.depthBuffer) {
    
                // setup depth texture
                if(renderTarget.depthTexture) {
                    var depthTextureProperties = this.properties.get(renderTarget.depthTexture);
    
                    depthTextureProperties.__webglTexture = gl.createTexture();
                    state.bindTexture(gl.TEXTURE_2D, depthTextureProperties.__webglTexture);
                    this.setTextureParameters(renderTarget.depthTexture, isTargetPowerOfTwo);
    
                    pixelFormat = renderTarget.depthTexture.pixelFormat;
                    pixelType = renderTarget.depthTexture.pixelType;
                    gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
    
                    if ( pixelType === WEBGL_PIXEL_TYPE.UNSIGNED_SHORT || pixelType === WEBGL_PIXEL_TYPE.UNSIGNED_INT ) {
    
                        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTextureProperties.__webglTexture, 0 );
            
                    } else if ( pixelType === WEBGL_PIXEL_TYPE.UNSIGNED_INT_24_8 ) {
            
                        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, depthTextureProperties.__webglTexture, 0 );
            
                    } else {
            
                        throw new Error( 'Unknown depthTexture format' );
            
                    }
    
                    state.bindTexture(gl.TEXTURE_2D, null);
                } else {
                    renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();
    
                    var renderbuffer = renderTargetProperties.__webglDepthbuffer;
    
                    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    
                    if (renderTarget.stencilBuffer) {
                        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                    } else {
                        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                    }
    
                    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                }
                
            }
    
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if(status !== gl.FRAMEBUFFER_COMPLETE) {
                if(status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                } else if(status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                } else if(status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                } else if(status === gl.FRAMEBUFFER_UNSUPPORTED) {
                    console.warn("framebuffer not complete: FRAMEBUFFER_UNSUPPORTED");
                } else {
                    console.warn("framebuffer not complete.");
                }
            }
    
            return;
        }
    
        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    },

    setRenderTargetCube: function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
    
        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);
    
        if (textureProperties.__webglTexture === undefined || renderTargetProperties.__webglFramebuffer === undefined) {
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);
            textureProperties.__webglTexture = gl.createTexture();
            renderTargetProperties.__webglFramebuffer = gl.createFramebuffer();
    
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    
            state.bindTexture(gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
    
            var isTargetPowerOfTwo = _isPowerOfTwo(renderTarget);
    
            this.setTextureParameters(renderTarget.texture, isTargetPowerOfTwo);
    
            var pixelFormat = renderTarget.texture.pixelFormat,
                pixelType = renderTarget.texture.pixelType;
            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, pixelFormat, renderTarget.width, renderTarget.height, 0, pixelFormat, pixelType, null);
            }
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
    
            if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
    
            state.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    
            if (renderTarget.depthBuffer) {
                renderTargetProperties.__webglDepthbuffer = gl.createRenderbuffer();
    
                var renderbuffer = renderTargetProperties.__webglDepthbuffer;
    
                gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    
                if (renderTarget.stencilBuffer) {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                } else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                }
    
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }
    
            return;
        }
    
        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
    
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
    },

    updateRenderTargetMipmap: function(renderTarget) {
        var gl = this.gl;
        var state = this.state;
        var texture = renderTarget.texture;
    
        if (texture.generateMipmaps && _isPowerOfTwo(renderTarget) &&
            texture.minFilter !== gl.NEAREST &&
            texture.minFilter !== gl.LINEAR) {
    
            var target = texture.textureType;
            var webglTexture = this.properties.get(texture).__webglTexture;
    
            state.bindTexture(target, webglTexture);
            gl.generateMipmap(target);
            state.bindTexture(target, null);
    
        }
    },

    onTextureDispose: function(event) {
        var gl = this.gl;
        var texture = event.target;
        var textureProperties = this.properties.get(texture);
    
        texture.removeEventListener('dispose', this.onTextureDispose, this);
    
        if(textureProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }
    
        this.properties.delete(texture);
    },

    onRenderTargetDispose: function(event) {
        var gl = this.gl;
        var renderTarget = event.target;
        var renderTargetProperties = this.properties.get(renderTarget);
    
        renderTarget.removeEventListener('dispose', this.onRenderTargetDispose, this);
    
        if(renderTargetProperties.__webglTexture) {
            gl.deleteTexture(textureProperties.__webglTexture);
        }
    
        if(renderTargetProperties.__webglFramebuffer) {
            gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
        }
    
        if(renderTargetProperties.__webglDepthbuffer) {
            gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer);
        }
    
        this.properties.delete(renderTarget);
    },

    setRenderTarget: function(target) {
        var gl = this.gl;
        var state = this.state;
    
        if (!target.texture) { // back RenderTarget
            if (state.currentRenderTarget === target) ; else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
                state.currentRenderTarget = target;
            }
    
            return;
        }
    
        var isCube = target.activeCubeFace !== undefined;
    
        if (state.currentRenderTarget !== target) {
            if (!isCube) {
                this.setRenderTarget2D(target);
            } else {
                this.setRenderTargetCube(target);
            }
    
            state.currentRenderTarget = target;
        } else {
            if (isCube) {
                var textureProperties = this.properties.get(target.texture);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
            }
        }
    }

});

function createBuffer(gl, data, attribute, bufferType) {
    var array = attribute.array;
    var usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    var buffer = gl.createBuffer();

    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, array, usage);

    var type = gl.FLOAT;

    if (array instanceof Float32Array) {
        type = gl.FLOAT;
    } else if (array instanceof Float64Array) {
        console.warn('Unsupported data buffer format: Float64Array.');
    } else if (array instanceof Uint16Array) {
        type = gl.UNSIGNED_SHORT;
    } else if (array instanceof Int16Array) {
        type = gl.SHORT;
    } else if (array instanceof Uint32Array) {
        type = gl.UNSIGNED_INT;
    } else if (array instanceof Int32Array) {
        type = gl.INT;
    } else if (array instanceof Int8Array) {
        type = gl.BYTE;
    } else if (array instanceof Uint8Array) {
        type = gl.UNSIGNED_BYTE;
    }

    data.buffer = buffer;
    data.type = type;
    data.bytesPerElement = array.BYTES_PER_ELEMENT;
    data.version = attribute.version;
}

function updateBuffer(gl, buffer, attribute, bufferType) {
    var array = attribute.array;
    var updateRange = attribute.updateRange;

    gl.bindBuffer(bufferType, buffer);

    if (attribute.dynamic === false) {
        gl.bufferData(bufferType, array, gl.STATIC_DRAW);
    } else if (updateRange.count === -1) {
        // Not using update ranges
        gl.bufferSubData(bufferType, 0, array);
    } else if (updateRange.count === 0) {
        console.error('updateBuffer: dynamic BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.');
    } else {
        gl.bufferSubData(bufferType, updateRange.offset * array.BYTES_PER_ELEMENT,
            array.subarray(updateRange.offset, updateRange.offset + updateRange.count));

        updateRange.count = -1; // reset range
    }
}

function updateAttribute(gl, properties, attribute, bufferType) {
    // if isInterleavedBufferAttribute, get InterleavedBuffer as data.
    // else get BufferAttribute as data
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = properties.get(attribute);

    if (data.buffer === undefined) {
        createBuffer(gl, data, attribute, bufferType);
    } else if (data.version < attribute.version) {
        updateBuffer(gl, data.buffer, attribute, bufferType);
        data.version = attribute.version;
    }
}

function removeAttribute(gl, properties, attribute) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = properties.get(attribute);

    if (data.buffer) {
        gl.deleteBuffer(data.buffer);
    }

    buffers.delete(attribute);
}

function WebGLGeometry(gl, state, properties, capabilities) {
    this.gl = gl;

    this.state = state;

    this.properties = properties;

    this.capabilities = capabilities;
}

Object.assign(WebGLGeometry.prototype, {

    // if need, create webgl buffers; but not bind
    setGeometry: function(geometry) {
        var gl = this.gl;
        var state = this.state;
        var properties = this.properties;

        var geometryProperties = this.properties.get(geometry);
        if (!geometryProperties.created) {
            geometry.addEventListener('dispose', this.onGeometryDispose2, this);
            geometryProperties.created = true;
        }

        if (geometry.index !== null) {
            updateAttribute(gl, properties, geometry.index, gl.ELEMENT_ARRAY_BUFFER);
        }

        for (var name in geometry.attributes) {
            updateAttribute(gl, properties, geometry.attributes[name], gl.ARRAY_BUFFER);
        }
    },

    onGeometryDispose: function(event) {
        var gl = this.gl;
        var geometry = event.target;
        var geometryProperties = this.properties.get(geometry);

        geometry.removeEventListener('dispose', this.onGeometryDispose, this);

        if (geometry.index !== null) {
            removeAttribute(gl, properties, geometry.index);
        }

        for (var name in geometry.attributes) {
            removeAttribute(gl, properties, geometry.attributes[name]);
        }

        this.properties.delete(geometry);
    }

});

function WebGLUniform(gl, program, uniformData) {
    this.gl = gl;

    this.name = uniformData.name;

    // WEBGL_UNIFORM_TYPE
    this.type = uniformData.type;

    this.size = uniformData.size;

    this.location = gl.getUniformLocation(program, this.name);

    this.setValue = undefined;
    this.set = undefined;
    this._generateSetValue();
}

Object.assign(WebGLUniform.prototype, {

    _generateSetValue: function() {
        var gl = this.gl;
        var type = this.type;
        var location = this.location;

        switch (type) {
            case WEBGL_UNIFORM_TYPE.FLOAT:
                if(this.size > 1) {
                    this.setValue = this.set = function(value) {
                        gl.uniform1fv(location, value);
                    };
                } else {
                    this.setValue = this.set = function(value) {
                        gl.uniform1f(location, value);
                    };
                }
                break;
            case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
            case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
            case WEBGL_UNIFORM_TYPE.BOOL:
            case WEBGL_UNIFORM_TYPE.INT:
                this.setValue = this.set = function(value) {
                    gl.uniform1i(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                this.setValue = function(p1, p2) {
                    gl.uniform2f(location, p1, p2);
                };
                this.set = function(value) {
                    gl.uniform2fv(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
            case WEBGL_UNIFORM_TYPE.INT_VEC2:
                this.setValue = function(p1, p2) {
                    gl.uniform2i(location, p1, p2);
                };
                this.set = function(value) {
                    gl.uniform2iv(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                this.setValue = function(p1, p2, p3) {
                    gl.uniform3f(location, p1, p2, p3);
                };
                this.set = function(value) {
                    gl.uniform3fv(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
            case WEBGL_UNIFORM_TYPE.INT_VEC3:
                this.setValue = function(p1, p2, p3) {
                    gl.uniform3i(location, p1, p2, p3);
                };
                this.set = function(value) {
                    gl.uniform3iv(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                this.setValue = function(p1, p2, p3, p4) {
                    gl.uniform4f(location, p1, p2, p3, p4);
                };
                this.set = function(value) {
                    gl.uniform4fv(location, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
            case WEBGL_UNIFORM_TYPE.INT_VEC4:
                this.setValue = function(p1, p2, p3, p4) {
                    gl.uniform4i(location, p1, p2, p3, p4);
                };
                this.set = function(value) {
                    gl.uniform4iv(location, value);
                };
                break;

            case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                this.setValue = this.set = function(value) {
                    gl.uniformMatrix2fv(location, false, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                this.setValue = this.set = function(value) {
                    gl.uniformMatrix3fv(location, false, value);
                };
                break;
            case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                this.setValue = this.set = function(value) {
                    gl.uniformMatrix4fv(location, false, value);
                };
                break;
        }
    }

});

function WebGLAttribute(gl, program, attributeData) {
    this.gl = gl;

    this.name = attributeData.name;

    // WEBGL_ATTRIBUTE_TYPE
    this.type = attributeData.type;

    this.size = attributeData.size;

    this.location = gl.getAttribLocation(program, this.name);

    this.count = 0;
    this.initCount(gl);

    this.format = gl.FLOAT;
    this.initFormat(gl);
}

Object.assign(WebGLAttribute.prototype, {

    initCount: function(gl) {
        var type = this.type;

        switch (type) {
            case WEBGL_ATTRIBUTE_TYPE.FLOAT:
            case WEBGL_ATTRIBUTE_TYPE.BYTE:
            case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
            case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                this.count = 1;
                break;
            case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                this.count = 2;
                break;
            case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                this.count = 3;
                break;
            case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                this.count = 4;
                break;
        }
    },

    initFormat: function(gl) {
        var type = this.type;

        switch (type) {
            case WEBGL_ATTRIBUTE_TYPE.FLOAT:
            case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
            case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
            case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                this.format = gl.FLOAT;
                break;
            case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                this.format = gl.UNSIGNED_BYTE;
                break;
            case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                this.format = gl.UNSIGNED_SHORT;
                break;
            case WEBGL_ATTRIBUTE_TYPE.BYTE:
                this.format = gl.BYTE;
                break;
        }
    }

});

function addLineNumbers( string ) {

    var lines = string.split( '\n' );

    for ( var i = 0; i < lines.length; i ++ ) {

        lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

    }

    return lines.join( '\n' );

}

/**
 * create a shader
 **/
function loadShader(gl, type, source) {
    // create a shader object
    var shader = gl.createShader(type);
    // bind the shader source, source must be string type?
    gl.shaderSource(shader, source);
    // compile shader
    gl.compileShader(shader);
    // if compile failed, log error
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.warn("shader not compiled!", gl.getShaderInfoLog(shader), addLineNumbers(source));
    }

    return shader;
}

/**
 * create a WebGL program
 **/
function createWebGLProgram(gl, vertexShader, fragmentShader) {
    // create a program object
    var program = gl.createProgram();
    // attach shaders to program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // link vertex shader and fragment shader
    gl.linkProgram(program);
    // if link failed, log error
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!linked) {
        console.warn("program not linked!", gl.getProgramInfoLog(program));
    }

    return program;
}

/**
 * extract uniforms
 */
function extractUniforms(gl, program) {
    var uniforms = {};

    var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (var i = 0; i < totalUniforms; i++) {
        var uniformData = gl.getActiveUniform(program, i);
        var name = uniformData.name;
        var uniform = new WebGLUniform(gl, program, uniformData);
        uniforms[name] = uniform;
    }

    return uniforms;
}

/**
 * extract attributes
 */
function extractAttributes(gl, program) {
    var attributes = {};

    var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < totalAttributes; i++) {
        var attribData = gl.getActiveAttrib(program, i);
        var name = attribData.name;
        var attribute = new WebGLAttribute(gl, program, attribData);
        attributes[name] = attribute;
    }

    return attributes;
}

/**
 * WebGL Program
 * @class Program
 */
function WebGLProgram(gl, vshader, fshader) {

    this.uuid = generateUUID();

    // vertex shader source
    this.vshaderSource = vshader;

    // fragment shader source
    this.fshaderSource = fshader;

    // WebGL vertex shader
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);

    // WebGL fragment shader
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);

    // program id
    this.id = createWebGLProgram(gl, vertexShader, fragmentShader);

    this.uniforms = extractUniforms(gl, this.id);

    this.attributes = extractAttributes(gl, this.id);

    // here we can delete shaders,
    // according to the documentation: https://www.opengl.org/sdk/docs/man/html/glLinkProgram.xhtml
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
}

WebGLProgram.prototype.dispose = function(gl) {
    gl.deleteProgram(this.id);
};

var alphaTest_frag = "#ifdef ALPHATEST\r\n\r\n\tif ( outColor.a < ALPHATEST ) discard;\r\n\r\n#endif";

var ambientlight_pars_frag = "uniform vec4 u_AmbientLightColor;";

var aoMap_pars_frag = "#ifdef USE_AOMAP\r\n\r\n\tuniform sampler2D aoMap;\r\n\tuniform float aoMapIntensity;\r\n\r\n#endif";

var begin_frag = "vec4 outColor = vec4(u_Color, u_Opacity);";

var begin_vert = "vec3 transformed = vec3(a_Position);\r\n#if defined(USE_NORMAL) || defined(USE_ENV_MAP)\r\n    vec3 objectNormal = vec3(a_Normal);\r\n#endif";

var bsdfs = "// diffuse just use lambert\r\n\r\nvec4 BRDF_Diffuse_Lambert(vec4 diffuseColor) {\r\n    return RECIPROCAL_PI * diffuseColor;\r\n}\r\n\r\n// specular use Cook-Torrance microfacet model, http://ruh.li/GraphicsCookTorrance.html\r\n// About RECIPROCAL_PI: referenced by http://www.joshbarczak.com/blog/?p=272\r\n\r\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\r\n\t// Original approximation by Christophe Schlick '94\r\n\tfloat fresnel = pow( 1.0 - dotLH, 5.0 );\r\n\r\n\t// Optimized variant (presented by Epic at SIGGRAPH '13)\r\n\t// float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\r\n\r\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\r\n}\r\n\r\n// use blinn phong instead of phong\r\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\r\n    // ( shininess * 0.5 + 1.0 ), three.js do this, but why ???\r\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\r\n}\r\n\r\nfloat G_BlinnPhong_Implicit( ) {\r\n\t// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\r\n\treturn 0.25;\r\n}\r\n\r\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\r\n    vec3 H = normalize(L + V);\r\n\r\n    float dotNH = saturate(dot(N, H));\r\n    float dotLH = saturate(dot(L, H));\r\n\r\n    vec4 F = F_Schlick(specularColor, dotLH);\r\n\r\n    float G = G_BlinnPhong_Implicit( );\r\n\r\n    float D = D_BlinnPhong(shininess, dotNH);\r\n\r\n    return F * G * D;\r\n}\r\n\r\n// Microfacet Models for Refraction through Rough Surfaces - equation (33)\r\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\r\n// alpha is \"roughness squared\" in Disney’s reparameterization\r\nfloat D_GGX( const in float alpha, const in float dotNH ) {\r\n\r\n\tfloat a2 = pow2( alpha );\r\n\r\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1\r\n\r\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\r\n\r\n}\r\n\r\n// Microfacet Models for Refraction through Rough Surfaces - equation (34)\r\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\r\n// alpha is \"roughness squared\" in Disney’s reparameterization\r\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\r\n\r\n\t// geometry term = G(l)⋅G(v) / 4(n⋅l)(n⋅v)\r\n\r\n\tfloat a2 = pow2( alpha );\r\n\r\n\tfloat gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\r\n\tfloat gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\r\n\r\n\treturn 1.0 / ( gl * gv );\r\n\r\n}\r\n\r\n// Moving Frostbite to Physically Based Rendering 2.0 - page 12, listing 2\r\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr_v2.pdf\r\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\r\n\r\n\tfloat a2 = pow2( alpha );\r\n\r\n\t// dotNL and dotNV are explicitly swapped. This is not a mistake.\r\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\r\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\r\n\r\n\treturn 0.5 / max( gv + gl, EPSILON );\r\n}\r\n\r\n// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility\r\nvec4 BRDF_Specular_GGX(vec4 specularColor, vec3 N, vec3 L, vec3 V, float roughness) {\r\n\r\n\tfloat alpha = pow2( roughness ); // UE4's roughness\r\n\r\n\tvec3 H = normalize(L + V);\r\n\r\n\tfloat dotNL = saturate( dot(N, L) );\r\n\tfloat dotNV = saturate( dot(N, V) );\r\n\tfloat dotNH = saturate( dot(N, H) );\r\n\tfloat dotLH = saturate( dot(L, H) );\r\n\r\n\tvec4 F = F_Schlick( specularColor, dotLH );\r\n\r\n\tfloat G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\r\n\r\n\tfloat D = D_GGX( alpha, dotNH );\r\n\r\n\treturn F * G * D;\r\n\r\n}\r\n\r\n// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\r\nvec4 BRDF_Specular_GGX_Environment( const in vec3 N, const in vec3 V, const in vec4 specularColor, const in float roughness ) {\r\n\r\n\tfloat dotNV = saturate( dot( N, V ) );\r\n\r\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\r\n\r\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\r\n\r\n\tvec4 r = roughness * c0 + c1;\r\n\r\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\r\n\r\n\tvec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\r\n\r\n\treturn specularColor * AB.x + AB.y;\r\n\r\n}\r\n\r\n// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\r\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\r\n\treturn ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\r\n}\r\n\r\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\r\n\treturn sqrt( 2.0 / ( blinnExponent + 2.0 ) );\r\n}";

var bumpMap_pars_frag = "#ifdef USE_BUMPMAP\r\n\r\n\tuniform sampler2D bumpMap;\r\n\tuniform float bumpScale;\r\n\r\n\t// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\r\n\t// http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\r\n\r\n\t// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\r\n\r\n\tvec2 dHdxy_fwd(vec2 uv) {\r\n\r\n\t\tvec2 dSTdx = dFdx( uv );\r\n\t\tvec2 dSTdy = dFdy( uv );\r\n\r\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, uv ).x;\r\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\r\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\r\n\r\n\t\treturn vec2( dBx, dBy );\r\n\r\n\t}\r\n\r\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\r\n\r\n\t\tvec3 vSigmaX = dFdx( surf_pos );\r\n\t\tvec3 vSigmaY = dFdy( surf_pos );\r\n\t\tvec3 vN = surf_norm;\t\t// normalized\r\n\r\n\t\tvec3 R1 = cross( vSigmaY, vN );\r\n\t\tvec3 R2 = cross( vN, vSigmaX );\r\n\r\n\t\tfloat fDet = dot( vSigmaX, R1 );\r\n\r\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\r\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\r\n\r\n\t}\r\n\r\n#endif\r\n";

var clippingPlanes_frag = "#ifdef NUM_CLIPPING_PLANES\r\n\r\n    vec4 plane;\r\n\r\n    for ( int i = 0; i < NUM_CLIPPING_PLANES; i ++ ) {\r\n\r\n        plane = clippingPlanes[ i ];\r\n        if ( dot( -v_modelPos, plane.xyz ) > plane.w ) discard;\r\n\r\n    }\r\n\r\n#endif";

var clippingPlanes_pars_frag = "#ifdef NUM_CLIPPING_PLANES\r\n    uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\r\n#endif";

var color_frag = "#ifdef USE_VCOLOR\r\n    outColor *= v_Color;\r\n#endif";

var color_pars_frag = "#ifdef USE_VCOLOR\r\n    varying vec4 v_Color;\r\n#endif";

var color_pars_vert = "#ifdef USE_VCOLOR\r\n    attribute vec4 a_Color;\r\n    varying vec4 v_Color;\r\n#endif";

var color_vert = "#ifdef USE_VCOLOR\r\n    v_Color = a_Color;\r\n#endif";

var common_frag = "uniform mat4 u_View;\r\n\r\nuniform float u_Opacity;\r\nuniform vec3 u_Color;\r\n\r\nuniform vec3 u_CameraPosition;";

var common_vert = "attribute vec3 a_Position;\r\nattribute vec3 a_Normal;\r\n\r\n#include <transpose>\r\n#include <inverse>\r\n\r\nuniform mat4 u_Projection;\r\nuniform mat4 u_View;\r\nuniform mat4 u_Model;\r\n\r\nuniform vec3 u_CameraPosition;";

var diffuseMap_frag = "#ifdef USE_DIFFUSE_MAP\r\n    vec4 texelColor = texture2D( texture, v_Uv );\r\n    texelColor = mapTexelToLinear( texelColor );\r\n\r\n    outColor *= texelColor;\r\n#endif";

var diffuseMap_pars_frag = "#ifdef USE_DIFFUSE_MAP\r\n    uniform sampler2D texture;\r\n#endif";

var directlight_pars_frag = "struct DirectLight\r\n{\r\n    vec3 direction;\r\n    vec4 color;\r\n    float intensity;\r\n\r\n    int shadow;\r\n    float shadowBias;\r\n    float shadowRadius;\r\n    vec2 shadowMapSize;\r\n};\r\nuniform DirectLight u_Directional[USE_DIRECT_LIGHT];";

var emissiveMap_frag = "#ifdef USE_EMISSIVEMAP\r\n\r\n\tvec4 emissiveColor = texture2D(emissiveMap, v_Uv);\r\n\r\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\r\n\r\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\r\n\r\n#endif";

var emissiveMap_pars_frag = "#ifdef USE_EMISSIVEMAP\r\n\r\n\tuniform sampler2D emissiveMap;\r\n\r\n#endif";

var encodings_frag = "gl_FragColor = linearToOutputTexel( gl_FragColor );";

var encodings_pars_frag = "// For a discussion of what this is, please read this: http://lousodrome.net/blog/light/2013/05/26/gamma-correct-and-hdr-rendering-in-a-32-bits-buffer/\r\n\r\nvec4 LinearToLinear( in vec4 value ) {\r\n\treturn value;\r\n}\r\n\r\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\r\n\treturn vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\r\n}\r\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\r\n\treturn vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\r\n}\r\n\r\nvec4 sRGBToLinear( in vec4 value ) {\r\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\r\n}\r\nvec4 LinearTosRGB( in vec4 value ) {\r\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\r\n}\r\n\r\nvec4 RGBEToLinear( in vec4 value ) {\r\n\treturn vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\r\n}\r\nvec4 LinearToRGBE( in vec4 value ) {\r\n\tfloat maxComponent = max( max( value.r, value.g ), value.b );\r\n\tfloat fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\r\n\treturn vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\r\n//  return vec4( value.brg, ( 3.0 + 128.0 ) / 256.0 );\r\n}\r\n\r\n// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html\r\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\r\n\treturn vec4( value.xyz * value.w * maxRange, 1.0 );\r\n}\r\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\r\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\r\n\tfloat M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\r\n\tM            = ceil( M * 255.0 ) / 255.0;\r\n\treturn vec4( value.rgb / ( M * maxRange ), M );\r\n}\r\n\r\n// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html\r\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\r\n\treturn vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\r\n}\r\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\r\n\tfloat maxRGB = max( value.x, max( value.g, value.b ) );\r\n\tfloat D      = max( maxRange / maxRGB, 1.0 );\r\n\tD            = min( floor( D ) / 255.0, 1.0 );\r\n\treturn vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\r\n}\r\n\r\n// LogLuv reference: http://graphicrants.blogspot.ca/2009/04/rgbm-color-encoding.html\r\n\r\n// M matrix, for encoding\r\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\r\nvec4 LinearToLogLuv( in vec4 value )  {\r\n\tvec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\r\n\tXp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\r\n\tvec4 vResult;\r\n\tvResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\r\n\tfloat Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\r\n\tvResult.w = fract(Le);\r\n\tvResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\r\n\treturn vResult;\r\n}\r\n\r\n// Inverse M matrix, for decoding\r\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\r\nvec4 LogLuvToLinear( in vec4 value ) {\r\n\tfloat Le = value.z * 255.0 + value.w;\r\n\tvec3 Xp_Y_XYZp;\r\n\tXp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\r\n\tXp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\r\n\tXp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\r\n\tvec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\r\n\treturn vec4( max(vRGB, 0.0), 1.0 );\r\n}\r\n";

var end_frag = "gl_FragColor = outColor;";

var envMap_frag = "#ifdef USE_ENV_MAP\r\n\r\n    vec3 envDir;\r\n    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\r\n        envDir = reflect(normalize(v_worldPos - u_CameraPosition), N);\r\n    #else\r\n        envDir = v_EnvPos;\r\n    #endif\r\n\r\n    vec4 envColor = textureCube(envMap, envDir);\r\n\r\n    envColor = envMapTexelToLinear( envColor );\r\n\r\n    #ifdef ENVMAP_BLENDING_MULTIPLY\r\n\t\toutColor = mix(outColor, envColor * outColor, u_EnvMap_Intensity);\r\n\t#elif defined( ENVMAP_BLENDING_MIX )\r\n\t\toutColor = mix(outColor, envColor, u_EnvMap_Intensity);\r\n\t#elif defined( ENVMAP_BLENDING_ADD )\r\n\t\toutColor += envColor * u_EnvMap_Intensity;\r\n\t#endif\r\n#endif";

var envMap_pars_frag = "#ifdef USE_ENV_MAP\r\n    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\r\n        varying vec3 v_worldPos;\r\n    #else\r\n        varying vec3 v_EnvPos;\r\n    #endif\r\n    uniform samplerCube envMap;\r\n    uniform float u_EnvMap_Intensity;\r\n#endif";

var envMap_pars_vert = "#ifdef USE_ENV_MAP\r\n    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\r\n        varying vec3 v_worldPos;\r\n    #else\r\n        varying vec3 v_EnvPos;\r\n    #endif\r\n#endif";

var envMap_vert = "#ifdef USE_ENV_MAP\r\n    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\r\n        v_worldPos = (u_Model * vec4(transformed, 1.0)).xyz;\r\n    #else\r\n        v_EnvPos = reflect(normalize((u_Model * vec4(transformed, 1.0)).xyz - u_CameraPosition), (transpose(inverse(u_Model)) * vec4(objectNormal, 1.0)).xyz);\r\n    #endif\r\n#endif";

var fog_frag = "#ifdef USE_FOG\r\n\r\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\r\n\r\n    #ifdef USE_EXP2_FOG\r\n\r\n        float fogFactor = whiteCompliment( exp2( - u_FogDensity * u_FogDensity * depth * depth * LOG2 ) );\r\n\r\n    #else\r\n\r\n        float fogFactor = smoothstep( u_FogNear, u_FogFar, depth );\r\n\r\n    #endif\r\n\r\n    gl_FragColor.rgb = mix( gl_FragColor.rgb, u_FogColor, fogFactor );\r\n\r\n#endif";

var fog_pars_frag = "#ifdef USE_FOG\r\n\r\n    uniform vec3 u_FogColor;\r\n\r\n    #ifdef USE_EXP2_FOG\r\n\r\n        uniform float u_FogDensity;\r\n\r\n    #else\r\n\r\n        uniform float u_FogNear;\r\n        uniform float u_FogFar;\r\n    #endif\r\n\r\n#endif";

var inverse = "mat4 inverse(mat4 m) {\r\n    float\r\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\r\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\r\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\r\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\r\n    b00 = a00 * a11 - a01 * a10,\r\n    b01 = a00 * a12 - a02 * a10,\r\n    b02 = a00 * a13 - a03 * a10,\r\n    b03 = a01 * a12 - a02 * a11,\r\n    b04 = a01 * a13 - a03 * a11,\r\n    b05 = a02 * a13 - a03 * a12,\r\n    b06 = a20 * a31 - a21 * a30,\r\n    b07 = a20 * a32 - a22 * a30,\r\n    b08 = a20 * a33 - a23 * a30,\r\n    b09 = a21 * a32 - a22 * a31,\r\n    b10 = a21 * a33 - a23 * a31,\r\n    b11 = a22 * a33 - a23 * a32,\r\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n    return mat4(\r\n        a11 * b11 - a12 * b10 + a13 * b09,\r\n        a02 * b10 - a01 * b11 - a03 * b09,\r\n        a31 * b05 - a32 * b04 + a33 * b03,\r\n        a22 * b04 - a21 * b05 - a23 * b03,\r\n        a12 * b08 - a10 * b11 - a13 * b07,\r\n        a00 * b11 - a02 * b08 + a03 * b07,\r\n        a32 * b02 - a30 * b05 - a33 * b01,\r\n        a20 * b05 - a22 * b02 + a23 * b01,\r\n        a10 * b10 - a11 * b08 + a13 * b06,\r\n        a01 * b08 - a00 * b10 - a03 * b06,\r\n        a30 * b04 - a31 * b02 + a33 * b00,\r\n        a21 * b02 - a20 * b04 - a23 * b00,\r\n        a11 * b07 - a10 * b09 - a12 * b06,\r\n        a00 * b09 - a01 * b07 + a02 * b06,\r\n        a31 * b01 - a30 * b03 - a32 * b00,\r\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\r\n}";

var light_frag = "#ifdef USE_LIGHT\r\n    vec4 light;\r\n    vec3 L;\r\n\r\n    vec4 totalReflect = vec4(0., 0., 0., 0.); // direct light\r\n    vec4 indirectIrradiance = vec4(0., 0., 0., 0.); // for indirect diffuse\r\n    vec4 indirectRadiance = vec4(0., 0., 0., 0.); // for indirect specular\r\n\r\n    #ifdef USE_PBR\r\n        vec4 diffuseColor = outColor.xyzw * (1.0 - metalnessFactor);\r\n        vec4 specularColor = mix(vec4(0.04), outColor.xyzw, metalnessFactor);\r\n        float roughness = clamp(roughnessFactor, 0.04, 1.0);\r\n    #else\r\n        vec4 diffuseColor = outColor.xyzw;\r\n        #ifdef USE_PHONG\r\n            vec4 specularColor = u_SpecularColor;\r\n            float shininess = u_Specular;\r\n        #endif\r\n    #endif\r\n\r\n    #ifdef USE_AMBIENT_LIGHT\r\n        #ifdef USE_PBR\r\n            indirectIrradiance += PI * diffuseColor * u_AmbientLightColor;\r\n        #else\r\n            indirectIrradiance += diffuseColor * u_AmbientLightColor;\r\n        #endif\r\n    #endif\r\n\r\n    // TODO light map\r\n\r\n    #ifdef USE_PBR\r\n        #ifdef USE_ENV_MAP\r\n    \t\tvec3 envDir;\r\n    \t    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)\r\n    \t        envDir = reflect(normalize(v_worldPos - u_CameraPosition), N);\r\n    \t    #else\r\n    \t        envDir = v_EnvPos;\r\n    \t    #endif\r\n            indirectIrradiance += getLightProbeIndirectIrradiance(8, envDir);\r\n            indirectRadiance += getLightProbeIndirectRadiance(GGXRoughnessToBlinnExponent(roughness), 8, envDir);\r\n    \t#endif\r\n    #endif\r\n\r\n    #if (defined(USE_PHONG) || defined(USE_PBR))\r\n        vec3 V = normalize( u_CameraPosition - v_modelPos );\r\n    #endif\r\n\r\n    #ifdef USE_DIRECT_LIGHT\r\n    for(int i = 0; i < USE_DIRECT_LIGHT; i++) {\r\n        L = -u_Directional[i].direction;\r\n        light = u_Directional[i].color * u_Directional[i].intensity;\r\n        L = normalize(L);\r\n\r\n        float dotNL = saturate( dot(N, L) );\r\n        vec4 irradiance = light * dotNL;\r\n\r\n        #ifdef USE_SHADOW\r\n            irradiance *= bool( u_Directional[i].shadow ) ? getShadow( directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], u_Directional[i].shadowBias, u_Directional[i].shadowRadius, u_Directional[i].shadowMapSize ) : 1.0;\r\n        #endif\r\n\r\n        #ifdef USE_PBR\r\n            irradiance *= PI;\r\n        #endif\r\n\r\n        vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\r\n\r\n        #ifdef USE_PHONG\r\n            reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;\r\n        #endif\r\n\r\n        #ifdef USE_PBR\r\n            reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness) * specularStrength;\r\n        #endif\r\n\r\n        totalReflect += reflectLight;\r\n    }\r\n    #endif\r\n\r\n    #ifdef USE_POINT_LIGHT\r\n    for(int i = 0; i < USE_POINT_LIGHT; i++) {\r\n        L = u_Point[i].position - v_modelPos;\r\n        float dist = pow(clamp(1. - length(L) / u_Point[i].distance, 0.0, 1.0), u_Point[i].decay);\r\n        light = u_Point[i].color * u_Point[i].intensity * dist;\r\n        L = normalize(L);\r\n\r\n        float dotNL = saturate( dot(N, L) );\r\n        vec4 irradiance = light * dotNL;\r\n\r\n        #ifdef USE_PBR\r\n            irradiance *= PI;\r\n        #endif\r\n\r\n        #ifdef USE_SHADOW\r\n            vec3 worldV = v_modelPos - u_Point[i].position;\r\n            irradiance *= bool( u_Point[i].shadow ) ? getPointShadow( pointShadowMap[ i ], worldV, u_Point[i].shadowBias, u_Point[i].shadowRadius, u_Point[i].shadowMapSize, u_Point[i].shadowCameraNear, u_Point[i].shadowCameraFar ) : 1.0;\r\n        #endif\r\n\r\n        vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\r\n\r\n        #ifdef USE_PHONG\r\n            reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;\r\n        #endif\r\n\r\n        #ifdef USE_PBR\r\n            reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness) * specularStrength;\r\n        #endif\r\n\r\n        totalReflect += reflectLight;\r\n    }\r\n    #endif\r\n\r\n    #ifdef USE_SPOT_LIGHT\r\n    for(int i = 0; i < USE_SPOT_LIGHT; i++) {\r\n        L = u_Spot[i].position - v_modelPos;\r\n        float lightDistance = length(L);\r\n        L = normalize(L);\r\n        float angleCos = dot( L, -normalize(u_Spot[i].direction) );\r\n\r\n        if( all( bvec2(angleCos > u_Spot[i].coneCos, lightDistance < u_Spot[i].distance) ) ) {\r\n\r\n            float spotEffect = smoothstep( u_Spot[i].coneCos, u_Spot[i].penumbraCos, angleCos );\r\n            float dist = pow(clamp(1. - lightDistance / u_Spot[i].distance, 0.0, 1.0), u_Spot[i].decay);\r\n            light = u_Spot[i].color * u_Spot[i].intensity * dist * spotEffect;\r\n\r\n            float dotNL = saturate( dot(N, L) );\r\n            vec4 irradiance = light * dotNL;\r\n\r\n            #ifdef USE_PBR\r\n                irradiance *= PI;\r\n            #endif\r\n\r\n            #ifdef USE_SHADOW\r\n                irradiance *= bool( u_Spot[i].shadow ) ? getShadow( spotShadowMap[ i ], vSpotShadowCoord[ i ], u_Spot[i].shadowBias, u_Spot[i].shadowRadius, u_Spot[i].shadowMapSize ) : 1.0;\r\n            #endif\r\n\r\n            vec4 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor);\r\n\r\n            #ifdef USE_PHONG\r\n                reflectLight += irradiance * BRDF_Specular_BlinnPhong(specularColor, N, L, V, shininess) * specularStrength;\r\n            #endif\r\n\r\n            #ifdef USE_PBR\r\n                reflectLight += irradiance * BRDF_Specular_GGX(specularColor, N, L, V, roughness) * specularStrength;\r\n            #endif\r\n\r\n            totalReflect += reflectLight;\r\n        }\r\n\r\n    }\r\n    #endif\r\n\r\n    vec4 indirectDiffuse = indirectIrradiance * BRDF_Diffuse_Lambert(diffuseColor);\r\n    vec4 indirectSpecular = vec4(0., 0., 0., 0.);\r\n\r\n    #if defined( USE_ENV_MAP ) && defined( USE_PBR )\r\n        indirectSpecular += indirectRadiance * BRDF_Specular_GGX_Environment(N, V, specularColor, roughness) * specularStrength;\r\n    #endif\r\n\r\n    #ifdef USE_AOMAP\r\n\r\n    \t// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\r\n    \tfloat ambientOcclusion = ( texture2D( aoMap, v_Uv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\r\n\r\n    \tindirectDiffuse *= ambientOcclusion;\r\n\r\n    \t#if defined( USE_ENV_MAP ) && defined( USE_PBR )\r\n\r\n    \t\tfloat dotNV = saturate( dot( N, V ) );\r\n\r\n    \t\tindirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, GGXRoughnessToBlinnExponent(roughness) );\r\n\r\n    \t#endif\r\n\r\n    #endif\r\n\r\n    outColor.xyz = totalReflect.xyz + indirectDiffuse.xyz + indirectSpecular.xyz;\r\n#endif";

var light_pars_frag = "#ifdef USE_AMBIENT_LIGHT\r\n    #include <ambientlight_pars_frag>\r\n#endif\r\n#ifdef USE_DIRECT_LIGHT\r\n    #include <directlight_pars_frag>\r\n#endif\r\n#ifdef USE_POINT_LIGHT\r\n    #include <pointlight_pars_frag>\r\n#endif\r\n#ifdef USE_SPOT_LIGHT\r\n    #include <spotlight_pars_frag>\r\n#endif\r\n\r\n#if defined(USE_PBR) && defined(USE_ENV_MAP)\r\n\r\n    vec4 getLightProbeIndirectIrradiance(const in int maxMIPLevel, const in vec3 envDir) {\r\n        // TODO: replace with properly filtered cubemaps and access the irradiance LOD level, be it the last LOD level\r\n    \t// of a specular cubemap, or just the default level of a specially created irradiance cubemap.\r\n\r\n    \t#ifdef TEXTURE_LOD_EXT\r\n\r\n    \t\tvec4 envMapColor = textureCubeLodEXT( envMap, envDir, float( maxMIPLevel ) );\r\n\r\n    \t#else\r\n\r\n    \t\t// force the bias high to get the last LOD level as it is the most blurred.\r\n    \t\tvec4 envMapColor = textureCube( envMap, envDir, float( maxMIPLevel ) );\r\n\r\n    \t#endif\r\n\r\n        envMapColor = envMapTexelToLinear( envMapColor );\r\n\r\n        return PI * envMapColor * u_EnvMap_Intensity;\r\n    }\r\n\r\n    // taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html\r\n    float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\r\n\r\n    \t//float envMapWidth = pow( 2.0, maxMIPLevelScalar );\r\n    \t//float desiredMIPLevel = log2( envMapWidth * sqrt( 3.0 ) ) - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\r\n\r\n    \tfloat maxMIPLevelScalar = float( maxMIPLevel );\r\n    \tfloat desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\r\n\r\n    \t// clamp to allowable LOD ranges.\r\n    \treturn clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\r\n\r\n    }\r\n\r\n    vec4 getLightProbeIndirectRadiance(const in float blinnShininessExponent, const in int maxMIPLevel, const in vec3 envDir) {\r\n        float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\r\n\r\n        #ifdef TEXTURE_LOD_EXT\r\n\r\n    \t\tvec4 envMapColor = textureCubeLodEXT( envMap, envDir, specularMIPLevel );\r\n\r\n    \t#else\r\n\r\n    \t\tvec4 envMapColor = textureCube( envMap, envDir, specularMIPLevel );\r\n\r\n    \t#endif\r\n\r\n        envMapColor = envMapTexelToLinear( envMapColor );\r\n\r\n        return envMapColor * u_EnvMap_Intensity;\r\n    }\r\n\r\n    // ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\r\n    float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\r\n\r\n    \treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\r\n\r\n    }\r\n\r\n#endif";

var normalMap_pars_frag = "#include <tbn>\r\n#include <tsn>\r\nuniform sampler2D normalMap;";

var normal_frag = "#ifdef USE_NORMAL\r\n    #ifdef DOUBLE_SIDED\r\n    \tfloat flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\r\n    #else\r\n    \tfloat flipNormal = 1.0;\r\n    #endif\r\n    #ifdef FLAT_SHADED\r\n        // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\r\n    \tvec3 fdx = vec3( dFdx( v_modelPos.x ), dFdx( v_modelPos.y ), dFdx( v_modelPos.z ) );\r\n    \tvec3 fdy = vec3( dFdy( v_modelPos.x ), dFdy( v_modelPos.y ), dFdy( v_modelPos.z ) );\r\n    \tvec3 N = normalize( cross( fdx, fdy ) );\r\n    #else\r\n        vec3 N = normalize(v_Normal) * flipNormal;\r\n    #endif\r\n    #ifdef USE_NORMAL_MAP\r\n        vec3 normalMapColor = texture2D(normalMap, v_Uv).rgb;\r\n        // for now, uv coord is flip Y\r\n        mat3 tspace = tsn(N, -v_modelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));\r\n        // mat3 tspace = tbn(normalize(v_Normal), v_modelPos, vec2(v_Uv.x, 1.0 - v_Uv.y));\r\n        N = normalize(tspace * (normalMapColor * 2.0 - 1.0));\r\n    #elif defined(USE_BUMPMAP)\r\n        N = perturbNormalArb(-v_modelPos, N, dHdxy_fwd(v_Uv));\r\n    #endif\r\n#endif";

var normal_pars_frag = "#if defined(USE_NORMAL) && !defined(FLAT_SHADED)\r\n    varying vec3 v_Normal;\r\n#endif";

var normal_pars_vert = "#if defined(USE_NORMAL) && !defined(FLAT_SHADED)\r\n    //attribute vec3 a_Normal;\r\n    varying vec3 v_Normal;\r\n#endif";

var normal_vert = "#if defined(USE_NORMAL) && !defined(FLAT_SHADED)\r\n    v_Normal = (transpose(inverse(u_Model)) * vec4(objectNormal, 1.0)).xyz;\r\n\r\n    #ifdef FLIP_SIDED\r\n    \tv_Normal = - v_Normal;\r\n    #endif\r\n#endif";

var packing = "const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\r\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\r\n\r\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\r\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\r\n\r\nconst float ShiftRight8 = 1. / 256.;\r\n\r\nvec4 packDepthToRGBA( const in float v ) {\r\n\r\n    vec4 r = vec4( fract( v * PackFactors ), v );\r\n    r.yzw -= r.xyz * ShiftRight8; // tidy overflow\r\n    return r * PackUpscale;\r\n\r\n}\r\n\r\nfloat unpackRGBAToDepth( const in vec4 v ) {\r\n\r\n    return dot( v, UnpackFactors );\r\n\r\n}";

var pointlight_pars_frag = "struct PointLight\r\n{\r\n    vec3 position;\r\n    vec4 color;\r\n    float intensity;\r\n    float distance;\r\n    float decay;\r\n\r\n    int shadow;\r\n    float shadowBias;\r\n    float shadowRadius;\r\n    vec2 shadowMapSize;\r\n\r\n    float shadowCameraNear;\r\n    float shadowCameraFar;\r\n};\r\nuniform PointLight u_Point[USE_POINT_LIGHT];";

var premultipliedAlpha_frag = "#ifdef USE_PREMULTIPLIED_ALPHA\r\n    gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;\r\n#endif";

var pvm_vert = "gl_Position = u_Projection * u_View * u_Model * vec4(transformed, 1.0);";

var shadow = "float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\r\n\r\n    return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\r\n\r\n}\r\n\r\nfloat textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {\r\n\r\n    return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );\r\n\r\n}\r\n\r\nfloat getShadow( sampler2D shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\r\n    shadowCoord.xyz /= shadowCoord.w;\r\n\r\n    float depth = shadowCoord.z + shadowBias;\r\n\r\n    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\r\n    bool inFrustum = all( inFrustumVec );\r\n\r\n    bvec2 frustumTestVec = bvec2( inFrustum, depth <= 1.0 );\r\n\r\n    bool frustumTest = all( frustumTestVec );\r\n\r\n    if ( frustumTest ) {\r\n        #ifdef USE_PCF_SOFT_SHADOW\r\n            // TODO x, y not equal\r\n            float texelSize = shadowRadius / shadowMapSize.x;\r\n\r\n            vec2 poissonDisk[4];\r\n            poissonDisk[0] = vec2(-0.94201624, -0.39906216);\r\n            poissonDisk[1] = vec2(0.94558609, -0.76890725);\r\n            poissonDisk[2] = vec2(-0.094184101, -0.92938870);\r\n            poissonDisk[3] = vec2(0.34495938, 0.29387760);\r\n\r\n            return texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[0] * texelSize, depth ) * 0.25 +\r\n                texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[1] * texelSize, depth ) * 0.25 +\r\n                texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[2] * texelSize, depth ) * 0.25 +\r\n                texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[3] * texelSize, depth ) * 0.25;\r\n        #else\r\n            return texture2DCompare( shadowMap, shadowCoord.xy, depth );\r\n        #endif\r\n    }\r\n\r\n    return 1.0;\r\n\r\n}\r\n\r\nfloat getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize, float shadowCameraNear, float shadowCameraFar ) {\r\n\r\n    // depth = normalized distance from light to fragment position\r\n    float depth = ( length( V ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?\r\n    depth += shadowBias;\r\n\r\n    #ifdef USE_PCF_SOFT_SHADOW\r\n        // TODO x, y equal force\r\n        float texelSize = shadowRadius / shadowMapSize.x;\r\n\r\n        vec3 poissonDisk[4];\r\n        poissonDisk[0] = vec3(-1.0, 1.0, -1.0);\r\n        poissonDisk[1] = vec3(1.0, -1.0, -1.0);\r\n        poissonDisk[2] = vec3(-1.0, -1.0, -1.0);\r\n        poissonDisk[3] = vec3(1.0, -1.0, 1.0);\r\n\r\n        return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +\r\n            textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +\r\n            textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +\r\n            textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;\r\n    #else\r\n        return textureCubeCompare( shadowMap, normalize(V), depth);\r\n    #endif\r\n}";

var shadowMap_frag = "#ifdef USE_SHADOW\r\n    // outColor *= getShadowMask();\r\n#endif";

var shadowMap_pars_frag = "#ifdef USE_SHADOW\r\n\r\n    #ifdef USE_DIRECT_LIGHT\r\n\r\n        uniform sampler2D directionalShadowMap[ USE_DIRECT_LIGHT ];\r\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\r\n\r\n    #endif\r\n\r\n    #ifdef USE_POINT_LIGHT\r\n\r\n        uniform samplerCube pointShadowMap[ USE_POINT_LIGHT ];\r\n\r\n    #endif\r\n\r\n    #ifdef USE_SPOT_LIGHT\r\n\r\n        uniform sampler2D spotShadowMap[ USE_SPOT_LIGHT ];\r\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\r\n\r\n    #endif\r\n\r\n    #include <packing>\r\n    #include <shadow>\r\n\r\n#endif";

var shadowMap_pars_vert = "#ifdef USE_SHADOW\r\n\r\n    #ifdef USE_DIRECT_LIGHT\r\n\r\n        uniform mat4 directionalShadowMatrix[ USE_DIRECT_LIGHT ];\r\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\r\n\r\n    #endif\r\n\r\n    #ifdef USE_POINT_LIGHT\r\n\r\n        // nothing\r\n\r\n    #endif\r\n\r\n    #ifdef USE_SPOT_LIGHT\r\n\r\n        uniform mat4 spotShadowMatrix[ USE_SPOT_LIGHT ];\r\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\r\n\r\n    #endif\r\n\r\n#endif";

var shadowMap_vert = "#ifdef USE_SHADOW\r\n\r\n    vec4 worldPosition = u_Model * vec4(transformed, 1.0);\r\n\r\n    #ifdef USE_DIRECT_LIGHT\r\n\r\n        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {\r\n\r\n            vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\r\n\r\n        }\r\n\r\n    #endif\r\n\r\n    #ifdef USE_POINT_LIGHT\r\n\r\n        // nothing\r\n\r\n    #endif\r\n\r\n    #ifdef USE_SPOT_LIGHT\r\n\r\n        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {\r\n\r\n            vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\r\n\r\n        }\r\n\r\n    #endif\r\n\r\n#endif";

var skinning_pars_vert = "#ifdef USE_SKINNING\r\n\r\n    attribute vec4 skinIndex;\r\n\tattribute vec4 skinWeight;\r\n\r\n    uniform mat4 bindMatrix;\r\n\tuniform mat4 bindMatrixInverse;\r\n\r\n    #ifdef BONE_TEXTURE\r\n        uniform sampler2D boneTexture;\r\n        uniform int boneTextureSize;\r\n\r\n        mat4 getBoneMatrix( const in float i ) {\r\n            float j = i * 4.0;\r\n            float x = mod( j, float( boneTextureSize ) );\r\n            float y = floor( j / float( boneTextureSize ) );\r\n\r\n            float dx = 1.0 / float( boneTextureSize );\r\n            float dy = 1.0 / float( boneTextureSize );\r\n\r\n            y = dy * ( y + 0.5 );\r\n\r\n            vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\r\n            vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\r\n            vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\r\n            vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\r\n\r\n            mat4 bone = mat4( v1, v2, v3, v4 );\r\n\r\n            return bone;\r\n        }\r\n    #else\r\n        uniform mat4 boneMatrices[MAX_BONES];\r\n\r\n        mat4 getBoneMatrix(const in float i) {\r\n            mat4 bone = boneMatrices[int(i)];\r\n            return bone;\r\n        }\r\n    #endif\r\n\r\n#endif";

var skinning_vert = "#ifdef USE_SKINNING\r\n\r\n    mat4 boneMatX = getBoneMatrix( skinIndex.x );\r\n    mat4 boneMatY = getBoneMatrix( skinIndex.y );\r\n    mat4 boneMatZ = getBoneMatrix( skinIndex.z );\r\n    mat4 boneMatW = getBoneMatrix( skinIndex.w );\r\n\r\n    vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);\r\n\r\n    vec4 skinned = vec4( 0.0 );\r\n\tskinned += boneMatX * skinVertex * skinWeight.x;\r\n\tskinned += boneMatY * skinVertex * skinWeight.y;\r\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\r\n\tskinned += boneMatW * skinVertex * skinWeight.w;\r\n\tskinned = bindMatrixInverse * skinned;\r\n\r\n    // override\r\n    transformed = skinned.xyz / skinned.w;\r\n\r\n    #if defined(USE_NORMAL) || defined(USE_ENV_MAP)\r\n        mat4 skinMatrix = mat4( 0.0 );\r\n        skinMatrix += skinWeight.x * boneMatX;\r\n        skinMatrix += skinWeight.y * boneMatY;\r\n        skinMatrix += skinWeight.z * boneMatZ;\r\n        skinMatrix += skinWeight.w * boneMatW;\r\n        skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\r\n\r\n        // override\r\n        objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\r\n    #endif\r\n\r\n#endif";

var specularMap_frag = "float specularStrength;\r\n\r\n#ifdef USE_SPECULARMAP\r\n\r\n\tvec4 texelSpecular = texture2D( specularMap, v_Uv );\r\n\tspecularStrength = texelSpecular.r;\r\n\r\n#else\r\n\r\n\tspecularStrength = 1.0;\r\n\r\n#endif";

var specularMap_pars_frag = "#ifdef USE_SPECULARMAP\r\n\r\n\tuniform sampler2D specularMap;\r\n\r\n#endif";

var spotlight_pars_frag = "struct SpotLight\r\n{\r\n    vec3 position;\r\n    vec4 color;\r\n    float intensity;\r\n    float distance;\r\n    float decay;\r\n    float coneCos;\r\n    float penumbraCos;\r\n    vec3 direction;\r\n\r\n    int shadow;\r\n    float shadowBias;\r\n    float shadowRadius;\r\n    vec2 shadowMapSize;\r\n};\r\nuniform SpotLight u_Spot[USE_SPOT_LIGHT];";

var tbn = "mat3 tbn(vec3 N, vec3 p, vec2 uv) {\r\n    vec3 dp1 = dFdx(p.xyz);\r\n    vec3 dp2 = dFdy(p.xyz);\r\n    vec2 duv1 = dFdx(uv.st);\r\n    vec2 duv2 = dFdy(uv.st);\r\n    vec3 dp2perp = cross(dp2, N);\r\n    vec3 dp1perp = cross(N, dp1);\r\n    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\r\n    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\r\n    float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));\r\n    return mat3(T * invmax, B * invmax, N);\r\n}";

var transpose = "mat4 transpose(mat4 inMatrix) {\r\n    vec4 i0 = inMatrix[0];\r\n    vec4 i1 = inMatrix[1];\r\n    vec4 i2 = inMatrix[2];\r\n    vec4 i3 = inMatrix[3];\r\n    mat4 outMatrix = mat4(\r\n        vec4(i0.x, i1.x, i2.x, i3.x),\r\n        vec4(i0.y, i1.y, i2.y, i3.y),\r\n        vec4(i0.z, i1.z, i2.z, i3.z),\r\n        vec4(i0.w, i1.w, i2.w, i3.w)\r\n    );\r\n    return outMatrix;\r\n}";

var tsn = "mat3 tsn(vec3 N, vec3 V, vec2 uv) {\r\n\r\n    vec3 q0 = dFdx( V.xyz );\r\n    vec3 q1 = dFdy( V.xyz );\r\n    vec2 st0 = dFdx( uv.st );\r\n    vec2 st1 = dFdy( uv.st );\r\n\r\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\r\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\r\n    // vec3 N = normalize( N );\r\n\r\n    mat3 tsn = mat3( S, T, N );\r\n    return tsn;\r\n}";

var uv_pars_frag = "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP) || defined(USE_ROUGHNESSMAP) || defined(USE_METALNESSMAP)\r\n    varying vec2 v_Uv;\r\n#endif\r\n\r\n#ifdef USE_AOMAP\r\n    varying vec2 v_Uv2;\r\n#endif";

var uv_pars_vert = "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP) || defined(USE_ROUGHNESSMAP) || defined(USE_METALNESSMAP)\r\n    attribute vec2 a_Uv;\r\n    varying vec2 v_Uv;\r\n    uniform mat3 uvTransform;\r\n#endif\r\n\r\n#ifdef USE_AOMAP\r\n    attribute vec2 a_Uv2;\r\n    varying vec2 v_Uv2;\r\n#endif\r\n";

var uv_vert = "#if defined(USE_DIFFUSE_MAP) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(USE_SPECULARMAP) || defined(USE_EMISSIVEMAP) || defined(USE_ROUGHNESSMAP) || defined(USE_METALNESSMAP)\r\n    v_Uv = (uvTransform * vec3(a_Uv, 1)).xy;\r\n#endif\r\n\r\n#ifdef USE_AOMAP\r\n    v_Uv2 = a_Uv2;\r\n#endif";

var viewModelPos_pars_frag = "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR) || defined(NUM_CLIPPING_PLANES) \r\n    varying vec3 v_modelPos;\r\n#endif";

var viewModelPos_pars_vert = "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR)|| defined(NUM_CLIPPING_PLANES)\r\n    varying vec3 v_modelPos;\r\n#endif";

var viewModelPos_vert = "#if defined(USE_POINT_LIGHT) || defined(USE_SPOT_LIGHT) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR) || defined(NUM_CLIPPING_PLANES)\r\n    v_modelPos = (u_Model * vec4(transformed, 1.0)).xyz;\r\n#endif";

var ShaderChunk = {
    alphaTest_frag: alphaTest_frag,
    ambientlight_pars_frag: ambientlight_pars_frag,
    aoMap_pars_frag: aoMap_pars_frag,
    begin_frag: begin_frag,
    begin_vert: begin_vert,
    bsdfs: bsdfs,
    bumpMap_pars_frag: bumpMap_pars_frag,
    clippingPlanes_frag: clippingPlanes_frag,
    clippingPlanes_pars_frag: clippingPlanes_pars_frag,
    color_frag: color_frag,
    color_pars_frag: color_pars_frag,
    color_pars_vert: color_pars_vert,
    color_vert: color_vert,
    common_frag: common_frag,
    common_vert: common_vert,
    diffuseMap_frag: diffuseMap_frag,
    diffuseMap_pars_frag: diffuseMap_pars_frag,
    directlight_pars_frag: directlight_pars_frag,
    emissiveMap_frag: emissiveMap_frag,
    emissiveMap_pars_frag: emissiveMap_pars_frag,
    encodings_frag: encodings_frag,
    encodings_pars_frag: encodings_pars_frag,
    end_frag: end_frag,
    envMap_frag: envMap_frag,
    envMap_pars_frag: envMap_pars_frag,
    envMap_pars_vert: envMap_pars_vert,
    envMap_vert: envMap_vert,
    fog_frag: fog_frag,
    fog_pars_frag: fog_pars_frag,
    inverse: inverse,
    light_frag: light_frag,
    light_pars_frag: light_pars_frag,
    normalMap_pars_frag: normalMap_pars_frag,
    normal_frag: normal_frag,
    normal_pars_frag: normal_pars_frag,
    normal_pars_vert: normal_pars_vert,
    normal_vert: normal_vert,
    packing: packing,
    pointlight_pars_frag: pointlight_pars_frag,
    premultipliedAlpha_frag: premultipliedAlpha_frag,
    pvm_vert: pvm_vert,
    shadow: shadow,
    shadowMap_frag: shadowMap_frag,
    shadowMap_pars_frag: shadowMap_pars_frag,
    shadowMap_pars_vert: shadowMap_pars_vert,
    shadowMap_vert: shadowMap_vert,
    skinning_pars_vert: skinning_pars_vert,
    skinning_vert: skinning_vert,
    specularMap_frag: specularMap_frag,
    specularMap_pars_frag: specularMap_pars_frag,
    spotlight_pars_frag: spotlight_pars_frag,
    tbn: tbn,
    transpose: transpose,
    tsn: tsn,
    uv_pars_frag: uv_pars_frag,
    uv_pars_vert: uv_pars_vert,
    uv_vert: uv_vert,
    viewModelPos_pars_frag: viewModelPos_pars_frag,
    viewModelPos_pars_vert: viewModelPos_pars_vert,
    viewModelPos_vert: viewModelPos_vert,
};

var basic_frag = "#include <common_frag>\r\n#include <uv_pars_frag>\r\n#include <color_pars_frag>\r\n#include <diffuseMap_pars_frag>\r\n#include <envMap_pars_frag>\r\n#include <aoMap_pars_frag>\r\n#include <fog_pars_frag>\r\nvoid main() {\r\n    #include <begin_frag>\r\n    #include <color_frag>\r\n    #include <diffuseMap_frag>\r\n    #include <alphaTest_frag>\r\n    #include <envMap_frag>\r\n    #include <end_frag>\r\n    #include <encodings_frag>\r\n    #include <premultipliedAlpha_frag>\r\n    #include <fog_frag>\r\n}";

var basic_vert = "#include <common_vert>\r\n#include <uv_pars_vert>\r\n#include <color_pars_vert>\r\n#include <envMap_pars_vert>\r\n#include <skinning_pars_vert>\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <pvm_vert>\r\n    #include <uv_vert>\r\n    #include <color_vert>\r\n    #include <envMap_vert>\r\n}";

var canvas2d_frag = "#include <common_frag>\r\nvarying vec2 v_Uv;\r\nuniform sampler2D spriteTexture;\r\nvoid main() {\r\n    #include <begin_frag>\r\n    outColor *= texture2D(spriteTexture, v_Uv);\r\n    #include <end_frag>\r\n    #include <premultipliedAlpha_frag>\r\n}";

var canvas2d_vert = "#include <common_vert>\r\nattribute vec2 a_Uv;\r\nvarying vec2 v_Uv;\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <pvm_vert>\r\n    v_Uv = a_Uv;\r\n}";

var depth_frag = "#include <common_frag>\r\n#include <diffuseMap_pars_frag>\r\n\r\n#include <uv_pars_frag>\r\n\r\n#include <packing>\r\n\r\nvoid main() {\r\n    #if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)\r\n        vec4 texelColor = texture2D( texture, v_Uv );\r\n\r\n        float alpha = texelColor.a * u_Opacity;\r\n        if(alpha < ALPHATEST) discard;\r\n    #endif\r\n    \r\n    #ifdef DEPTH_PACKING_RGBA\r\n        gl_FragColor = packDepthToRGBA(gl_FragCoord.z);\r\n    #else\r\n        gl_FragColor = vec4( vec3( 1.0 - gl_FragCoord.z ), u_Opacity );\r\n    #endif\r\n}";

var depth_vert = "#include <common_vert>\r\n#include <skinning_pars_vert>\r\n#include <uv_pars_vert>\r\nvoid main() {\r\n    #include <uv_vert>\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <pvm_vert>\r\n}";

var distance_frag = "#include <common_frag>\r\nuniform float nearDistance;\r\nuniform float farDistance;\r\nvarying vec3 v_ModelPos;\r\n#include <packing>\r\nvoid main() {\r\n    float dist = length( v_ModelPos - u_CameraPosition );\r\n\tdist = ( dist - nearDistance ) / ( farDistance - nearDistance );\r\n\tdist = saturate( dist ); // clamp to [ 0, 1 ]\r\n\r\n    gl_FragColor = packDepthToRGBA(dist);\r\n}";

var distance_vert = "#include <common_vert>\r\nvarying vec3 v_ModelPos;\r\n#include <skinning_pars_vert>\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <pvm_vert>\r\n    v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;\r\n}";

var lambert_frag = "#include <common_frag>\r\n\r\nuniform vec3 emissive;\r\n\r\n#include <uv_pars_frag>\r\n#include <color_pars_frag>\r\n#include <diffuseMap_pars_frag>\r\n#include <normalMap_pars_frag>\r\n#include <bumpMap_pars_frag>\r\n#include <light_pars_frag>\r\n#include <normal_pars_frag>\r\n#include <viewModelPos_pars_frag>\r\n#include <bsdfs>\r\n#include <envMap_pars_frag>\r\n#include <aoMap_pars_frag>\r\n#include <shadowMap_pars_frag>\r\n#include <fog_pars_frag>\r\n#include <emissiveMap_pars_frag>\r\n#include <clippingPlanes_pars_frag>\r\nvoid main() {\r\n    #include <clippingPlanes_frag>\r\n    #include <begin_frag>\r\n    #include <color_frag>\r\n    #include <diffuseMap_frag>\r\n    #include <alphaTest_frag>\r\n    #include <normal_frag>\r\n    #include <light_frag>\r\n    #include <envMap_frag>\r\n    #include <shadowMap_frag>\r\n\r\n    vec3 totalEmissiveRadiance = emissive;\r\n    #include <emissiveMap_frag>\r\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\r\n\r\n    #include <end_frag>\r\n    #include <encodings_frag>\r\n    #include <premultipliedAlpha_frag>\r\n    #include <fog_frag>\r\n}";

var lambert_vert = "#include <common_vert>\r\n#include <normal_pars_vert>\r\n#include <uv_pars_vert>\r\n#include <color_pars_vert>\r\n#include <viewModelPos_pars_vert>\r\n#include <envMap_pars_vert>\r\n#include <shadowMap_pars_vert>\r\n#include <skinning_pars_vert>\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <pvm_vert>\r\n    #include <normal_vert>\r\n    #include <uv_vert>\r\n    #include <color_vert>\r\n    #include <viewModelPos_vert>\r\n    #include <envMap_vert>\r\n    #include <shadowMap_vert>\r\n}";

var linedashed_frag = "#include <common_frag>\r\n#include <fog_pars_frag>\r\n\r\nuniform float dashSize;\r\nuniform float totalSize;\r\n\r\nvarying float vLineDistance;\r\n\r\nvoid main() {\r\n\r\n    if ( mod( vLineDistance, totalSize ) > dashSize ) {\r\n\t\tdiscard;\r\n\t}\r\n\r\n    #include <begin_frag>\r\n    #include <end_frag>\r\n    #include <premultipliedAlpha_frag>\r\n    #include <fog_frag>\r\n}";

var linedashed_vert = "#include <common_vert>\r\n\r\nuniform float scale;\r\nattribute float lineDistance;\r\n\r\nvarying float vLineDistance;\r\n\r\nvoid main() {\r\n    vLineDistance = scale * lineDistance;\r\n\r\n    vec3 transformed = vec3(a_Position);\r\n\r\n    #include <pvm_vert>\r\n}";

var normaldepth_frag = "#include <common_frag>\r\n#include <diffuseMap_pars_frag>\r\n\r\n#include <uv_pars_frag>\r\n\r\n#define USE_NORMAL\r\n\r\n#include <packing>\r\n#include <normal_pars_frag>\r\n\r\nvoid main() {\r\n    #if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)\r\n        vec4 texelColor = texture2D( texture, v_Uv );\r\n\r\n        float alpha = texelColor.a * u_Opacity;\r\n        if(alpha < ALPHATEST) discard;\r\n    #endif\r\n    vec4 packedNormalDepth;\r\n    packedNormalDepth.xyz = normalize(v_Normal) * 0.5 + 0.5;\r\n    packedNormalDepth.w = gl_FragCoord.z;\r\n    gl_FragColor = packedNormalDepth;\r\n}";

var normaldepth_vert = "#include <common_vert>\r\n\r\n#define USE_NORMAL\r\n\r\n#include <skinning_pars_vert>\r\n#include <normal_pars_vert>\r\n#include <uv_pars_vert>\r\nvoid main() {\r\n    #include <uv_vert>\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <normal_vert>\r\n    #include <pvm_vert>\r\n}";

var pbr_frag = "#include <common_frag>\r\n\r\n// if no light> this will not active\r\nuniform float u_Metalness;\r\n#ifdef USE_METALNESSMAP\r\n\tuniform sampler2D metalnessMap;\r\n#endif\r\n\r\nuniform float u_Roughness;\r\n#ifdef USE_ROUGHNESSMAP\r\n\tuniform sampler2D roughnessMap;\r\n#endif\r\n\r\nuniform vec3 emissive;\r\n\r\n#include <uv_pars_frag>\r\n#include <color_pars_frag>\r\n#include <diffuseMap_pars_frag>\r\n#include <normalMap_pars_frag>\r\n#include <bumpMap_pars_frag>\r\n#include <envMap_pars_frag>\r\n#include <aoMap_pars_frag>\r\n#include <light_pars_frag>\r\n#include <normal_pars_frag>\r\n#include <viewModelPos_pars_frag>\r\n#include <bsdfs>\r\n#include <shadowMap_pars_frag>\r\n#include <fog_pars_frag>\r\n#include <emissiveMap_pars_frag>\r\n#include <clippingPlanes_pars_frag>\r\nvoid main() {\r\n    #include <clippingPlanes_frag>\r\n    #include <begin_frag>\r\n    #include <color_frag>\r\n    #include <diffuseMap_frag>\r\n    #include <alphaTest_frag>\r\n    #include <normal_frag>\r\n    #include <specularMap_frag>\r\n\r\n    float roughnessFactor = u_Roughness;\r\n    #ifdef USE_ROUGHNESSMAP\r\n    \tvec4 texelRoughness = texture2D( roughnessMap, v_Uv );\r\n    \t// reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\r\n    \troughnessFactor *= texelRoughness.g;\r\n    #endif\r\n\r\n    float metalnessFactor = u_Metalness;\r\n    #ifdef USE_METALNESSMAP\r\n    \tvec4 texelMetalness = texture2D( metalnessMap, v_Uv );\r\n    \t// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\r\n    \tmetalnessFactor *= texelMetalness.b;\r\n    #endif\r\n\r\n    #include <light_frag>\r\n    #include <shadowMap_frag>\r\n\r\n    vec3 totalEmissiveRadiance = emissive;\r\n    #include <emissiveMap_frag>\r\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\r\n\r\n    #include <end_frag>\r\n    #include <encodings_frag>\r\n    #include <premultipliedAlpha_frag>\r\n    #include <fog_frag>\r\n}";

var pbr_vert = "#include <common_vert>\r\n#include <normal_pars_vert>\r\n#include <uv_pars_vert>\r\n#include <color_pars_vert>\r\n#include <viewModelPos_pars_vert>\r\n#include <envMap_pars_vert>\r\n#include <shadowMap_pars_vert>\r\n#include <skinning_pars_vert>\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <pvm_vert>\r\n    #include <normal_vert>\r\n    #include <uv_vert>\r\n    #include <color_vert>\r\n    #include <viewModelPos_vert>\r\n    #include <envMap_vert>\r\n    #include <shadowMap_vert>\r\n}";

var phong_frag = "#include <common_frag>\r\n\r\n// if no light> this will not active\r\nuniform float u_Specular;\r\nuniform vec4 u_SpecularColor;\r\n#include <specularMap_pars_frag>\r\n\r\nuniform vec3 emissive;\r\n\r\n#include <uv_pars_frag>\r\n#include <color_pars_frag>\r\n#include <diffuseMap_pars_frag>\r\n#include <normalMap_pars_frag>\r\n#include <bumpMap_pars_frag>\r\n#include <light_pars_frag>\r\n#include <normal_pars_frag>\r\n#include <viewModelPos_pars_frag>\r\n#include <bsdfs>\r\n#include <envMap_pars_frag>\r\n#include <aoMap_pars_frag>\r\n#include <shadowMap_pars_frag>\r\n#include <fog_pars_frag>\r\n#include <emissiveMap_pars_frag>\r\n#include <clippingPlanes_pars_frag>\r\nvoid main() {\r\n    #include <clippingPlanes_frag>\r\n    #include <begin_frag>\r\n    #include <color_frag>\r\n    #include <diffuseMap_frag>\r\n    #include <alphaTest_frag>\r\n    #include <normal_frag>\r\n    #include <specularMap_frag>\r\n    #include <light_frag>\r\n    #include <envMap_frag>\r\n    #include <shadowMap_frag>\r\n\r\n    vec3 totalEmissiveRadiance = emissive;\r\n    #include <emissiveMap_frag>\r\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\r\n\r\n    #include <end_frag>\r\n    #include <encodings_frag>\r\n    #include <premultipliedAlpha_frag>\r\n    #include <fog_frag>\r\n}";

var phong_vert = "#include <common_vert>\r\n#include <normal_pars_vert>\r\n#include <uv_pars_vert>\r\n#include <color_pars_vert>\r\n#include <viewModelPos_pars_vert>\r\n#include <envMap_pars_vert>\r\n#include <shadowMap_pars_vert>\r\n#include <skinning_pars_vert>\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <skinning_vert>\r\n    #include <pvm_vert>\r\n    #include <normal_vert>\r\n    #include <uv_vert>\r\n    #include <color_vert>\r\n    #include <viewModelPos_vert>\r\n    #include <envMap_vert>\r\n    #include <shadowMap_vert>\r\n}";

var point_frag = "#include <common_frag>\r\n#include <diffuseMap_pars_frag>\r\n#include <fog_pars_frag>\r\nvoid main() {\r\n    #include <begin_frag>\r\n    #ifdef USE_DIFFUSE_MAP\r\n        outColor *= texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));\r\n    #endif\r\n    #include <end_frag>\r\n    #include <encodings_frag>\r\n    #include <premultipliedAlpha_frag>\r\n    #include <fog_frag>\r\n}";

var point_vert = "#include <common_vert>\r\nuniform float u_PointSize;\r\nuniform float u_PointScale;\r\nvoid main() {\r\n    #include <begin_vert>\r\n    #include <pvm_vert>\r\n    vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);\r\n    #ifdef USE_SIZEATTENUATION\r\n        gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );\r\n    #else\r\n        gl_PointSize = u_PointSize;\r\n    #endif\r\n}";

var ShaderLib = {
    basic_frag: basic_frag,
    basic_vert: basic_vert,
    canvas2d_frag: canvas2d_frag,
    canvas2d_vert: canvas2d_vert,
    depth_frag: depth_frag,
    depth_vert: depth_vert,
    distance_frag: distance_frag,
    distance_vert: distance_vert,
    lambert_frag: lambert_frag,
    lambert_vert: lambert_vert,
    linedashed_frag: linedashed_frag,
    linedashed_vert: linedashed_vert,
    normaldepth_frag: normaldepth_frag,
    normaldepth_vert: normaldepth_vert,
    pbr_frag: pbr_frag,
    pbr_vert: pbr_vert,
    phong_frag: phong_frag,
    phong_vert: phong_vert,
    point_frag: point_frag,
    point_vert: point_vert
};

var programMap = {};

/**
 * generate program code
 */
function generateProgramCode(props, material) {
    var code = "";
    for (var key in props) {
        code += props[key] + "_";
    }
    if(material.defines !== undefined) {
        for (var name in material.defines) {
            code += name + "_" + material.defines[ name ] + "_";
        }
    }
    return code;
}

function getTextureEncodingFromMap( map, gammaOverrideLinear ) {

    var encoding;

    if ( ! map ) {

        encoding = TEXEL_ENCODING_TYPE.LINEAR;

    } else if ( map.encoding ) {

        encoding = map.encoding;

    }

    // add backwards compatibility for Renderer.gammaInput/gammaOutput parameter, should probably be removed at some point.
    if ( encoding === TEXEL_ENCODING_TYPE.LINEAR && gammaOverrideLinear ) {

        encoding = TEXEL_ENCODING_TYPE.GAMMA;

    }

    return encoding;

}

function getEncodingComponents( encoding ) {

    switch ( encoding ) {

        case TEXEL_ENCODING_TYPE.LINEAR:
            return [ 'Linear','( value )' ];
        case TEXEL_ENCODING_TYPE.SRGB:
            return [ 'sRGB','( value )' ];
        case TEXEL_ENCODING_TYPE.RGBE:
            return [ 'RGBE','( value )' ];
        case TEXEL_ENCODING_TYPE.RGBM7:
            return [ 'RGBM','( value, 7.0 )' ];
        case TEXEL_ENCODING_TYPE.RGBM16:
            return [ 'RGBM','( value, 16.0 )' ];
        case TEXEL_ENCODING_TYPE.RGBD:
            return [ 'RGBD','( value, 256.0 )' ];
        case TEXEL_ENCODING_TYPE.GAMMA:
            return [ 'Gamma','( value, float( GAMMA_FACTOR ) )' ];
        default:
                console.error( 'unsupported encoding: ' + encoding );

    }

}

function getTexelDecodingFunction( functionName, encoding ) {

    var components = getEncodingComponents( encoding );
    return "vec4 " + functionName + "( vec4 value ) { return " + components[ 0 ] + "ToLinear" + components[ 1 ] + "; }";

}

function getTexelEncodingFunction( functionName, encoding ) {

    var components = getEncodingComponents( encoding );
    return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[ 0 ] + components[ 1 ] + "; }";

}

function generateDefines( defines ) {

    var chunks = [];

    for ( var name in defines ) {

        var value = defines[ name ];

        if ( value === false ) continue;

        chunks.push( '#define ' + name + ' ' + value );

    }

    return chunks.join( '\n' );

}

/**
 * create program
 */
function createProgram(gl, props, defines) {

    // create defines
    var prefixVertex = [

        'precision ' + props.precision + ' float;',
        'precision ' + props.precision + ' int;',

        '#define SHADER_NAME ' + props.materialType,

        defines,

        props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '',
        props.useMetalnessMap ? '#define USE_METALNESSMAP' : '',

        (props.pointLightNum > 0) ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
        (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
        (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
        (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '',
        props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '',
        props.useShadow ? '#define USE_SHADOW' : '',
        props.flatShading ? '#define FLAT_SHADED' : '',
        props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
        props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
        props.materialType == MATERIAL_TYPE.PBR ? '#define USE_PBR' : '',
        props.flipSided ? '#define FLIP_SIDED' : '',
        props.numClippingPlanes > 0 ? ('#define NUM_CLIPPING_PLANES ' + props.numClippingPlanes) : '',

        props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
        props.useEnvMap ? '#define USE_ENV_MAP' : '',
        props.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',
        props.useAOMap ? '#define USE_AOMAP' : '',
        props.useVertexColors ? '#define USE_VCOLOR' : '',

        props.useSkinning ? '#define USE_SKINNING' : '',
        (props.bonesNum > 0) ? ('#define MAX_BONES ' + props.bonesNum) : '',
        props.useVertexTexture ? '#define BONE_TEXTURE' : ''
        
    ].join("\n");

    var prefixFragment = [

        '#extension GL_OES_standard_derivatives : enable',
        (props.useShaderTextureLOD && props.useEnvMap) ? '#extension GL_EXT_shader_texture_lod : enable' : '',

        'precision ' + props.precision + ' float;',
        'precision ' + props.precision + ' int;',

        '#define SHADER_NAME ' + props.materialType,
        
        '#define PI 3.14159265359',
        '#define EPSILON 1e-6',
        'float pow2( const in float x ) { return x*x; }',
        '#define LOG2 1.442695',
        '#define RECIPROCAL_PI 0.31830988618',
        '#define saturate(a) clamp( a, 0.0, 1.0 )',
        '#define whiteCompliment(a) ( 1.0 - saturate( a ) )',

        defines,

        props.useRoughnessMap ? '#define USE_ROUGHNESSMAP' : '',
        props.useMetalnessMap ? '#define USE_METALNESSMAP' : '',

        (props.pointLightNum) > 0 ? ('#define USE_POINT_LIGHT ' + props.pointLightNum) : '',
        (props.spotLightNum > 0) ? ('#define USE_SPOT_LIGHT ' + props.spotLightNum) : '',
        (props.directLightNum) > 0 ? ('#define USE_DIRECT_LIGHT ' + props.directLightNum) : '',
        (props.ambientLightNum) > 0 ? ('#define USE_AMBIENT_LIGHT ' + props.ambientLightNum) : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.ambientLightNum > 0 || props.spotLightNum > 0) ? '#define USE_LIGHT' : '',
        (props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) ? '#define USE_NORMAL' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useNormalMap) ? '#define USE_NORMAL_MAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useBumpMap) ? '#define USE_BUMPMAP' : '',
        ((props.pointLightNum > 0 || props.directLightNum > 0 || props.spotLightNum > 0) && props.useSpecularMap) ? '#define USE_SPECULARMAP' : '',
        props.useEmissiveMap ? '#define USE_EMISSIVEMAP' : '',
        props.useShadow ? '#define USE_SHADOW' : '',
        props.usePCFSoftShadow ? '#define USE_PCF_SOFT_SHADOW' : '',
        props.flatShading ? '#define FLAT_SHADED' : '',
        props.materialType == MATERIAL_TYPE.LAMBERT ? '#define USE_LAMBERT' : '',
        props.materialType == MATERIAL_TYPE.PHONG ? '#define USE_PHONG' : '',
        props.materialType == MATERIAL_TYPE.PBR ? '#define USE_PBR' : '',
        props.doubleSided ? '#define DOUBLE_SIDED' : '',
        (props.envMap && props.useShaderTextureLOD) ? '#define TEXTURE_LOD_EXT' : '',
        props.numClippingPlanes > 0 ? ('#define NUM_CLIPPING_PLANES ' + props.numClippingPlanes) : '',

        props.useDiffuseMap ? '#define USE_DIFFUSE_MAP' : '',
        props.useEnvMap ? '#define USE_ENV_MAP' : '',
        props.useAOMap ? '#define USE_AOMAP' : '',
        props.useVertexColors ? '#define USE_VCOLOR' : '',
        props.premultipliedAlpha ? '#define USE_PREMULTIPLIED_ALPHA' : '',
        props.fog ? '#define USE_FOG' : '',
        props.fogExp2 ? '#define USE_EXP2_FOG' : '',
        props.alphaTest ? ('#define ALPHATEST ' + props.alphaTest) : '',
        props.useEnvMap ? '#define ' + props.envMapCombine : '',
        '#define GAMMA_FACTOR ' + props.gammaFactor,

        (props.diffuseMapEncoding || props.envMapEncoding || props.emissiveMapEncoding || props.outputEncoding) ? ShaderChunk["encodings_pars_frag"] : '',
        props.diffuseMapEncoding ? getTexelDecodingFunction("mapTexelToLinear", props.diffuseMapEncoding) : '',
        props.envMapEncoding ? getTexelDecodingFunction("envMapTexelToLinear", props.envMapEncoding) : '',
        props.emissiveMapEncoding ? getTexelDecodingFunction("emissiveMapTexelToLinear", props.emissiveMapEncoding) : '',
        props.outputEncoding ? getTexelEncodingFunction("linearToOutputTexel", props.outputEncoding) : '',

        props.packDepthToRGBA ? '#define DEPTH_PACKING_RGBA' : '',

    ].join("\n");

    // vertexCode & fragmentCode
    var vertex = ShaderLib[props.materialType + "_vert"] || props.vertexShader || ShaderLib.basic_vert;
    var fragment = ShaderLib[props.materialType + "_frag"] || props.fragmentShader || ShaderLib.basic_frag;

    var vshader = [
        prefixVertex,
        vertex
    ].join("\n");

    var fshader = [
        prefixFragment,
        fragment
    ].join("\n");

    vshader = parseIncludes(vshader);
    fshader = parseIncludes(fshader);

    return new WebGLProgram(gl, vshader, fshader);
}

var parseIncludes = function(string) {

    var pattern = /#include +<([\w\d.]+)>/g;

    function replace(match, include) {

        var replace = ShaderChunk[include];

        if (replace === undefined) {

            throw new Error('Can not resolve #include <' + include + '>');

        }

        return parseIncludes(replace);

    }

    return string.replace(pattern, replace);

};

function generateProps(glCore, camera, material, object, lights, fog, clippingPlanes) {
    var props = {}; // cache this props?

    props.materialType = material.type;
    // capabilities
    var capabilities = glCore.capabilities;
    props.precision = capabilities.maxPrecision;
    props.useShaderTextureLOD = !!capabilities.shaderTextureLOD;
    // maps
    props.useDiffuseMap = !!material.diffuseMap;
    props.useNormalMap = !!material.normalMap;
    props.useBumpMap = !!material.bumpMap;
    props.useSpecularMap = !!material.specularMap;
    props.useEnvMap = !!material.envMap;
    props.envMapCombine = material.envMapCombine;
    props.useEmissiveMap = !!material.emissiveMap;
    props.useRoughnessMap = !!material.roughnessMap;
    props.useMetalnessMap = !!material.metalnessMap;
    props.useAOMap = !!material.aoMap;
    // lights
    props.ambientLightNum = !!lights ? lights.ambientsNum : 0;
    props.directLightNum = !!lights ? lights.directsNum : 0;
    props.pointLightNum = !!lights ? lights.pointsNum : 0;
    props.spotLightNum = !!lights ? lights.spotsNum : 0;
    props.useShadow = object.receiveShadow;
    props.usePCFSoftShadow = object.shadowType === SHADOW_TYPE.PCF_SOFT;
    // encoding
    var currentRenderTarget = glCore.state.currentRenderTarget;
    props.gammaFactor = camera.gammaFactor;
    props.outputEncoding = getTextureEncodingFromMap(currentRenderTarget.texture || null, camera.gammaOutput);
    props.diffuseMapEncoding = getTextureEncodingFromMap(material.diffuseMap, camera.gammaInput);
    props.envMapEncoding = getTextureEncodingFromMap(material.envMap, camera.gammaInput);
    props.emissiveMapEncoding = getTextureEncodingFromMap(material.emissiveMap, camera.gammaInput);
    // other
    props.alphaTest = material.alphaTest;
    props.premultipliedAlpha = material.premultipliedAlpha;
    props.useVertexColors = material.vertexColors;
    props.numClippingPlanes = !!clippingPlanes ? clippingPlanes.length : 0;
    props.flatShading = material.shading === SHADING_TYPE.FLAT_SHADING;
    props.fog = !!fog;
    props.fogExp2 = !!fog && (fog.fogType === FOG_TYPE.EXP2);
    props.sizeAttenuation = material.sizeAttenuation;
    props.doubleSided = material.side === DRAW_SIDE.DOUBLE;
    props.flipSided = material.side === DRAW_SIDE.BACK;
    props.packDepthToRGBA = material.packToRGBA;
    // skinned mesh
    var useSkinning = object.type === OBJECT_TYPE.SKINNED_MESH && object.skeleton;
    var maxVertexUniformVectors = capabilities.maxVertexUniformVectors;
    var useVertexTexture = capabilities.maxVertexTextures > 0 && capabilities.floatTextures;
    var maxBones = 0;
    if(useVertexTexture) {
        maxBones = 1024;
    } else {
        maxBones = object.skeleton ? object.skeleton.bones.length : 0;
        if(maxBones * 16 > maxVertexUniformVectors) {
            console.warn("Program: too many bones (" + maxBones + "), current cpu only support " + Math.floor(maxVertexUniformVectors / 16) + " bones!!");
            maxBones = Math.floor(maxVertexUniformVectors / 16);
        }
    }
    props.useSkinning = useSkinning;
    props.bonesNum = maxBones;
    props.useVertexTexture = useVertexTexture;
    if(material.type === MATERIAL_TYPE.SHADER) {
        props.vertexShader = material.vertexShader;
        props.fragmentShader = material.fragmentShader;
    }

    return props;
}

/**
 * get a suitable program
 * @param {WebGLCore} glCore
 * @param {Camera} camera
 * @param {Material} material
 * @param {Object3D} object?
 * @param {RenderCache} cache?
 */
function getProgram(glCore, camera, material, object, cache) {
    var gl = glCore.gl;
    var material = material || object.material;

    // get render context from cache
    var lights = (cache && material.acceptLight) ? cache.lights : null;
    var fog = cache ? cache.fog : null;
    var clippingPlanes = cache ? cache.clippingPlanes : null;

    var props = generateProps(glCore, camera, material, object, lights, fog, clippingPlanes);
    var code = generateProgramCode(props, material);
    var map = programMap;
    var program;

    if (map[code]) {
        program = map[code];
    } else {
        var customDefines = "";
        if(material.defines !== undefined) {
            customDefines = generateDefines(material.defines);
        }
        program = createProgram(gl, props, customDefines);

        map[code] = program;
    }

    return program;
}

var helpVector3 = new Vector3();
var helpVector4 = new Vector4();

function defaultGetMaterial(renderable) {
    return renderable.material;
}
function defaultIfRender(renderable) {
    return true;
}

function noop() {}
var getClippingPlanesData = function() {
    var planesData;
    var plane = new Plane();
    return function getClippingPlanesData(planes, camera) {
        if(!planesData || planesData.length < planes.length * 4) {
            planesData = new Float32Array(planes.length * 4);
        }

        for(var i = 0; i < planes.length; i++) {
            plane.copy(planes[i]);//.applyMatrix4(camera.viewMatrix);
            planesData[i * 4 + 0] = plane.normal.x;
            planesData[i * 4 + 1] = plane.normal.y;
            planesData[i * 4 + 2] = plane.normal.z;
            planesData[i * 4 + 3] = plane.constant;
        }
        return planesData;
    }
}();

/**
 * render method by WebGL.
 * just for render pass once in one render target
 */
function WebGLCore(gl) {
    this.gl = gl;
    
    var properties = new WebGLProperties();
    this.properties = properties;

    var capabilities = new WebGLCapabilities(gl);
    this.capabilities = capabilities;

    var state = new WebGLState(gl, capabilities);
    state.enable(gl.STENCIL_TEST);
    state.enable(gl.DEPTH_TEST);
    gl.depthFunc( gl.LEQUAL );
    state.setCullFace(CULL_FACE_TYPE.BACK);
    state.setFlipSided(false);
    state.clearColor(0, 0, 0, 0);
    this.state = state;

    this.texture = new WebGLTexture(gl, state, properties, capabilities);

    this.geometry = new WebGLGeometry(gl, state, properties, capabilities);

    this._usedTextureUnits = 0;

    this._currentGeometryProgram = "";
}

var directShadowMaps = [];
var pointShadowMaps = [];
var spotShadowMaps = [];

Object.assign(WebGLCore.prototype, {

    /**
     * clear buffer
     */
    clear: function(color, depth, stencil) {
        var gl = this.gl;
    
        var bits = 0;
    
        if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
        if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
        if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;
    
        gl.clear(bits);
    },

    /**
     * Render opaque and transparent objects
     * @param {zen3d.Scene} scene 
     * @param {zen3d.Camera} camera 
     * @param {boolean} updateRenderList? default is false.
     */
    render: function(scene, camera, updateRenderList) {
        updateRenderList = (updateRenderList !== undefined ? updateRenderList : true);
        var renderList;
        if(updateRenderList) {
            renderList = scene.updateRenderList(camera);
        } else {
            renderList = scene.getRenderList(camera);
        }
    
        this.renderPass(renderList.opaque, camera, {
            scene: scene,
            getMaterial: function(renderable) {
                return scene.overrideMaterial || renderable.material;
            }
        });
    
        this.renderPass(renderList.transparent, camera, {
            scene: scene,
            getMaterial: function(renderable) {
                return scene.overrideMaterial || renderable.material;
            }
        });

    },

    /**
     * Render a single renderable list in camera in sequence
     * @param {Array} list List of all renderables.
     * @param {zen3d.Camera} camera Camera provide view matrix and porjection matrix.
     * @param {Object} [config]?
     * @param {Function} [config.getMaterial]? Get renderable material.
     * @param {Function} [config.beforeRender] Before render each renderable.
     * @param {Function} [config.afterRender] After render each renderable
     * @param {Function} [config.ifRender]? If render the renderable.
     * @param {zen3d.Scene} [config.scene]? Rendering scene, have some rendering context.
     */
    renderPass: function(renderList, camera, config) {
        config = config || {};
    
        var gl = this.gl;
        var state = this.state;
    
        var getMaterial = config.getMaterial || defaultGetMaterial;
        var beforeRender = config.beforeRender || noop;
        var afterRender = config.afterRender || noop;
        var ifRender = config.ifRender || defaultIfRender;
        var scene = config.scene || {};

        var currentRenderTarget = state.currentRenderTarget;
    
        for (var i = 0, l = renderList.length; i < l; i++) {
            var renderItem = renderList[i];
    
            if(!ifRender(renderItem)) {
                continue;
            }
            
            var object = renderItem.object;
            var material = getMaterial.call(this, renderItem);
            var geometry = renderItem.geometry;
            var group = renderItem.group;

            object.onBeforeRender(renderItem, material);
            beforeRender.call(this, renderItem, material);
    
            var program = getProgram(this, camera, material, object, scene);
            state.setProgram(program);
    
            this.geometry.setGeometry(geometry);
    
            var geometryProgram = program.uuid + "_" + geometry.uuid;
            if(geometryProgram !== this._currentGeometryProgram) {
                this.setupVertexAttributes(program, geometry);
                this._currentGeometryProgram = geometryProgram;
            }
    
            // update uniforms
            // TODO need a better upload method
            var uniforms = program.uniforms;
            for (var key in uniforms) {
                var uniform = uniforms[key];

                // upload custom uniforms
                if(material.uniforms && material.uniforms[key] !== undefined) {
                    if(uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_2D) {
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.uniforms[key], slot);
                        uniform.setValue(slot);
                    } else if(uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_CUBE) {
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.uniforms[key], slot);
                        uniform.setValue(slot);
                    } else {
                        uniform.set(material.uniforms[key]);
                    }
                    continue;
                }

                switch (key) {
    
                    // pvm matrix
                    case "u_Projection":
                        if (object.type === OBJECT_TYPE.CANVAS2D && object.isScreenCanvas) {
                            var projectionMat = object.orthoCamera.projectionMatrix.elements;
                        } else {
                            var projectionMat = camera.projectionMatrix.elements;
                        }
    
                        uniform.setValue(projectionMat);
                        break;
                    case "u_View":
                        if (object.type === OBJECT_TYPE.CANVAS2D && object.isScreenCanvas) {
                            var viewMatrix = object.orthoCamera.viewMatrix.elements;
                        } else {
                            var viewMatrix = camera.viewMatrix.elements;
                        }
    
                        uniform.setValue(viewMatrix);
                        break;
                    case "u_Model":
                        var modelMatrix = object.worldMatrix.elements;
                        uniform.setValue(modelMatrix);
                        break;
    
                    case "u_Color":
                        var color = material.diffuse;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_Opacity":
                        uniform.setValue(material.opacity);
                        break;
    
                    case "texture":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.diffuseMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "normalMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.normalMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "bumpMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.bumpMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "bumpScale":
                        uniform.setValue(material.bumpScale);
                        break;
                    case "envMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.envMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "cubeMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.cubeMap, slot);
                        uniform.setValue(slot);
                        break;
    
                    case "u_EnvMap_Intensity":
                        uniform.setValue(material.envMapIntensity);
                        break;
                    case "u_Specular":
                        uniform.setValue(material.shininess);
                        break;
                    case "u_SpecularColor":
                        var color = material.specular;
                        uniform.setValue(color.r, color.g, color.b, 1);
                        break;
                    case "specularMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.specularMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "aoMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.aoMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "aoMapIntensity":
                        uniform.setValue(material.aoMapIntensity);
                        break;
                    case "u_Roughness":
                        uniform.setValue(material.roughness);
                        break;
                    case "roughnessMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.roughnessMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "u_Metalness":
                        uniform.setValue(material.metalness);
                        break;
                    case "metalnessMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.metalnessMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "emissive":
                        var color = material.emissive;
                        var intensity = material.emissiveIntensity;
                        uniform.setValue(color.r * intensity, color.g * intensity, color.b * intensity);
                        break;
                    case "emissiveMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.emissiveMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "u_CameraPosition":
                        helpVector3.setFromMatrixPosition(camera.worldMatrix);
                        uniform.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                        break;
                    case "u_FogColor":
                        var color = scene.fog.color;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_FogDensity":
                        uniform.setValue(scene.fog.density);
                        break;
                    case "u_FogNear":
                        uniform.setValue(scene.fog.near);
                        break;
                    case "u_FogFar":
                        uniform.setValue(scene.fog.far);
                        break;
                    case "u_PointSize":
                        uniform.setValue(material.size);
                        break;
                    case "u_PointScale":
                        var scale = currentRenderTarget.height * 0.5; // three.js do this
                        uniform.setValue(scale);
                        break;
                    case "dashSize":
                        uniform.setValue(material.dashSize);
                        break;
                    case "totalSize":
                        uniform.setValue(material.dashSize + material.gapSize);
                        break;
                    case "scale":
                        uniform.setValue(material.scale);
                        break;
                    case "clippingPlanes[0]":
                        var planesData = getClippingPlanesData(scene.clippingPlanes || [], camera);
                        gl.uniform4fv(uniform.location, planesData);
                        break;
                    case "uvTransform":
                        var uvScaleMap;
                        uvScaleMap = material.diffuseMap || 
                            material.specularMap || material.normalMap || material.bumpMap ||
                            material.roughnessMap || material.metalnessMap || material.emissiveMap;
                        if(uvScaleMap) {
                            if(uvScaleMap.matrixAutoUpdate) {
                                uvScaleMap.updateMatrix();
                            }
                            uniform.setValue(uvScaleMap.matrix.elements);
                        }
                        break;
                    default:
                        break;
                }
            }
    
            // boneMatrices
            if(object.type === OBJECT_TYPE.SKINNED_MESH) {
                this.uploadSkeleton(uniforms, object, program.id);
            }
    
            if (material.acceptLight && scene.lights) {
                this.uploadLights(uniforms, scene.lights, object.receiveShadow, camera);
            }
    
            var frontFaceCW = object.worldMatrix.determinant() < 0;
            this.setStates(material, frontFaceCW);
    
            var viewport = helpVector4.set(
                currentRenderTarget.width, 
                currentRenderTarget.height,
                currentRenderTarget.width, 
                currentRenderTarget.height
            ).multiply(camera.rect);
    
            viewport.z -= viewport.x;
            viewport.w -= viewport.y;
    
            viewport.x = Math.floor(viewport.x);
            viewport.y = Math.floor(viewport.y);
            viewport.z = Math.floor(viewport.z);
            viewport.w = Math.floor(viewport.w);
    
            if(object.type === OBJECT_TYPE.CANVAS2D) {
                if(object.isScreenCanvas) {
                    object.setRenderViewport(viewport.x, viewport.y, viewport.z, viewport.w);
                    state.viewport(object.viewport.x, object.viewport.y, object.viewport.z, object.viewport.w);
                }
    
                var _offset = 0;
                for (var j = 0; j < object.drawArray.length; j++) {
                    var drawData = object.drawArray[j];
    
                    var slot = this.allocTexUnit();
                    this.texture.setTexture2D(drawData.texture, slot);
                    uniforms.spriteTexture.setValue(slot);
    
                    gl.drawElements(gl.TRIANGLES, drawData.count * 6, gl.UNSIGNED_SHORT, _offset * 2);
                    _offset += drawData.count * 6;
                    this._usedTextureUnits = 0;
                }
            } else {
                state.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
    
                this.draw(geometry, material, group);
            }
    
            // reset used tex Unit
            this._usedTextureUnits = 0;

            // Ensure depth buffer writing is enabled so it can be cleared on next render

            state.enable(gl.DEPTH_TEST);
            state.depthMask( true );
            state.colorMask( true );

            afterRender(this, renderItem);
            object.onAfterRender(renderItem); 

        }
    },

    /**
     * @private
     * set states
     * @param {boolean} frontFaceCW
     */
    setStates: function(material, frontFaceCW) {
        var gl = this.gl;
        var state = this.state;
    
        // set blend
        if (material.transparent) {
            state.setBlend(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);
        } else {
            state.setBlend(BLEND_TYPE.NONE);
        }
    
        // set depth test
        if (material.depthTest) {
            state.enable(gl.DEPTH_TEST);
        } else {
            state.disable(gl.DEPTH_TEST);
        }

        state.depthMask( material.depthWrite );
        state.colorMask( material.colorWrite );
    
        // set draw side
        state.setCullFace(
            (material.side === DRAW_SIDE.DOUBLE) ? CULL_FACE_TYPE.NONE : CULL_FACE_TYPE.BACK
        );
    
        var flipSided = ( material.side === DRAW_SIDE.BACK );
        if ( frontFaceCW ) flipSided = ! flipSided;
    
        state.setFlipSided(flipSided);
    
        // set line width
        if(material.lineWidth !== undefined) {
            state.setLineWidth(material.lineWidth);
        }
    },

    /**
     * @private
     * gl draw
     */
    draw: function(geometry, material, group) {
        var gl = this.gl;
        var properties = this.properties;
    
        var useIndexBuffer = geometry.index !== null;
    
        var drawStart = 0;
        var drawCount = useIndexBuffer ? geometry.index.count : geometry.getAttribute("a_Position").count;
        var groupStart = group ? group.start : 0;
        var groupCount = group ? group.count : Infinity;
        drawStart = Math.max(drawStart, groupStart);
        drawCount = Math.min(drawCount, groupCount);
    
        var angleInstancedArraysExt = this.capabilities.angleInstancedArraysExt;
    
        if(useIndexBuffer) {
            var indexProperty = properties.get(geometry.index);
            var bytesPerElement = indexProperty.bytesPerElement;
            var type = indexProperty.type;
            if(geometry.isInstancedGeometry) {
                if(geometry.maxInstancedCount > 0) {
                    angleInstancedArraysExt.drawElementsInstancedANGLE(material.drawMode, drawCount, type, drawStart * bytesPerElement, geometry.maxInstancedCount);
                }
            } else {
                gl.drawElements(material.drawMode, drawCount, type, drawStart * bytesPerElement);
            }
        } else {
            if(geometry.isInstancedGeometry) {
                if(geometry.maxInstancedCount > 0) {
                    angleInstancedArraysExt.drawArraysInstancedANGLE(material.drawMode, drawStart, drawCount, geometry.maxInstancedCount);
                }
            } else {
                gl.drawArrays(material.drawMode, drawStart, drawCount);
            }
        }
    },

    /**
     * @private
     * upload skeleton uniforms
     */
    uploadSkeleton: function(uniforms, object, programId) {
        if(object.skeleton && object.skeleton.bones.length > 0) {
            var skeleton = object.skeleton;
            var gl = this.gl;

            skeleton.updateBones();
    
            if(this.capabilities.maxVertexTextures > 0 && this.capabilities.floatTextures) {
                if(skeleton.boneTexture === undefined) {
                    var size = Math.sqrt(skeleton.bones.length * 4);
                    size = nextPowerOfTwo(Math.ceil(size));
                    size = Math.max(4, size);
    
                    var boneMatrices = new Float32Array(size * size * 4);
                    boneMatrices.set(skeleton.boneMatrices);
    
                    var boneTexture = new TextureData(boneMatrices, size, size);
    
                    skeleton.boneMatrices = boneMatrices;
                    skeleton.boneTexture = boneTexture;
                    skeleton.boneTextureSize = size;
                }
    
                var slot = this.allocTexUnit();
                this.texture.setTexture2D(skeleton.boneTexture, slot);
    
                if(uniforms["boneTexture"]) {
                    uniforms["boneTexture"].setValue(slot);
                }
    
                if(uniforms["boneTextureSize"]) {
                    uniforms["boneTextureSize"].setValue(skeleton.boneTextureSize);
                }
            } else {
                // TODO a cache for uniform location
                var location = gl.getUniformLocation(programId, "boneMatrices");
                gl.uniformMatrix4fv(location, false, skeleton.boneMatrices);
            }

            uniforms["bindMatrix"].setValue(object.bindMatrix.elements);
            uniforms["bindMatrixInverse"].setValue(object.bindMatrixInverse.elements);
        }
    },

    /**
     * @private
     * upload lights uniforms
     * TODO a better function for array & struct uniforms upload
     */
    uploadLights: function(uniforms, lights, receiveShadow, camera) {
        var gl = this.gl;
    
        if(lights.ambientsNum > 0) {
            uniforms.u_AmbientLightColor.set(lights.ambient);
        }
    
        for (var k = 0; k < lights.directsNum; k++) {
            var light = lights.directional[k];
    
            var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"];
            u_Directional_direction.set(light.direction);
            var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"];
            u_Directional_intensity.setValue(1);
            var u_Directional_color = uniforms["u_Directional[" + k + "].color"];
            u_Directional_color.set(light.color);
    
            var shadow = light.shadow && receiveShadow;
    
            var u_Directional_shadow = uniforms["u_Directional[" + k + "].shadow"];
            u_Directional_shadow.setValue(shadow ? 1 : 0);
    
            if(shadow) {
                var u_Directional_shadowBias = uniforms["u_Directional[" + k + "].shadowBias"];
                u_Directional_shadowBias.setValue(light.shadowBias);
                var u_Directional_shadowRadius = uniforms["u_Directional[" + k + "].shadowRadius"];
                u_Directional_shadowRadius.setValue(light.shadowRadius);
                var u_Directional_shadowMapSize = uniforms["u_Directional[" + k + "].shadowMapSize"];
                u_Directional_shadowMapSize.set(light.shadowMapSize);
    
                var slot = this.allocTexUnit();
                this.texture.setTexture2D(lights.directionalShadowMap[k], slot);
                directShadowMaps[k] = slot;
            }
        }
        if(directShadowMaps.length > 0) {
            var directionalShadowMap = uniforms["directionalShadowMap[0]"];
            gl.uniform1iv(directionalShadowMap.location, directShadowMaps);
    
            directShadowMaps.length = 0;
    
            var directionalShadowMatrix = uniforms["directionalShadowMatrix[0]"];
            gl.uniformMatrix4fv(directionalShadowMatrix.location, false, lights.directionalShadowMatrix);
        }
    
        for (var k = 0; k < lights.pointsNum; k++) {
            var light = lights.point[k];
    
            var u_Point_position = uniforms["u_Point[" + k + "].position"];
            u_Point_position.set(light.position);
            var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"];
            u_Point_intensity.setValue(1);
            var u_Point_color = uniforms["u_Point[" + k + "].color"];
            u_Point_color.set(light.color);
            var u_Point_distance = uniforms["u_Point[" + k + "].distance"];
            u_Point_distance.setValue(light.distance);
            var u_Point_decay = uniforms["u_Point[" + k + "].decay"];
            u_Point_decay.setValue(light.decay);
    
            var shadow = light.shadow && receiveShadow;
    
            var u_Point_shadow = uniforms["u_Point[" + k + "].shadow"];
            u_Point_shadow.setValue(shadow ? 1 : 0);
    
            if (shadow) {
                var u_Point_shadowBias = uniforms["u_Point[" + k + "].shadowBias"];
                u_Point_shadowBias.setValue(light.shadowBias);
                var u_Point_shadowRadius = uniforms["u_Point[" + k + "].shadowRadius"];
                u_Point_shadowRadius.setValue(light.shadowRadius);
                var u_Point_shadowMapSize = uniforms["u_Point[" + k + "].shadowMapSize"];
                u_Point_shadowMapSize.set(light.shadowMapSize);
                var u_Point_shadowCameraNear = uniforms["u_Point[" + k + "].shadowCameraNear"];
                u_Point_shadowCameraNear.setValue(light.shadowCameraNear);
                var u_Point_shadowCameraFar = uniforms["u_Point[" + k + "].shadowCameraFar"];
                u_Point_shadowCameraFar.setValue(light.shadowCameraFar);
    
                var slot = this.allocTexUnit();
                this.texture.setTextureCube(lights.pointShadowMap[k], slot);
                pointShadowMaps[k] = slot;
            }
        }
        if(pointShadowMaps.length > 0) {
            var pointShadowMap = uniforms["pointShadowMap[0]"];
            gl.uniform1iv(pointShadowMap.location, pointShadowMaps);
    
            pointShadowMaps.length = 0;
        }
    
        for (var k = 0; k < lights.spotsNum; k++) {
            var light = lights.spot[k];
    
            var u_Spot_position = uniforms["u_Spot[" + k + "].position"];
            u_Spot_position.set(light.position);
            var u_Spot_direction = uniforms["u_Spot[" + k + "].direction"];
            u_Spot_direction.set(light.direction);
            var u_Spot_intensity = uniforms["u_Spot[" + k + "].intensity"];
            u_Spot_intensity.setValue(1);
            var u_Spot_color = uniforms["u_Spot[" + k + "].color"];
            u_Spot_color.set(light.color);
            var u_Spot_distance = uniforms["u_Spot[" + k + "].distance"];
            u_Spot_distance.setValue(light.distance);
            var u_Spot_decay = uniforms["u_Spot[" + k + "].decay"];
            u_Spot_decay.setValue(light.decay);
            var u_Spot_coneCos = uniforms["u_Spot[" + k + "].coneCos"];
            u_Spot_coneCos.setValue(light.coneCos);
            var u_Spot_penumbraCos = uniforms["u_Spot[" + k + "].penumbraCos"];
            u_Spot_penumbraCos.setValue(light.penumbraCos);
    
            var shadow = light.shadow && receiveShadow;
    
            var u_Spot_shadow = uniforms["u_Spot[" + k + "].shadow"];
            u_Spot_shadow.setValue(shadow ? 1 : 0);
    
            if (shadow) {
                var u_Spot_shadowBias = uniforms["u_Spot[" + k + "].shadowBias"];
                u_Spot_shadowBias.setValue(light.shadowBias);
                var u_Spot_shadowRadius = uniforms["u_Spot[" + k + "].shadowRadius"];
                u_Spot_shadowRadius.setValue(light.shadowRadius);
                var u_Spot_shadowMapSize = uniforms["u_Spot[" + k + "].shadowMapSize"];
                u_Spot_shadowMapSize.set(light.shadowMapSize);
    
                var slot = this.allocTexUnit();
                this.texture.setTexture2D(lights.spotShadowMap[k], slot);
                spotShadowMaps[k] = slot;
            }
        }
        if(spotShadowMaps.length > 0) {
            var spotShadowMap = uniforms["spotShadowMap[0]"];
            gl.uniform1iv(spotShadowMap.location, spotShadowMaps);
    
            spotShadowMaps.length = 0;
    
            var spotShadowMatrix = uniforms["spotShadowMatrix[0]"];
            gl.uniformMatrix4fv(spotShadowMatrix.location, false, lights.spotShadowMatrix);
        }
    },

    /**
     * @private
     * alloc texture unit
     */
    allocTexUnit: function() {
        var textureUnit = this._usedTextureUnits;
    
        if (textureUnit >= this.capabilities.maxTextures) {
    
            console.warn('trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);
    
        }
    
        this._usedTextureUnits += 1;
    
        return textureUnit;
    },

    /**
     * @private 
     */
    setupVertexAttributes: function(program, geometry) {
        var gl = this.gl;
        var attributes = program.attributes;
        var properties = this.properties;
        var angleInstancedArraysExt = this.capabilities.angleInstancedArraysExt;
        for (var key in attributes) {
            var programAttribute = attributes[key];
            var geometryAttribute = geometry.getAttribute(key);
            if(geometryAttribute) {
                var normalized = geometryAttribute.normalized;
                var size = geometryAttribute.size;
                if(programAttribute.count !== size) {
                    console.warn("WebGLCore: attribute " + key + " size not match! " + programAttribute.count + " : " + size);
                }
    
                var attribute;
                if(geometryAttribute.isInterleavedBufferAttribute) {
                    attribute = properties.get(geometryAttribute.data);
                } else {
                    attribute = properties.get(geometryAttribute);
                }
                var buffer = attribute.buffer;
                var type = attribute.type;
                if(programAttribute.format !== type) ;
                var bytesPerElement = attribute.bytesPerElement;
    
                if(geometryAttribute.isInterleavedBufferAttribute) {
                    var data = geometryAttribute.data;
                    var stride = data.stride;
                    var offset = geometryAttribute.offset;
    
                    gl.enableVertexAttribArray(programAttribute.location);
    
                    if(data && data.isInstancedInterleavedBuffer) {
                        if(!angleInstancedArraysExt) {
                            console.warn("ANGLE_instanced_arrays not supported");
                        }
                        angleInstancedArraysExt.vertexAttribDivisorANGLE(programAttribute.location, data.meshPerAttribute);
                        if ( geometry.maxInstancedCount === undefined ) {
                            geometry.maxInstancedCount = data.meshPerAttribute * data.count;
                        }
                    }
    
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, bytesPerElement * stride, bytesPerElement * offset);
                } else {
                    gl.enableVertexAttribArray(programAttribute.location);
    
                    if(geometryAttribute && geometryAttribute.isInstancedBufferAttribute) {
                        if(!angleInstancedArraysExt) {
                            console.warn("ANGLE_instanced_arrays not supported");
                        }
                        angleInstancedArraysExt.vertexAttribDivisorANGLE(programAttribute.location, geometryAttribute.meshPerAttribute);
                        if ( geometry.maxInstancedCount === undefined ) {
                            geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;
                        }
                    }
    
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, 0, 0);
                }
            } else {
                console.warn("WebGLCore: geometry attribute " + key + " not found!");
            }
        }
    
        // bind index if could
        if(geometry.index) {
            var indexProperty = properties.get(geometry.index);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexProperty.buffer);
        }
    }

});

/**
 * Camera
 * @class
 */
function Camera() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.CAMERA;

    // view matrix
    this.viewMatrix = new Matrix4();

    // projection matrix
    this.projectionMatrix = new Matrix4();

    // camera frustum
    this.frustum = new Frustum();

    // gamma space or linear space
    this.gammaFactor = 2.0;
    this.gammaInput = false;
    this.gammaOutput = false;
    
    // Where on the screen is the camera rendered in normalized coordinates.
    this.rect = new Vector4(0, 0, 1, 1);

    // frustum test
    this.frustumCulled = true;
}

Camera.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Camera,

    /**
     * set view by look at, this func will set quaternion of this camera
     */
    lookAt: function() {
        var m = new Matrix4();

        return function lookAt(target, up) {

            m.lookAtRH(this.position, target, up);
            this.quaternion.setFromRotationMatrix(m);

        };
    }(),

    /**
     * set orthographic projection matrix
     */
    setOrtho: function(left, right, bottom, top, near, far) {
        this.projectionMatrix.set(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        );
    },

    /**
     * set perspective projection matrix
     */
    setPerspective: function(fov, aspect, near, far) {
        this.projectionMatrix.set(
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / (Math.tan(fov / 2)), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, -1, 0
        );
    },

    /*
        * get world direction (override)
        * must call after world matrix updated
        */
    getWorldDirection: function() {

        var position = new Vector3();
        var quaternion = new Quaternion();
        var scale = new Vector3();

        return function getWorldDirection(optionalTarget) {

            var result = optionalTarget || new Vector3();

            this.worldMatrix.decompose(position, quaternion, scale);

            result.set(0, 0, -1).applyQuaternion(quaternion);

            return result;

        };
    }(),

    updateMatrix: function() {

        var matrix = new Matrix4();

        return function updateMatrix() {
            Object3D.prototype.updateMatrix.call(this);

            this.viewMatrix.getInverse(this.worldMatrix); // update view matrix
    
            matrix.multiplyMatrices(this.projectionMatrix, this.viewMatrix); // get PV matrix
            this.frustum.setFromMatrix(matrix); // update frustum
        }
        
    }(),

    copy: function ( source, recursive ) {
        Object3D.prototype.copy.call( this, source, recursive );

        this.viewMatrix.copy( source.viewMatrix );
        this.projectionMatrix.copy( source.projectionMatrix );

        return this;
    }

});

/**
 * RenderTargetBase Class
 * @class
 */
function RenderTargetBase(width, height) {
    EventDispatcher.call(this);

    this.uuid = generateUUID();

    this.width = width;
    this.height = height;

    this.depthBuffer = true;
    this.stencilBuffer = true;
}

RenderTargetBase.prototype = Object.assign(Object.create(EventDispatcher.prototype), {

    constructor: RenderTargetBase,

    /**
     * resize render target
     */
    resize: function(width, height) {
        if(this.width !== width || this.height !== height) {
            this.dispose();
        }

        this.width = width;
        this.height = height;
    },

    dispose: function() {
        this.dispatchEvent({type: 'dispose'});
    }

});

/**
 * RenderTargetCube Class
 * @class
 */
function RenderTargetCube(width, height) {
    RenderTargetBase.call(this, width, height);

    this.texture = new TextureCube();

    this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
}

RenderTargetCube.prototype = Object.create(RenderTargetBase.prototype);
RenderTargetCube.prototype.constructor = RenderTargetCube;

function EnvironmentMapPass(renderTarget) {
    this.camera = new Camera();

    this.targets = [
        new Vector3( 1, 0, 0 ), new Vector3( -1, 0, 0 ), new Vector3( 0, 1, 0 ),
        new Vector3( 0, -1, 0 ), new Vector3( 0, 0, 1 ), new Vector3( 0, 0, -1 )
    ];
    this.ups = [
        new Vector3( 0, -1, 0 ), new Vector3( 0, -1, 0 ), new Vector3( 0, 0, 1 ),
        new Vector3( 0, 0, -1 ), new Vector3( 0, -1, 0 ), new Vector3( 0, -1, 0 )
    ];

    this.camera.setPerspective(90 / 180 * Math.PI, 1, 1, 1000);

    this.position = new Vector3();
    this.lookTarget = new Vector3();

    this.renderTarget = renderTarget || new RenderTargetCube(512, 512);
    this.renderTexture = this.renderTarget.texture;
    this.renderTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;
}

EnvironmentMapPass.prototype.render = function(glCore, scene) {
    this.camera.position.copy(this.position);

    for(var i = 0; i < 6; i++) {
        this.lookTarget.set(this.targets[i].x + this.camera.position.x, this.targets[i].y + this.camera.position.y, this.targets[i].z + this.camera.position.z);
        this.camera.lookAt(this.lookTarget, this.ups[i]);

        this.camera.updateMatrix();

        this.renderTarget.activeCubeFace = i;

        glCore.texture.setRenderTarget(this.renderTarget);

        glCore.clear(true, true, true);

        glCore.render(scene, this.camera);

        glCore.texture.updateRenderTargetMipmap(this.renderTarget);
    }
};

function ShadowMapPass() {
    this.depthMaterial = new DepthMaterial();
    this.depthMaterial.packToRGBA = true;

    this.distanceMaterial = new DistanceMaterial();

    this.oldClearColor = new Vector4();
}

Object.assign(ShadowMapPass.prototype, {

    render: function(glCore, scene) {
    
        var gl = glCore.gl;
        var state = glCore.state;

        // force disable stencil
        var useStencil = state.states[gl.STENCIL_TEST];
        if(useStencil) {
            state.disable(gl.STENCIL_TEST);
        }

        this.oldClearColor.copy(state.currentClearColor);
        state.clearColor(1, 1, 1, 1);

        var lights = scene.lights.shadows;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                var renderList = scene.updateRenderList(camera);

                glCore.texture.setRenderTarget(shadowTarget);

                glCore.clear(true, true);

                var material = isPointLight ? this.distanceMaterial : this.depthMaterial;
                material.uniforms = material.uniforms || {};
                material.uniforms["nearDistance"] = shadow.cameraNear;
                material.uniforms["farDistance"] = shadow.cameraFar;

                glCore.renderPass(renderList.opaque, camera, {
                    getMaterial: function(renderable) {
                        // copy draw side
                        material.side = renderable.material.side;
                        return material;
                    },
                    ifRender: function(renderable) {
                        return renderable.object.castShadow;
                    }
                });

                // ignore transparent objects?

            }

            // set generateMipmaps false
            // this.texture.updateRenderTargetMipmap(shadowTarget);

        }

        if(useStencil) {
            state.enable(gl.STENCIL_TEST);
        }

        state.clearColor(this.oldClearColor.x, this.oldClearColor.y, this.oldClearColor.z, this.oldClearColor.w);
    }

});

var helpVector3$1 = new Vector3();

var lightCaches = {};

function getLightCache(light) {
    if(lightCaches[light.uuid] !== undefined) {
        return lightCaches[light.uuid];
    }

    var cache;
    switch ( light.lightType ) {
        case LIGHT_TYPE.DIRECT:
            cache = {
                direction: new Float32Array(3),
                color: new Float32Array([0, 0, 0, 1]),
                shadow: false,
                shadowBias: 0,
                shadowRadius: 1,
                shadowMapSize: new Float32Array(2)
            };
            break;
        case LIGHT_TYPE.POINT:
            cache = {
                position: new Float32Array(3),
                color: new Float32Array([0, 0, 0, 1]),
                distance: 0,
                decay: 0,
                shadow: false,
                shadowBias: 0,
                shadowRadius: 1,
                shadowMapSize: new Float32Array(2),
                shadowCameraNear: 1,
                shadowCameraFar: 1000
            };
            break;
        case LIGHT_TYPE.SPOT:
            cache = {
                position: new Float32Array(3),
                direction: new Float32Array(3),
                color: new Float32Array([0, 0, 0, 1]),
                distance: 0,
                coneCos: 0,
                penumbraCos: 0,
                decay: 0,
                shadow: false,
                shadowBias: 0,
                shadowRadius: 1,
                shadowMapSize: new Float32Array(2)
            };
            break;
    }

    lightCaches[light.uuid] = cache;

    return cache;
}

function LightCache() {
    this.ambient = new Float32Array([0, 0, 0, 1]);
    this.directional = [];
    this.directionalShadowMap = [];
    this.directionalShadowMatrix = [];
    this.point = [];
    this.pointShadowMap = [];
    this.pointShadowMatrix = [];
    this.spot = [];
    this.spotShadowMap = [];
    this.spotShadowMatrix = [];
    this.shadows = [];
    this.ambientsNum = 0;
    this.directsNum = 0;
    this.pointsNum = 0;
    this.spotsNum = 0;
    this.shadowsNum = 0;
    this.totalNum = 0;
}

Object.assign(LightCache.prototype, {

    startCount: function () {
        for(var i = 0; i < 3; i++) {
            this.ambient[i] = 0;
        }
        this.shadows.length = 0;
        this.ambientsNum = 0;
        this.directsNum = 0;
        this.pointsNum = 0;
        this.spotsNum = 0;
        this.shadowsNum = 0;
        this.totalNum = 0;
    },

    add: function (object) {
        if (object.lightType == LIGHT_TYPE.AMBIENT) {
            this._doAddAmbientLight(object);
        } else if (object.lightType == LIGHT_TYPE.DIRECT) {
            this._doAddDirectLight(object);
        } else if (object.lightType == LIGHT_TYPE.POINT) {
            this._doAddPointLight(object);
        } else if (object.lightType == LIGHT_TYPE.SPOT) {
            this._doAddSpotLight(object);
        }

        if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
            this.shadows.push(object);
            this.shadowsNum++;
        }

        this.totalNum++;
    },

    endCount: function () {
        // do nothing
    },

    _doAddAmbientLight: function (object) {
        var intensity = object.intensity;
        var color = object.color;

        this.ambient[0] += color.r * intensity;
        this.ambient[1] += color.g * intensity;
        this.ambient[2] += color.b * intensity;

        this.ambientsNum++;
    },

    _doAddDirectLight: function (object) {
        var intensity = object.intensity;
        var color = object.color;

        var cache = getLightCache(object);

        cache.color[0] = color.r * intensity;
        cache.color[1] = color.g * intensity;
        cache.color[2] = color.b * intensity;

        var direction = helpVector3$1;
        object.getWorldDirection(direction);
        //direction.transformDirection(camera.viewMatrix);

        cache.direction[0] = direction.x;
        cache.direction[1] = direction.y;
        cache.direction[2] = direction.z;

        if(object.castShadow) {
            cache.shadow = true;
            cache.shadowBias = object.shadow.bias;
            cache.shadowRadius = object.shadow.radius;
            cache.shadowMapSize[0] = object.shadow.mapSize.x;
            cache.shadowMapSize[1] = object.shadow.mapSize.y;
        } else {
            cache.shadow = false;
        }

        if(object.castShadow) {

            // resize typed array
            var needSize = (this.directsNum + 1) * 16;
            if(this.directionalShadowMatrix.length < needSize) {
                var old = this.directionalShadowMatrix;
                this.directionalShadowMatrix = new Float32Array(needSize);
                this.directionalShadowMatrix.set(old);
            }

            this.directionalShadowMatrix.set(object.shadow.matrix.elements, this.directsNum * 16);
            this.directionalShadowMap[this.directsNum] = object.shadow.map;
        }

        this.directional[this.directsNum] = cache;

        this.directsNum++;
    },

    _doAddPointLight: function (object) {
        var intensity = object.intensity;
        var color = object.color;
        var distance = object.distance;
        var decay = object.decay;

        var cache = getLightCache(object);

        cache.color[0] = color.r * intensity;
        cache.color[1] = color.g * intensity;
        cache.color[2] = color.b * intensity;

        cache.distance = distance;
        cache.decay = decay;

        var position = helpVector3$1.setFromMatrixPosition(object.worldMatrix);//.applyMatrix4(camera.viewMatrix);

        cache.position[0] = position.x;
        cache.position[1] = position.y;
        cache.position[2] = position.z;

        if(object.castShadow) {
            cache.shadow = true;
            cache.shadowBias = object.shadow.bias;
            cache.shadowRadius = object.shadow.radius;
            cache.shadowMapSize[0] = object.shadow.mapSize.x;
            cache.shadowMapSize[1] = object.shadow.mapSize.y;
            cache.shadowCameraNear = object.shadow.cameraNear;
            cache.shadowCameraFar = object.shadow.cameraFar;
        } else {
            cache.shadow = false;
        }

        if(object.castShadow) {

            // resize typed array
            var needSize = (this.pointsNum + 1) * 16;
            if(this.pointShadowMatrix.length < needSize) {
                var old = this.pointShadowMatrix;
                this.pointShadowMatrix = new Float32Array(needSize);
                this.pointShadowMatrix.set(old);
            }

            this.pointShadowMatrix.set(object.shadow.matrix.elements, this.pointsNum * 16);
            this.pointShadowMap[this.pointsNum] = object.shadow.map;
        }

        this.point[this.pointsNum] = cache;

        this.pointsNum++;
    },

    _doAddSpotLight: function (object) {
        var intensity = object.intensity;
        var color = object.color;
        var distance = object.distance;
        var decay = object.decay;

        var cache = getLightCache(object);

        cache.color[0] = color.r * intensity;
        cache.color[1] = color.g * intensity;
        cache.color[2] = color.b * intensity;

        cache.distance = distance;
        cache.decay = decay;

        var position = helpVector3$1.setFromMatrixPosition(object.worldMatrix);//.applyMatrix4(camera.viewMatrix);

        cache.position[0] = position.x;
        cache.position[1] = position.y;
        cache.position[2] = position.z;

        var direction = helpVector3$1;
        object.getWorldDirection(helpVector3$1);
        // helpVector3.transformDirection(camera.viewMatrix);

        cache.direction[0] = direction.x;
        cache.direction[1] = direction.y;
        cache.direction[2] = direction.z;

        var coneCos = Math.cos(object.angle);
        var penumbraCos = Math.cos(object.angle * (1 - object.penumbra));

        cache.coneCos = coneCos;
        cache.penumbraCos = penumbraCos;

        if(object.castShadow) {
            cache.shadow = true;
            cache.shadowBias = object.shadow.bias;
            cache.shadowRadius = object.shadow.radius;
            cache.shadowMapSize[0] = object.shadow.mapSize.x;
            cache.shadowMapSize[1] = object.shadow.mapSize.y;
        } else {
            cache.shadow = false;
        }

        if(object.castShadow) {

            // resize typed array
            var needSize = (this.spotsNum + 1) * 16;
            if(this.spotShadowMatrix.length < needSize) {
                var old = this.spotShadowMatrix;
                this.spotShadowMatrix = new Float32Array(needSize);
                this.spotShadowMatrix.set(old);
            }

            this.spotShadowMatrix.set(object.shadow.matrix.elements, this.spotsNum * 16);
            this.spotShadowMap[this.spotsNum] = object.shadow.map;
        }

        this.spot[this.spotsNum] = cache;

        this.spotsNum++;
    }

});

var helpVector3$2 = new Vector3();
var helpSphere = new Sphere();

var sortFrontToBack = function(a, b) {
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    } else {
        return a.z - b.z;
    }
};

var sortBackToFront = function(a, b) {
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    } else {
        return b.z - a.z;
    }
};

function RenderList() {

    var renderItems = [];
	var renderItemsIndex = 0;

    var opaque = [];
    var opaqueCount = 0;
    var transparent = [];
    var transparentCount = 0;

    function startCount() {
        renderItemsIndex = 0;

        opaqueCount = 0;
        transparentCount = 0;
    }

    function add(object, camera) {

        // frustum test
        if(object.frustumCulled && camera.frustumCulled) {
            helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);
            var frustumTest = camera.frustum.intersectsSphere(helpSphere);
            if(!frustumTest) { // only test bounding sphere
                return;
            }
        }

        // calculate z
        helpVector3$2.setFromMatrixPosition(object.worldMatrix);
        helpVector3$2.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

        if(Array.isArray(object.material)){
            var groups = object.geometry.groups;

            for(var i = 0; i < groups.length; i++) {
                var group = groups[i];
                var groupMaterial = object.material[group.materialIndex];
                if(groupMaterial) {
                    _doAdd(object, object.geometry, groupMaterial, helpVector3$2.z, group);
                }
            }
        } else {
            _doAdd(object, object.geometry, object.material, helpVector3$2.z);
        }

    }

    function _doAdd(object, geometry, material, z, group) {

        var renderable = renderItems[renderItemsIndex];

        if (renderable === undefined) {
            renderable = {
                object: object,
                geometry: geometry,
                material: material,
                z: z,
                renderOrder: object.renderOrder,
                group: group
            };
            renderItems[ renderItemsIndex ] = renderable;
        } else {
            renderable.object = object;
            renderable.geometry = geometry;
            renderable.material = material;
            renderable.z = z;
            renderable.renderOrder = object.renderOrder;
            renderable.group = group;
        }
        
        if (material.transparent) {
            transparent[transparentCount] = renderable;
            transparentCount++;
        } else {
            opaque[opaqueCount] = renderable;
            opaqueCount++;
        }

        renderItemsIndex ++;

    }

    function endCount() {
        opaque.length = opaqueCount;
        transparent.length = transparentCount;
    }

    function sort() {
        opaque.sort(sortFrontToBack);
        transparent.sort(sortBackToFront);
    }

    return {
        opaque: opaque,
        transparent: transparent,
        startCount: startCount,
        add: add,
        endCount: endCount,
        sort: sort
    };

}

/**
 * Scene
 * @class
 */
function Scene() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.SCENE;

    this.overrideMaterial = null;

    this.fog = null;

    this.clippingPlanes = []; // Planes array

    this._renderLists = {};

    this.lights = new LightCache();
}

Scene.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Scene,

    updateRenderList: function(camera) {
        var id = camera.uuid;

        if(!this._renderLists[id]) {
            this._renderLists[id] = new RenderList();
        }

        var renderList = this._renderLists[id];

        renderList.startCount();

        this._doUpdateRenderList(this, camera, renderList);

        renderList.endCount();

        renderList.sort();

        return renderList;
    },

    getRenderList: function(camera) {
        return this._renderLists[camera.uuid];
    },

    updateLights: function() {
        var lights = this.lights;

        this.lights.startCount();

        this._doUpdateLights(this);

        this.lights.endCount();

        return this.lights;
    },

    _doUpdateRenderList: function(object, camera, renderList) {

        if (!object.visible) {
            return;
        }

        if (!!object.geometry && !!object.material) { // renderable
            renderList.add(object, camera);
        }

        // skip ui children
        if(OBJECT_TYPE.CANVAS2D === object.type) {
            return;
        }

        // handle children by recursion
        var children = object.children;
        for (var i = 0, l = children.length; i < l; i++) {
            this._doUpdateRenderList(children[i], camera, renderList);
        }
    },

    _doUpdateLights: function(object) {

        if (!object.visible) {
            return;
        }

        if (OBJECT_TYPE.LIGHT === object.type) { // light
            this.lights.add(object);
        }

        // skip ui children
        if(OBJECT_TYPE.CANVAS2D === object.type) {
            return;
        }

        // handle children by recursion
        var children = object.children;
        for (var i = 0, l = children.length; i < l; i++) {
            this._doUpdateLights(children[i]);
        }
    }

});

/**
 * Mesh
 * @class
 */
function Mesh(geometry, material) {
    Object3D.call(this);

    this.geometry = geometry;

    this.material = material;

    this.type = OBJECT_TYPE.MESH;
}

Mesh.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Mesh,

    // override
    raycast: function() {
        var sphere = new Sphere();
        var box = new Box3();
        var inverseMatrix = new Matrix4();
        var ray = new Ray();

        var barycoord = new Vector3();

        var vA = new Vector3();
        var vB = new Vector3();
        var vC = new Vector3();

        var uvA = new Vector2();
        var uvB = new Vector2();
        var uvC = new Vector2();

        var intersectionPoint = new Vector3();
        var intersectionPointWorld = new Vector3();

        function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
            Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);

            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);

            uv1.add(uv2).add(uv3);

            return uv1.clone();
        }

        function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
            var intersect;
            var material = object.material;

            // if (material.side === BackSide) {
            //     intersect = ray.intersectTriangle(pC, pB, pA, true, point);
            // } else {
                // intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
            // }
            intersect = ray.intersectTriangle(pC, pB, pA, true, point);

            if (intersect === null) return null;

            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.worldMatrix);

            var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);

            if (distance < raycaster.near || distance > raycaster.far) return null;

            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                object: object
            };
        }

        return function raycast(raycaster, intersects) {
            var geometry = this.geometry;
            var worldMatrix = this.worldMatrix;

            // sphere test
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(worldMatrix);
            if (!raycaster.ray.intersectsSphere(sphere)) {
                return;
            }

            // box test
            box.copy(geometry.boundingBox);
            box.applyMatrix4(worldMatrix);
            if (!raycaster.ray.intersectsBox(box)) {
                return;
            }

            // vertex test
            inverseMatrix.getInverse(worldMatrix);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

            var index = geometry.index.array;
            var position = geometry.getAttribute("a_Position");
            var uv = geometry.getAttribute("a_Uv");
            var a, b, c;

            for (var i = 0; i < index.length; i += 3) {
                a = index[i];
                b = index[i + 1];
                c = index[i + 2];

                vA.fromArray(position.array, a * 3);
                vB.fromArray(position.array, b * 3);
                vC.fromArray(position.array, c * 3);

                var intersection = checkIntersection(this, raycaster, ray, vA, vB, vC, intersectionPoint);

                if (intersection) {
                    // uv
                    uvA.fromArray(uv.array, a * 2);
                    uvB.fromArray(uv.array, b * 2);
                    uvC.fromArray(uv.array, c * 2);

                    intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);

                    intersection.face = [a, b, c];
                    intersection.faceIndex = a;

                    intersects.push(intersection);
                }
            }
        }
    }(),

    clone: function() {
        return new this.constructor( this.geometry, this.material ).copy( this );
    }

});

function ShaderPostPass(shader) {
    var scene = new Scene();

    var camera = this.camera = new Camera();
    camera.frustumCulled = false;
    camera.position.set(0, 1, 0);
    camera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, -1));
    camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
    scene.add(camera);

    var geometry = new PlaneGeometry(2, 2, 1, 1);
    var material = this.material = new ShaderMaterial(shader);
    this.uniforms = material.uniforms;
    var plane = new Mesh(geometry, material);
    plane.frustumCulled = false;
    scene.add(plane);

    // static scene
    scene.updateMatrix();
    this.renderList = scene.updateRenderList(camera);

    this.renderConfig = {};
}

Object.assign(ShaderPostPass.prototype, {

    render: function(glCore) {
        glCore.renderPass(this.renderList.opaque, this.camera, this.renderConfig);
    }

});

/**
 * RenderTargetBack Class
 * no texture & framebuffer in this render target, but an canvas tag element
 * @class
 */
function RenderTargetBack(view) {
    RenderTargetBase.call(this, view.width, view.height);

    this.view = view; // render to canvas
}

RenderTargetBack.prototype = Object.assign(Object.create(RenderTargetBase.prototype), {

    constructor: RenderTargetBack,

    /**
     * resize render target
     */
    resize: function(width, height) {
        this.view.width = width;
        this.view.height = height;

        this.width = width;
        this.height = height;
    },

    dispose: function() {
        // dispose canvas?
    }

});

function Performance() {
    this._entities = {};

    this.enableCounter = false;
}

Object.assign(Performance.prototype, {

    getEntity: function(key) {
        return this._entities[key];
    },

    getFps: function() {
        var entity = this.getEntity("fps");
        return (entity && entity.averageDelta) ? Math.floor(1000 / entity.averageDelta) : 0;
    },

    updateFps: function() {
        if(!this.enableCounter) {
            return;
        }
        this.endCounter("fps");
        this.startCounter("fps", 60);
    },

    getNow: function() {
        if(window.performance) {
            return window.performance.now();
        }
        return new Date().getTime();
    },

    startCounter: function(key, averageRange) {
        if(!this.enableCounter) {
            return;
        }

        var entity = this._entities[key];
        if(!entity) {
            entity = {
                start: 0,
                end: 0,
                delta: 0,
                _cache: [],
                averageRange: 1,
                averageDelta: 0
            };
            this._entities[key] = entity;
        }
        entity.start = this.getNow();
        entity.averageRange = averageRange || 1;
    },

    endCounter: function(key) {
        if(!this.enableCounter) {
            return;
        }

        var entity = this._entities[key];
        if(entity) {
            entity.end = this.getNow();
            entity.delta = entity.end - entity.start;

            if(entity.averageRange > 1) {
                entity._cache.push(entity.delta);
                var length = entity._cache.length;
                if(length >= entity.averageRange) {
                    if(length > entity.averageRange) {
                        entity._cache.shift();
                        length--;
                    }
                    var sum = 0;
                    for(var i = 0; i < length; i++) {
                        sum += entity._cache[i];
                    }
                    entity.averageDelta = sum / length;
                }
            }
        }
    }

});

/**
 * Renderer
 * @class
 */
function Renderer(view, options) {

    this.backRenderTarget = new RenderTargetBack(view);
    
    var gl = view.getContext("webgl", options || {
        antialias: true, // antialias
        alpha: false, // effect performance, default false
        // premultipliedAlpha: false, // effect performance, default false
        stencil: true
    });
    this.glCore = new WebGLCore(gl);

    this.autoClear = true;

    this.performance = new Performance();

    this.shadowMapPass = new ShadowMapPass();

    this.shadowAutoUpdate = true;
    this.shadowNeedsUpdate = false;

    this.matrixAutoUpdate = true;
    this.lightsAutoupdate = true;
}

/**
 * render scene with camera
 */
Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
    var performance = this.performance;

    performance.updateFps();

    performance.startCounter("render", 60);

    this.matrixAutoUpdate && scene.updateMatrix();
    this.lightsAutoupdate && scene.updateLights();

    performance.startCounter("renderShadow", 60);   

    if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
        this.shadowMapPass.render(this.glCore, scene);

        this.shadowNeedsUpdate = false;
    }

    performance.endCounter("renderShadow");

    if (renderTarget === undefined) {
        renderTarget = this.backRenderTarget;
    }
    this.glCore.texture.setRenderTarget(renderTarget);

    if (this.autoClear || forceClear) {
        this.glCore.clear(true, true, true);
    }

    performance.startCounter("renderList", 60);
    this.glCore.render(scene, camera);
    performance.endCounter("renderList");

    if (!!renderTarget.texture) {
        this.glCore.texture.updateRenderTargetMipmap(renderTarget);
    }

    this.performance.endCounter("render");
};

/**
 * RenderTarget2D Class
 * @class
 */
function RenderTarget2D(width, height) {
    RenderTargetBase.call(this, width, height);

    this.texture = new Texture2D();

    this.depthTexture = null;
}

RenderTarget2D.prototype = Object.create(RenderTargetBase.prototype);
RenderTarget2D.prototype.constructor = RenderTarget2D;

/**
 * Fog
 * @class
 */
function Fog(color, near, far) {

    this.fogType = FOG_TYPE.NORMAL;

    this.color = new Color3( (color !== undefined) ? color : 0x000000 );

    this.near = (near !== undefined) ? near : 1;
    this.far = (far !== undefined) ? far : 1000;
}

/**
 * FogExp2
 * @class
 */
function FogExp2(color, density) {

    this.fogType = FOG_TYPE.EXP2;

    this.color = new Color3( (color !== undefined) ? color : 0x000000 );

    this.density = (density !== undefined) ? density : 0.00025;
}

/**
 * Group
 * @class
 */
function Group() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.GROUP;
}

Group.prototype = Object.create(Object3D.prototype);
Group.prototype.constructor = Group;

/**
 * Light
 * @class
 */
function Light() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.LIGHT;

    this.lightType = "";

    // default light color is white
    this.color = new Color3(0xffffff);

    // light intensity, default 1
    this.intensity = 1;
}

Light.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Light,

    copy: function(source) {
        Object3D.prototype.copy.call(this, source);

        this.type = source.type;
        this.lightType = source.lightType;
        this.color.copy(source.color);
        this.intensity = source.intensity;

        return this;
    }

});

/**
 * AmbientLight
 * @class
 */
function AmbientLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.AMBIENT;
}

AmbientLight.prototype = Object.create(Light.prototype);
AmbientLight.prototype.constructor = AmbientLight;

function LightShadow() {
    this.camera = new Camera();
    this.matrix = new Matrix4();

    this.bias = 0.0003;
    this.radius = 2;

    this.cameraNear = 1;
    this.cameraFar = 500;

    this.mapSize = new Vector2(512, 512);

    this.renderTarget = null;
    this.map = null;
}

Object.assign(LightShadow.prototype, {

    update: function(light, face) {

    },

    copy: function(source) {
        this.camera.copy(source.camera);
        this.matrix.copy(source.matrix);

        this.bias = source.bias;
        this.radius = source.radius;

        this.cameraNear = source.cameraNear;
        this.cameraFar = source.cameraFar;

        this.mapSize.copy(source.mapSize);

        return this;
    },

    clone: function() {
        return new this.constructor().copy( this );
    }

});

/**
 * DirectionalLightShadow
 * @class
 */
function DirectionalLightShadow() {
    LightShadow.call(this);

    // direct light is just a direction
    // we would not do camera frustum cull, because this light could be any where
    this.camera.frustumCulled = false;

    this.renderTarget = new RenderTarget2D(this.mapSize.x, this.mapSize.y);

    var map = this.renderTarget.texture;
    map.generateMipmaps = false;
    map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
    this.map = map;

    // the cast shadow window size
    this.windowSize = 500;

    this._lookTarget = new Vector3();

    this._up = new Vector3(0, 1, 0);
}

DirectionalLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {

    constructor: DirectionalLightShadow,

    /**
     * update by light
     */
    update: function(light) {
        this._updateCamera(light);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    },

    /**
     * update camera matrix by light
     */
    _updateCamera: function(light) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;

        // set camera position and lookAt(rotation)
        light.getWorldDirection(this._lookTarget);
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
        camera.lookAt(lookTarget, this._up);

        // update view matrix
        camera.updateMatrix();

        // update projection
        var halfWindowSize = this.windowSize / 2;
        camera.setOrtho(-halfWindowSize, halfWindowSize, -halfWindowSize, halfWindowSize, this.cameraNear, this.cameraFar);
    },

    /**
     * update shadow matrix
     */
    _updateMatrix: function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    },

    copy: function(source) {
        LightShadow.prototype.copy.call(this, source);

        this.windowSize = source.windowSize;

        return this;
    }

});

/**
 * DirectionalLight
 * @class
 */
function DirectionalLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.DIRECT;

    this.shadow = new DirectionalLightShadow();
}

DirectionalLight.prototype = Object.assign(Object.create(Light.prototype), {

    constructor: DirectionalLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);
        
        return this;
    }

});

/**
 * PointLightShadow
 * @class
 */
function PointLightShadow() {
    LightShadow.call(this);

    this.renderTarget = new RenderTargetCube(this.mapSize.x, this.mapSize.y);

    var map = this.renderTarget.texture;
    map.generateMipmaps = false;
    map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
    this.map = map;

    this._targets = [
        new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 1, 0),
        new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)
    ];

    this._ups = [
        new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1),
        new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)
    ];

    this._lookTarget = new Vector3();
}

PointLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {

    constructor: PointLightShadow,

    /**
     * update by light
     */
    update: function(light, face) {
        this._updateCamera(light, face);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    },

    /**
     * update camera matrix by light
     */
    _updateCamera: function(light, face) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;
        var targets = this._targets;
        var ups = this._ups;

        // set camera position and lookAt(rotation)
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(targets[face].x + camera.position.x, targets[face].y + camera.position.y, targets[face].z + camera.position.z);
        camera.lookAt(lookTarget, ups[face]);

        // update view matrix
        camera.updateMatrix();

        // update projection
        camera.setPerspective(90 / 180 * Math.PI, 1, this.cameraNear, this.cameraFar);
    },

    /**
     * update shadow matrix
     */
    _updateMatrix: function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    }

});

/**
 * PointLight
 * @class
 */
function PointLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.POINT;

    // decay of this light
    this.decay = 2;

    // distance of this light
    this.distance = 200;

    this.shadow = new PointLightShadow();
}

PointLight.prototype = Object.assign(Object.create(Light.prototype), {

    constructor: PointLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);

        return this;
    }
});

/**
 * SpotLightShadow
 * @class
 */
function SpotLightShadow() {
    LightShadow.call(this);

    this.renderTarget = new RenderTarget2D(this.mapSize.x, this.mapSize.y);

    var map = this.renderTarget.texture;
    map.generateMipmaps = false;
    map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
    this.map = map;

    this._lookTarget = new Vector3();

    this._up = new Vector3(0, 1, 0);
}

SpotLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {

    constructor: SpotLightShadow,

    /**
     * update by light
     */
    update: function(light) {
        this._updateCamera(light);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    },

    /**
     * update camera matrix by light
     */
    _updateCamera: function(light) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;

        // set camera position and lookAt(rotation)
        light.getWorldDirection(this._lookTarget);
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
        camera.lookAt(lookTarget, this._up);

        // update view matrix
        camera.updateMatrix();

        // update projection
        // TODO distance should be custom?
        camera.setPerspective(light.angle * 2, 1, this.cameraNear, this.cameraFar);
    },

    /**
     * update shadow matrix
     */
    _updateMatrix: function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    }
});

/**
 * SpotLight
 * @class
 */
function SpotLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.SPOT;

    // decay of this light
    this.decay = 2;

    // distance of this light
    this.distance = 200;

    // from 0 to 1
    this.penumbra = 0;

    this.angle = Math.PI / 6;

    this.shadow = new SpotLightShadow();
}

SpotLight.prototype = Object.assign(Object.create(Light.prototype), {

    constructor: SpotLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);

        return this;
    }
});

/**
 * SkinnedMesh
 * @class
 */
function SkinnedMesh(geometry, material) {
    Mesh.call(this, geometry, material);

    this.type = OBJECT_TYPE.SKINNED_MESH;

    this.skeleton = undefined;

    this.bindMode = 'attached';

    this.bindMatrix = new Matrix4();
    this.bindMatrixInverse = new Matrix4();
}

SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype), {

    constructor: SkinnedMesh,
    
    bind: function ( skeleton, bindMatrix ) {

		this.skeleton = skeleton;

		if ( bindMatrix === undefined ) {

			this.updateMatrix();

			bindMatrix = this.worldMatrix;

		}

		this.bindMatrix.copy( bindMatrix );
		this.bindMatrixInverse.getInverse( bindMatrix );

	},

    updateMatrix: function() {
        Mesh.prototype.updateMatrix.call(this);

        if(this.bindMode === 'attached') {
            this.bindMatrixInverse.getInverse(this.worldMatrix);
        } else if(this.bindMode === 'detached') {
            this.bindMatrixInverse.getInverse(this.bindMatrix);
        } else {
            console.warn( 'zen3d.SkinnedMesh: Unrecognized bindMode: ' + this.bindMode );
        }
    },

    clone: function () {
        return new this.constructor( this.geometry, this.material ).copy( this );
    }

});

/**
 * Points
 * @class
 */
function Points(geometry, material) {
    Object3D.call(this);

    this.geometry = geometry;

    this.material = material;

    this.type = OBJECT_TYPE.POINT;
}

Points.prototype = Object.create(Object3D.prototype);
Points.prototype.constructor = Points;

/**
 * Line
 * @class
 */
function Line(geometry, material) {
    Object3D.call(this);

    this.geometry = geometry;

    this.material = material;

    this.type = OBJECT_TYPE.LINE;
}

Line.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Line,

    /**
     * raycast
     */
    raycast: function() {
        // TODO
    }

});

export { EventDispatcher, Raycaster, Euler, Vector2, Vector3, Vector4, Matrix3, Matrix4, Quaternion, Box2, Box3, Sphere, Plane, Frustum, Color3, Ray, Triangle, Curve, Spherical, TextureBase, Texture2D, TextureCube, TextureData, TextureDepth, Bone, Skeleton, AnimationMixer, BooleanKeyframeTrack, ColorKeyframeTrack, KeyframeClip, KeyframeTrack, NumberKeyframeTrack, PropertyBindingMixer, QuaternionKeyframeTrack, StringKeyframeTrack, VectorKeyframeTrack, BufferAttribute, CubeGeometry, CylinderGeometry, Geometry, InstancedBufferAttribute, InstancedGeometry, InstancedInterleavedBuffer, InterleavedBuffer, InterleavedBufferAttribute, PlaneGeometry, SphereGeometry, Material, BasicMaterial, LambertMaterial, PhongMaterial, PBRMaterial, PointsMaterial, LineMaterial, LineLoopMaterial, LineDashedMaterial, ShaderMaterial, DepthMaterial, DistanceMaterial, WebGLCapabilities, WebGLState, WebGLProperties, WebGLTexture, WebGLGeometry, WebGLUniform, WebGLAttribute, WebGLProgram, WebGLCore, ShaderChunk, ShaderLib, EnvironmentMapPass, ShadowMapPass, ShaderPostPass, Renderer, LightCache, RenderList, RenderTargetBase, RenderTargetBack, RenderTarget2D, RenderTargetCube, Object3D, Scene, Fog, FogExp2, Group, Light, AmbientLight, DirectionalLight, PointLight, SpotLight, LightShadow, DirectionalLightShadow, SpotLightShadow, PointLightShadow, Camera, Mesh, SkinnedMesh, Points, Line, FileLoader, ImageLoader, TGALoader, generateUUID, isMobile, isWeb, createCheckerBoardPixels, isPowerOfTwo, nearestPowerOfTwo, nextPowerOfTwo, cloneUniforms, halton, OBJECT_TYPE, LIGHT_TYPE, MATERIAL_TYPE, FOG_TYPE, BLEND_TYPE, BLEND_EQUATION, BLEND_FACTOR, CULL_FACE_TYPE, DRAW_SIDE, SHADING_TYPE, WEBGL_TEXTURE_TYPE, WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE, WEBGL_TEXTURE_FILTER, WEBGL_TEXTURE_WRAP, WEBGL_UNIFORM_TYPE, WEBGL_ATTRIBUTE_TYPE, WEBGL_BUFFER_USAGE, SHADOW_TYPE, TEXEL_ENCODING_TYPE, ENVMAP_COMBINE_TYPE, DRAW_MODE };
