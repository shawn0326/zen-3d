import {Texture2D} from './Texture2D.js';
import {WEBGL_PIXEL_TYPE, WEBGL_PIXEL_FORMAT, WEBGL_TEXTURE_FILTER} from '../const.js';

/**
 * Creates a texture for use as a Depth Texture. 
 * Require support for the {@link https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/ WEBGL_depth_texture extension}.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Texture2D
 * @param {number} width - The width of the texture.
 * @param {number} height - The height of the texture.
 */
function TextureDepth(width, height) {

    Texture2D.call(this);

    /**
     * Image data like: {width: number, height: number}
     * @member {Object}
     */
    this.image = {width: width, height: height};

    /**
     * Use unsigned_short or unsigned_int.
     * DEPTH_STENCIL_ATTACHMENT will be set to UNSIGNED_INT_24_8.
     * @default zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_SHORT
     */
    this.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_SHORT;

    /**
     * Depth textures don't change this.
     * @default zen3d.WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT
     */
    this.pixelFormat = WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT;   

    /**
     * @default zen3d.WEBGL_TEXTURE_FILTER.NEAREST
     */
    this.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;

    /**
     * @default zen3d.WEBGL_TEXTURE_FILTER.NEAREST
     */
    this.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

    /**
     * Depth textures do not use mipmaps.
     * @default false
     */
    this.generateMipmaps = false;

    /**
     * Depth textures do not need to be flipped so this is false by default.
     * @default false
     */
    this.flipY = false;
}

TextureDepth.prototype = Object.assign(Object.create(Texture2D.prototype), /** @lends zen3d.TextureDepth.prototype */{

    constructor: TextureDepth,

    /**
     * This is an Depth Texture.
     * @readonly
     * @type {boolean}
     * @default true
     */
    isDepthTexture: true

});

export {TextureDepth};