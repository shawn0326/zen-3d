import {Texture2D} from './Texture2D.js';
import {WEBGL_PIXEL_TYPE, WEBGL_TEXTURE_FILTER} from '../const.js';

/**
 * Creates a texture directly from raw data, width and height.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Texture2D
 * @param {TypedArray} data - The data of the texture.
 * @param {number} width - The width of the texture.
 * @param {number} height - The height of the texture.
 */
function TextureData(data, width, height) {

    Texture2D.call(this);

    /**
     * Image data like: {data: TypedArray, width: number, height: number}
     * @member {Object}
     */
    this.image = {data: data, width: width, height: height};

    /**
     * Default pixel type set to float.
     * @default zen3d.WEBGL_PIXEL_TYPE.FLOAT
     */
    this.pixelType = WEBGL_PIXEL_TYPE.FLOAT;

    /**
     * @default zen3d.WEBGL_TEXTURE_FILTER.NEAREST
     */
    this.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;

    /**
     * @default zen3d.WEBGL_TEXTURE_FILTER.NEAREST
     */
    this.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

    /**
     * Data textures do not use mipmaps.
     * @default false
     */
    this.generateMipmaps = false;

    /**
     * Data textures do not need to be flipped so this is false by default.
     * @default false
     */
    this.flipY = false;
}

TextureData.prototype = Object.assign(Object.create(Texture2D.prototype), /** @lends zen3d.TextureData.prototype */{

    constructor: TextureData,

    /**
     * This is an Data Texture.
     * @readonly
     * @type {boolean}
     * @default true
     */
    isDataTexture: true

});

export {TextureData};