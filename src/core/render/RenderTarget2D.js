import {RenderTargetBase} from './RenderTargetBase.js';
import {Texture2D} from '../texture/Texture2D.js';

/**
 * Render Target that render to 2d texture.
 * @constructor
 * @extends RenderTargetBase
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTarget2D(width, height) {

    RenderTargetBase.call(this, width, height);

    /**
     * The texture attached to COLOR_ATTACHMENT0.
     * @type {Texture2D}
     * @default Texture2D()
     */
    this.texture = new Texture2D();

    /**
     * The texture attached to DEPTH_ATTACHMENT.
     * @type {TextureDepth}
     */
    this.depthTexture = null;

}

RenderTarget2D.prototype = Object.create(RenderTargetBase.prototype);
RenderTarget2D.prototype.constructor = RenderTarget2D;

export {RenderTarget2D};