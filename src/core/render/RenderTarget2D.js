import {RenderTargetBase} from './RenderTargetBase.js';
import {Texture2D} from '../texture/Texture2D.js';

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

export {RenderTarget2D};