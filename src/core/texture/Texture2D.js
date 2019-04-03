import { TextureBase } from './TextureBase.js';
import { Vector2 } from '../math/Vector2.js';
import { Matrix3 } from '../math/Matrix3.js';
import { WEBGL_TEXTURE_TYPE, WEBGL_PIXEL_FORMAT } from '../const.js';
import { ImageLoader } from '../loader/ImageLoader.js';
import { TGALoader } from '../loader/TGALoader.js';
import { RGBELoader } from '../loader/RGBELoader.js';

/**
 * Creates a cube texture made up of single image.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.TextureBase
 */
function Texture2D() {
	TextureBase.call(this);

	this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_2D;

	/**
     * Image data for this texture.
     * @member {null|HTMLImageElement|Object}
     * @default null
     */
	this.image = null;

	/**
     * How much a single repetition of the texture is offset from the beginning, in each direction U and V.
     * Typical range is 0.0 to 1.0.
     * _Note:_ The offset property is a convenience modifier and only affects the Texture's application to the first set of UVs on a model.
     * If the Texture is used as a map requiring additional UV sets (e.g. the aoMap or lightMap of most stock materials), those UVs must be manually assigned to achieve the desired offset..
     * @member {zen3d.Vector2}
     * @default zen3d.Vector2(0, 0)
     */
	this.offset = new Vector2();

	/**
     * How many times the texture is repeated across the surface, in each direction U and V.
     * If repeat is set greater than 1 in either direction, the corresponding Wrap parameter should also be set to {@link zen3d.WEBGL_TEXTURE_WRAP.REPEAT} or {@link zen3d.WEBGL_TEXTURE_WRAP.MIRRORED_REPEAT} to achieve the desired tiling effect.
     * _Note:_ The repeat property is a convenience modifier and only affects the Texture's application to the first set of UVs on a model.
     * If the Texture is used as a map requiring additional UV sets (e.g. the aoMap or lightMap of most stock materials), those UVs must be manually assigned to achieve the desired repetiton.
     * @member {zen3d.Vector2}
     * @default zen3d.Vector2(1, 1)
     */
	this.repeat = new Vector2(1, 1);

	/**
     * The point around which rotation occurs.
     * A value of (0.5, 0.5) corresponds to the center of the texture.
     * Default is (0, 0), the lower left.
     * @member {zen3d.Vector2}
     * @default zen3d.Vector2(0, 0)
     */
	this.center = new Vector2();


	/**
     * How much the texture is rotated around the center point, in radians.
     * Postive values are counter-clockwise.
     * @member {number}
     * @default 0
     */
	this.rotation = 0;

	/**
     * The uv-transform matrix for the texture. Updated by the renderer from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center} when the texture's {@link zen3d.Texture2D#matrixAutoUpdate} property is true.
     * When {@link zen3d.Texture2D#matrixAutoUpdate}  property is false, this matrix may be set manually.
     * Default is the identity matrix.
     * @member {zen3d.Matrix3}
     * @default Matrix3()
     */
	this.matrix = new Matrix3();

	/**
     * Whether to update the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
     * Set this to false if you are specifying the uv-transform matrix directly.
     * @member {boolean}
     * @default true
     */
	this.matrixAutoUpdate = true;
}

Texture2D.prototype = Object.assign(Object.create(TextureBase.prototype), /** @lends zen3d.Texture2D.prototype */{

	constructor: Texture2D,

	copy: function(source) {
		TextureBase.prototype.copy.call(this, source);

		this.image = source.image;
		this.mipmaps = source.mipmaps.slice(0);

		this.offset.copy(source.offset);
		this.repeat.copy(source.repeat);
		this.center.copy(source.center);
		this.rotation = source.rotation;

		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrix.copy(source.matrix);

		return this;
	},

	/**
     * Update the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
     */
	updateMatrix: function() {
		this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
	}

});

/**
 * Create Texture2D from image.
 * @param {HTMLImageElement} image
 * @return {TextureCube} - The result Texture.
 */
Texture2D.fromImage = function(image) {
	var texture = new Texture2D();

	texture.image = image;
	texture.version++;

	return texture;
}

/**
 * Create Texture2D from src.
 * @param {string} src
 * @return {TextureCube} - The result Texture.
 */
Texture2D.fromSrc = function(src) {
	var texture = new Texture2D();

	// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
	var isJPEG = src.search(/\.(jpg|jpeg)$/) > 0 || src.search(/^data\:image\/jpeg/) === 0;

	var isTGA = src.search(/\.(tga)$/) > 0 || src.search(/^data\:image\/tga/) === 0;

	var isHDR = src.search(/\.(hdr)$/) > 0;

	if (isHDR) {
		var loader = new RGBELoader();
		loader.load(src, function(textureData) {
			texture.image = { data: textureData.data, width: textureData.width, height: textureData.height };
			texture.encoding = zen3d.TEXEL_ENCODING_TYPE.RGBE;
			texture.type = textureData.type;
			texture.format = textureData.format;

			texture.version++;

			texture.dispatchEvent({ type: 'onload' });
		});
	} else {
		var loader = isTGA ? new TGALoader() : new ImageLoader();
		loader.load(src, function(image) {
			texture.format = isJPEG ? WEBGL_PIXEL_FORMAT.RGB : WEBGL_PIXEL_FORMAT.RGBA;
			texture.image = image;

			texture.version++;

			texture.dispatchEvent({ type: 'onload' });
		});
	}


	return texture;
}

export { Texture2D };