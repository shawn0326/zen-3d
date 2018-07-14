import {generateUUID} from '../base.js';
import {WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE, WEBGL_TEXTURE_FILTER, WEBGL_TEXTURE_WRAP, TEXEL_ENCODING_TYPE} from '../const.js';
import {EventDispatcher} from '../EventDispatcher.js';

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

    dispose: function() {
        this.dispatchEvent({type: 'dispose'});

        this.version = 0;
    }

});

export {TextureBase};