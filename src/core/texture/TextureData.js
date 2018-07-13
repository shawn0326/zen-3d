import {Texture2D} from './Texture2D.js';
import {WEBGL_PIXEL_TYPE, WEBGL_TEXTURE_FILTER} from '../const.js';

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

export {TextureData};