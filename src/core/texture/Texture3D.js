import { TextureBase } from './TextureBase.js';
import { WEBGL_TEXTURE_TYPE, WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE } from '../const.js';

/**
 * Creates a 3D texture. (WebGL 2.0)
 * @constructor
 * @memberof zen3d
 * @extends zen3d.TextureBase
 */
function Texture3D() {
	TextureBase.call(this);

	this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_3D;

	/**
     * Image data for this texture.
     * @member {Object}
     * @default null
     */
	this.image = { data: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]), width: 2, height: 2, depth: 2 };

	/**
     * WebGLTexture texel data format.
     * @type {zen3d.WEBGL_PIXEL_FORMAT}
     * @default zen3d.WEBGL_PIXEL_FORMAT.RED
     */
	this.format = WEBGL_PIXEL_FORMAT.RED;

	/**
     * WebGLTexture texel data internal format.
     * If null, internalformat is set to be same as format.
     * This must be null in WebGL 1.0.
     * @type {null|zen3d.WEBGL_PIXEL_FORMAT}
     * @default zen3d.WEBGL_PIXEL_FORMAT.R8
     */
	this.internalformat = WEBGL_PIXEL_FORMAT.R8;

	/**
     * WebGLTexture texel data type.
     * @type {zen3d.WEBGL_PIXEL_TYPE}
     * @default zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE
     */
	this.type = WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

	/**
     * @default false
     */
	this.flipY = false;
}

Texture3D.prototype = Object.assign(Object.create(TextureBase.prototype), /** @lends zen3d.TextureCube.prototype */{

	constructor: Texture3D

});

export { Texture3D };