/**
 * Enum for object Type.
 * @name zen3d.OBJECT_TYPE
 * @readonly
 * @enum {string}
 */
export var OBJECT_TYPE = {
    MESH: "mesh",
    SKINNED_MESH: "skinned_mesh",
    LIGHT: "light",
    CAMERA: "camera",
    SCENE: "scene",
    GROUP: "group",
    CANVAS2D: "canvas2d"
};

/**
 * Enum for light Type.
 * @name zen3d.LIGHT_TYPE
 * @readonly
 * @enum {string}
 */
export var LIGHT_TYPE = {
    AMBIENT: "ambient",
    DIRECT: "direct",
    POINT: "point",
    SPOT: "spot"
};

/**
 * Enum for material Type.
 * @name zen3d.MATERIAL_TYPE
 * @readonly
 * @enum {string}
 */
export var MATERIAL_TYPE = {
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
 * Enum for fog Type.
 * @name zen3d.FOG_TYPE
 * @readonly
 * @enum {string}
 */
export var FOG_TYPE = {
    NORMAL: "normal",
    EXP2: "exp2"
};

/**
 * Enum for blend Type.
 * @name zen3d.BLEND_TYPE
 * @readonly
 * @enum {string}
 */
export var BLEND_TYPE = {
    NONE: "none",
    NORMAL: "normal",
    ADD: "add",
    CUSTOM: "custom"
};

/**
 * Enum for blend equation.
 * @name zen3d.BLEND_EQUATION
 * @readonly
 * @enum {number}
 */
export var BLEND_EQUATION = {
    ADD: 0x8006,
    SUBTRACT: 0x800A,
    REVERSE_SUBTRACT: 0x800B
};

/**
 * Enum for blend factor.
 * @name zen3d.BLEND_FACTOR
 * @readonly
 * @enum {number}
 */
export var BLEND_FACTOR = {
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
 * Enum for cull face Type.
 * @name zen3d.CULL_FACE_TYPE
 * @readonly
 * @enum {string}
 */
export var CULL_FACE_TYPE = {
    NONE: "none",
    FRONT: "front",
    BACK: "back",
    FRONT_AND_BACK: "front_and_back"
};

/**
 * Enum for draw side.
 * @name zen3d.DRAW_SIDE
 * @readonly
 * @enum {string}
 */
export var DRAW_SIDE = {
    FRONT: "front",
    BACK: "back",
    DOUBLE: "double"
};

/**
 * Enum for shading side.
 * @name zen3d.SHADING_TYPE
 * @readonly
 * @enum {string}
 */
export var SHADING_TYPE = {
    SMOOTH_SHADING: "smooth_shading",
    FLAT_SHADING: "flat_shading"
}

/**
 * Enum for WebGL Texture Type.
 * @name zen3d.WEBGL_TEXTURE_TYPE
 * @readonly
 * @enum {number}
 */
export var WEBGL_TEXTURE_TYPE = {
    TEXTURE_2D: 0x0DE1,
    TEXTURE_CUBE_MAP: 0x8513
};

/**
 * Enum for WebGL pixel format.
 * @name zen3d.WEBGL_PIXEL_FORMAT
 * @readonly
 * @enum {number}
 */
export var WEBGL_PIXEL_FORMAT = {
    DEPTH_COMPONENT: 0x1902,
    DEPTH_STENCIL: 0x84F9,
    ALPHA: 0x1906,
    RGB: 0x1907,
    RGBA: 0x1908,
    LUMINANCE: 0x1909,
    LUMINANCE_ALPHA: 0x190A
}

/**
 * Enum for WebGL pixel Type.
 * @name zen3d.WEBGL_PIXEL_TYPE
 * @readonly
 * @enum {number}
 */
export var WEBGL_PIXEL_TYPE = {
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
}

/**
 * Enum for WebGL Texture filter.
 * @name zen3d.WEBGL_TEXTURE_FILTER
 * @readonly
 * @enum {number}
 */
export var WEBGL_TEXTURE_FILTER = {
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703
}

/**
 * Enum for WebGL Texture wrap.
 * @name zen3d.WEBGL_TEXTURE_WRAP
 * @readonly
 * @enum {number}
 */
export var WEBGL_TEXTURE_WRAP = {
    REPEAT:	0x2901,
    CLAMP_TO_EDGE: 0x812F,
    MIRRORED_REPEAT: 0x8370
}

/**
 * Enum for WebGL Uniform Type.
 * Taken from the {@link http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14 WebGl spec}.
 * @name zen3d.WEBGL_UNIFORM_TYPE
 * @readonly
 * @enum {number}
 */
export var WEBGL_UNIFORM_TYPE = {
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
}

/**
 * Enum for WebGL Attribute Type.
 * @name zen3d.WEBGL_ATTRIBUTE_TYPE
 * @readonly
 * @enum {number}
 */
export var WEBGL_ATTRIBUTE_TYPE = {
    FLOAT_VEC2: 0x8B50,
    FLOAT_VEC3: 0x8B51,
    FLOAT_VEC4: 0x8B52,
    FLOAT: 0x1406,
    BYTE: 0xffff,
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT: 0x1403
}

/**
 * Enum for Shadow Type.
 * @name zen3d.SHADOW_TYPE
 * @readonly
 * @enum {number}
 */
export var SHADOW_TYPE = {
    HARD: "hard",
    PCF_SOFT: "pcf_soft"
}

/**
 * Enum for Texel Encoding Type.
 * @name zen3d.TEXEL_ENCODING_TYPE
 * @readonly
 * @enum {number}
 */
export var TEXEL_ENCODING_TYPE = {
    LINEAR: "linear",
    SRGB: "sRGB",
    RGBE: "RGBE",
    RGBM7: "RGBM7",
    RGBM16: "RGBM16",
    RGBD: "RGBD",
    GAMMA: "Gamma"
}

/**
 * Enum for Envmap Combine Type.
 * @name zen3d.ENVMAP_COMBINE_TYPE
 * @readonly
 * @enum {number}
 */
export var ENVMAP_COMBINE_TYPE = {
    MULTIPLY: "ENVMAP_BLENDING_MULTIPLY",
    MIX: "ENVMAP_BLENDING_MIX",
    ADD: "ENVMAP_BLENDING_ADD"
}

/**
 * Enum for Draw Mode.
 * @name zen3d.DRAW_MODE
 * @readonly
 * @enum {number}
 */
export var DRAW_MODE = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
}

/**
 * Enum for ATTACHMENT
 * @name zen3d.ATTACHMENT
 * @readonly
 * @enum {number}
 */
export var ATTACHMENT = {
    COLOR_ATTACHMENT0: 0x8CE0,
    COLOR_ATTACHMENT1: 0x8CE1,
    COLOR_ATTACHMENT2: 0x8CE2,
    COLOR_ATTACHMENT3: 0x8CE3,
    COLOR_ATTACHMENT4: 0x8CE4,
    COLOR_ATTACHMENT5: 0x8CE5,
    COLOR_ATTACHMENT6: 0x8CE6,
    COLOR_ATTACHMENT7: 0x8CE7,
    COLOR_ATTACHMENT8: 0x8CE8,
    COLOR_ATTACHMENT9: 0x8CE9,
    COLOR_ATTACHMENT10: 0x8CE10,
    COLOR_ATTACHMENT11: 0x8CE11,
    COLOR_ATTACHMENT12: 0x8CE12,
    COLOR_ATTACHMENT13: 0x8CE13,
    COLOR_ATTACHMENT14: 0x8CE14,
    COLOR_ATTACHMENT15: 0x8CE15,
    DEPTH_ATTACHMENT: 0x8D00,
    STENCIL_ATTACHMENT: 0x8D20,
    DEPTH_STENCIL_ATTACHMENT: 0x821A
}

/**
 * Enum for DRAW_BUFFER
 * @name zen3d.DRAW_BUFFER
 * @readonly
 * @enum {number}
 */
export var DRAW_BUFFER = {
    DRAW_BUFFER0: 0x8825,
    DRAW_BUFFER1: 0x8826,
    DRAW_BUFFER2: 0x8827,
    DRAW_BUFFER3: 0x8828,
    DRAW_BUFFER4: 0x8829,
    DRAW_BUFFER5: 0x882A,
    DRAW_BUFFER6: 0x882B,
    DRAW_BUFFER7: 0x882C,
    DRAW_BUFFER8: 0x882D,
    DRAW_BUFFER9: 0x882E,
    DRAW_BUFFER10: 0x882F,
    DRAW_BUFFER11: 0x8830,
    DRAW_BUFFER12: 0x8831,
    DRAW_BUFFER13: 0x8832,
    DRAW_BUFFER14: 0x8833,
    DRAW_BUFFER15: 0x8834
}