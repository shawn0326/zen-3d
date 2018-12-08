import {generateUUID} from '../base.js';
import {WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE, WEBGL_TEXTURE_FILTER, WEBGL_TEXTURE_WRAP, TEXEL_ENCODING_TYPE} from '../const.js';
import {EventDispatcher} from '../EventDispatcher.js';

/**
 * Create a texture to apply to a surface or as a reflection or refraction map.
 * @constructor
 * @memberof zen3d
 * @abstract
 * @extends zen3d.EventDispatcher
 */
function TextureBase() {

    EventDispatcher.call(this);

    /**
     * UUID of this texture instance. 
     * This gets automatically assigned, so this shouldn't be edited.
     * @readonly
     * @type {string}
     */
    this.uuid = generateUUID();

    this.textureType = "";

    /**
     * WebGLTexture border. 
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D WebGLTexture texImage2D()}.
     * Must be zero. 
     * @type {number}
     */
    this.border = 0;

    /**
     * WebGLTexture texel data format.
     * @type {zen3d.WEBGL_PIXEL_FORMAT}
     * @default zen3d.WEBGL_PIXEL_FORMAT.RGBA
     */
    this.format = WEBGL_PIXEL_FORMAT.RGBA;

    /**
     * WebGLTexture texel data internal format.
     * If null, internalformat is set to be same as format.
     * This must be null in WebGL 1.0.
     * @type {null|zen3d.WEBGL_PIXEL_FORMAT}
     * @default null
     */
    this.internalformat = null;

    /**
     * WebGLTexture texel data type.
     * @type {zen3d.WEBGL_PIXEL_TYPE}
     * @default zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE
     */
    this.type = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     * @type {zen3d.WEBGL_TEXTURE_FILTER}
     * @default zen3d.WEBGL_TEXTURE_FILTER.LINEAR
     */
    this.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     * @type {zen3d.WEBGL_TEXTURE_FILTER}
     * @default zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR
     */
    this.minFilter = WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;

    /**
     * This defines how the texture is wrapped horizontally and corresponds to U in UV mapping.
     * @type {zen3d.WEBGL_TEXTURE_WRAP}
     * @default zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE
     */
    this.wrapS = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

    /**
     * This defines how the texture is wrapped vertically and corresponds to V in UV mapping.
     * @type {zen3d.WEBGL_TEXTURE_WRAP}
     * @default zen3d.WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE
     */
    this.wrapT = WEBGL_TEXTURE_WRAP.CLAMP_TO_EDGE;

    /**
     * The number of samples taken along the axis through the pixel that has the highest density of texels.
     * A higher value gives a less blurry result than a basic mipmap, at the cost of more texture samples being used. 
     * Use {@link WebGLcapabilities#maxAnisotropy} to find the maximum valid anisotropy value for the GPU; this value is usually a power of 2.
     * @type {number}
     * @default 1
     */
    this.anisotropy = 1;

    /**
     * Use for shadow sampler (WebGL 2.0 Only).
     * @type {zen3d.WEBGL_COMPARE_FUNC|undefined}
     * @default undefined
     */
    this.compare = undefined;

    /**
     * Whether to generate mipmaps (if possible) for a texture.
     * Set this to false if you are creating mipmaps manually.
     * @type {boolean}
     * @default true
     */
    this.generateMipmaps = true;

    /**
     * texture pixel encoding.
     * @type {zen3d.TEXEL_ENCODING_TYPE}
     * @default zen3d.TEXEL_ENCODING_TYPE.LINEAR 
     */
    this.encoding = TEXEL_ENCODING_TYPE.LINEAR;

    /**
     * Flips the image's Y axis to match the WebGL texture coordinate space.
     * @type {boolean}
     * @default true 
     */
    this.flipY = true;

    /**
     * version code increse if texture changed.
     * if version is still 0, this texture will be skiped.
     * @type {number}
     * @default 0
     */
    this.version = 0;
}

TextureBase.prototype = Object.assign(Object.create(EventDispatcher.prototype), /** @lends zen3d.TextureBase.prototype */{

    constructor: TextureBase,

    /**
     * Returns a clone of this texture.
     * @return {zen3d.TextureBase}
     */
    clone: function() {
        return new this.constructor().copy( this );
    },

    /**
     * Copy the given texture into this texture.
     * @param {zen3d.TextureBase} source - The texture to be copied.
     * @return {zen3d.TextureBase}
     */
    copy: function( source ) {
        this.textureType = source.textureType;
        this.border = source.border;
        this.format = source.format;
        this.type = source.type;
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

    /**
     * Dispatches a dispose event.
     */
    dispose: function() {
        this.dispatchEvent({type: 'dispose'});

        this.version = 0;
    }

});

export {TextureBase};