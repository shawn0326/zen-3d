import {Texture2D} from './Texture2D.js';
import {WEBGL_PIXEL_TYPE, WEBGL_PIXEL_FORMAT, WEBGL_TEXTURE_FILTER} from '../const.js';

/**
 * Creates a texture for use as a Depth Texture. 
 * Require support for the {@link https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/ WEBGL_depth_texture extension}.
 * @constructor
 * @extends Texture2D
 */
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

export {TextureDepth};